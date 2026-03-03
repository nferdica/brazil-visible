# Brazil Visible — Fonte da Verdade

> Este arquivo é a referência canônica do projeto. Qualquer agente de IA, contribuidor ou ferramenta deve consultá-lo para entender a arquitetura, convenções e estado atual da aplicação.

---

## Visão Geral

**Brazil Visible** é um catálogo aberto de fontes de dados públicos brasileiros para fiscalização governamental. O site documenta APIs, portais e bases de dados do governo federal com exemplos de código, receitas de cruzamento e notebooks reproduzíveis.

- **URL de produção**: https://brazilvisible.org
- **Repositório**: https://github.com/nferdica/brazil-visible
- **Licença**: MIT
- **Idioma principal**: PT-BR
- **Branch de produção**: `main`
- **Branch de desenvolvimento**: `develop`

---

## Números Atuais

| Métrica | Valor |
|---------|-------|
| Fontes de dados documentadas | 92 |
| Categorias de APIs | 22 |
| URLs únicas monitoradas | 61 (56 HTTP/S + 5 FTP) |
| Receitas de cruzamento | 5 |
| Notebooks Jupyter | 3 |
| Tags únicas | 550+ |
| Páginas estáticas geradas | ~686 |

---

## Tech Stack

| Camada | Tecnologia | Versão |
|--------|-----------|--------|
| Runtime | Node.js | >= 20 |
| Framework | Next.js (App Router) | 15.x |
| Renderização | Static Export (`output: 'export'`) | — |
| Styling | Tailwind CSS | 3.4.x |
| MDX | next-mdx-remote/rsc | 5.x |
| Syntax Highlight | Shiki (via rehype-pretty-code) | 3.x |
| Temas | next-themes (class-based dark mode) | 0.4.x |
| Ícones | Lucide React | 0.576+ |
| Hero Background | @paper-design/shaders-react | 0.0.71 |
| Deploy | Docker (node:20-alpine + nginx:alpine) | — |
| Hosting | EasyPanel | — |
| CI/CD | GitHub Actions | — |

---

## Arquitetura

### Princípios

1. **100% estático** — `next build` gera HTML/CSS/JS puro em `out/`. Sem servidor Node em produção.
2. **Conteúdo como dados** — Todo conteúdo vive em arquivos `.md` com frontmatter YAML estruturado. O código TypeScript lê o filesystem em build time.
3. **Zero banco de dados** — Não há banco de dados. O conteúdo é lido de `docs/` e o health check gera `public/health.json`.
4. **SEO-first** — Cada página tem metadata, canonical URL, JSON-LD e sitemap dinâmico.

### Fluxo de build

```
docs/*.md (Markdown + YAML frontmatter)
    ↓ gray-matter (parse frontmatter)
    ↓ lib/content.ts (sidebar, tags, docs)
    ↓ next-mdx-remote/rsc (renderiza MDX)
    ↓ next build (static export)
    ↓ out/ (HTML estático)
    ↓ Docker (nginx serve)
    ↓ EasyPanel (produção)
```

### Fluxo de health check

```
docs/apis/**/*.md (extrai url_base do frontmatter)
    ↓ scripts/health-check.mjs (normaliza URLs, deduplica)
    ↓ HTTP GET com headers de navegador (3 camadas de retry)
    ↓ public/health.json (resultado)
    ↓ GitHub Actions (a cada 6h, commit automático)
    ↓ components/status-badge.tsx (client-side fetch + badge)
```

---

## Estrutura de Diretórios

```
brazil-visible/
├── app/                              # Next.js App Router
│   ├── layout.tsx                    # Root layout (font, theme, navbar, footer)
│   ├── page.tsx                      # Landing page (hero, categorias, donate)
│   ├── globals.css                   # Tailwind base + custom CSS variables
│   ├── sitemap.ts                    # Sitemap dinâmico (todas as páginas)
│   ├── not-found.tsx                 # Página 404
│   ├── error.tsx                     # Error boundary raiz
│   └── docs/                         # Área de documentação
│       ├── layout.tsx                # Layout com sidebar + TOC
│       ├── page.tsx                  # Home da documentação (docs/intro.md)
│       ├── loading.tsx               # Skeleton de loading
│       ├── error.tsx                 # Error boundary da docs
│       ├── apis/
│       │   ├── page.tsx              # Índice de APIs (grid de categorias)
│       │   ├── [category]/
│       │   │   ├── page.tsx          # Lista de APIs de uma categoria
│       │   │   └── [slug]/
│       │   │       └── page.tsx      # Página individual de API
│       ├── cruzamentos/
│       │   ├── page.tsx              # Índice de receitas
│       │   └── [slug]/
│       │       └── page.tsx          # Página individual de receita
│       ├── tags/
│       │   ├── page.tsx              # Cloud de tags
│       │   └── [tag]/
│       │       └── page.tsx          # APIs com uma tag específica
│       └── como-contribuir/
│           └── page.tsx              # Guia de contribuição
│
├── components/                       # Componentes React (12 arquivos)
│   ├── navbar.tsx                    # Navegação principal (desktop + mobile)
│   ├── footer.tsx                    # Rodapé com links externos
│   ├── docs-sidebar.tsx              # Sidebar colapsável da documentação
│   ├── mobile-sidebar.tsx            # Sidebar mobile (sheet overlay)
│   ├── search-input.tsx              # Busca client-side com ARIA combobox
│   ├── toc.tsx                       # Table of Contents (IntersectionObserver)
│   ├── breadcrumbs.tsx               # Breadcrumbs com JSON-LD
│   ├── doc-nav.tsx                   # Navegação anterior/próximo
│   ├── status-badge.tsx              # Badge de status (online/offline/FTP)
│   ├── hero-background.tsx           # Background animado (MeshGradient shader)
│   ├── scroll-reveal.tsx             # Animação de reveal ao scroll
│   └── theme-provider.tsx            # Wrapper do next-themes
│
├── lib/                              # Utilitários de build
│   ├── content.ts                    # Leitura do filesystem (memoizado)
│   │   ├── getSidebar()              # → SidebarCategory[]
│   │   ├── getAllApiDocs()            # → DocEntry[]
│   │   ├── getApiDoc()               # → { frontmatter, content }
│   │   ├── getCruzamentoDoc()        # → { frontmatter, content }
│   │   └── getAllTags()              # → Map<string, DocEntry[]>
│   ├── mdx.tsx                       # Pipeline MDX (remark-gfm, rehype-pretty-code, etc.)
│   └── remark-admonitions.ts         # Plugin para :::warning, :::tip, :::note
│
├── docs/                             # Conteúdo Markdown
│   ├── intro.md                      # Home da documentação
│   ├── como-contribuir.md            # Guia de contribuição
│   ├── apis/                         # 92 fontes de dados
│   │   ├── category.json             # Configuração da seção
│   │   ├── banco-central/            # 9 fontes (ifdata, sgs-*)
│   │   ├── transparencia-cgu/        # 8 fontes (ceaf, ceis, cepim, cnep, ...)
│   │   ├── justica-eleitoral-tse/    # 7 fontes (eleitorado, candidaturas, ...)
│   │   ├── meio-ambiente/            # 7 fontes (car, deter, prodes, ...)
│   │   ├── saude-datasus/            # 6 fontes (sim, sinan, sinasc, sih, ...)
│   │   ├── dados-geoespaciais/       # 5 fontes (ibge, inde, incra, ...)
│   │   ├── infraestrutura-transportes/ # 5 fontes
│   │   ├── educacao/                 # 4 fontes
│   │   ├── ibge-estatisticas/        # 4 fontes
│   │   ├── receita-federal/          # 4 fontes
│   │   ├── agencias-reguladoras/     # 4 fontes
│   │   ├── mercado-financeiro/       # 4 fontes
│   │   ├── portais-centrais/         # 4 fontes
│   │   ├── poder-judiciario-cnj/     # 4 fontes
│   │   ├── tesouro-nacional/         # 3 fontes
│   │   ├── outros/                   # 3 fontes
│   │   ├── previdencia-social/       # 2 fontes
│   │   ├── trabalho-emprego/         # 2 fontes
│   │   ├── diarios-oficiais/         # 2 fontes
│   │   ├── apis-governamentais/      # 3 fontes
│   │   ├── ipea/                     # 1 fonte
│   │   └── seguranca-publica/        # 1 fonte
│   ├── cruzamentos/                  # 5 receitas
│   │   ├── parlamentar-empresas-emendas.md
│   │   ├── cpf-cnpj-nexus.md
│   │   ├── servidor-publico-empresas.md
│   │   ├── desmatamento-car-embargos.md
│   │   └── licitacoes-sancoes.md
│   └── plans/                        # Design docs (não renderizados)
│
├── recipes/                          # Notebooks Jupyter
│   ├── raio-x-parlamentar/           # README + notebook.ipynb + requirements.txt
│   ├── licitacao-suspeita/
│   └── fantasmas-servico-publico/
│
├── scripts/
│   ├── health-check.mjs              # Verifica disponibilidade das APIs
│   └── validate-frontmatter.mjs      # Valida frontmatter obrigatório
│
├── public/                           # Assets estáticos
│   ├── icon-dark.svg                 # Ícone (preto, para modo claro)
│   ├── icon-light.svg                # Ícone (branco, para modo escuro)
│   ├── logo-dark.svg                 # Logo completa (preta, para modo claro)
│   ├── logo-light.svg                # Logo completa (branca, para modo escuro)
│   ├── og-image.png                  # Open Graph image (512x512)
│   ├── health.json                   # Resultado do health check (gerado)
│   ├── manifest.json                 # PWA manifest
│   └── robots.txt                    # Robots.txt
│
├── .github/workflows/
│   ├── ci.yml                        # Build check em push/PR
│   └── health-check.yml              # Health check a cada 6h
│
├── Dockerfile                        # Multi-stage: node build → nginx serve
├── nginx.conf                        # Config nginx com security headers
├── next.config.ts                    # output: 'export', trailingSlash: true
├── tailwind.config.js                # Cores brasileiras, dark mode class
├── tsconfig.json                     # TypeScript strict
├── package.json                      # Dependências e scripts
├── AGENTS.md                         # Este arquivo (fonte da verdade)
├── CLAUDE.md                         # Instruções para Claude Code
├── CONTRIBUTING.md                   # Guia de contribuição
├── CODE_OF_CONDUCT.md                # Código de conduta
├── LICENSE                           # MIT
└── README.md                         # Visão geral do projeto
```

---

## Convenções de Conteúdo

### Frontmatter de APIs (obrigatório)

Cada arquivo em `docs/apis/<category>/<slug>.md` DEVE conter:

```yaml
---
title: "Nome da API"                    # Título exibido na página
slug: nome-em-kebab-case                # Slug único (usado na URL)
orgao: "SIGLA"                          # Sigla do órgão (BCB, CGU, IBGE, etc.)
url_base: "https://..."                 # URL base (deve retornar 200 no health check)
tipo_acesso: "API REST"                 # Tipo (API REST, CSV Download, Web Interface, etc.)
status: documentado                     # documentado | parcial | stub
---
```

Campos opcionais: `autenticacao`, `formato_dados`, `frequencia_atualizacao`, `campos_chave`, `tags`, `cruzamento_com`.

### Valores de status

| Status | Significado |
|--------|------------|
| `documentado` | Totalmente documentado com exemplos |
| `parcial` | Informações parciais, falta conteúdo |
| `stub` | Apenas metadata no frontmatter |

### Seções do corpo (API)

1. **O que é** — descrição da fonte e relevância
2. **Como acessar** — tabela com URL, autenticação, rate limits
3. **Endpoints/recursos principais** — tabela com endpoints
4. **Exemplo de uso** — código Python funcional
5. **Campos disponíveis** — tabela com nome, tipo, descrição
6. **Cruzamentos possíveis** — links para fontes cruzáveis
7. **Limitações conhecidas** — problemas e limites

### Frontmatter de Cruzamentos

```yaml
---
title: "Nome da Receita"
dificuldade: Básico | Intermediário | Avançado
fontes_utilizadas: [slug1, slug2]
campos_ponte: [CPF, CNPJ, etc.]
tags: [tag1, tag2]
---
```

### Seções do corpo (Cruzamento)

1. **Objetivo** — o que a análise busca responder
2. **Fluxo de dados** — diagrama das fontes
3. **Passo a passo** — instruções detalhadas
4. **Exemplo de código** — script Python funcional
5. **Resultado esperado** — output da análise
6. **Limitações** — cuidados e gaps

---

## Health Check

### Como funciona

O script `scripts/health-check.mjs`:

1. Lê todos os `url_base` do frontmatter das 92 APIs
2. Normaliza URLs (remove template vars `{SERIE}`, query strings, barras duplas)
3. Deduplica → 61 URLs únicas (56 HTTP/S + 5 FTP)
4. URLs FTP (DATASUS) → marcadas como status `ftp` sem teste de rede
5. URLs HTTP/S testadas com estratégia de 3 camadas:
   - **Camada 1**: GET com headers completos de Chrome (User-Agent, Accept, Sec-Fetch-*)
   - **Camada 2**: GET sem Sec-Fetch-* (alguns WAFs bloqueiam esses headers)
   - **Camada 3**: HEAD com headers simples
6. Para na primeira resposta que não seja 403
7. Resultado salvo em `public/health.json`

### GitHub Action

- **Workflow**: `.github/workflows/health-check.yml`
- **Frequência**: A cada 6h (`cron: '0 */6 * * *'`) + manual (`workflow_dispatch`)
- **Comportamento**: Roda o script, faz commit do `health.json` se mudou (com `[skip ci]`)

### Componente StatusBadge

- Arquivo: `components/status-badge.tsx` (client component)
- Faz `fetch('/health.json')` no `useEffect`
- Normaliza o `urlBase` recebido via props (mesma lógica do script)
- Mostra badge colorido:
  - Verde = online (200-399)
  - Vermelho = offline (400+, timeout)
  - Azul = FTP
  - Cinza = desconhecido (health.json não carregou)

### URLs compartilhadas

Múltiplos docs podem apontar para a mesma `url_base`:

| URL | Docs que compartilham |
|-----|----------------------|
| Portal da Transparência (Swagger) | 9 docs |
| BCB Dados Abertos | 8 docs (todos os SGS) |
| TSE Dados Abertos | 7 docs |
| IBGE Agregados | 4 docs |
| Receita Federal | 4 docs |
| Conecta gov.br | 2 docs |
| TerraBrasilis | 2 docs |
| Tesouro/SADIPEM | 2 docs |
| MTE/CAGED | 2 docs |

**Total: 61 URLs únicas + 31 duplicadas = 92 docs**

---

## Paleta de Cores

Definida em `tailwind.config.js`:

| Token | Hex | Uso |
|-------|-----|-----|
| `brazil-green` | `#009C3B` | Cor primária, links, botões |
| `brazil-green-light` | `#00B847` | Variante clara para dark mode |
| `brazil-green-dark` | `#007A2E` | Hover de botões verdes |
| `brazil-yellow` | `#FFDF00` | Acentos |
| `brazil-blue` | `#002776` | Acentos secundários |
| `dark-bg` | `#0c0c18` | Background do dark mode |
| `dark-surface` | `#14142a` | Superfícies do dark mode |

---

## Comandos

| Comando | Descrição |
|---------|-----------|
| `npm install` | Instalar dependências |
| `npm run dev` | Servidor de desenvolvimento (http://localhost:3000) |
| `npm run build` | Build de produção (static export para `out/`) |
| `npm run lint` | Linter (Next.js ESLint) |
| `node scripts/validate-frontmatter.mjs` | Validar frontmatter das APIs |
| `node scripts/health-check.mjs` | Verificar disponibilidade das APIs |

---

## Git & Branching

| Branch | Função |
|--------|--------|
| `main` | Produção (deploy automático) |
| `develop` | Desenvolvimento (base para novas features) |

### Fluxo

1. Branch de feature a partir de `develop`
2. PR para `develop`
3. Merge `develop` → `main` para releases

### Commits

Conventional Commits obrigatório:

| Prefixo | Uso |
|---------|-----|
| `feat:` | Nova API, receita, feature |
| `docs:` | Melhorar documentação existente |
| `fix:` | Corrigir erros, links, dados |
| `ci:` | Alterações em CI/CD |
| `refactor:` | Refatoração sem mudança funcional |
| `style:` | Formatação, espaçamento |

---

## Checklist pré-commit

1. `npm run build` — deve compilar sem erros
2. `node scripts/validate-frontmatter.mjs` — ao modificar APIs
3. `node scripts/health-check.mjs` — ao alterar `url_base` de APIs
4. Verificar que não há secrets ou arquivos grandes sendo commitados

---

## Deploy

### Docker (produção)

```bash
docker build -t brazil-visible .
docker run -p 80:80 brazil-visible
```

O `Dockerfile` faz build multi-stage:
1. **Stage 1** (node:20-alpine): `npm ci` + `npm run build` → gera `out/`
2. **Stage 2** (nginx:alpine): copia `out/` para nginx, aplica `nginx.conf`

### nginx.conf

Configurado com:
- Security headers (X-Frame-Options, CSP, Referrer-Policy, Permissions-Policy)
- SPA fallback (`try_files $uri $uri/ $uri/index.html`)
- Cache de 1 ano para `/_next/static/`
- Gzip para text, CSS, JSON, JS, SVG

---

## Acessibilidade

- `focus-visible:ring` em todos os elementos interativos
- `aria-expanded` em menus e sidebar colapsáveis
- `aria-label` em seções e botões sem texto visível
- `role="combobox"` com `aria-autocomplete` no search
- `role="dialog"` no menu mobile com trap de foco
- `prefers-reduced-motion` respeitado no hero e scroll-reveal
- Touch targets >= 44px (TOC, botões mobile)

---

## SEO

- `<title>` e `<meta description>` em todas as páginas
- `canonical` URL em todas as páginas
- `hreflang` pt-BR no root layout
- JSON-LD `WebSite` na landing page
- JSON-LD `Article` em cada página de API
- JSON-LD `BreadcrumbList` nos breadcrumbs
- Open Graph e Twitter Card metadata
- `sitemap.xml` dinâmico gerado em build time
- `robots.txt` permissivo
- Font `display: swap` para evitar FOIT

---

## Adicionando Conteúdo

### Nova API

```bash
# 1. Criar arquivo
touch docs/apis/<categoria>/<slug>.md

# 2. Preencher frontmatter (todos os campos obrigatórios)
# 3. Escrever corpo seguindo as 7 seções
# 4. Validar
node scripts/validate-frontmatter.mjs

# 5. Verificar build
npm run build

# 6. Testar health check
node scripts/health-check.mjs

# 7. Commit
git commit -m "docs: add <nome> to <categoria>"
```

### Nova Receita de Cruzamento

```bash
# 1. Criar arquivo
touch docs/cruzamentos/<slug>.md

# 2. Preencher frontmatter + corpo (6 seções)
# 3. Verificar build
npm run build

# 4. Commit
git commit -m "docs: add <nome> cross-reference recipe"
```

### Novo Notebook

```bash
# 1. Criar diretório
mkdir recipes/<slug>

# 2. Criar README.md, notebook.ipynb, requirements.txt
# 3. Adicionar notebook_path ao frontmatter do cruzamento correspondente

# 4. Commit
git commit -m "feat: add <nome> Jupyter notebook"
```
