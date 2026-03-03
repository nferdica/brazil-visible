---
title: SGS/API BCB - Meios de Pagamento
slug: sgs-meios-pagamento
orgao: BCB
url_base: https://dadosabertos.bcb.gov.br/
tipo_acesso: API REST
autenticacao: Não requerida
formato_dados: [JSON, CSV, XML]
frequencia_atualizacao: Mensal
campos_chave: [data, valor, quantidade_cartoes, volume_transacoes, cheques]
tags: [meios de pagamento, cartões de crédito, cartões de débito, cheques, boletos, transferências]
cruzamento_com:
  - sgs-pix
  - sgs-credito
  - sgs-base-monetaria
  - sgs-juros
status: documentado
---

# SGS/API BCB - Meios de Pagamento

## O que é

O **SGS do Banco Central** publica séries históricas sobre os diversos meios de pagamento utilizados no Brasil, incluindo cartões de crédito, cartões de débito, cheques, boletos bancários e transferências eletrônicas (TED/DOC). Estes dados permitem acompanhar a evolução do uso de cada instrumento de pagamento, o volume de transações e a tendência de digitalização dos pagamentos no país.

As estatísticas de meios de pagamento são relevantes para análises de inclusão financeira, política monetária e comportamento do consumidor. Com a introdução do PIX em 2020, a dinâmica dos meios de pagamento no Brasil passou por transformação significativa.

## Como acessar

| Item | Detalhe |
|---|---|
| **URL base (SGS)** | `https://api.bcb.gov.br/dados/serie/bcdata.sgs.{SERIE}/dados?formato=json` |
| **Estatísticas de pagamentos (portal)** | `https://www.bcb.gov.br/estabilidadefinanceira/estatisticasmeiosdepagamento` |
| **Autenticação** | Não requerida |
| **Rate limit** | Não documentado oficialmente; recomenda-se no máximo 5 requisições/segundo |
| **Formatos** | JSON, CSV, XML |
| **CORS** | Habilitado |

### Parâmetros de consulta

- `formato`: `json`, `csv` ou `xml`
- `dataInicial`: formato `dd/MM/yyyy`
- `dataFinal`: formato `dd/MM/yyyy`

## Endpoints/recursos principais

### Séries SGS - Cartões

| Série | Código | Descrição | Periodicidade |
|---|---|---|---|
| Cartões de crédito - quantidade | 25226 | Quantidade de cartões de crédito ativos | Trimestral |
| Cartões de débito - quantidade | 25227 | Quantidade de cartões de débito ativos | Trimestral |
| Transações com cartão de crédito - quantidade | 25228 | Número de transações com cartão de crédito | Trimestral |
| Transações com cartão de crédito - valor | 25229 | Valor total das transações com cartão de crédito (R$ milhões) | Trimestral |
| Transações com cartão de débito - quantidade | 25230 | Número de transações com cartão de débito | Trimestral |
| Transações com cartão de débito - valor | 25231 | Valor total das transações com cartão de débito (R$ milhões) | Trimestral |

### Séries SGS - Cheques e Outros

| Série | Código | Descrição | Periodicidade |
|---|---|---|---|
| Cheques compensados - quantidade | 7168 | Quantidade de cheques compensados | Mensal |
| Cheques compensados - valor | 7169 | Valor dos cheques compensados (R$ milhões) | Mensal |
| TED - quantidade | 17662 | Quantidade de TEDs realizadas | Mensal |
| TED - valor | 17663 | Valor total das TEDs (R$ milhões) | Mensal |
| Boletos - quantidade | 25232 | Quantidade de boletos liquidados | Trimestral |
| Boletos - valor | 25233 | Valor total dos boletos liquidados (R$ milhões) | Trimestral |

## Exemplo de uso

### Consultar evolução de cheques compensados

```python
import requests
import pandas as pd

# Cheques compensados - quantidade - Série 7168
url = "https://api.bcb.gov.br/dados/serie/bcdata.sgs.7168/dados?formato=json"
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

# Comparar primeiro e último ano
df["ano"] = df["data"].dt.year
resumo = df.groupby("ano")["valor"].sum()
print("Cheques compensados por ano:")
print(resumo)
print(f"\nRedução: {((resumo.iloc[-1] / resumo.iloc[0]) - 1) * 100:.1f}%")
```

### Comparar meios de pagamento

```python
import requests
import pandas as pd

# Comparar TED e cheques (quantidades mensais)
series = {
    "Cheques": 7168,
    "TED": 17662,
}

dfs = {}
for nome, codigo in series.items():
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
    dfs[nome] = df[["data", nome]].set_index("data")

# Juntar séries
resultado = pd.concat(dfs.values(), axis=1)
print("Comparação mensal (2024):")
print(resultado.tail(6))
```

### Consultar volume de cartões de crédito

```python
import requests
import pandas as pd

# Transações com cartão de crédito - valor (R$ milhões) - Série 25229
url = "https://api.bcb.gov.br/dados/serie/bcdata.sgs.25229/dados?formato=json"
params = {
    "dataInicial": "01/01/2022",
    "dataFinal": "31/12/2024"
}

response = requests.get(url, params=params)
response.raise_for_status()
dados = response.json()

df = pd.DataFrame(dados)
df["data"] = pd.to_datetime(df["data"], format="%d/%m/%Y")
df["valor"] = df["valor"].astype(float)

print("Volume de transações com cartão de crédito (R$ milhões):")
for _, row in df.iterrows():
    print(f"  {row['data'].strftime('%Y-T%q' if False else '%Y-%m')}: R$ {row['valor']:,.0f} mi")
```

## Campos disponíveis

### SGS (Séries de meios de pagamento)

| Campo | Tipo | Descrição |
|---|---|---|
| `data` | string | Data do registro (formato `dd/MM/yyyy`) |
| `valor` | string | Valor do indicador (quantidade ou R$ milhões, conforme a série) |

### Indicadores derivados

| Indicador | Unidade | Descrição |
|---|---|---|
| Quantidade de cartões | unidades | Número de cartões ativos (crédito ou débito) |
| Volume de transações | R$ milhões | Valor total transacionado no período |
| Quantidade de transações | unidades | Número total de transações realizadas |
| Ticket médio | R$ | Valor médio por transação (volume/quantidade) |

## Cruzamentos possíveis

| Cruzamento | Fonte relacionada | Chave de ligação | Finalidade |
|---|---|---|---|
| PIX | [SGS/API BCB - PIX](sgs-pix) | Período (mês/ano) | Comparar crescimento do PIX com queda de cheques e TEDs (substituição de meios) |
| Crédito | [SGS/API BCB - Crédito](sgs-credito) | Período (mês/trimestre) | Correlacionar uso de cartão de crédito com inadimplência e concessões de crédito |
| Base monetária | [SGS/API BCB - Base Monetária](sgs-base-monetaria) | Período (mês/ano) | Avaliar relação entre meios eletrônicos e demanda por papel-moeda |
| Juros | [SGS/API BCB - Juros](sgs-juros) | Período (mês/ano) | Analisar impacto dos juros no uso do cartão de crédito (rotativo) |
| POF/PNAD | IBGE (POF/PNAD) | Período (ano/trimestre) | Correlacionar uso de meios de pagamento com perfil socioeconômico |

## Limitações conhecidas

| Limitação | Detalhes |
|---|---|
| **Periodicidade variada** | Séries de cartões são trimestrais, enquanto cheques e TEDs são mensais; dificulta comparação direta |
| **Defasagem** | Dados trimestrais podem ser publicados com até 90 dias de atraso |
| **Séries de cartão incompletas** | Dados detalhados de cartões (por bandeira, por faixa de valor) não estão disponíveis no SGS |
| **DOC descontinuado** | O DOC foi descontinuado em janeiro de 2024; séries históricas do DOC foram encerradas |
| **PIX não incluído** | Estatísticas do PIX estão em séries separadas (ver [SGS/API BCB - PIX](sgs-pix)) |
| **Sem dados por instituição** | As séries SGS são agregadas; dados por instituição/bandeira requerem consulta ao portal de estatísticas do BCB |
| **Limite de 10 anos por consulta** | Desde março de 2025, consultas ao SGS em formato JSON/CSV são limitadas a intervalos de no máximo 10 anos. Para séries longas, é necessário fazer múltiplas requisições com intervalos de datas diferentes, ou usar o endpoint `/dados/ultimos/{N}`. |
| **Cartões pré-pagos** | Cartões pré-pagos podem estar parcialmente representados nas estatísticas, dependendo do período |
