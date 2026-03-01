---
title: SGS/API BCB - Reservas Internacionais
slug: sgs-reservas-internacionais
orgao: BCB
url_base: https://api.bcb.gov.br/dados/serie/bcdata.sgs.{SERIE}/dados?formato=json
tipo_acesso: API REST
autenticacao: Não requerida
formato_dados: [JSON, CSV, XML]
frequencia_atualizacao: Diária
campos_chave: [data, valor, posicao_reservas, composicao]
tags: [reservas internacionais, câmbio, dólar, ativos externos, posição diária, ouro, títulos]
cruzamento_com:
  - sgs-cambio
  - sgs-juros
  - sgs-base-monetaria
  - tesouro-nacional/siafi
status: documentado
---

# SGS/API BCB - Reservas Internacionais

## O que é

O **SGS do Banco Central** publica séries históricas das **reservas internacionais** do Brasil, que representam os ativos em moeda estrangeira mantidos pelo BCB. As reservas são compostas principalmente por títulos do Tesouro americano, depósitos em bancos centrais estrangeiros, ouro e direitos especiais de saque (DES) no FMI.

As reservas internacionais são um indicador fundamental da capacidade do país de honrar compromissos externos e da solidez da política cambial. O Brasil mantém uma das maiores reservas internacionais entre países emergentes, acumuladas principalmente a partir de 2006.

O BCB divulga diariamente a **posição das reservas** e mensalmente a **composição detalhada** por tipo de ativo, moeda e prazo.

## Como acessar

| Item | Detalhe |
|---|---|
| **URL base (SGS)** | `https://api.bcb.gov.br/dados/serie/bcdata.sgs.{SERIE}/dados?formato=json` |
| **Portal de Reservas** | `https://www.bcb.gov.br/estabilidadefinanceira/reservasinternacionais` |
| **Autenticação** | Não requerida |
| **Rate limit** | Não documentado oficialmente; recomenda-se no máximo 5 requisições/segundo |
| **Formatos** | JSON, CSV, XML |
| **CORS** | Habilitado |

### Parâmetros de consulta

- `formato`: `json`, `csv` ou `xml`
- `dataInicial`: formato `dd/MM/yyyy`
- `dataFinal`: formato `dd/MM/yyyy`

## Endpoints/recursos principais

### Séries SGS - Posição das Reservas

| Série | Código | Descrição | Periodicidade |
|---|---|---|---|
| Reservas internacionais - posição | 13621 | Posição diária das reservas internacionais (US$ milhões) | Diária |
| Reservas internacionais - conceito liquidez | 3546 | Reservas no conceito de liquidez internacional (US$ milhões) | Mensal |

### Séries SGS - Composição (Mensal)

| Série | Código | Descrição | Periodicidade |
|---|---|---|---|
| Reservas - Títulos | 3547 | Aplicações em títulos (US$ milhões) | Mensal |
| Reservas - Depósitos em moeda | 3548 | Depósitos em moeda estrangeira (US$ milhões) | Mensal |
| Reservas - Ouro | 3549 | Posição em ouro (US$ milhões) | Mensal |
| Reservas - DES (FMI) | 3550 | Direitos Especiais de Saque no FMI (US$ milhões) | Mensal |
| Reservas - Posição no FMI | 3551 | Posição de reserva no FMI (US$ milhões) | Mensal |
| Reservas - Outros ativos | 3552 | Outros ativos de reserva (US$ milhões) | Mensal |

### Séries SGS - Variação

| Série | Código | Descrição | Periodicidade |
|---|---|---|---|
| Variação das reservas | 13622 | Variação diária das reservas (US$ milhões) | Diária |
| Resultado das reservas (BRL) | 13170 | Resultado financeiro das reservas em reais (R$ milhões) | Mensal |

## Exemplo de uso

### Consultar posição diária das reservas

```python
import requests
import pandas as pd

# Posição diária das reservas internacionais - Série 13621
url = "https://api.bcb.gov.br/dados/serie/bcdata.sgs.13621/dados?formato=json"
params = {
    "dataInicial": "01/01/2025",
    "dataFinal": "28/02/2025"
}

response = requests.get(url, params=params)
response.raise_for_status()
dados = response.json()

df = pd.DataFrame(dados)
df["data"] = pd.to_datetime(df["data"], format="%d/%m/%Y")
df["valor"] = df["valor"].astype(float)

print(f"Reservas internacionais (US$ milhões):")
print(f"  Início do período: US$ {df['valor'].iloc[0]:,.0f} mi")
print(f"  Fim do período: US$ {df['valor'].iloc[-1]:,.0f} mi")
print(f"  Variação: US$ {df['valor'].iloc[-1] - df['valor'].iloc[0]:,.0f} mi")
print(f"\nÚltimos 5 dias:")
print(df.tail().to_string(index=False))
```

### Consultar composição das reservas

```python
import requests
import pandas as pd

# Composição das reservas
composicao = {
    "Títulos": 3547,
    "Depósitos em moeda": 3548,
    "Ouro": 3549,
    "DES (FMI)": 3550,
    "Posição no FMI": 3551,
    "Outros ativos": 3552,
}

resultados = {}
for nome, codigo in composicao.items():
    url = f"https://api.bcb.gov.br/dados/serie/bcdata.sgs.{codigo}/dados?formato=json"
    params = {
        "dataInicial": "01/01/2024",
        "dataFinal": "31/12/2024"
    }

    response = requests.get(url, params=params)
    response.raise_for_status()
    dados = response.json()

    if dados:
        ultimo = float(dados[-1]["valor"])
        resultados[nome] = ultimo

# Mostrar composição
total = sum(resultados.values())
print(f"Composição das reservas (último dado disponível):")
print(f"{'Componente':<25} {'US$ mi':>12} {'%':>8}")
print("-" * 48)
for nome, valor in sorted(resultados.items(), key=lambda x: x[1], reverse=True):
    print(f"{nome:<25} {valor:>12,.0f} {valor/total*100:>7.1f}%")
print("-" * 48)
print(f"{'Total':<25} {total:>12,.0f} {'100.0%':>8}")
```

### Série histórica de longo prazo

```python
import requests
import pandas as pd

# Reservas internacionais - conceito liquidez - Série 3546
url = "https://api.bcb.gov.br/dados/serie/bcdata.sgs.3546/dados?formato=json"
params = {
    "dataInicial": "01/01/2000",
    "dataFinal": "31/12/2024"
}

response = requests.get(url, params=params)
response.raise_for_status()
dados = response.json()

df = pd.DataFrame(dados)
df["data"] = pd.to_datetime(df["data"], format="%d/%m/%Y")
df["valor"] = df["valor"].astype(float)
df["ano"] = df["data"].dt.year

# Resumo anual (último valor de cada ano)
resumo = df.groupby("ano")["valor"].last()
print("Reservas internacionais - evolução anual (US$ milhões):")
for ano, valor in resumo.items():
    print(f"  {ano}: US$ {valor:,.0f} mi")
```

## Campos disponíveis

### SGS (Séries de reservas internacionais)

| Campo | Tipo | Descrição |
|---|---|---|
| `data` | string | Data do registro (formato `dd/MM/yyyy`) |
| `valor` | string | Valor em US$ milhões ou R$ milhões (conforme a série) |

### Indicadores derivados

| Indicador | Unidade | Descrição |
|---|---|---|
| Posição das reservas | US$ milhões | Estoque total de reservas internacionais |
| Composição por ativo | US$ milhões | Títulos, depósitos, ouro, DES e outros |
| Variação diária | US$ milhões | Mudança na posição de um dia para outro |
| Resultado financeiro | R$ milhões | Ganho/perda financeira das reservas em moeda local |
| Reservas/PIB | % | Razão entre reservas e PIB (calculado pelo usuário) |
| Reservas/Dívida externa | % | Cobertura de dívida externa (calculado pelo usuário) |

## Cruzamentos possíveis

- **[SGS/API BCB - Câmbio](sgs-cambio)** — correlacionar variação das reservas com movimentos na taxa de câmbio (intervenções do BCB)
- **[SGS/API BCB - Juros](sgs-juros)** — analisar custo de carregamento das reservas (diferencial de juros interno vs. rendimento das reservas)
- **[SGS/API BCB - Base Monetária](sgs-base-monetaria)** — avaliar impacto das compras/vendas de reservas sobre a base monetária
- **Tesouro Nacional** — comparar reservas com dívida pública externa
- **IPEA** — complementar com indicadores de vulnerabilidade externa e balanço de pagamentos

## Limitações conhecidas

- **Defasagem da composição**: a posição diária é atualizada com 1 dia útil de atraso; a composição detalhada tem defasagem mensal de 30 a 60 dias
- **Denominação em dólar**: as reservas são reportadas em dólar americano; variações podem refletir oscilações cambiais entre as moedas que compõem as reservas, não necessariamente compras/vendas
- **Efeito contábil do ouro**: o valor do ouro nas reservas varia com a cotação internacional, gerando "variações" que não são operações do BCB
- **Rendimento não publicado em séries diárias**: o rendimento financeiro das reservas é divulgado apenas em relatórios periódicos e na série mensal
- **Sem detalhamento por moeda**: a composição por moeda das reservas é divulgada apenas no relatório anual de gestão de reservas, não via SGS
- **Dados consolidados**: as séries mostram o total; não é possível identificar operações individuais (swaps, intervenções spot, etc.) via SGS
