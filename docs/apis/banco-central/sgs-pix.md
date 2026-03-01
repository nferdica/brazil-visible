---
title: SGS/API BCB - PIX
slug: sgs-pix
orgao: BCB
url_base: https://api.bcb.gov.br/dados/serie/bcdata.sgs.{SERIE}/dados?formato=json
tipo_acesso: API REST
autenticacao: Não requerida
formato_dados: [JSON, CSV, XML]
frequencia_atualizacao: Mensal
campos_chave: [data, valor, quantidade_transacoes, chaves_cadastradas]
tags: [PIX, pagamentos instantâneos, transferências, chaves PIX, estatísticas]
cruzamento_com:
  - sgs-meios-pagamento
  - sgs-credito
  - sgs-base-monetaria
  - ifdata
status: documentado
---

# SGS/API BCB - PIX

## O que é

O Banco Central do Brasil disponibiliza via **SGS** e **OLINDA** estatísticas sobre o **PIX**, o sistema brasileiro de pagamentos instantâneos lançado em novembro de 2020. Os dados incluem quantidade e valor de transações, número de chaves cadastradas, participação por tipo de pessoa (física e jurídica) e evolução do uso ao longo do tempo.

O PIX se tornou rapidamente o principal meio de pagamento eletrônico do Brasil, superando boletos, TED e DOC em volume de transações. As estatísticas disponibilizadas pelo BCB permitem acompanhar a adoção e o impacto do PIX no sistema financeiro.

## Como acessar

| Item | Detalhe |
|---|---|
| **URL base (SGS)** | `https://api.bcb.gov.br/dados/serie/bcdata.sgs.{SERIE}/dados?formato=json` |
| **URL base (OLINDA)** | `https://olinda.bcb.gov.br/olinda/servico/SPI/versao/v1/odata/` |
| **Estatísticas PIX (portal)** | `https://www.bcb.gov.br/estabilidadefinanceira/estatisticasspi` |
| **Autenticação** | Não requerida |
| **Rate limit** | Não documentado oficialmente; recomenda-se no máximo 5 requisições/segundo |
| **Formatos** | JSON, CSV |
| **CORS** | Habilitado |

### Parâmetros de consulta (SGS)

- `formato`: `json`, `csv` ou `xml`
- `dataInicial`: formato `dd/MM/yyyy`
- `dataFinal`: formato `dd/MM/yyyy`

## Endpoints/recursos principais

### Séries SGS

| Série | Código | Descrição | Periodicidade |
|---|---|---|---|
| PIX - Quantidade de transações | 29657 | Total de transações PIX realizadas | Mensal |
| PIX - Valor total das transações | 29658 | Valor total movimentado via PIX (R$) | Mensal |
| PIX - Chaves cadastradas (PF) | 29659 | Número de chaves PIX de Pessoa Física | Mensal |
| PIX - Chaves cadastradas (PJ) | 29660 | Número de chaves PIX de Pessoa Jurídica | Mensal |
| PIX - Usuários cadastrados | 29661 | Total de usuários com chave PIX | Mensal |
| PIX - Instituições participantes | 29662 | Número de instituições no ecossistema PIX | Mensal |

### Endpoints OLINDA (SPI - Sistema de Pagamentos Instantâneos)

| Endpoint | Descrição |
|---|---|
| `EstatisticasTransacoesPix` | Estatísticas agregadas de transações PIX |
| `PixLiquidadosSPI` | Volume de PIX liquidados no SPI |
| `ParticipantesDoSpi` | Lista de instituições participantes do SPI |

## Exemplo de uso

### Consultar volume de transações PIX

```python
import requests
import pandas as pd

# PIX - Quantidade de transações - Série 29657
url = "https://api.bcb.gov.br/dados/serie/bcdata.sgs.29657/dados?formato=json"
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

print("Transações PIX mensais (2024):")
for _, row in df.iterrows():
    print(f"  {row['data'].strftime('%Y-%m')}: {row['valor']:,.0f}")

print(f"\nTotal no ano: {df['valor'].sum():,.0f}")
```

### Consultar chaves PIX cadastradas

```python
import requests
import pandas as pd

# Chaves PIX - Pessoa Física (29659) e Jurídica (29660)
series = {"PF": 29659, "PJ": 29660}

for tipo, codigo in series.items():
    url = f"https://api.bcb.gov.br/dados/serie/bcdata.sgs.{codigo}/dados?formato=json"
    params = {
        "dataInicial": "01/01/2024",
        "dataFinal": "31/12/2024"
    }

    response = requests.get(url, params=params)
    response.raise_for_status()
    dados = response.json()

    if dados:
        ultimo = dados[-1]
        print(f"Chaves PIX {tipo}: {float(ultimo['valor']):,.0f} (em {ultimo['data']})")
```

### Consultar participantes do SPI via OLINDA

```python
import requests

url = (
    "https://olinda.bcb.gov.br/olinda/servico/SPI/versao/v1/odata/"
    "ParticipantesDoSpi"
)
params = {
    "$format": "json",
    "$top": 10,
    "$orderby": "NomeReduzido asc"
}

response = requests.get(url, params=params)
response.raise_for_status()
dados = response.json()["value"]

print("Participantes do SPI (primeiros 10):")
for p in dados:
    print(f"  {p['NomeReduzido']} (ISPB: {p['ISPB']}) - Tipo: {p['TipoParticipacao']}")
```

## Campos disponíveis

### SGS (Séries PIX)

| Campo | Tipo | Descrição |
|---|---|---|
| `data` | string | Data do registro (formato `dd/MM/yyyy`) |
| `valor` | string | Valor do indicador (quantidade ou valor monetário) |

### OLINDA (ParticipantesDoSpi)

| Campo | Tipo | Descrição |
|---|---|---|
| `ISPB` | string | Código ISPB da instituição |
| `NomeReduzido` | string | Nome reduzido da instituição |
| `TipoParticipacao` | string | Tipo de participação (Direto, Indireto) |
| `InicioDaOperacao` | date | Data de início da operação no PIX |

### OLINDA (EstatisticasTransacoesPix)

| Campo | Tipo | Descrição |
|---|---|---|
| `AnoMes` | string | Ano e mês de referência |
| `QuantidadeTransacoes` | long | Quantidade total de transações |
| `ValorTransacoes` | decimal | Valor total das transações (R$) |

## Cruzamentos possíveis

- **[SGS/API BCB - Meios de Pagamento](sgs-meios-pagamento)** — comparar evolução do PIX com outros meios de pagamento (cartões, boletos, cheques)
- **[SGS/API BCB - Crédito](sgs-credito)** — analisar se a adoção do PIX impactou o volume de operações de crédito
- **[SGS/API BCB - Base Monetária](sgs-base-monetaria)** — avaliar impacto do PIX na demanda por papel-moeda e na base monetária
- **[IFData](ifdata)** — correlacionar participação no PIX com dados financeiros das instituições
- **IBGE (PNAD)** — cruzar adoção do PIX com dados demográficos e de inclusão financeira

## Limitações conhecidas

- **Séries relativamente novas**: o PIX foi lançado em novembro de 2020, então as séries históricas são curtas
- **Dados agregados**: as estatísticas públicas são agregadas; dados transacionais individuais não são disponibilizados
- **Defasagem**: dados mensais podem ter defasagem de 30 a 45 dias
- **Códigos de série podem variar**: o BCB pode reorganizar as séries do PIX; verificar no portal do SGS os códigos mais atualizados
- **Sem distinção por tipo de transação**: as séries agregadas não diferenciam PIX P2P, P2B, B2B, etc.
- **Dados de fraude**: estatísticas de fraudes e contestações do PIX não são disponibilizadas publicamente via API
