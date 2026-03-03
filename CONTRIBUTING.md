# Como Contribuir

Obrigado pelo interesse em contribuir com o **Brazil Visible**! Este projeto é um catálogo colaborativo de APIs e fontes de dados públicos brasileiros, voltado para fiscalização governamental e transparência.

Toda contribuição é bem-vinda, seja adicionando novas fontes de dados, criando receitas de cruzamento, melhorando a documentação existente ou reportando problemas.

## Sumário

- [Adicionando uma nova API](#adicionando-uma-nova-api)
- [Adicionando uma receita de cruzamento](#adicionando-uma-receita-de-cruzamento)
- [Melhorando documentação existente](#melhorando-documentação-existente)
- [Setup local para desenvolvimento](#setup-local-para-desenvolvimento)
- [Padrões de commit](#padrões-de-commit)

---

## Adicionando uma nova API

Para adicionar uma nova fonte de dados ao catálogo, siga os passos abaixo:

### 1. Identifique a categoria

As APIs são organizadas por órgão/tema dentro de `docs/apis/`. Veja as categorias existentes:

```
docs/apis/
  banco-central/
  transparencia-cgu/
  receita-federal/
  tesouro-nacional/
  saude-datasus/
  justica-eleitoral-tse/
  educacao/
  ibge-estatisticas/
  ...
```

Se nenhuma categoria existente se aplica, crie uma nova pasta com nome em kebab-case e adicione um `category.json` com `label` e `position`.

### 2. Crie o arquivo Markdown

Crie um arquivo `.md` dentro da categoria apropriada. O nome do arquivo deve usar kebab-case e descrever a fonte de dados. Exemplo: `docs/apis/banco-central/sgs-cambio.md`.

### 3. Preencha o frontmatter

Toda página de API **deve** conter o seguinte frontmatter YAML no início do arquivo. Este schema é obrigatório:

```yaml
---
title: "Nome da API ou Fonte de Dados"    # Título exibido na página
slug: nome-em-kebab-case                  # Slug para a URL (deve ser único na categoria)
orgao: "SIGLA"                            # Sigla do órgão responsável (ex: BCB, CGU, IBGE)
url_base: "https://..."                   # URL base da API ou portal de dados
tipo_acesso: "API REST"                   # Tipo de acesso (API REST, Download CSV, Web Scraping, etc.)
autenticacao: "Não requerida"             # Tipo de autenticação (Não requerida, API Key, OAuth, etc.)
formato_dados: [JSON, CSV]                # Formatos de dados disponíveis (lista YAML)
frequencia_atualizacao: "Diária"          # Frequência de atualização (Diária, Mensal, Anual, etc.)
campos_chave:                             # Lista dos campos mais importantes
  - campo1
  - campo2
tags:                                     # Tags para busca e categorização
  - tag1
  - tag2
cruzamento_com:                           # Slugs de outras APIs para cruzamento
  - categoria/slug-da-api
status: documentado                       # Status da documentação (documentado, parcial, stub)
---
```

### 4. Escreva o conteúdo

Após o frontmatter, escreva o conteúdo da página seguindo esta estrutura:

1. **O que é** — descrição da fonte de dados e sua relevância
2. **Como acessar** — tabela com URL, autenticação, rate limits, formatos
3. **Endpoints/recursos principais** — tabela com endpoints ou recursos disponíveis
4. **Exemplo de uso** — código Python funcional demonstrando como consumir a API
5. **Campos disponíveis** — tabela com nome, tipo e descrição de cada campo
6. **Cruzamentos possíveis** — links para outras fontes de dados que podem ser cruzadas
7. **Limitações conhecidas** — problemas, limites e cuidados ao usar a fonte

### 5. Abra um Pull Request

Abra um PR com título descritivo e preencha o template. Verifique se o build passa antes de submeter.

---

## Adicionando uma receita de cruzamento

Receitas de cruzamento mostram como combinar dados de duas ou mais fontes para gerar insights. Para adicionar uma nova receita:

### 1. Crie o arquivo

Crie o arquivo em `docs/cruzamentos/` com nome descritivo em kebab-case. Exemplo: `docs/cruzamentos/empresas-sancionadas-doadoras-eleicoes.md`.

### 2. Estrutura da receita

A receita deve conter:

1. **Objetivo** — o que a análise busca responder
2. **Fontes utilizadas** — lista das APIs/fontes envolvidas com links
3. **Campos de ligação** — quais campos conectam as bases (ex: CNPJ, CPF, código IBGE)
4. **Passo a passo** — instruções detalhadas de como realizar o cruzamento
5. **Código de exemplo** — script Python funcional que demonstra o cruzamento
6. **Resultado esperado** — o que o usuário deve encontrar ao executar a receita
7. **Cuidados e limitações** — problemas de qualidade de dados, gaps temporais, etc.

### 3. Abra um Pull Request

Abra um PR referenciando as APIs utilizadas na receita.

---

## Melhorando documentação existente

Melhorias na documentação existente são muito bem-vindas! Alguns exemplos:

- **Corrigir informações desatualizadas** — URLs que mudaram, endpoints descontinuados
- **Adicionar exemplos de uso** — novos exemplos de código em Python ou outras linguagens
- **Completar campos faltantes** — preencher campos do frontmatter que estejam vazios
- **Melhorar descrições** — tornar explicações mais claras e detalhadas
- **Adicionar cruzamentos** — sugerir novos cruzamentos entre fontes de dados
- **Corrigir erros** — erros de português, formatação, links quebrados

Para fazer melhorias:

1. Encontre o arquivo correspondente em `docs/`
2. Faça as alterações necessárias
3. Verifique se o build continua passando (`npm run build`)
4. Abra um Pull Request descrevendo o que foi alterado

---

## Setup local para desenvolvimento

### Pré-requisitos

- [Node.js](https://nodejs.org/) versão 20 ou superior
- npm (incluído com o Node.js)

### Instalação

```bash
# Clone o repositorio
git clone https://github.com/nferdica/brazil-visible.git
cd brazil-visible

# Instale as dependências
npm install
```

### Executando localmente

```bash
# Inicia o servidor de desenvolvimento com hot-reload
npm run dev
```

O site estará disponível em `http://localhost:3000`.

### Build de produção

```bash
# Gera o build estático
npm run build
```

---

## Padrões de commit

Este projeto segue a convenção de [Conventional Commits](https://www.conventionalcommits.org/pt-br/). Use os seguintes prefixos nas mensagens de commit:

| Prefixo  | Quando usar                                              | Exemplo                                          |
|----------|----------------------------------------------------------|--------------------------------------------------|
| `feat:`  | Adicionar nova API, receita de cruzamento ou recurso     | `feat: add API page for CNES/DATASUS`            |
| `docs:`  | Melhorar documentação existente, corrigir textos         | `docs: fix broken link in portal-transparencia`  |
| `fix:`   | Corrigir erros no build, links quebrados, dados errados  | `fix: correct endpoint URL for SGS series`       |
| `ci:`    | Alterações em CI/CD, GitHub Actions, deploy              | `ci: add build check on pull requests`           |

### Formato da mensagem

```
<tipo>: <descrição curta em inglês>

[corpo opcional com mais detalhes]
```

### Exemplos

```bash
git commit -m "feat: add API page for RAIS employment data"
git commit -m "docs: improve example code for PTAX query"
git commit -m "fix: correct authentication info for CGU API"
git commit -m "ci: add deploy workflow for GitHub Pages"
```

---

## Código de Conduta

Este projeto adota o [Contributor Covenant v2.1](CODE_OF_CONDUCT.md) como código de conduta. Ao participar, espera-se que você siga este código. Reporte comportamentos inaceitáveis para **brazil-visible@proton.me**.

---

## Dúvidas?

Abra uma [Discussion](https://github.com/nferdica/brazil-visible/discussions) no GitHub ou entre em contato via issues. Toda contribuição é valorizada!
