# Brazil Visible

Catálogo aberto de **92 fontes de dados públicos brasileiros** para fiscalização governamental.

[![Build](https://github.com/nferdica/brazil-visible/actions/workflows/ci.yml/badge.svg)](https://github.com/nferdica/brazil-visible/actions/workflows/ci.yml)
[![Health Check](https://github.com/nferdica/brazil-visible/actions/workflows/health-check.yml/badge.svg)](https://github.com/nferdica/brazil-visible/actions/workflows/health-check.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](./LICENSE)

## O que é

Um site de documentação que cataloga APIs e bases de dados públicas do governo brasileiro, com:

- **92 fontes de dados** documentadas com exemplos de código Python
- **22 categorias** organizadas por órgão (BCB, CGU, TSE, Receita Federal, IBGE, etc.)
- **5 receitas de cruzamento** mostrando como combinar bases para detectar irregularidades
- **3 notebooks Jupyter** reproduzíveis para análises avançadas
- **Sistema de tags** com 550+ tags para busca transversal
- **Health check automático** verificando disponibilidade de todas as 61 URLs a cada 6h
- **Frontmatter estruturado** que permite consumo programático do catálogo

## Para quem

- **Desenvolvedores** que querem consumir dados públicos programaticamente
- **Jornalistas** que precisam cruzar bases para investigações
- **Pesquisadores** que estudam transparência e governança pública
- **Cidadãos** que querem entender como fiscalizar o governo

## Início rápido

```bash
git clone https://github.com/nferdica/brazil-visible.git
cd brazil-visible
npm install
npm run dev
```

O site estará disponível em `http://localhost:3000`.

## Tech Stack

| Camada | Tecnologia |
|--------|-----------|
| Framework | [Next.js 15](https://nextjs.org/) (App Router, `output: 'export'`) |
| Styling | [Tailwind CSS 3.4](https://tailwindcss.com/) com paleta da bandeira brasileira |
| MDX | [next-mdx-remote/rsc](https://github.com/hashicorp/next-mdx-remote) + remark/rehype |
| Temas | [next-themes](https://github.com/pacocoursey/next-themes) (dark mode class-based) |
| Deploy | Docker (node:20-alpine + nginx:alpine) no EasyPanel |
| CI/CD | GitHub Actions (build + health check a cada 6h) |

## Estrutura do projeto

```
brazil-visible/
├── app/                          # Next.js App Router
│   ├── layout.tsx                # Root layout (Plus Jakarta Sans, ThemeProvider)
│   ├── page.tsx                  # Landing page
│   ├── sitemap.ts                # Sitemap dinâmico
│   └── docs/                     # Área de documentação
│       ├── apis/                 # Rotas dinâmicas [category]/[slug]
│       ├── cruzamentos/          # Rotas dinâmicas [slug]
│       ├── tags/                 # Sistema de tags [tag]
│       └── como-contribuir/      # Guia de contribuição
├── components/                   # 12 componentes React
│   ├── navbar.tsx                # Navegação principal
│   ├── search-input.tsx          # Busca client-side
│   ├── status-badge.tsx          # Badge de disponibilidade (online/offline/FTP)
│   ├── docs-sidebar.tsx          # Sidebar da documentação
│   └── ...                       # footer, toc, breadcrumbs, etc.
├── lib/                          # Utilitários
│   ├── content.ts                # Leitura do filesystem (sidebar, docs, tags)
│   ├── mdx.tsx                   # Pipeline de renderização MDX
│   └── remark-admonitions.ts     # Plugin remark para :::warning/:::tip/:::note
├── docs/                         # Conteúdo Markdown
│   ├── apis/                     # 92 fontes de dados em 22 categorias
│   ├── cruzamentos/              # 5 receitas de cruzamento
│   ├── intro.md                  # Página inicial da documentação
│   └── como-contribuir.md        # Guia de contribuição
├── recipes/                      # 3 notebooks Jupyter reproduzíveis
│   ├── raio-x-parlamentar/       # Análise patrimonial de parlamentares
│   ├── licitacao-suspeita/       # Detecção de licitações suspeitas
│   └── fantasmas-servico-publico/# Servidores fantasma
├── scripts/                      # Scripts auxiliares
│   ├── health-check.mjs          # Verifica disponibilidade das APIs
│   └── validate-frontmatter.mjs  # Valida frontmatter dos docs
├── public/                       # Assets estáticos
│   ├── health.json               # Resultado do health check (gerado)
│   ├── manifest.json             # PWA manifest
│   └── *.svg, *.png              # Ícones e logos
├── Dockerfile                    # Build multi-stage (node + nginx)
├── nginx.conf                    # Configuração nginx com security headers
├── AGENTS.md                     # Fonte da verdade do projeto
├── CLAUDE.md                     # Instruções para Claude Code
└── CONTRIBUTING.md               # Guia de contribuição
```

## Receitas de cruzamento

O diferencial do projeto: guias práticos para cruzar dados entre bases.

| Receita | Fontes | Dificuldade |
|---------|--------|-------------|
| Parlamentar x Empresas x Emendas | TSE, Receita Federal, CGU | Avançado |
| Rede CPF/CNPJ | Receita Federal (QSA, CNPJ) | Intermediário |
| Servidor Público x Empresas | CGU, Receita Federal | Intermediário |
| Desmatamento x CAR x Embargos | INPE, SICAR, IBAMA | Avançado |
| Licitações x Sanções | CGU (Contratos, CEIS, CNEP) | Básico |

## Comandos

| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Servidor de desenvolvimento (http://localhost:3000) |
| `npm run build` | Build de produção (static export para `out/`) |
| `node scripts/validate-frontmatter.mjs` | Validar frontmatter das APIs |
| `node scripts/health-check.mjs` | Verificar disponibilidade das APIs (gera `public/health.json`) |

## Health Check

O sistema de health check verifica automaticamente a disponibilidade de todas as 61 URLs únicas extraídas do frontmatter das 92 APIs documentadas.

- Roda a cada 6h via GitHub Actions (`.github/workflows/health-check.yml`)
- Usa headers de navegador Chrome para contornar WAFs governamentais
- Estratégia de 3 camadas: GET com Sec-Fetch → GET simples → HEAD
- Resultado salvo em `public/health.json` e exibido como badges no site

## Contribuindo

Contribuições são muito bem-vindas! Veja o [guia de contribuição](./CONTRIBUTING.md) para saber como:

- Adicionar uma nova fonte de dados
- Criar uma receita de cruzamento
- Melhorar documentação existente

## Apoie o projeto

Brazil Visible é mantido de forma independente. Sua doação ajuda a cobrir custos de servidor e dedicação ao desenvolvimento.

- [GitHub Sponsors](https://github.com/sponsors/nferdica)
- [Buy Me a Coffee](https://buymeacoffee.com/nferdica)

## Licença

[MIT](./LICENSE)

## Agradecimentos

Inspirado pela comunidade [Brazilian Accelerationism (br/acc)](https://x.com/i/communities/2025393333086916724) e pelo trabalho de fiscalização governamental usando dados abertos.
