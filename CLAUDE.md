# Brazil Visible — Claude Code Instructions

> Para arquitetura completa, estrutura de diretórios e convenções detalhadas, consulte [AGENTS.md](./AGENTS.md).

## Project Overview
Documentation site (Next.js 15, App Router, static export) cataloging 92 Brazilian public data sources for government oversight. PT-BR primary language.

## Key Commands
- `npm install` — install dependencies
- `npm run dev` — local dev server (http://localhost:3000)
- `npm run build` — production build (static export to `out/`)
- `node scripts/validate-frontmatter.mjs` — validate API page frontmatter
- `node scripts/health-check.mjs` — check API availability (generates `public/health.json`)

## Tech Stack
- **Framework**: Next.js 15 (App Router, `output: 'export'`)
- **Styling**: Tailwind CSS 3.4 with Brazilian flag color palette
- **MDX**: `next-mdx-remote/rsc` with remark/rehype plugins
- **Themes**: `next-themes` (class-based dark mode)
- **Deploy**: Docker (node:20-alpine build + nginx:alpine) for EasyPanel

## Project Structure
- `app/` — Next.js App Router pages and layouts
- `components/` — 12 React components (navbar, sidebar, search, status-badge, etc.)
- `lib/content.ts` — filesystem-based content utilities (memoized)
- `lib/mdx.tsx` — MDX rendering pipeline with remark/rehype plugins
- `lib/remark-admonitions.ts` — custom remark plugin for :::warning/:::tip/:::note
- `docs/apis/<category>/<source>.md` — API documentation pages (92 sources across 22 categories)
- `docs/cruzamentos/<recipe>.md` — cross-referencing recipes (5 recipes)
- `recipes/<name>/` — Jupyter notebooks (3 notebooks)
- `scripts/health-check.mjs` — API availability checker (WAF-bypass, 3-tier strategy)
- `scripts/validate-frontmatter.mjs` — frontmatter validation
- `public/health.json` — health check results (generated, committed by CI)

## Conventions

### API Pages
- Every API page MUST have required frontmatter: title, slug, orgao, url_base, tipo_acesso, status
- Optional frontmatter: autenticacao, formato_dados, frequencia_atualizacao, campos_chave, tags, cruzamento_com
- Body sections: O que é, Como acessar, Endpoints/recursos principais, Exemplo de uso, Campos disponíveis, Cruzamentos possíveis, Limitações conhecidas
- Content in PT-BR
- Status values: documentado (fully documented), parcial (partial info), stub (metadata only)
- url_base MUST be a URL that returns HTTP 200 (for health check accuracy)

### Cross-Reference Recipes
- Frontmatter: title, dificuldade, fontes_utilizadas, campos_ponte, tags
- Body sections: Objetivo, Fluxo de dados, Passo a passo, Exemplo de código, Resultado esperado, Limitações

### General
- Commit messages follow conventional commits (feat:, docs:, ci:, fix:)
- Branch from `develop`, PR to `develop`, merge `develop` to `main` for releases
- `main` = production, `develop` = development branch
- Always run `npm run build` before committing to verify no build errors
- Run `node scripts/validate-frontmatter.mjs` when modifying API pages
- Run `node scripts/health-check.mjs` when modifying url_base values

## Adding a New API Source
1. Create `docs/apis/<category>/<slug>.md`
2. Fill frontmatter with all required fields
3. Write content following the template sections
4. Run `node scripts/validate-frontmatter.mjs` to validate
5. Run `npm run build` to verify
6. Run `node scripts/health-check.mjs` to verify url_base
7. Commit with `docs: add <source name> to <category>`

## Adding a Cross-Reference Recipe
1. Create `docs/cruzamentos/<slug>.md`
2. Fill frontmatter (title, dificuldade, fontes_utilizadas, campos_ponte, tags)
3. Write content following template sections
4. Run `npm run build` to verify
5. Commit with `docs: add <recipe name> cross-reference recipe`
