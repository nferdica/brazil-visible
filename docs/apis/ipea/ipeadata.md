---
title: Ipeadata — Séries Econômicas e Indicadores Sociais
slug: ipeadata
orgao: IPEA
url_base: http://www.ipeadata.gov.br/api/
tipo_acesso: API REST
autenticacao: Não requerida
formato_dados: [JSON]
frequencia_atualizacao: Diária
campos_chave:
  - serie_codigo
  - valor
  - data
  - tema
  - frequencia
  - unidade
tags:
  - IPEA
  - séries temporais
  - indicadores econômicos
  - indicadores sociais
  - Atlas do Desenvolvimento Humano
  - IDH
  - macroeconomia
cruzamento_com:
  - banco-central/sgs-juros
  - banco-central/sgs-indices
  - ibge-estatisticas/ipca-inflacao
  - ibge-estatisticas/pib-municipal
status: documentado
---

# Ipeadata — Séries Econômicas e Indicadores Sociais

## O que é

O **Ipeadata** é o banco de dados do **IPEA (Instituto de Pesquisa Econômica Aplicada)** que reúne séries temporais de dados econômicos, financeiros e sociais do Brasil. Funciona como um **agregador de fontes oficiais**, consolidando dados do IBGE, Banco Central, MTE, CVM e diversas outras instituições em uma plataforma unificada com API de acesso.

O Ipeadata organiza os dados em três grandes temas:

- **Macroeconômico** — PIB, inflação, câmbio, juros, balança comercial, contas nacionais, emprego
- **Regional** — dados por UF e município (PIB municipal, população, IDH, indicadores sociais)
- **Social** — educação, saúde, trabalho, renda, desigualdade, pobreza

Além das séries temporais, o IPEA mantém o **Atlas do Desenvolvimento Humano no Brasil**, com o IDH-M (Índice de Desenvolvimento Humano Municipal) e centenas de indicadores sociais por município, calculados a partir dos Censos Demográficos.

## Como acessar

| Item | Detalhe |
|---|---|
| **Portal** | `http://www.ipeadata.gov.br/` |
| **API** | `http://www.ipeadata.gov.br/api/odata4/` |
| **Atlas do Desenvolvimento Humano** | `http://www.atlasbrasil.org.br/` |
| **Autenticação** | Não requerida |
| **Formato** | JSON (OData v4) |
| **CORS** | Habilitado |

### Estrutura da API (OData v4)

A API segue o padrão OData v4, permitindo consultas com filtros, ordenação e paginação:

```
http://www.ipeadata.gov.br/api/odata4/{recurso}?$filter={filtro}&$orderby={campo}&$top={n}
```

## Endpoints/recursos principais

### Endpoints da API

| Endpoint | Descrição |
|---|---|
| `Metadados` | Lista de todas as séries disponíveis |
| `Metadados('{SERCODIGO}')` | Metadados de uma série específica |
| `ValoresSerie(SERCODIGO='{SERCODIGO}')` | Valores de uma série temporal |
| `Temas` | Lista de temas |
| `Paises` | Lista de países (para séries internacionais) |
| `Territorios` | Lista de territórios (UFs, municípios) |

### Séries mais consultadas

| Série | Código | Descrição | Frequência |
|---|---|---|---|
| PIB real | `SCN104_PIBPMG104` | PIB trimestral a preços de mercado | Trimestral |
| IPCA | `PRECOS_IPCA` | Variação mensal do IPCA | Mensal |
| Taxa Selic | `BMF366_TJOVER366` | Taxa Selic anualizada | Diária |
| Câmbio | `BMF366_TRMECO366` | Taxa de câmbio comercial R$/US$ | Diária |
| Desemprego | `PNADC_TXDESOCU` | Taxa de desocupação (PNAD Contínua) | Trimestral |
| IDH-M | `ADH_IDH` | IDH Municipal | Decenal |
| Pobreza | `ADH_PIND` | % de pobres por município | Decenal |
| Gini | `ADH_GINI` | Índice de Gini por município | Decenal |

## Exemplo de uso

### Listar séries por tema

```python
import requests

# Listar metadados de séries (primeiras 20)
url = "http://www.ipeadata.gov.br/api/odata4/Metadados"
params = {
    "$top": 20,
    "$filter": "contains(SERNOME, 'PIB')",
    "$select": "SERCODIGO,SERNOME,PERNOME,UNINOME",
}

response = requests.get(url, params=params)
response.raise_for_status()
dados = response.json()["value"]

for serie in dados:
    print(f"{serie['SERCODIGO']}: {serie['SERNOME']} ({serie['PERNOME']})")
```

### Consultar série temporal

```python
import requests
import pandas as pd

# IPCA mensal
url = "http://www.ipeadata.gov.br/api/odata4/ValoresSerie(SERCODIGO='PRECOS_IPCA')"

response = requests.get(url)
response.raise_for_status()
dados = response.json()["value"]

df = pd.DataFrame(dados)
df["VALDATA"] = pd.to_datetime(df["VALDATA"])
df["VALVALOR"] = df["VALVALOR"].astype(float)

# Últimos 12 meses
ultimos_12 = df.tail(12)
print("IPCA — últimos 12 meses:")
for _, row in ultimos_12.iterrows():
    print(f"  {row['VALDATA'].strftime('%b/%Y')}: {row['VALVALOR']:.2f}%")
```

### IDH Municipal (Atlas do Desenvolvimento Humano)

```python
import requests
import pandas as pd

# IDH Municipal — dados regionais
url = "http://www.ipeadata.gov.br/api/odata4/ValoresSerie(SERCODIGO='ADH_IDH')"

response = requests.get(url)
response.raise_for_status()
dados = response.json()["value"]

df = pd.DataFrame(dados)
df["VALVALOR"] = df["VALVALOR"].astype(float)

# Filtrar Censo 2010 (último disponível para IDH-M)
df_2010 = df[df["VALDATA"].str.contains("2010")]
df_2010 = df_2010.sort_values("VALVALOR", ascending=False)

print(f"Municípios com IDH-M: {len(df_2010):,}")
print("\nTop 10 municípios com maior IDH-M:")
print(df_2010.head(10)[["TERCODIGO", "VALVALOR"]].to_string(index=False))

print("\n10 municípios com menor IDH-M:")
print(df_2010.tail(10)[["TERCODIGO", "VALVALOR"]].to_string(index=False))
```

## Campos disponíveis

### Metadados de séries

| Campo | Tipo | Descrição |
|---|---|---|
| `SERCODIGO` | string | Código identificador da série |
| `SERNOME` | string | Nome da série |
| `SERTEMA` | string | Tema (Macroeconômico, Regional, Social) |
| `PERNOME` | string | Periodicidade (Diária, Mensal, Trimestral, Anual) |
| `UNINOME` | string | Unidade (%, R$, Índice, etc.) |
| `SERFONTE` | string | Fonte dos dados (IBGE, BCB, MTE, etc.) |
| `SERCOMENTARIO` | string | Comentário/nota metodológica |
| `SERINICIO` | date | Data de início da série |
| `SERFIM` | date | Data de fim da série (nulo se ativa) |

### Valores de séries

| Campo | Tipo | Descrição |
|---|---|---|
| `SERCODIGO` | string | Código da série |
| `VALDATA` | datetime | Data de referência |
| `VALVALOR` | float | Valor da observação |
| `TERCODIGO` | string | Código do território (para séries regionais) |
| `NIVNOME` | string | Nível geográfico (Brasil, UF, Município) |

## Cruzamentos possíveis

| Cruzamento | Fonte relacionada | Chave de ligação | Finalidade |
|---|---|---|---|
| Ipeadata x BCB | [SGS/API BCB — Juros](/docs/apis/banco-central/sgs-juros) | período | Validar e complementar séries monetárias |
| IDH x PIB | [PIB Municipal](/docs/apis/ibge-estatisticas/pib-municipal) | `codigo_municipio` | Correlacionar desenvolvimento humano com riqueza |
| Indicadores sociais x Censo | [Censo Demográfico](/docs/apis/ibge-estatisticas/censo-demografico) | `codigo_municipio` | Contextualizar indicadores do Atlas com dados censitários |
| Inflação x IPCA | [IPCA/Inflação](/docs/apis/ibge-estatisticas/ipca-inflacao) | período | Comparar séries de inflação de diferentes fontes |

## Limitações conhecidas

| Limitação | Detalhes |
|---|---|
| **API via HTTP (não HTTPS)** | A API do Ipeadata usa HTTP, não HTTPS. Algumas bibliotecas e ambientes corporativos podem bloquear requisições HTTP. |
| **Performance variável** | Séries com muitas observações ou consultas regionais podem ser lentas. |
| **Dados do Atlas desatualizados** | O Atlas do Desenvolvimento Humano (IDH-M) é baseado nos Censos Demográficos. O último cálculo completo usa dados do Censo 2010. O cálculo com dados do Censo 2022 ainda está em andamento. |
| **Sem paginação automática** | Para séries muito longas, pode ser necessário usar `$top` e `$skip` para paginar os resultados. |
| **Códigos de território** | Os códigos de território do Ipeadata podem diferir dos códigos IBGE padrão. É necessário usar a tabela de territórios para harmonizar. |
| **Documentação limitada** | A documentação da API é básica. Explorar os metadados via endpoint `Metadados` é essencial para encontrar as séries desejadas. |
| **Séries descontinuadas** | Algumas séries podem estar descontinuadas sem aviso claro. Verificar o campo `SERFIM` nos metadados. |
