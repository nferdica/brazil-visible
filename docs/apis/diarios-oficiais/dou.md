---
title: DOU — Diário Oficial da União
slug: dou
orgao: Imprensa Nacional
url_base: https://www.in.gov.br/
tipo_acesso: API REST
autenticacao: Não requerida
formato_dados: [JSON, HTML]
frequencia_atualizacao: Diária
campos_chave:
  - data_publicacao
  - secao
  - orgao
  - titulo
  - tipo_ato
  - conteudo
tags:
  - DOU
  - Diário Oficial
  - legislação
  - nomeações
  - decretos
  - leis
  - contratos
  - atos oficiais
  - Imprensa Nacional
cruzamento_com:
  - transparencia-cgu/servidores-federais
  - transparencia-cgu/contratos-federais
  - apis-governamentais/siape
status: parcial
---

# DOU — Diário Oficial da União

## O que é

O **DOU (Diário Oficial da União)** é o veículo oficial de publicação dos atos do governo federal brasileiro. Publicado diariamente pela **Imprensa Nacional**, o DOU é dividido em três seções:

- **Seção 1** — Leis, decretos, resoluções, portarias, instruções normativas
- **Seção 2** — Atos de pessoal (nomeações, exonerações, aposentadorias, promoções)
- **Seção 3** — Contratos, licitações, avisos, editais

A versão digital do DOU está disponível no portal da Imprensa Nacional, com possibilidade de busca textual e acesso via API. Projetos como o **Querido Diário** da Open Knowledge Brasil também oferecem acesso estruturado aos diários oficiais.

## Como acessar

| Item | Detalhe |
|---|---|
| **Portal IN** | `https://www.in.gov.br/` |
| **API INLABS** | `https://inlabs.in.gov.br/` (requer cadastro) |
| **Querido Diário** | `https://queridodiario.ok.org.br/` |
| **Autenticação** | Portal: não requerida. API INLABS: cadastro institucional. |
| **Formato** | JSON, HTML, PDF |
| **Publicação** | Diária (dias úteis), edições extras sob demanda |

### Busca textual

O portal da Imprensa Nacional permite buscas textuais nos atos publicados:

```
https://www.in.gov.br/consulta/-/buscar/dou?q={termo}&s=todos&exactDate=personalizado&publishFrom={data_inicio}&publishTo={data_fim}
```

## Endpoints/recursos principais

| Recurso | Conteúdo | Acesso |
|---|---|---|
| **Busca textual** | Pesquisa por palavras-chave nos atos publicados | Público |
| **INLABS API** | API REST com dados estruturados do DOU | Cadastro institucional |
| **Querido Diário API** | API aberta com DOU e DOEs estaduais/municipais | Público |
| **PDF do jornal** | Edição completa em PDF | Público |

### Querido Diário — API aberta

| Endpoint | Descrição |
|---|---|
| `https://queridodiario.ok.org.br/api/gazettes` | Busca em diários oficiais |
| `?territory_id={id}` | Filtrar por município/UF |
| `&since={data}&until={data}` | Filtrar por período |
| `&querystring={termo}` | Busca textual |

## Exemplo de uso

### Busca no portal da Imprensa Nacional

```python
import requests
from bs4 import BeautifulSoup

# Busca de nomeações no DOU
url = "https://www.in.gov.br/consulta/-/buscar/dou"
params = {
    "q": "nomeação",
    "s": "todos",
    "exactDate": "personalizado",
    "publishFrom": "01/01/2025",
    "publishTo": "31/01/2025",
}

headers = {"User-Agent": "Mozilla/5.0"}
response = requests.get(url, params=params, headers=headers)

# O resultado é HTML — necessário parsing
soup = BeautifulSoup(response.text, "html.parser")
resultados = soup.find_all("div", class_="resultado")
print(f"Resultados encontrados: {len(resultados)}")
```

### Consulta via Querido Diário

```python
import requests
import pandas as pd

# Buscar publicações no DOU via Querido Diário
url = "https://queridodiario.ok.org.br/api/gazettes"
params = {
    "territory_id": "5300108",  # Brasília (código IBGE)
    "since": "2025-01-01",
    "until": "2025-01-31",
    "querystring": "licitação",
}

response = requests.get(url, params=params)
response.raise_for_status()
dados = response.json()

print(f"Publicações encontradas: {dados['total_gazettes']}")
for gazette in dados["gazettes"][:5]:
    print(f"  {gazette['date']}: {gazette.get('edition', 'N/A')}")
    print(f"    URL: {gazette.get('txt_url', 'N/A')}")
```

## Campos disponíveis

### Portal IN (busca textual)

| Campo | Tipo | Descrição |
|---|---|---|
| `data_publicacao` | date | Data de publicação |
| `secao` | string | Seção do DOU (1, 2, 3, Extra) |
| `orgao` | string | Órgão responsável pelo ato |
| `titulo` | string | Título/ementa do ato |
| `tipo_ato` | string | Lei, Decreto, Portaria, Edital, etc. |
| `conteudo` | string | Texto completo do ato |
| `url` | string | Link para o ato no portal |

### Querido Diário API

| Campo | Tipo | Descrição |
|---|---|---|
| `territory_id` | string | Código IBGE do território |
| `date` | date | Data de publicação |
| `edition` | string | Número da edição |
| `is_extra_edition` | boolean | Edição extra (S/N) |
| `txt_url` | string | URL do texto em formato TXT |
| `url` | string | URL original do diário |

## Cruzamentos possíveis

| Cruzamento | Fonte relacionada | Chave de ligação | Finalidade |
|---|---|---|---|
| Nomeações x Servidores | [Servidores Federais](/docs/apis/transparencia-cgu/servidores-federais) | Nome, órgão | Validar nomeações publicadas com cadastro de servidores |
| Contratos x Licitações | [Contratos Federais](/docs/apis/transparencia-cgu/contratos-federais) | Órgão, número do contrato | Cruzar publicações de contratos com dados do Portal da Transparência |
| Nomeações x SIAPE | [SIAPE](/docs/apis/apis-governamentais/siape) | CPF, matrícula | Vincular nomeações do DOU com dados funcionais do SIAPE |

## Limitações conhecidas

| Limitação | Detalhes |
|---|---|
| **API INLABS restrita** | A API oficial (INLABS) requer cadastro institucional e aprovação, não sendo aberta ao público geral. |
| **Dados não estruturados** | O conteúdo do DOU é majoritariamente texto livre (HTML/PDF), sem estruturação padronizada dos campos. Análise requer NLP. |
| **Busca textual limitada** | A busca no portal da IN pode retornar resultados imprecisos e não oferece filtros avançados. |
| **Sem API pública oficial** | Não há API REST oficial aberta. Alternativas incluem o Querido Diário e web scraping. |
| **Volume diário alto** | Cada edição do DOU pode conter milhares de atos, especialmente a Seção 2 (pessoal). |
| **Edições extras** | Edições extras são publicadas sem aviso prévio, dificultando monitoramento automatizado. |
