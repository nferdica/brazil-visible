#!/usr/bin/env node

/**
 * Health check script for Brazil Visible API sources.
 *
 * Reads all .md files under docs/apis/, extracts url_base from frontmatter,
 * normalises URLs (strips template vars and query strings), deduplicates,
 * then performs HTTP GET checks with browser-like headers to avoid WAF blocks.
 *
 * Strategy per URL:
 *  1. GET with full browser headers (Chrome UA, Accept, Sec-Fetch-*)
 *  2. On 403 → retry without Sec-Fetch-* headers (some WAFs reject those)
 *  3. On 403 again → retry HEAD (lighter, some APIs prefer it)
 *
 * FTP URLs are marked as status "ftp" without attempting a network check.
 *
 * Output: public/health.json
 */

import { readFileSync, readdirSync, writeFileSync, mkdirSync } from 'node:fs';
import { resolve, join } from 'node:path';
import matter from 'gray-matter';

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

const MAX_CONCURRENCY = 5;
const TIMEOUT_MS = 10_000;

const rootDir = resolve(process.cwd());
const apisDir = resolve(rootDir, 'docs', 'apis');
const outputDir = resolve(rootDir, 'public');
const outputPath = resolve(outputDir, 'health.json');

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Recursively collect all .md files under a directory.
 */
function collectMarkdownFiles(dir) {
  const results = [];
  const entries = readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...collectMarkdownFiles(fullPath));
    } else if (entry.isFile() && entry.name.endsWith('.md')) {
      results.push(fullPath);
    }
  }
  return results;
}

/**
 * Normalise a url_base value:
 *  1. Strip template variables like {SERIE}, {UF}, {AAMM}, etc.
 *  2. Remove query strings (?formato=json, etc.)
 *  3. Collapse double slashes left over from stripping (but keep protocol ://)
 *  4. Remove trailing slashes for consistency, then re-add a single one if
 *     the original ended with a slash (keeps path-level URLs consistent).
 */
function normaliseUrl(raw) {
  let url = raw.trim();

  // Strip template variables: {ANYTHING}
  url = url.replace(/\{[^}]+\}/g, '');

  // Remove query string
  const qIndex = url.indexOf('?');
  if (qIndex !== -1) {
    url = url.substring(0, qIndex);
  }

  // Collapse consecutive slashes (but preserve ://)
  url = url.replace(/([^:])\/\/+/g, '$1/');

  // Remove trailing slash(es) for dedup, then add exactly one back
  url = url.replace(/\/+$/, '');

  return url;
}

/**
 * Run an array of async functions with a concurrency limit.
 */
async function parallelLimit(tasks, limit) {
  const results = [];
  let idx = 0;

  async function worker() {
    while (idx < tasks.length) {
      const i = idx++;
      results[i] = await tasks[i]();
    }
  }

  const workers = Array.from({ length: Math.min(limit, tasks.length) }, () =>
    worker(),
  );
  await Promise.all(workers);
  return results;
}

/** Browser-like headers (tier 1): full Chrome fingerprint. */
const BROWSER_HEADERS = {
  'User-Agent':
    'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
  Accept:
    'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
  'Accept-Language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7',
  'Accept-Encoding': 'gzip, deflate, br',
  'Sec-Fetch-Dest': 'document',
  'Sec-Fetch-Mode': 'navigate',
  'Sec-Fetch-Site': 'none',
  'Sec-Fetch-User': '?1',
  'Upgrade-Insecure-Requests': '1',
};

/** Tier 2 headers: drop Sec-Fetch-* (some WAFs reject them). */
const SIMPLE_HEADERS = {
  'User-Agent': BROWSER_HEADERS['User-Agent'],
  Accept: BROWSER_HEADERS['Accept'],
  'Accept-Language': BROWSER_HEADERS['Accept-Language'],
};

/**
 * Perform a single fetch with its own AbortController + timeout.
 * Returns the Response on success, or null on network/timeout error.
 */
async function timedFetch(url, method, headers) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(url, {
      method,
      signal: controller.signal,
      redirect: 'follow',
      headers,
    });
    return res;
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Check a single URL. Returns { status, code }.
 *
 * Strategy (stops at the first non-403 response):
 *  1. GET with full browser headers (Chrome UA + Sec-Fetch-*)
 *  2. GET without Sec-Fetch-* headers (some WAFs block those)
 *  3. HEAD with simple headers (lightest request)
 */
async function checkUrl(url) {
  // Tier 1 — full browser GET
  let response = await timedFetch(url, 'GET', BROWSER_HEADERS);
  if (response && response.status !== 403) {
    return toResult(response);
  }

  // Tier 2 — GET without Sec-Fetch-*
  response = await timedFetch(url, 'GET', SIMPLE_HEADERS);
  if (response && response.status !== 403) {
    return toResult(response);
  }

  // Tier 3 — HEAD (some APIs only accept HEAD)
  response = await timedFetch(url, 'HEAD', SIMPLE_HEADERS);
  if (response) {
    return toResult(response);
  }

  return { status: 'offline', code: 0 };
}

function toResult(response) {
  const code = response.status;
  const status = code >= 200 && code < 400 ? 'online' : 'offline';
  return { status, code };
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  console.log('Health check — Brazil Visible API sources\n');

  // 1. Collect all markdown files and extract url_base + slug
  const files = collectMarkdownFiles(apisDir).sort();
  console.log(`Found ${files.length} API documentation files.\n`);

  /** @type {Map<string, string[]>} normalised URL -> slugs */
  const urlToSlugs = new Map();

  /** @type {Map<string, string>} normalised URL -> original raw URL (for FTP detection) */
  const urlToRaw = new Map();

  for (const filePath of files) {
    const content = readFileSync(filePath, 'utf-8');
    const { data } = matter(content);
    const raw = data.url_base;
    const slug = data.slug;

    if (!raw || !slug) continue;

    const normalised = normaliseUrl(raw);

    if (!urlToSlugs.has(normalised)) {
      urlToSlugs.set(normalised, []);
      urlToRaw.set(normalised, raw);
    }
    urlToSlugs.get(normalised).push(slug);
  }

  const uniqueUrls = [...urlToSlugs.keys()];
  const ftpUrls = uniqueUrls.filter((u) => {
    const raw = urlToRaw.get(u) ?? u;
    return raw.toLowerCase().startsWith('ftp://');
  });
  const httpUrls = uniqueUrls.filter((u) => {
    const raw = urlToRaw.get(u) ?? u;
    return !raw.toLowerCase().startsWith('ftp://');
  });

  console.log(
    `Unique URLs: ${uniqueUrls.length} (${httpUrls.length} HTTP/S, ${ftpUrls.length} FTP)\n`,
  );

  // 2. Build results map — start with FTP entries
  /** @type {Record<string, {status: string, code: number, slugs: string[], checkedAt: string}>} */
  const results = {};

  const now = new Date().toISOString();

  for (const url of ftpUrls) {
    results[url] = {
      status: 'ftp',
      code: 0,
      slugs: urlToSlugs.get(url),
      checkedAt: now,
    };
    console.log(`  FTP   ${url}  (${urlToSlugs.get(url).join(', ')})`);
  }

  // 3. Check HTTP/S URLs with concurrency limit
  const tasks = httpUrls.map((url) => async () => {
    const result = await checkUrl(url);
    results[url] = {
      ...result,
      slugs: urlToSlugs.get(url),
      checkedAt: new Date().toISOString(),
    };

    const icon = result.status === 'online' ? '\u2714' : '\u2718';
    console.log(
      `  ${icon} ${result.status.toUpperCase().padEnd(7)} ${result.code}  ${url}`,
    );

    return result;
  });

  await parallelLimit(tasks, MAX_CONCURRENCY);

  // 4. Write output
  mkdirSync(outputDir, { recursive: true });

  const output = {
    updatedAt: now,
    results,
  };

  writeFileSync(outputPath, JSON.stringify(output, null, 2) + '\n', 'utf-8');

  // 5. Summary
  const online = Object.values(results).filter(
    (r) => r.status === 'online',
  ).length;
  const offline = Object.values(results).filter(
    (r) => r.status === 'offline',
  ).length;
  const ftp = Object.values(results).filter((r) => r.status === 'ftp').length;

  console.log('');
  console.log(
    `Done. ${online} online, ${offline} offline, ${ftp} FTP — written to public/health.json`,
  );
}

main().catch((err) => {
  console.error('Health check failed:', err);
  process.exit(1);
});
