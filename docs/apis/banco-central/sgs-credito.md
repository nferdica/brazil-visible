---
title: SGS/API BCB - Crédito
slug: sgs-credito
orgao: BCB
url_base: https://dadosabertos.bcb.gov.br/
tipo_acesso: API REST
autenticacao: Não requerida
formato_dados: [JSON, CSV, XML]
frequencia_atualizacao: Mensal
campos_chave: [data, valor, inadimplencia, spread, volume_credito]
tags: [crédito, inadimplência, spread bancário, empréstimos, financiamentos, operações de crédito]
cruzamento_com:
  - sgs-juros
  - sgs-indices
  - sgs-pix
  - ifdata
status: documentado
---

# SGS/API BCB - Crédito

## O que é

O **SGS do Banco Central** publica séries históricas detalhadas sobre o mercado de crédito brasileiro, incluindo volume de operações, taxas de inadimplência, spreads bancários e concessões por modalidade. Estes dados são essenciais para monitorar a saúde do sistema financeiro, o acesso ao crédito e o nível de endividamento de famílias e empresas.

O BCB diferencia as estatísticas entre **Pessoa Física (PF)** e **Pessoa Jurídica (PJ)**, e entre **recursos livres** (taxas definidas pelo mercado) e **recursos direcionados** (taxas reguladas, como crédito imobiliário e rural).

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

### Séries SGS - Inadimplência

| Série | Código | Descrição | Periodicidade |
|---|---|---|---|
| Inadimplência - Recursos livres PF | 21112 | Inadimplência - Recursos livres - Pessoa Física (%) | Mensal |
| Inadimplência - Recursos livres PJ | 21113 | Inadimplência - Recursos livres - Pessoa Jurídica (%) | Mensal |
| Inadimplência - Total | 21082 | Taxa de inadimplência - Total do SFN (%) | Mensal |
| Inadimplência - Recursos livres PF | 21114 | Inadimplência - Recursos livres PF (%) | Mensal |
| Inadimplência - Recursos livres PJ | 21115 | Inadimplência - Recursos livres PJ (%) | Mensal |

### Séries SGS - Volume e Concessões

| Série | Código | Descrição | Periodicidade |
|---|---|---|---|
| Saldo total de crédito | 20539 | Saldo das operações de crédito do SFN (R$ milhões) | Mensal |
| Concessões de crédito - Total | 20631 | Concessões de crédito total (R$ milhões) | Mensal |
| Concessões - Recursos livres PF | 20632 | Concessões recursos livres PF (R$ milhões) | Mensal |
| Concessões - Recursos livres PJ | 20633 | Concessões recursos livres PJ (R$ milhões) | Mensal |
| Crédito/PIB | 20622 | Razão crédito/PIB (%) | Mensal |

### Séries SGS - Spread

| Série | Código | Descrição | Periodicidade |
|---|---|---|---|
| Spread médio - Total | 20783 | Spread médio das operações de crédito (p.p.) | Mensal |
| Spread - Recursos livres PF | 20786 | Spread médio recursos livres PF (p.p.) | Mensal |
| Spread - Recursos livres PJ | 20787 | Spread médio recursos livres PJ (p.p.) | Mensal |

## Exemplo de uso

### Consultar inadimplência PF e PJ

```python
import requests
import pandas as pd

series = {
    "Inadimplência PF": 21112,
    "Inadimplência PJ": 21113,
}

resultados = {}
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
    df["valor"] = df["valor"].astype(float)
    resultados[nome] = df

for nome, df in resultados.items():
    print(f"\n{nome}:")
    print(f"  Último valor: {df['valor'].iloc[-1]:.2f}%")
    print(f"  Média no período: {df['valor'].mean():.2f}%")
```

### Consultar saldo de crédito e razão crédito/PIB

```python
import requests
import pandas as pd

# Saldo total de crédito (20539) e Crédito/PIB (20622)
series = {
    "Saldo de crédito (R$ mi)": 20539,
    "Crédito/PIB (%)": 20622,
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
        print(f"{nome}: {float(ultimo['valor']):,.2f} (em {ultimo['data']})")
```

### Consultar spread bancário

```python
import requests
import pandas as pd

# Spread médio total - Série 20783
url = "https://api.bcb.gov.br/dados/serie/bcdata.sgs.20783/dados?formato=json"
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

print("Evolução do spread bancário médio (p.p.):")
print(df.tail(12).to_string(index=False))
```

## Campos disponíveis

### SGS (Séries de crédito)

| Campo | Tipo | Descrição |
|---|---|---|
| `data` | string | Data do registro (formato `dd/MM/yyyy`) |
| `valor` | string | Valor do indicador (%, R$ milhões ou p.p., conforme a série) |

### Indicadores derivados

| Indicador | Unidade | Descrição |
|---|---|---|
| Inadimplência | % | Percentual de operações com atraso superior a 90 dias |
| Spread | p.p. | Diferença entre a taxa de empréstimo e a taxa de captação |
| Saldo de crédito | R$ milhões | Estoque total de operações de crédito do SFN |
| Concessões | R$ milhões | Novas operações de crédito no período |
| Crédito/PIB | % | Razão entre o estoque de crédito e o PIB |

## Cruzamentos possíveis

| Cruzamento | Fonte relacionada | Chave de ligação | Finalidade |
|---|---|---|---|
| Juros | [SGS/API BCB - Juros](sgs-juros) | Período (mês/ano) | Analisar impacto da Selic sobre inadimplência e concessões de crédito |
| Índices | [SGS/API BCB - Índices](sgs-indices) | Período (mês/ano) | Correlacionar crédito com atividade econômica (IBC-Br) e inflação |
| PIX | [SGS/API BCB - PIX](sgs-pix) | Período (mês/ano) | Avaliar se o PIX impactou modalidades de crédito (ex: cheque especial) |
| IFData | [IFData](ifdata) | CNPJ da instituição | Cruzar dados de crédito com informações financeiras por instituição |
| Receita Federal | Receita Federal (CNPJ) | CNPJ / CNAE | Analisar inadimplência por setor econômico usando CNAE |
| PNAD | IBGE (PNAD) | Período (ano/trimestre) | Correlacionar endividamento com renda e emprego |

## Limitações conhecidas

| Limitação | Detalhes |
|---|---|
| **Dados agregados** | As séries SGS fornecem dados agregados para o Sistema Financeiro Nacional; para dados por instituição, usar o IFData ou o SCR (não público) |
| **Defasagem** | Dados mensais são publicados com aproximadamente 30 dias de atraso |
| **Mudanças metodológicas** | O BCB revisou a metodologia das séries de crédito em 2013 e 2019; séries antigas podem não ser diretamente comparáveis |
| **Inadimplência subestimada** | A taxa oficial considera apenas atrasos superiores a 90 dias; operações renegociadas saem da estatística de inadimplência |
| **Séries de crédito direcionado** | Incluem operações do BNDES, crédito rural e imobiliário, que têm dinâmicas próprias e podem distorcer médias |
| **Limite de 10 anos por consulta** | Desde março de 2025, consultas ao SGS em formato JSON/CSV são limitadas a intervalos de no máximo 10 anos. Para séries longas, é necessário fazer múltiplas requisições com intervalos de datas diferentes, ou usar o endpoint `/dados/ultimos/{N}`. |
| **Sem dados de CPF/CNPJ** | Dados individuais de crédito não são públicos (protegidos pelo sigilo bancário) |
