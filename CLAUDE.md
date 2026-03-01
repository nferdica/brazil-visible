# Brazil Visible — Claude Code Instructions

## Project Overview
Documentation site (Docusaurus 3.x) cataloging 93+ Brazilian public data sources for government oversight. PT-BR primary language with English i18n support.

## Key Commands
- `npm install` — install dependencies
- `npm run start` — local dev server (http://localhost:3000/brazil-visible/)
- `npm run build` — production build
- `node scripts/validate-frontmatter.mjs` — validate API page frontmatter

## Project Structure
- `docs/apis/<category>/<source>.md` — API documentation pages (93 sources across 22 categories)
- `docs/cruzamentos/<recipe>.md` — cross-referencing recipes
- `docs/intro.md` — homepage content
- `docs/como-contribuir.md` — contribution guide
- `src/pages/index.tsx` — custom landing page
- `src/pages/index.module.css` — landing page styles
- `i18n/en/` — English translations
- `scripts/validate-frontmatter.mjs` — frontmatter validation
- `docs/plans/` — design documents (excluded from site build)

## Conventions

### API Pages
- Every API page MUST have required frontmatter: title, slug, orgao, url_base, tipo_acesso, status
- Optional frontmatter: autenticacao, formato_dados, frequencia_atualizacao, campos_chave, tags, cruzamento_com
- Body sections: O que é, Como acessar, Endpoints/recursos principais, Exemplo de uso, Campos disponíveis, Cruzamentos possíveis, Limitações conhecidas
- Content in PT-BR first, English translations in i18n/en/
- Status values: documentado (fully documented), parcial (partial info), stub (metadata only)

### Cross-Reference Recipes
- Frontmatter: title, dificuldade, fontes_utilizadas, campos_ponte, tags
- Body sections: Objetivo, Fluxo de dados, Passo a passo, Exemplo de código, Resultado esperado, Limitações

### General
- Commit messages follow conventional commits (feat:, docs:, ci:, fix:)
- Branch from `develop`, PR to `develop`, merge `develop` to `main` for releases
- `main` = production (auto-deploy to GitHub Pages)
- `develop` = development branch
- Always run `npm run build` before committing to verify no build errors
- Run `node scripts/validate-frontmatter.mjs` when modifying API pages

## Adding a New API Source
1. Create `docs/apis/<category>/<slug>.md`
2. Fill frontmatter with all required fields
3. Write content following the template sections
4. Run `node scripts/validate-frontmatter.mjs` to validate
5. Run `npm run build` to verify
6. Commit with `docs: add <source name> to <category>`

## Adding a Cross-Reference Recipe
1. Create `docs/cruzamentos/<slug>.md`
2. Fill frontmatter (title, dificuldade, fontes_utilizadas, campos_ponte, tags)
3. Write content following template sections
4. Run `npm run build` to verify
5. Commit with `docs: add <recipe name> cross-reference recipe`
