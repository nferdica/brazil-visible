'use client';

import { useState } from 'react';
import { Check } from 'lucide-react';

const COMMAND = 'npm i @brazilvisible/sdk';

export function CopyCommand() {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(COMMAND);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative inline-flex flex-col items-center">
      <button
        type="button"
        onClick={handleCopy}
        className="group inline-flex items-center gap-3 rounded-full border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-5 py-2.5 text-sm font-mono cursor-pointer transition-all hover:border-neutral-400 dark:hover:border-neutral-600 hover:shadow-sm"
      >
        <span className="text-neutral-400 dark:text-neutral-500 select-none">$</span>
        <span className="text-neutral-700 dark:text-neutral-300">{COMMAND}</span>
        <span className="text-neutral-400 dark:text-neutral-500 transition-colors group-hover:text-neutral-600 dark:group-hover:text-neutral-300">
          {copied ? <Check size={14} /> : <CopyIcon />}
        </span>
      </button>

      <span
        className={`absolute -bottom-9 rounded-full bg-neutral-900 dark:bg-white px-3 py-1 text-xs font-medium text-white dark:text-neutral-900 transition-all duration-200 ${
          copied ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-1 pointer-events-none'
        }`}
      >
        Copiado!
      </span>
    </div>
  );
}

function CopyIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  );
}
