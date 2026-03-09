import Link from 'next/link';
import Image from 'next/image';
import { ExternalLink } from 'lucide-react';

const documentacao = [
  { href: '/docs/', label: 'Início' },
  { href: '/docs/apis/', label: 'Documentação' },
  { href: '/docs/cruzamentos/', label: 'Cruzamentos' },
  { href: '/docs/sdk/', label: 'SDK' },
  { href: '/docs/como-contribuir/', label: 'Como Contribuir' },
];

const comunidade = [
  { href: 'https://github.com/nferdica/brazil-visible', label: 'GitHub' },
  { href: 'https://github.com/nferdica/brazil-visible-sdk', label: 'SDK no GitHub' },
  { href: 'https://github.com/nferdica/brazil-visible/issues', label: 'GitHub Issues' },
];

const mais = [
  { href: 'https://github.com/sponsors/nferdica', label: 'GitHub Sponsors' },
  { href: 'https://buymeacoffee.com/nferdica', label: 'Buy Me a Coffee' },
];

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-neutral-950 text-neutral-400">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
              Documentação
            </h3>
            <ul className="mt-4 space-y-3">
              {documentacao.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-neutral-400 transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
              Comunidade
            </h3>
            <ul className="mt-4 space-y-3">
              {comunidade.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-sm text-neutral-400 transition-colors hover:text-white"
                  >
                    {link.label}
                    <ExternalLink size={12} className="opacity-50" aria-hidden="true" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
              Mais
            </h3>
            <ul className="mt-4 space-y-3">
              {mais.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-sm text-neutral-400 transition-colors hover:text-white"
                  >
                    {link.label}
                    <ExternalLink size={12} className="opacity-50" aria-hidden="true" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-neutral-800 pt-8 flex flex-col items-center gap-4">
          <Image
            src="/logo-light.svg"
            alt="Brazil Visible"
            width={120}
            height={80}
            className="opacity-60"
          />
          <p className="text-sm text-neutral-500">
            &copy; {currentYear} Brazil Visible. Distribuído sob licença MIT.
          </p>
        </div>
      </div>
    </footer>
  );
}
