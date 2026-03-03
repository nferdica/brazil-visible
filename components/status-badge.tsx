'use client';

import { useState, useEffect } from 'react';

interface HealthEntry {
  status: 'online' | 'offline' | 'ftp';
  code: number;
  slugs: string[];
  checkedAt: string;
}

interface HealthData {
  updatedAt: string;
  results: Record<string, HealthEntry>;
}

/**
 * Normalise a url_base value the same way the health-check script does:
 *  1. Strip template variables like {SERIE}
 *  2. Remove query strings
 *  3. Collapse consecutive slashes (preserving protocol ://)
 *  4. Remove trailing slashes
 */
function normaliseUrl(raw: string): string {
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

  // Remove trailing slash(es)
  url = url.replace(/\/+$/, '');

  return url;
}

const badgeStyles: Record<string, string> = {
  online:
    'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400',
  offline:
    'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
  ftp:
    'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  unknown:
    'bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400',
};

const badgeLabels: Record<string, string> = {
  online: 'Online',
  offline: 'Offline',
  ftp: 'FTP',
  unknown: 'Desconhecido',
};

interface StatusBadgeProps {
  urlBase: string;
}

export function StatusBadge({ urlBase }: StatusBadgeProps) {
  const [status, setStatus] = useState<string>('unknown');

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const res = await fetch('/health.json');
        if (!res.ok) return;

        const data: HealthData = await res.json();
        if (cancelled) return;

        const normalised = normaliseUrl(urlBase);
        const entry = data.results[normalised];

        if (entry) {
          setStatus(entry.status);
        }
      } catch (err) {
        if (process.env.NODE_ENV === 'development') {
          console.warn('StatusBadge: failed to load /health.json', err);
        }
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [urlBase]);

  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${badgeStyles[status] ?? badgeStyles.unknown}`}
    >
      {badgeLabels[status] ?? badgeLabels.unknown}
    </span>
  );
}
