---
title: SGS/API BCB - Juros
slug: sgs-juros
orgao: BCB
url_base: https://api.bcb.gov.br/dados/serie/bcdata.sgs.{SERIE}/dados?formato=json
tipo_acesso: API REST
autenticacao: Não requerida
formato_dados: [JSON, CSV, XML]
frequencia_atualizacao: Diária
campos_chave: [data, valor, taxa_selic, cdi]
tags: [juros, Selic, CDI, taxa de juros, política monetária, crédito]
cruzamento_com:
  - sgs-cambio
  - sgs-indices
  - sgs-credito
  - tesouro-nacional/siafi
status: documentado
---

# SGS/API BCB - Juros

## O que é

O **SGS do Banco Central** disponibiliza séries históricas das principais taxas de juros da economia brasileira. A **taxa Selic** (Sistema Especial de Liquidação e de Custódia) é a taxa básica de juros da economia, definida pelo COPOM (Comitê de Política Monetária). O **CDI** (Certificado de Depósito Interbancário) é a taxa de referência para operações entre bancos e serve como benchmark para investimentos de renda fixa.

Estas séries são fundamentais para análises de política monetária, custo do crédito e rentabilidade de investimentos.

## Como acessar

| Item | Detalhe |
|---|---|
| **URL base (SGS)** | `https://api.bcb.gov.br/dados/serie/bcdata.sgs.{SERIE}/dados?formato=json` |
| **URL base (OLINDA)** | `https://olinda.bcb.gov.br/olinda/servico/taxaJuros/versao/v2/odata/` |
| **Autenticação** | Não requerida |
| **Rate limit** | Não documentado oficialmente; recomenda-se no máximo 5 requisições/segundo |
| **Formatos** | JSON, CSV, XML |
| **CORS** | Habilitado |

### Parâmetros de consulta (SGS)

- `formato`: `json`, `csv` ou `xml`
- `dataInicial`: formato `dd/MM/yyyy`
- `dataFinal`: formato `dd/MM/yyyy`

## Endpoints/recursos principais

### Séries SGS

| Série | Código | Descrição | Periodicidade |
|---|---|---|---|
| Taxa Selic (meta) | 432 | Meta da taxa Selic definida pelo COPOM | Diária (atualiza a cada reunião) |
| Taxa Selic (diária) | 11 | Taxa Selic apurada no mercado | Diária |
| CDI | 12 | Taxa média dos CDIs (anualizada) | Diária |
| Taxa Selic (acumulada no mês) | 4390 | Selic acumulada no mês corrente | Mensal |
| CDI (acumulado no mês) | 4391 | CDI acumulado no mês corrente | Mensal |
| Taxa de juros - Empréstimos PF | 20714 | Taxa média de juros - Pessoa Física | Mensal |
| Taxa de juros - Empréstimos PJ | 20715 | Taxa média de juros - Pessoa Jurídica | Mensal |
| Spread bancário - PF | 20786 | Spread médio - Pessoa Física | Mensal |
| Spread bancário - PJ | 20787 | Spread médio - Pessoa Jurídica | Mensal |

### Endpoints OLINDA (Taxas de Juros por modalidade)

| Endpoint | Descrição |
|---|---|
| `TaxasJuros` | Lista todas as taxas de juros por instituição e modalidade |
| `TaxasJurosDiariaPorInicio` | Taxas diárias a partir de uma data inicial |
| `TaxasJurosMensalPorInicio` | Taxas mensais a partir de uma data inicial |

## Exemplo de uso

### Consultar taxa Selic meta

```python
import requests
import pandas as pd

# Taxa Selic meta - Série 432
url = "https://api.bcb.gov.br/dados/serie/bcdata.sgs.432/dados?formato=json"
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

# Mostrar apenas as mudanças (decisões do COPOM)
mudancas = df[df["valor"] != df["valor"].shift(1)]
print(mudancas)
```

### Consultar CDI diário

```python
import requests
import pandas as pd

# CDI diário - Série 12
url = "https://api.bcb.gov.br/dados/serie/bcdata.sgs.12/dados?formato=json"
params = {
    "dataInicial": "01/01/2025",
    "dataFinal": "31/01/2025"
}

response = requests.get(url, params=params)
response.raise_for_status()
dados = response.json()

df = pd.DataFrame(dados)
df["data"] = pd.to_datetime(df["data"], format="%d/%m/%Y")
df["valor"] = df["valor"].astype(float)

print(f"CDI médio no período: {df['valor'].mean():.2f}% a.a.")
print(df.tail())
```

### Consultar taxas de juros por instituição (OLINDA)

```python
import requests

url = (
    "https://olinda.bcb.gov.br/olinda/servico/taxaJuros/versao/v2/odata/"
    "TaxasJurosDiariaPorInicio(InicioPeriodo=@InicioPeriodo)"
)
params = {
    "@InicioPeriodo": "'2025-01-01'",
    "$filter": "Segmento eq 'PESSOA FÍSICA' and Modalidade eq 'CARTÃO DE CRÉDITO'",
    "$top": 10,
    "$format": "json",
    "$orderby": "TaxaJurosAoMes desc"
}

response = requests.get(url, params=params)
response.raise_for_status()
dados = response.json()["value"]

for d in dados:
    print(f"{d['InstituicaoFinanceira']}: {d['TaxaJurosAoMes']}% a.m.")
```

## Campos disponíveis

### SGS (Séries de juros)

| Campo | Tipo | Descrição |
|---|---|---|
| `data` | string | Data do registro (formato `dd/MM/yyyy`) |
| `valor` | string | Valor da taxa (% ao ano, salvo indicação contrária) |

### OLINDA (TaxasJuros)

| Campo | Tipo | Descrição |
|---|---|---|
| `Segmento` | string | Pessoa Física ou Pessoa Jurídica |
| `Modalidade` | string | Tipo de operação de crédito |
| `InstituicaoFinanceira` | string | Nome do banco/instituição |
| `TaxaJurosAoMes` | float | Taxa de juros ao mês (%) |
| `TaxaJurosAoAno` | float | Taxa de juros ao ano (%) |
| `cnpj8` | string | CNPJ da instituição (8 dígitos) |
| `Posicao` | int | Ranking da instituição na modalidade |
| `InicioPeriodo` | date | Data de início do período |
| `FimPeriodo` | date | Data de fim do período |

## Cruzamentos possíveis

- **[SGS/API BCB - Câmbio](sgs-cambio)** — analisar impacto dos juros sobre a taxa de câmbio (carry trade)
- **[SGS/API BCB - Índices](sgs-indices)** — correlacionar Selic com IPCA para cálculo de juros reais
- **[SGS/API BCB - Crédito](sgs-credito)** — avaliar impacto dos juros no volume e inadimplência do crédito
- **[IFData](ifdata)** — cruzar taxas cobradas por instituição com dados financeiros dos bancos
- **Tesouro Nacional** — analisar custo da dívida pública em relação à Selic

## Limitações conhecidas

- **Taxa Selic meta vs. diária**: a série 432 (meta) reflete decisões do COPOM e pode ter o mesmo valor por semanas; a série 11 (diária) reflete a taxa efetiva apurada no mercado
- **CDI vs. Selic**: o CDI geralmente é 0,10 p.p. abaixo da Selic meta, mas as séries SGS mostram valores anualizados que podem confundir a comparação direta
- **Taxas por instituição (OLINDA)**: podem ter defasagem de até 5 dias úteis
- **Séries descontinuadas**: algumas séries antigas de juros foram encerradas e substituídas por novas; verificar o status no portal do SGS
- **Horário de atualização**: séries diárias são atualizadas geralmente até as 20h do dia útil seguinte
- **Rate limit não documentado**: requisições excessivas podem ser bloqueadas temporariamente
