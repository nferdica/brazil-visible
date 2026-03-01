# Brazil Visible

Catálogo aberto de **93+ fontes de dados públicos brasileiros** para fiscalização governamental.

[![Build](https://github.com/nferdica/brazil-visible/actions/workflows/ci.yml/badge.svg)](https://github.com/nferdica/brazil-visible/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](./LICENSE)

## O que é

Um site de documentação que cataloga APIs e bases de dados públicas do governo brasileiro, com:

- **92 fontes de dados** documentadas com exemplos de código Python
- **22 categorias** organizadas por órgão (BCB, CGU, TSE, Receita Federal, IBGE, etc.)
- **5 receitas de cruzamento** mostrando como combinar bases para detectar irregularidades
- **Frontmatter estruturado** que permite consumo programático do catálogo

## Para quem

- **Desenvolvedores** que querem consumir dados públicos programaticamente
- **Jornalistas** que precisam cruzar bases para investigações
- **Pesquisadores** que estudam transparência e governança pública
- **Cidadãos** que querem entender como fiscalizar o governo

## Início rápido

```bash
# Clonar o repositório
git clone https://github.com/nferdica/brazil-visible.git
cd brazil-visible

# Instalar dependências
npm install

# Rodar localmente
npm run start
```

O site estará disponível em `http://localhost:3000/brazil-visible/`.

## Estrutura do projeto

```
docs/
├── apis/                    # 92 fontes de dados
│   ├── banco-central/       # BCB (9 fontes)
│   ├── receita-federal/     # Receita Federal (4 fontes)
│   ├── transparencia-cgu/   # CGU (8 fontes)
│   ├── justica-eleitoral-tse/ # TSE (7 fontes)
│   └── ...                  # +17 categorias
├── cruzamentos/             # 5 receitas de cruzamento
├── intro.md                 # Página inicial
└── como-contribuir.md       # Guia de contribuição
```

## Receitas de cruzamento

O diferencial do projeto: guias práticos para cruzar dados entre bases.

| Receita | Fontes | Dificuldade |
|---------|--------|-------------|
| Parlamentar × Empresas × Emendas | TSE, Receita Federal, CGU | Avançado |
| Rede CPF/CNPJ | Receita Federal (QSA, CNPJ) | Intermediário |
| Servidor Público × Empresas | CGU, Receita Federal | Intermediário |
| Desmatamento × CAR × Embargos | INPE, SICAR, IBAMA | Avançado |
| Licitações × Sanções | CGU (Contratos, CEIS, CNEP) | Básico |

## Contribuindo

Contribuições são muito bem-vindas! Veja o [guia de contribuição](./CONTRIBUTING.md) para saber como:

- Adicionar uma nova fonte de dados
- Criar uma receita de cruzamento
- Melhorar documentação existente

## Comandos

| Comando | Descrição |
|---------|-----------|
| `npm run start` | Servidor de desenvolvimento |
| `npm run build` | Build de produção |
| `node scripts/validate-frontmatter.mjs` | Validar frontmatter das APIs |

## Tecnologias

- [Docusaurus 3](https://docusaurus.io/) — gerador de site estático
- [GitHub Pages](https://pages.github.com/) — hospedagem gratuita
- [GitHub Actions](https://github.com/features/actions) — CI/CD

## Licença

[MIT](./LICENSE)

## Agradecimentos

Inspirado pela comunidade [Brazilian Accelerationism (br/acc)](https://x.com/i/communities/2025393333086916724) e pelo trabalho de fiscalização governamental usando dados abertos.
