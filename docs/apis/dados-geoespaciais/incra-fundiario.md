---
title: INCRA Estrutura Fundiária — Imóveis Rurais e Assentamentos
slug: incra-fundiario
orgao: INCRA
url_base: https://acervofundiario.incra.gov.br/
tipo_acesso: Web Interface
autenticacao: Não requerida
formato_dados: [SHP, CSV, WMS]
frequencia_atualizacao: Anual
campos_chave:
  - codigo_imovel
  - area_hectares
  - municipio
  - uf
  - tipo_imovel
  - assentamento
tags:
  - INCRA
  - fundiário
  - imóveis rurais
  - assentamentos
  - reforma agrária
  - georreferenciamento
  - CAR
  - SIGEF
  - SNCR
cruzamento_com:
  - dados-geoespaciais/ibge-geociencias
  - dados-geoespaciais/cprm-geologia
  - ibge-estatisticas/censo-demografico
  - ibge-estatisticas/pib-municipal
status: stub
---

# INCRA Estrutura Fundiária — Imóveis Rurais e Assentamentos

## O que é

O **INCRA (Instituto Nacional de Colonização e Reforma Agrária)** é responsável pelo ordenamento da estrutura fundiária do Brasil, incluindo a regularização de imóveis rurais, criação e gestão de assentamentos de reforma agrária, e georreferenciamento de propriedades. Os dados disponíveis incluem:

- **SNCR (Sistema Nacional de Cadastro Rural)** — cadastro de imóveis rurais com área, proprietário, município
- **SIGEF (Sistema de Gestão Fundiária)** — parcelas georreferenciadas certificadas pelo INCRA
- **Assentamentos** — projetos de assentamento de reforma agrária (localização, capacidade, famílias)
- **Acervo Fundiário** — dados geoespaciais de propriedades rurais
- **Grilagem** — áreas identificadas como terras públicas ocupadas irregularmente

Esses dados são fundamentais para análises de concentração fundiária, uso do solo, conflitos agrários e política de reforma agrária.

## Como acessar

| Item | Detalhe |
|---|---|
| **Acervo Fundiário** | `https://acervofundiario.incra.gov.br/` |
| **SIGEF** | `https://sigef.incra.gov.br/` |
| **Painel de assentamentos** | `https://painel.incra.gov.br/` |
| **dados.gov.br** | `https://dados.gov.br/dados/organizacoes/visualizar/instituto-nacional-de-colonizacao-e-reforma-agraria-incra` |
| **Autenticação** | Não requerida para dados públicos |
| **Formatos** | SHP, CSV, WMS, KML |

## Endpoints/recursos principais

| Recurso | Conteúdo | Formato |
|---|---|---|
| **SIGEF — Parcelas certificadas** | Polígonos georreferenciados de imóveis rurais | SHP/WFS |
| **Assentamentos** | Localização e dados dos projetos de assentamento | SHP/CSV |
| **SNCR** | Cadastro de imóveis rurais (dados tabulares) | CSV |
| **Acervo Fundiário** | Camadas geoespaciais de terras públicas e privadas | WMS/SHP |
| **Malha fundiária** | Malha digitalizada de imóveis rurais | SHP |

## Exemplo de uso

### Análise de assentamentos de reforma agrária

```python
import pandas as pd

# Download do CSV de assentamentos do dados.gov.br
df = pd.read_csv(
    "assentamentos_incra.csv",
    sep=";",
    encoding="utf-8",
    dtype=str,
)

print(f"Total de assentamentos: {len(df):,}")
print(f"Colunas: {list(df.columns)}")

# Assentamentos por UF
por_uf = df["UF"].value_counts()
print("\nAssentamentos por UF:")
print(por_uf.head(10))

# Total de famílias assentadas
df["FAMILIAS"] = pd.to_numeric(df["FAMILIAS"], errors="coerce")
print(f"\nTotal de famílias assentadas: {df['FAMILIAS'].sum():,.0f}")
```

### Visualização geoespacial do SIGEF

```python
import geopandas as gpd

# Leitura de parcelas certificadas (shapefile)
gdf = gpd.read_file("parcelas_sigef.shp")

print(f"Parcelas certificadas: {len(gdf):,}")
print(f"Área total (ha): {gdf['area_ha'].sum():,.0f}")

# Mapa de parcelas
import matplotlib.pyplot as plt

fig, ax = plt.subplots(figsize=(10, 10))
gdf.plot(ax=ax, edgecolor="green", facecolor="lightgreen", linewidth=0.2)
ax.set_title("Parcelas certificadas — SIGEF/INCRA")
ax.set_axis_off()
plt.tight_layout()
plt.savefig("parcelas_sigef.png", dpi=150)
```

## Campos disponíveis

### Assentamentos

| Campo | Tipo | Descrição |
|---|---|---|
| `CODIGO_SIPRA` | string | Código do assentamento no SIPRA |
| `NOME_PA` | string | Nome do projeto de assentamento |
| `UF` | string | UF |
| `MUNICIPIO` | string | Município |
| `AREA_HA` | float | Área total do assentamento (hectares) |
| `CAPACIDADE` | int | Capacidade de famílias |
| `FAMILIAS` | int | Famílias assentadas |
| `DATA_CRIACAO` | date | Data de criação |
| `FASE` | string | Fase do assentamento |
| `geometry` | Polygon | Geometria do assentamento |

### SIGEF (Parcelas certificadas)

| Campo | Tipo | Descrição |
|---|---|---|
| `parcela_id` | string | Identificador da parcela |
| `area_ha` | float | Área em hectares |
| `municipio` | string | Município |
| `uf` | string | UF |
| `data_certificacao` | date | Data de certificação |
| `geometry` | Polygon | Geometria da parcela |

## Cruzamentos possíveis

| Cruzamento | Fonte relacionada | Chave de ligação | Finalidade |
|---|---|---|---|
| Fundiário x Limites | [IBGE Geociências](/docs/apis/dados-geoespaciais/ibge-geociencias) | Geometria, município | Analisar estrutura fundiária por município |
| Fundiário x Geologia | [CPRM Geologia](/docs/apis/dados-geoespaciais/cprm-geologia) | Geometria | Avaliar aptidão geológica e mineral de áreas rurais |
| Fundiário x População | [Censo Demográfico](/docs/apis/ibge-estatisticas/censo-demografico) | Município | Contextualizar estrutura fundiária com dados demográficos |
| Fundiário x PIB | [PIB Municipal](/docs/apis/ibge-estatisticas/pib-municipal) | Município | Correlacionar concentração fundiária com desenvolvimento |

## Limitações conhecidas

| Limitação | Detalhes |
|---|---|
| **Cobertura incompleta** | O georreferenciamento de imóveis rurais pelo SIGEF cobre apenas parte dos imóveis do país. |
| **Dados tabulares vs. geoespaciais** | O SNCR (cadastro tabular) e o SIGEF (geoespacial) não estão totalmente integrados. |
| **Interface web complexa** | O Acervo Fundiário e o SIGEF têm interfaces web especializadas que podem ser difíceis de navegar. |
| **Sem API REST** | Não há API REST moderna. O acesso é via download de shapefiles ou geoserviços WMS/WFS. |
| **Dados sensíveis** | Informações de proprietários individuais não são disponibilizadas publicamente. |
| **Defasagem** | O cadastro pode não refletir transações recentes de compra e venda de imóveis rurais. |
