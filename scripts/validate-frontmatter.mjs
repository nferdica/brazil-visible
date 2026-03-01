#!/usr/bin/env node

/**
 * Frontmatter validation script for docs/apis/ markdown files.
 *
 * Checks that every .md file under docs/apis/ contains the required
 * frontmatter fields: title, slug, orgao, url_base, tipo_acesso, status.
 *
 * Exit code 0 — all files valid.
 * Exit code 1 — one or more files missing required fields.
 */

import { readFileSync, readdirSync } from "node:fs";
import { resolve, relative, join } from "node:path";
import matter from "gray-matter";

const REQUIRED_FIELDS = [
  "title",
  "slug",
  "orgao",
  "url_base",
  "tipo_acesso",
  "status",
];

const rootDir = resolve(process.cwd());
const apisDir = resolve(rootDir, "docs", "apis");

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
    } else if (entry.isFile() && entry.name.endsWith(".md")) {
      results.push(fullPath);
    }
  }
  return results;
}

let fileCount = 0;
let passCount = 0;
let failCount = 0;
const errors = [];

const files = collectMarkdownFiles(apisDir).sort();

for (const filePath of files) {
  fileCount++;
  const rel = relative(rootDir, filePath);
  const content = readFileSync(filePath, "utf-8");
  const { data } = matter(content);

  const missing = REQUIRED_FIELDS.filter((field) => {
    const value = data[field];
    return value === undefined || value === null || String(value).trim() === "";
  });

  if (missing.length > 0) {
    failCount++;
    const msg = `FAIL  ${rel}  — missing: ${missing.join(", ")}`;
    errors.push(msg);
    console.log(`  \u2718 ${msg}`);
  } else {
    passCount++;
    console.log(`  \u2714 PASS  ${rel}`);
  }
}

console.log("");
console.log(`Results: ${passCount} passed, ${failCount} failed, ${fileCount} total`);

if (failCount > 0) {
  console.log("");
  console.log("Validation failed. Fix the files listed above.");
  process.exit(1);
} else {
  console.log("All frontmatter validations passed.");
  process.exit(0);
}
