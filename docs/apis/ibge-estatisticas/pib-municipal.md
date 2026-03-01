---
title: PIB Municipal — Produto Interno Bruto dos Municípios
slug: pib-municipal
orgao: IBGE
url_base: https://servicodados.ibge.gov.br/api/v3/agregados
tipo_acesso: API REST
autenticacao: Não requerida
formato_dados: [JSON, CSV]
frequencia_atualizacao: Anual
campos_chave:
  - codigo_municipio
  - pib_total
  - pib_per_capita
  - vab_agropecuaria
  - vab_industria
  - vab_servicos
  - vab_administracao_publica
tags:
  - IBGE
  - PIB
  - produto interno bruto
  - economia municipal
  - valor adicionado bruto
  - renda per capita
  - município
cruzamento_com:
  - ibge-estatisticas/censo-demografico
  - trabalho-emprego/rais
  - educacao/censo-escolar
  - tesouro-nacional/siconfi
  - receita-federal/cnpj-completa
status: documentado
---

# PIB Municipal — Produto Interno Bruto dos Municípios

## O que é

O **PIB dos Municípios** é uma pesquisa do **IBGE** que estima o Produto Interno Bruto de cada um dos 5.570 municípios brasileiros, decompondo a atividade econômica em setores:

- **Agropecuária** — valor adicionado bruto (VAB) da agricultura, pecuária, silvicultura e pesca
- **Indústria** — VAB da indústria extrativa, de transformação, construção e eletricidade/gás/água
- **Serviços** — VAB do comércio, transporte, alojamento, informação, atividades financeiras e imobiliárias
- **Administração Pública** — VAB da administração, educação e saúde públicas, seguridade social
- **Impostos** — impostos sobre produtos líquidos de subsídios

Além do PIB total e setorial, a pesquisa calcula o **PIB per capita** de cada município, permitindo comparações regionais de riqueza.

## Como acessar

| Item | Detalhe |
|---|---|
| **API Agregados (SIDRA)** | `https://servicodados.ibge.gov.br/api/v3/agregados` |
| **API SIDRA clássica** | `https://apisidra.ibge.gov.br/` |
| **Portal** | `https://www.ibge.gov.br/estatisticas/economicas/contas-nacionais/9088-produto-interno-bruto-dos-municipios.html` |
| **Autenticação** | Não requerida |
| **Formatos** | JSON (API), CSV/XLSX (download) |
| **CORS** | Habilitado |
| **Defasagem** | ~2 anos (dados de 2021 publicados em 2023) |

### Principais tabelas SIDRA

| Tabela | Código | Conteúdo |
|---|---|---|
| PIB a preços correntes | 5938 | PIB total e setorial por município |
| PIB per capita | 5938 | PIB per capita por município |

## Endpoints/recursos principais

### API SIDRA

| Endpoint | Descrição |
|---|---|
| `/values/t/5938/n6/all/v/37/p/last` | PIB total — todos os municípios (último ano) |
| `/values/t/5938/n6/all/v/543/p/last` | PIB per capita — todos os municípios |
| `/values/t/5938/n6/{cod}/v/all/p/last` | Todas as variáveis de um município |
| `/values/t/5938/n3/all/v/37,543/p/last` | PIB total e per capita por UF |

### Variáveis disponíveis (Tabela 5938)

| Código | Variável |
|---|---|
| 37 | PIB a preços correntes (R$ mil) |
| 513 | VAB Agropecuária (R$ mil) |
| 517 | VAB Indústria (R$ mil) |
| 521 | VAB Serviços (R$ mil) |
| 525 | VAB Administração Pública (R$ mil) |
| 497 | Impostos sobre produtos (R$ mil) |
| 543 | PIB per capita (R$) |

## Exemplo de uso

### PIB de todos os municípios via API

```python
import requests
import pandas as pd

# PIB total e per capita — todos os municípios — último ano
url = "https://apisidra.ibge.gov.br/values/t/5938/n6/all/v/37,543/p/last"

response = requests.get(url)
response.raise_for_status()
dados = response.json()

df = pd.DataFrame(dados[1:])
df.columns = dados[0].values()

print(f"Total de registros: {len(df):,}")
print(df.head())
```

### Top 10 municípios por PIB

```python
import requests
import pandas as pd

# PIB total — todos os municípios
url = "https://apisidra.ibge.gov.br/values/t/5938/n6/all/v/37/p/last"

response = requests.get(url)
response.raise_for_status()
dados = response.json()

df = pd.DataFrame(dados[1:])
df.columns = dados[0].values()
df["Valor"] = pd.to_numeric(df["Valor"], errors="coerce")

top10 = df.nlargest(10, "Valor")[["Município", "Valor"]]
top10["PIB (R$ bilhões)"] = (top10["Valor"] / 1e6).round(1)

print("Top 10 municípios por PIB:")
print(top10[["Município", "PIB (R$ bilhões)"]].to_string(index=False))
```

### Composição setorial do PIB de um município

```python
import sidrapy
import pandas as pd

# VAB setorial de São Paulo (código 3550308)
dados = sidrapy.get_table(
    table_code="5938",
    territorial_level="6",
    ibge_territorial_code="3550308",
    variable="513,517,521,525,497",  # VAB setores + impostos
    period="last",
)

print("Composição do PIB de São Paulo:")
for _, row in dados.iterrows():
    valor = float(row["V"]) if row["V"] != "..." else 0
    print(f"  {row['D2N']}: R$ {valor/1e6:.1f} bilhões")
```

## Campos disponíveis

### Tabela 5938 — PIB dos Municípios

| Campo | Tipo | Descrição |
|---|---|---|
| `Município (Código)` | string | Código IBGE do município (7 dígitos) |
| `Município` | string | Nome do município |
| `Ano` | int | Ano de referência |
| `Variável` | string | Código da variável (PIB, VAB, etc.) |
| `Valor` | float | Valor em R$ mil (exceto PIB per capita, em R$) |

### Variáveis

| Variável | Código | Unidade | Descrição |
|---|---|---|---|
| PIB a preços correntes | 37 | R$ mil | Produto Interno Bruto total |
| VAB Agropecuária | 513 | R$ mil | Valor adicionado — setor primário |
| VAB Indústria | 517 | R$ mil | Valor adicionado — setor secundário |
| VAB Serviços | 521 | R$ mil | Valor adicionado — setor terciário |
| VAB Adm. Pública | 525 | R$ mil | Valor adicionado — setor público |
| Impostos | 497 | R$ mil | Impostos sobre produtos líquidos de subsídios |
| PIB per capita | 543 | R$ | PIB total dividido pela população estimada |

## Cruzamentos possíveis

| Cruzamento | Fonte relacionada | Chave de ligação | Finalidade |
|---|---|---|---|
| PIB x População | [Censo Demográfico](/docs/apis/ibge-estatisticas/censo-demografico) | `codigo_municipio` | Validar PIB per capita, analisar desigualdades |
| PIB x Emprego | [RAIS](/docs/apis/trabalho-emprego/rais) | `codigo_municipio` | Correlacionar produção econômica com emprego formal |
| PIB x Educação | [Censo Escolar](/docs/apis/educacao/censo-escolar) | `codigo_municipio` | Relacionar riqueza municipal com infraestrutura educacional |
| PIB x Receita Municipal | [SICONFI](/docs/apis/tesouro-nacional/siconfi) | `codigo_municipio` | Comparar produção econômica com arrecadação |
| PIB x Empresas | [CNPJ Completa](/docs/apis/receita-federal/cnpj-completa) | `codigo_municipio` | Analisar concentração empresarial e PIB |

## Limitações conhecidas

| Limitação | Detalhes |
|---|---|
| **Defasagem de ~2 anos** | O PIB municipal é publicado com aproximadamente 2 anos de atraso (ex: dados de 2021 publicados em dezembro de 2023). |
| **Valores a preços correntes** | Os valores são nominais (preços correntes). Para comparações entre anos, é necessário deflacionar usando IPCA ou deflator do PIB. |
| **Metodologia de rateio** | O PIB municipal é estimado por rateio do PIB estadual para os municípios, usando indicadores proxy. Não é uma medição direta. |
| **Sem desagregação CNAE** | A decomposição setorial é limitada a 4 grandes setores. Não há detalhamento por CNAE/atividade econômica específica. |
| **Valores em R$ mil** | Os valores estão em milhares de reais. É necessário multiplicar por 1.000 para obter valores absolutos. |
| **PIB per capita estimado** | O PIB per capita usa estimativas populacionais intercensitárias, que podem ter imprecisões em municípios pequenos. |
