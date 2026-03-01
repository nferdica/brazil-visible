---
title: SGS/API BCB - Base Monetária
slug: sgs-base-monetaria
orgao: BCB
url_base: https://api.bcb.gov.br/dados/serie/bcdata.sgs.{SERIE}/dados?formato=json
tipo_acesso: API REST
autenticacao: Não requerida
formato_dados: [JSON, CSV, XML]
frequencia_atualizacao: Mensal
campos_chave: [data, valor, base_monetaria, M1, M2, M3, M4]
tags: [base monetária, M1, M2, M3, M4, papel-moeda, emissão, agregados monetários, política monetária]
cruzamento_com:
  - sgs-juros
  - sgs-indices
  - sgs-cambio
  - sgs-meios-pagamento
status: documentado
---

# SGS/API BCB - Base Monetária

## O que é

O **SGS do Banco Central** publica séries históricas dos **agregados monetários** brasileiros, que medem a quantidade de moeda em circulação na economia em diferentes graus de liquidez. Os agregados monetários (M1, M2, M3, M4) são instrumentos fundamentais para análise de política monetária e acompanhamento da liquidez do sistema financeiro.

- **Base Monetária**: papel-moeda emitido + reservas bancárias compulsórias
- **M1**: papel-moeda em poder do público + depósitos à vista
- **M2**: M1 + depósitos de poupança + títulos privados (CDB, LCI, LCA)
- **M3**: M2 + quotas de fundos de renda fixa + operações compromissadas com títulos federais
- **M4**: M3 + títulos públicos federais em poder do público

## Como acessar

| Item | Detalhe |
|---|---|
| **URL base (SGS)** | `https://api.bcb.gov.br/dados/serie/bcdata.sgs.{SERIE}/dados?formato=json` |
| **Autenticação** | Não requerida |
| **Rate limit** | Não documentado oficialmente; recomenda-se no máximo 5 requisições/segundo |
| **Formatos** | JSON, CSV, XML |
| **CORS** | Habilitado |

### Parâmetros de consulta

- `formato`: `json`, `csv` ou `xml`
- `dataInicial`: formato `dd/MM/yyyy`
- `dataFinal`: formato `dd/MM/yyyy`

## Endpoints/recursos principais

### Séries SGS - Agregados Monetários

| Série | Código | Descrição | Periodicidade |
|---|---|---|---|
| M1 | 27788 | Meios de pagamento - M1 (R$ milhões) | Mensal |
| M2 | 27810 | Meios de pagamento ampliados - M2 (R$ milhões) | Mensal |
| M3 | 27813 | Meios de pagamento ampliados - M3 (R$ milhões) | Mensal |
| M4 | 27815 | Meios de pagamento ampliados - M4 (R$ milhões) | Mensal |

### Séries SGS - Base Monetária e Componentes

| Série | Código | Descrição | Periodicidade |
|---|---|---|---|
| Base monetária | 1788 | Base monetária - saldo (R$ milhões) | Mensal |
| Base monetária (média no período) | 1789 | Base monetária - média dos saldos diários (R$ milhões) | Mensal |
| Papel-moeda emitido | 1786 | Papel-moeda emitido pelo BCB (R$ milhões) | Mensal |
| Papel-moeda em poder do público | 1787 | Papel-moeda em circulação (R$ milhões) | Mensal |
| Reservas bancárias | 1790 | Reservas bancárias (R$ milhões) | Mensal |
| Depósitos à vista | 27789 | Depósitos à vista nos bancos (R$ milhões) | Mensal |

### Séries SGS - Variação percentual

| Série | Código | Descrição | Periodicidade |
|---|---|---|---|
| M1 - variação % mensal | 27790 | Variação percentual mensal do M1 | Mensal |
| M2 - variação % mensal | 27811 | Variação percentual mensal do M2 | Mensal |
| M3 - variação % mensal | 27814 | Variação percentual mensal do M3 | Mensal |
| M4 - variação % em 12 meses | 27816 | Variação percentual do M4 em 12 meses | Mensal |

## Exemplo de uso

### Consultar agregados monetários M1 a M4

```python
import requests
import pandas as pd

# Consultar M1, M2, M3 e M4
agregados = {
    "M1": 27788,
    "M2": 27810,
    "M3": 27813,
    "M4": 27815,
}

resultados = {}
for nome, codigo in agregados.items():
    url = f"https://api.bcb.gov.br/dados/serie/bcdata.sgs.{codigo}/dados?formato=json"
    params = {
        "dataInicial": "01/01/2024",
        "dataFinal": "31/12/2024"
    }

    response = requests.get(url, params=params)
    response.raise_for_status()
    dados = response.json()

    df = pd.DataFrame(dados)
    df["data"] = pd.to_datetime(df["data"], format="%d/%m/%Y")
    df[nome] = df["valor"].astype(float)
    resultados[nome] = df[["data", nome]].set_index("data")

# Combinar todos os agregados
df_completo = pd.concat(resultados.values(), axis=1)
print("Agregados monetários (R$ milhões) - últimos 6 meses:")
print(df_completo.tail(6).to_string())
```

### Consultar base monetária e papel-moeda

```python
import requests
import pandas as pd

# Base monetária (1788) e papel-moeda em poder do público (1787)
series = {
    "Base Monetária": 1788,
    "Papel-moeda (público)": 1787,
}

for nome, codigo in series.items():
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
        print(f"{nome}: R$ {float(ultimo['valor']):,.0f} milhões (em {ultimo['data']})")
```

### Analisar evolução do M4 em relação ao PIB

```python
import requests
import pandas as pd

# M4 - variação em 12 meses - Série 27816
url = "https://api.bcb.gov.br/dados/serie/bcdata.sgs.27816/dados?formato=json"
params = {
    "dataInicial": "01/01/2020",
    "dataFinal": "31/12/2024"
}

response = requests.get(url, params=params)
response.raise_for_status()
dados = response.json()

df = pd.DataFrame(dados)
df["data"] = pd.to_datetime(df["data"], format="%d/%m/%Y")
df["valor"] = df["valor"].astype(float)

print("Variação do M4 em 12 meses (%):")
print(df.set_index("data").tail(12).to_string())
print(f"\nMédia no período: {df['valor'].mean():.2f}%")
```

## Campos disponíveis

### SGS (Séries de base monetária)

| Campo | Tipo | Descrição |
|---|---|---|
| `data` | string | Data do registro (formato `dd/MM/yyyy`) |
| `valor` | string | Valor em R$ milhões ou variação percentual (conforme a série) |

### Indicadores derivados

| Indicador | Unidade | Descrição |
|---|---|---|
| Base monetária | R$ milhões | Papel-moeda emitido + reservas bancárias |
| M1 | R$ milhões | Papel-moeda em poder do público + depósitos à vista |
| M2 | R$ milhões | M1 + depósitos de poupança + títulos privados |
| M3 | R$ milhões | M2 + quotas de fundos de renda fixa + compromissadas |
| M4 | R$ milhões | M3 + títulos públicos federais |
| Multiplicador monetário | razão | M1 / Base monetária |

## Cruzamentos possíveis

- **[SGS/API BCB - Juros](sgs-juros)** — analisar relação entre Selic e expansão/contração monetária
- **[SGS/API BCB - Índices](sgs-indices)** — correlacionar crescimento dos agregados monetários com inflação (IPCA)
- **[SGS/API BCB - Câmbio](sgs-cambio)** — avaliar impacto da liquidez doméstica sobre a taxa de câmbio
- **[SGS/API BCB - Meios de Pagamento](sgs-meios-pagamento)** — comparar evolução dos agregados com uso de meios de pagamento eletrônicos
- **Tesouro Nacional** — cruzar M4 (que inclui títulos públicos) com dados de dívida pública

## Limitações conhecidas

- **Defasagem**: dados mensais são publicados com aproximadamente 30 dias de atraso
- **Revisões**: séries de agregados monetários podem ser revisadas retroativamente pelo BCB
- **Mudanças metodológicas**: a definição dos agregados (especialmente M2, M3 e M4) foi alterada ao longo do tempo; séries anteriores a 2001 podem usar definições diferentes
- **Sazonalidade**: os agregados monetários apresentam forte sazonalidade (especialmente em dezembro/janeiro), o que dificulta comparações mês a mês
- **Séries não dessazonalizadas**: o BCB não publica versões dessazonalizadas dos agregados; o ajuste sazonal deve ser feito pelo usuário
- **Granularidade limitada**: as séries são agregadas para todo o sistema financeiro; não há quebra por região, tipo de instituição ou segmento
