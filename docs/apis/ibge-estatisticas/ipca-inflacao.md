---
title: IPCA/Inflação — Índice Nacional de Preços ao Consumidor Amplo
slug: ipca-inflacao
orgao: IBGE
url_base: https://servicodados.ibge.gov.br/api/v3/agregados
tipo_acesso: API REST
autenticacao: Não requerida
formato_dados: [JSON]
frequencia_atualizacao: Mensal
campos_chave:
  - variacao_mensal
  - variacao_acumulada_ano
  - variacao_acumulada_12m
  - grupo_produto
  - subitem
  - numero_indice
tags:
  - IBGE
  - IPCA
  - inflação
  - preços
  - custo de vida
  - índice de preços
  - cesta básica
cruzamento_com:
  - banco-central/sgs-juros
  - banco-central/sgs-indices
  - ibge-estatisticas/pnad-continua
  - ipea/ipeadata
status: documentado
---

# IPCA/Inflação — Índice Nacional de Preços ao Consumidor Amplo

## O que é

O **IPCA (Índice Nacional de Preços ao Consumidor Amplo)** é o índice oficial de inflação do Brasil, calculado mensalmente pelo **IBGE**. Ele mede a variação de preços de um conjunto de produtos e serviços consumidos por famílias com rendimento de 1 a 40 salários mínimos, cobrindo as principais regiões metropolitanas do país.

O IPCA é utilizado como:

- **Meta de inflação** — referência para o regime de metas de inflação do Banco Central
- **Indexador** — correção de contratos, aluguéis, títulos públicos (NTN-B/Tesouro IPCA+)
- **Deflator** — conversão de valores nominais para valores reais (poder de compra)
- **Indicador econômico** — monitoramento da estabilidade de preços

O IBGE também calcula:

- **IPCA-15** — prévia da inflação (coletado na primeira quinzena do mês)
- **IPCA-E** — acumulado trimestral do IPCA-15
- **INPC** — Índice Nacional de Preços ao Consumidor (famílias 1-5 SM)

A estrutura do IPCA é decomposta em **9 grupos** de produtos e serviços (Alimentação, Habitação, Transportes, Saúde, etc.), permitindo análise detalhada dos vetores de inflação.

## Como acessar

| Item | Detalhe |
|---|---|
| **API Agregados (SIDRA)** | `https://servicodados.ibge.gov.br/api/v3/agregados` |
| **API SIDRA clássica** | `https://apisidra.ibge.gov.br/` |
| **SGS/BCB** | `https://api.bcb.gov.br/dados/serie/bcdata.sgs.433/dados?formato=json` (série 433) |
| **Portal** | `https://www.ibge.gov.br/estatisticas/economicas/precos-e-custos/9256-indice-nacional-de-precos-ao-consumidor-amplo.html` |
| **Autenticação** | Não requerida |
| **Formatos** | JSON |
| **CORS** | Habilitado |

### Séries SGS do BCB

| Série | Código | Descrição |
|---|---|---|
| IPCA — variação mensal | 433 | Variação % no mês |
| IPCA — acumulado 12 meses | 13522 | Variação % acumulada em 12 meses |
| IPCA-15 — variação mensal | 7478 | Prévia mensal |
| INPC — variação mensal | 188 | Índice famílias 1-5 SM |

## Endpoints/recursos principais

### API SIDRA — Tabelas do IPCA

| Tabela | Código | Conteúdo |
|---|---|---|
| IPCA — Variação mensal | 1737 | Variação mensal e acumulada por grupo |
| IPCA — Geral | 7060 | IPCA geral e por grupo (nova estrutura) |
| IPCA — Subitens | 7061 | Variação por subitem (produto específico) |
| IPCA-15 | 7062 | Prévia do IPCA por grupo |
| INPC | 1736 | Índice famílias de menor renda |

### Endpoints via SGS/BCB

| Endpoint | Descrição |
|---|---|
| `api.bcb.gov.br/dados/serie/bcdata.sgs.433/dados?formato=json` | IPCA mensal (série histórica completa) |
| `api.bcb.gov.br/dados/serie/bcdata.sgs.13522/dados?formato=json` | IPCA acumulado 12 meses |

## Exemplo de uso

### IPCA mensal via SGS/BCB

```python
import requests
import pandas as pd

# IPCA — variação mensal (série 433)
url = "https://api.bcb.gov.br/dados/serie/bcdata.sgs.433/dados"
params = {
    "formato": "json",
    "dataInicial": "01/01/2024",
    "dataFinal": "31/12/2024",
}

response = requests.get(url, params=params)
response.raise_for_status()
dados = response.json()

df = pd.DataFrame(dados)
df["data"] = pd.to_datetime(df["data"], format="%d/%m/%Y")
df["valor"] = df["valor"].astype(float)

print("IPCA mensal 2024 (%):")
for _, row in df.iterrows():
    print(f"  {row['data'].strftime('%b/%Y')}: {row['valor']:.2f}%")

acumulado = ((1 + df["valor"] / 100).prod() - 1) * 100
print(f"\nIPCA acumulado no ano: {acumulado:.2f}%")
```

### IPCA por grupo de produtos via SIDRA

```python
import requests
import pandas as pd

# IPCA por grupo — último mês disponível
url = "https://apisidra.ibge.gov.br/values/t/7060/n1/all/v/63,66/p/last/c315/7169,7170,7445,7486,7558,7625,7660,7712,7766"

response = requests.get(url)
response.raise_for_status()
dados = response.json()

df = pd.DataFrame(dados[1:])
df.columns = dados[0].values()

print("IPCA por grupo de produtos/serviços:")
print(df[["Geral, grupo, subgrupo, item e subitem", "Valor"]].to_string(index=False))
```

### Série histórica com sidrapy

```python
import sidrapy
import pandas as pd

# IPCA mensal — últimos 24 meses — geral
dados = sidrapy.get_table(
    table_code="7060",
    territorial_level="1",
    ibge_territorial_code="all",
    variable="63",  # Variação mensal
    period="last%2024",
    classifications={"315": "7169"},  # Índice geral
)

dados["V"] = pd.to_numeric(dados["V"], errors="coerce")
print("IPCA mensal — últimos 24 meses:")
for _, row in dados.iterrows():
    print(f"  {row['D3N']}: {row['V']:.2f}%")
```

## Campos disponíveis

### IPCA via API SIDRA (Tabela 7060)

| Variável | Código | Descrição |
|---|---|---|
| Variação mensal | 63 | Variação percentual no mês (%) |
| Variação acumulada no ano | 66 | Variação acumulada de janeiro ao mês (%) |
| Variação acumulada 12 meses | 2265 | Variação acumulada em 12 meses (%) |
| Peso mensal | 357 | Peso do grupo no índice (%) |
| Número-índice | 2266 | Número-índice (dez/1993=100) |

### Grupos do IPCA

| Código | Grupo |
|---|---|
| 7169 | Índice geral |
| 7170 | 1. Alimentação e bebidas |
| 7445 | 2. Habitação |
| 7486 | 3. Artigos de residência |
| 7558 | 4. Vestuário |
| 7625 | 5. Transportes |
| 7660 | 6. Saúde e cuidados pessoais |
| 7712 | 7. Despesas pessoais |
| 7766 | 8. Educação |
| 7786 | 9. Comunicação |

### IPCA via SGS/BCB

| Campo | Tipo | Descrição |
|---|---|---|
| `data` | string | Data de referência (dd/MM/yyyy) |
| `valor` | string | Variação mensal (%) |

## Cruzamentos possíveis

| Cruzamento | Fonte relacionada | Chave de ligação | Finalidade |
|---|---|---|---|
| Inflação x Juros | [SGS/API BCB — Juros](/docs/apis/banco-central/sgs-juros) | período | Analisar relação Selic-inflação e política monetária |
| Inflação x Atividade | [SGS/API BCB — Índices](/docs/apis/banco-central/sgs-indices) | período | Correlacionar inflação com IBC-Br e atividade econômica |
| Inflação x Renda | [PNAD Contínua](/docs/apis/ibge-estatisticas/pnad-continua) | trimestre | Calcular rendimento real (deflacionado pelo IPCA) |
| Inflação x Séries históricas | [Ipeadata](/docs/apis/ipea/ipeadata) | período | Comparar IPCA com outros índices (IGP-M, IGP-DI) |

## Limitações conhecidas

| Limitação | Detalhes |
|---|---|
| **Cobertura geográfica** | O IPCA cobre 16 regiões metropolitanas e capitais. Não há IPCA municipal para todos os 5.570 municípios. |
| **Faixa de renda** | O IPCA reflete o consumo de famílias com 1-40 SM. Famílias de renda mais alta ou mais baixa podem ter inflação efetiva diferente. |
| **Pesos fixos** | Os pesos dos grupos são atualizados periodicamente (POF), mas permanecem fixos entre atualizações. Mudanças nos hábitos de consumo não são refletidas imediatamente. |
| **Sazonalidade** | Alguns itens (educação, vestuário) têm forte componente sazonal. Análises mensais devem considerar isso. |
| **API SIDRA pode ser lenta** | Consultas com muitas variáveis ou períodos longos podem demorar. |
| **Mudanças metodológicas** | A estrutura de grupos e subitens muda quando a POF é atualizada (última: POF 2017-2018). Comparações longas requerem encadeamento de séries. |
