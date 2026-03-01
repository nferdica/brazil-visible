import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
  title: 'Brazil Visible',
  tagline: 'Catálogo de dados públicos brasileiros para fiscalização governamental',
  favicon: 'img/favicon.ico',

  // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
  future: {
    v4: true, // Improve compatibility with the upcoming Docusaurus v4
  },

  // Set the production url of your site here
  url: 'https://nferdica.github.io',
  // Set the /<baseUrl>/ pathname under which your site is served
  baseUrl: '/brazil-visible/',

  // GitHub pages deployment config.
  organizationName: 'nferdica',
  projectName: 'brazil-visible',

  onBrokenLinks: 'warn',

  i18n: {
    defaultLocale: 'pt-BR',
    locales: ['pt-BR'],
    localeConfigs: {
      'pt-BR': {
        label: 'Português (Brasil)',
      },
    },
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          exclude: ['**/plans/**'],
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    image: 'img/docusaurus-social-card.jpg',
    colorMode: {
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: 'Brazil Visible',
      logo: {
        alt: 'Brazil Visible Logo',
        src: 'img/logo.svg',
      },
      items: [
        {
          to: '/docs/apis',
          position: 'left',
          label: 'APIs',
        },
        {
          to: '/docs/cruzamentos',
          position: 'left',
          label: 'Cruzamentos',
        },
        {
          to: '/docs/como-contribuir',
          position: 'left',
          label: 'Como Contribuir',
        },
        {
          href: 'https://github.com/nferdica/brazil-visible',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Documentação',
          items: [
            {
              label: 'Início',
              to: '/docs/',
            },
            {
              label: 'APIs e Fontes de Dados',
              to: '/docs/apis',
            },
            {
              label: 'Receitas de Cruzamento',
              to: '/docs/cruzamentos',
            },
          ],
        },
        {
          title: 'Comunidade',
          items: [
            {
              label: 'GitHub Discussions',
              href: 'https://github.com/nferdica/brazil-visible/discussions',
            },
            {
              label: 'Issues',
              href: 'https://github.com/nferdica/brazil-visible/issues',
            },
          ],
        },
        {
          title: 'Mais',
          items: [
            {
              label: 'GitHub',
              href: 'https://github.com/nferdica/brazil-visible',
            },
            {
              label: 'Licença',
              href: 'https://github.com/nferdica/brazil-visible/blob/main/LICENSE',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Brazil Visible. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
