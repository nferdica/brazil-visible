# Como Contribuir

Obrigado pelo interesse em contribuir com o **Brazil Visible**! Este projeto e um catalogo colaborativo de APIs e fontes de dados publicos brasileiros, voltado para fiscalizacao governamental e transparencia.

Toda contribuicao e bem-vinda, seja adicionando novas fontes de dados, criando receitas de cruzamento, melhorando a documentacao existente ou reportando problemas.

## Sumario

- [Adicionando uma nova API](#adicionando-uma-nova-api)
- [Adicionando uma receita de cruzamento](#adicionando-uma-receita-de-cruzamento)
- [Melhorando documentacao existente](#melhorando-documentacao-existente)
- [Setup local para desenvolvimento](#setup-local-para-desenvolvimento)
- [Padroes de commit](#padroes-de-commit)

---

## Adicionando uma nova API

Para adicionar uma nova fonte de dados ao catalogo, siga os passos abaixo:

### 1. Identifique a categoria

As APIs sao organizadas por orgao/tema dentro de `docs/apis/`. Veja as categorias existentes:

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

Se nenhuma categoria existente se aplica, crie uma nova pasta com nome em kebab-case.

### 2. Crie o arquivo Markdown

Crie um arquivo `.md` dentro da categoria apropriada. O nome do arquivo deve usar kebab-case e descrever a fonte de dados. Exemplo: `docs/apis/banco-central/sgs-cambio.md`.

### 3. Preencha o frontmatter

Toda pagina de API **deve** conter o seguinte frontmatter YAML no inicio do arquivo. Este schema e obrigatorio:

```yaml
---
title: "Nome da API ou Fonte de Dados"    # Titulo exibido na pagina
slug: nome-em-kebab-case                  # Slug para a URL (deve ser unico na categoria)
orgao: "SIGLA"                            # Sigla do orgao responsavel (ex: BCB, CGU, IBGE)
url_base: "https://..."                   # URL base da API ou portal de dados
tipo_acesso: "API REST"                   # Tipo de acesso (API REST, Download CSV, Web Scraping, etc.)
autenticacao: "Nao requerida"             # Tipo de autenticacao (Nao requerida, API Key, OAuth, etc.)
formato_dados: [JSON, CSV]                # Formatos de dados disponiveis (lista YAML)
frequencia_atualizacao: "Diaria"          # Frequencia de atualizacao (Diaria, Mensal, Anual, etc.)
campos_chave:                             # Lista dos campos mais importantes
  - campo1
  - campo2
  - campo3
tags:                                     # Tags para busca e categorizacao
  - tag1
  - tag2
cruzamento_com:                           # Slugs de outras APIs para cruzamento
  - categoria/slug-da-api
  - outra-categoria/slug
status: documentado                       # Status da documentacao (documentado, em-progresso, rascunho)
---
```

### 4. Escreva o conteudo

Apos o frontmatter, escreva o conteudo da pagina seguindo esta estrutura:

1. **O que e** -- descricao da fonte de dados e sua relevancia
2. **Como acessar** -- tabela com URL, autenticacao, rate limits, formatos
3. **Endpoints/recursos principais** -- tabela com endpoints ou recursos disponiveis
4. **Exemplo de uso** -- codigo Python funcional demonstrando como consumir a API
5. **Campos disponiveis** -- tabela com nome, tipo e descricao de cada campo
6. **Cruzamentos possiveis** -- links para outras fontes de dados que podem ser cruzadas
7. **Limitacoes conhecidas** -- problemas, limites e cuidados ao usar a fonte

### 5. Abra um Pull Request

Abra um PR com o titulo descritivo e preencha o template. Verifique se o build passa antes de submeter.

---

## Adicionando uma receita de cruzamento

Receitas de cruzamento mostram como combinar dados de duas ou mais fontes para gerar insights. Para adicionar uma nova receita:

### 1. Crie o arquivo

Crie o arquivo em `docs/cruzamentos/` com nome descritivo em kebab-case. Exemplo: `docs/cruzamentos/empresas-sancionadas-doadoras-eleicoes.md`.

### 2. Estrutura da receita

A receita deve conter:

1. **Objetivo** -- o que a analise busca responder
2. **Fontes utilizadas** -- lista das APIs/fontes envolvidas com links
3. **Campos de ligacao** -- quais campos conectam as bases (ex: CNPJ, CPF, codigo IBGE)
4. **Passo a passo** -- instrucoes detalhadas de como realizar o cruzamento
5. **Codigo de exemplo** -- script Python funcional que demonstra o cruzamento
6. **Resultado esperado** -- o que o usuario deve encontrar ao executar a receita
7. **Cuidados e limitacoes** -- problemas de qualidade de dados, gaps temporais, etc.

### 3. Abra um Pull Request

Abra um PR referenciando as APIs utilizadas na receita.

---

## Melhorando documentacao existente

Melhorias na documentacao existente sao muito bem-vindas! Alguns exemplos:

- **Corrigir informacoes desatualizadas** -- URLs que mudaram, endpoints descontinuados
- **Adicionar exemplos de uso** -- novos exemplos de codigo em Python ou outras linguagens
- **Completar campos faltantes** -- preencher campos do frontmatter que estejam vazios
- **Melhorar descricoes** -- tornar explicacoes mais claras e detalhadas
- **Adicionar cruzamentos** -- sugerir novos cruzamentos entre fontes de dados
- **Corrigir erros** -- erros de portugues, formatacao, links quebrados

Para fazer melhorias:

1. Encontre o arquivo correspondente em `docs/`
2. Faca as alteracoes necessarias
3. Verifique se o build continua passando (`npm run build`)
4. Abra um Pull Request descrevendo o que foi alterado

---

## Setup local para desenvolvimento

### Pre-requisitos

- [Node.js](https://nodejs.org/) versao 20 ou superior
- npm (incluido com o Node.js)

### Instalacao

```bash
# Clone o repositorio
git clone https://github.com/nferdica/brazil-visible.git
cd brazil-visible

# Instale as dependencias
npm install
```

### Executando localmente

```bash
# Inicia o servidor de desenvolvimento com hot-reload
npm run start
```

O site estara disponivel em `http://localhost:3000/brazil-visible/`.

### Build de producao

```bash
# Gera o build estatico
npm run build

# Serve o build localmente para verificacao
npm run serve
```

### Verificacao de tipos

```bash
npm run typecheck
```

---

## Padroes de commit

Este projeto segue a convencao de [Conventional Commits](https://www.conventionalcommits.org/pt-br/). Use os seguintes prefixos nas mensagens de commit:

| Prefixo  | Quando usar                                              | Exemplo                                          |
|----------|----------------------------------------------------------|--------------------------------------------------|
| `feat:`  | Adicionar nova API, receita de cruzamento ou recurso     | `feat: add API page for CNES/DATASUS`            |
| `docs:`  | Melhorar documentacao existente, corrigir textos         | `docs: fix broken link in portal-transparencia`  |
| `fix:`   | Corrigir erros no build, links quebrados, dados errados  | `fix: correct endpoint URL for SGS series`       |
| `ci:`    | Alteracoes em CI/CD, GitHub Actions, deploy              | `ci: add build check on pull requests`           |

### Formato da mensagem

```
<tipo>: <descricao curta em ingles>

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

## Codigo de Conduta

Este projeto adota o [Contributor Covenant v2.1](CODE_OF_CONDUCT.md) como codigo de conduta. Ao participar, espera-se que voce siga este codigo. Reporte comportamentos inaceitaveis para **brazil-visible@proton.me**.

---

## Duvidas?

Abra uma [Discussion](https://github.com/nferdica/brazil-visible/discussions) no GitHub ou entre em contato via issues. Toda contribuicao e valorizada!
