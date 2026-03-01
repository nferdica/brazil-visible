---
title: SGS/API BCB - Índices
slug: sgs-indices
orgao: BCB
url_base: https://api.bcb.gov.br/dados/serie/bcdata.sgs.{SERIE}/dados?formato=json
tipo_acesso: API REST
autenticacao: Não requerida
formato_dados: [JSON, CSV, XML]
frequencia_atualizacao: Mensal
campos_chave: [data, valor, indice, indicador]
tags: [IBC-Br, IPCA, atividade econômica, expectativas, inflação, índices]
cruzamento_com:
  - sgs-cambio
  - sgs-juros
  - sgs-credito
  - ibge-estatisticas/ipca
status: documentado
---

# SGS/API BCB - Índices

## O que é

O **SGS do Banco Central** publica séries de índices econômicos que medem atividade econômica e expectativas de mercado. O **IBC-Br** (Índice de Atividade Econômica do Banco Central) é considerado uma "prévia do PIB", calculado mensalmente pelo BCB. O sistema também disponibiliza séries de índices de preços (como o IPCA) e o **Boletim Focus**, que agrega expectativas de mercado para as principais variáveis macroeconômicas.

O Boletim Focus é disponibilizado via um endpoint dedicado na plataforma OLINDA, com projeções de analistas para indicadores como IPCA, PIB, câmbio e Selic.

## Como acessar

| Item | Detalhe |
|---|---|
| **URL base (SGS)** | `https://api.bcb.gov.br/dados/serie/bcdata.sgs.{SERIE}/dados?formato=json` |
| **URL base (OLINDA - Focus)** | `https://olinda.bcb.gov.br/olinda/servico/Expectativas/versao/v1/odata/` |
| **Autenticação** | Não requerida |
| **Rate limit** | Não documentado oficialmente; recomenda-se no máximo 5 requisições/segundo |
| **Formatos** | JSON, CSV, XML |
| **CORS** | Habilitado |

### Parâmetros de consulta (SGS)

- `formato`: `json`, `csv` ou `xml`
- `dataInicial`: formato `dd/MM/yyyy`
- `dataFinal`: formato `dd/MM/yyyy`

### Parâmetros de consulta (OLINDA - Focus)

- `$filter`: filtro OData para indicador e data
- `$format`: `json` ou `csv`
- `$top`: número máximo de registros
- `$orderby`: campo de ordenação

## Endpoints/recursos principais

### Séries SGS

| Série | Código | Descrição | Periodicidade |
|---|---|---|---|
| IBC-Br | 24364 | Índice de Atividade Econômica do Banco Central | Mensal |
| IBC-Br (dessazonalizado) | 24365 | IBC-Br com ajuste sazonal | Mensal |
| IPCA (variação mensal) | 433 | Índice Nacional de Preços ao Consumidor Amplo | Mensal |
| IPCA (acumulado 12 meses) | 13522 | IPCA acumulado nos últimos 12 meses | Mensal |
| IGP-M (variação mensal) | 189 | Índice Geral de Preços - Mercado | Mensal |
| INPC (variação mensal) | 188 | Índice Nacional de Preços ao Consumidor | Mensal |
| IPC-Fipe (variação mensal) | 193 | Índice de Preços ao Consumidor - FIPE | Mensal |

### Endpoints OLINDA (Expectativas - Boletim Focus)

| Endpoint | Descrição |
|---|---|
| `ExpectativasMercadoAnuais` | Expectativas anuais (IPCA, PIB, câmbio, Selic) |
| `ExpectativasMercadoTrimestrais` | Expectativas trimestrais |
| `ExpectativasMercadoMensais` | Expectativas mensais |
| `ExpectativasMercadoTop4Anuais` | Expectativas das 4 melhores instituições |
| `ExpectativasMercadoInflacao12Meses` | Expectativas de inflação para 12 meses |
| `ExpectativasMercadoInstituicoes` | Expectativas por instituição |

## Exemplo de uso

### Consultar IBC-Br

```python
import requests
import pandas as pd

# IBC-Br dessazonalizado - Série 24365
url = "https://api.bcb.gov.br/dados/serie/bcdata.sgs.24365/dados?formato=json"
params = {
    "dataInicial": "01/01/2024",
    "dataFinal": "31/12/2024"
}

response = requests.get(url, params=params)
response.raise_for_status()
dados = response.json()

df = pd.DataFrame(dados)
df["data"] = pd.to_datetime(df["data"], format="%d/%m/%Y")
df["valor"] = df["valor"].astype(float)

# Calcular variação mensal
df["variacao_mensal"] = df["valor"].pct_change() * 100
print(df[["data", "valor", "variacao_mensal"]].tail())
```

### Consultar IPCA acumulado 12 meses

```python
import requests
import pandas as pd

# IPCA acumulado 12 meses - Série 13522
url = "https://api.bcb.gov.br/dados/serie/bcdata.sgs.13522/dados?formato=json"
params = {
    "dataInicial": "01/01/2023",
    "dataFinal": "31/12/2024"
}

response = requests.get(url, params=params)
response.raise_for_status()
dados = response.json()

df = pd.DataFrame(dados)
df["data"] = pd.to_datetime(df["data"], format="%d/%m/%Y")
df["valor"] = df["valor"].astype(float)

print(f"IPCA acumulado 12m (último): {df['valor'].iloc[-1]:.2f}%")
print(df.tail())
```

### Consultar expectativas Focus

```python
import requests
import pandas as pd

# Expectativas anuais do Focus para o IPCA
url = (
    "https://olinda.bcb.gov.br/olinda/servico/Expectativas/versao/v1/odata/"
    "ExpectativasMercadoAnuais"
)
params = {
    "$filter": "Indicador eq 'IPCA' and DataReferencia eq '2025'",
    "$top": 10,
    "$orderby": "Data desc",
    "$format": "json"
}

response = requests.get(url, params=params)
response.raise_for_status()
dados = response.json()["value"]

for d in dados[:5]:
    print(f"Data: {d['Data']} | Mediana: {d['Mediana']}% | "
          f"Mín: {d['Minimo']}% | Máx: {d['Maximo']}%")
```

## Campos disponíveis

### SGS (Séries de índices)

| Campo | Tipo | Descrição |
|---|---|---|
| `data` | string | Data do registro (formato `dd/MM/yyyy`) |
| `valor` | string | Valor do índice ou variação percentual |

### OLINDA (ExpectativasMercadoAnuais)

| Campo | Tipo | Descrição |
|---|---|---|
| `Indicador` | string | Nome do indicador (IPCA, PIB, Câmbio, Selic) |
| `Data` | date | Data da pesquisa |
| `DataReferencia` | string | Ano de referência da expectativa |
| `Media` | float | Média das expectativas |
| `Mediana` | float | Mediana das expectativas |
| `DesvioPadrao` | float | Desvio padrão das expectativas |
| `Minimo` | float | Valor mínimo das expectativas |
| `Maximo` | float | Valor máximo das expectativas |
| `numeroRespondentes` | int | Número de instituições respondentes |
| `baseCalculo` | int | Base de cálculo utilizada |

## Cruzamentos possíveis

- **[SGS/API BCB - Câmbio](sgs-cambio)** — analisar relação entre câmbio e índices de inflação (pass-through cambial)
- **[SGS/API BCB - Juros](sgs-juros)** — comparar trajetória da Selic com IPCA para calcular juros reais
- **[SGS/API BCB - Crédito](sgs-credito)** — correlacionar atividade econômica (IBC-Br) com concessão de crédito
- **IBGE (Contas Nacionais)** — comparar IBC-Br com PIB oficial trimestral do IBGE
- **IPEA** — complementar com outros índices e indicadores de conjuntura

## Limitações conhecidas

- **IBC-Br defasagem**: publicado com aproximadamente 45 dias de atraso em relação ao mês de referência
- **IBC-Br vs. PIB**: o IBC-Br é uma proxy do PIB, não o PIB oficial; pode haver divergências significativas
- **IPCA via SGS**: o IPCA no SGS do BCB é uma cópia da série do IBGE; para dados desagregados por grupo/subgrupo, é necessário consultar a SIDRA/IBGE
- **Focus - viés institucional**: as expectativas do Focus refletem a opinião de analistas do mercado financeiro, que podem ter viés
- **Focus - atualização**: o relatório Focus é publicado às segundas-feiras; dados consultados durante a semana refletem a última publicação
- **Séries descontinuadas**: verificar no portal do SGS se a série está ativa antes de usar em produção
