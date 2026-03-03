---
title: INCRA Estrutura Fundiária — Imóveis Rurais e Assentamentos
slug: incra-fundiario
orgao: INCRA
url_base: https://acervofundiario.incra.gov.br/
tipo_acesso: Download (SHP, CSV, GeoJSON) / WMS / Portal web
autenticacao: Gov.br (Silver ou Gold) para portais interativos / Não requerida para downloads
formato_dados: [SHP, CSV, GeoJSON, GML, WMS, KML, XLS]
frequencia_atualizacao: Diária (WMS) / Anual (dumps)
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
  - meio-ambiente/car
status: documentado
---

# INCRA Estrutura Fundiária — Imóveis Rurais e Assentamentos

## O que é

O **INCRA (Instituto Nacional de Colonização e Reforma Agrária)** é responsável pelo ordenamento da estrutura fundiária do Brasil, incluindo a regularização de imóveis rurais, criação e gestão de assentamentos de reforma agrária, e georreferenciamento de propriedades. Os dados disponíveis incluem:

- **SNCR (Sistema Nacional de Cadastro Rural)** — cadastro de imóveis rurais com área, proprietário, município
- **SIGEF (Sistema de Gestão Fundiária)** — 1+ milhão de parcelas georreferenciadas certificadas pelo INCRA
- **Assentamentos** — projetos de assentamento de reforma agrária (localização, capacidade, famílias)
- **Acervo Fundiário** — dados geoespaciais consolidados (SIGEF + SNCI legado)
- **Territórios quilombolas** — áreas de comunidades quilombolas certificadas

Esses dados são fundamentais para análises de concentração fundiária, uso do solo, conflitos agrários e política de reforma agrária.

> **Nota:** Desde outubro de 2023, os portais interativos (Acervo Fundiário, SIGEF) requerem login via **Gov.br** com nível Silver ou Gold. Downloads de shapefiles continuam disponíveis sem autenticação.

## Como acessar

### Portais e sistemas

| Plataforma | URL | Autenticação | Descrição |
|---|---|---|---|
| **Acervo Fundiário** | `https://acervofundiario.incra.gov.br/` | Gov.br (Silver+) | Portal principal de dados geoespaciais |
| **Download de dados** | `https://acervofundiario.incra.gov.br/i3geo/datadownload.htm` | Não requerida | Download direto de shapefiles e CSVs |
| **SIGEF** | `https://sigef.incra.gov.br/` | Gov.br (Silver+) | Sistema de gestão de parcelas certificadas |
| **Painel de assentamentos** | `https://painel.incra.gov.br/` | Não requerida | Dashboard interativo de assentamentos |
| **SNCR** | `https://sncr.serpro.gov.br/dcr/` | Gov.br | Cadastro Nacional de Imóveis Rurais |
| **CCIR** | `https://sncr.serpro.gov.br/ccir/emissao` | Gov.br | Emissão do Certificado de Cadastro de Imóvel Rural |
| **Dados abertos** | `https://www.gov.br/incra/pt-br/acesso-a-informacao/dados-abertos` | Não requerida | Página institucional de dados abertos |
| **Certificação** | `https://certificacao.incra.gov.br/csv_shp/export_shp.py` | Não requerida | Exportação de coordenadas certificadas |

### Processo de download de dados

1. Acesse `https://acervofundiario.incra.gov.br/i3geo/datadownload.htm`
2. Selecione a camada desejada (parcelas SIGEF, assentamentos, etc.)
3. Selecione o estado (ou deixe em branco para todo o Brasil)
4. Escolha o formato (SHP, GeoJSON, CSV, GML, Excel)
5. Faça o download do arquivo exportado

### Formatos disponíveis para download

| Formato | Extensão | Descrição |
|---|---|---|
| Shapefile | `.shp/.shx/.dbf` (ZIP) | Formato GIS padrão |
| GeoJSON | `.geojson` | Formato leve para web |
| GML 2.0 / 3.1.1 | `.gml` | Geography Markup Language |
| CSV | `.csv` | Dados tabulares |
| Excel | `.xls` | Planilha Microsoft |

## Endpoints/recursos principais

| Recurso | Conteúdo | Formato |
|---|---|---|
| **SIGEF — Parcelas certificadas** | 1+ milhão de polígonos georreferenciados de imóveis rurais | SHP/WFS/GeoJSON |
| **SIGEF — Regularização fundiária** | 300.000+ parcelas de regularização validadas | SHP/GeoJSON |
| **Assentamentos** | Localização e dados dos projetos de assentamento | SHP/CSV/XLS |
| **SNCR** | Cadastro de imóveis rurais (dados tabulares) | CSV (via Base dos Dados) |
| **Acervo Fundiário** | Camadas geoespaciais consolidadas (SIGEF + SNCI) | WMS/SHP |
| **Malha fundiária** | Malha digitalizada de imóveis rurais | SHP |
| **Territórios quilombolas** | Áreas de comunidades quilombolas | SHP/GeoJSON |

### Dados tratados (Base dos Dados)

O SNCR também está disponível de forma tratada na **Base dos Dados** (`https://basedosdados.org/`), com dados prontos para análise em SQL, Python e R.

## Exemplo de uso

### Download e análise de assentamentos

```python
import pandas as pd

# Exportação via Painel de Assentamentos (https://painel.incra.gov.br/)
# Suporta download em PDF, XLS e ODS
# Alternativamente, baixar o CSV do dados.gov.br

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
print("\nAssentamentos por UF (top 10):")
print(por_uf.head(10))

# Total de famílias assentadas
df["FAMILIAS"] = pd.to_numeric(df["FAMILIAS"], errors="coerce")
print(f"\nTotal de famílias assentadas: {df['FAMILIAS'].sum():,.0f}")
```

### Visualização geoespacial do SIGEF

```python
import geopandas as gpd
import matplotlib.pyplot as plt

# Leitura de parcelas certificadas (download do Acervo Fundiário)
gdf = gpd.read_file("parcelas_sigef_sp.shp")

print(f"Parcelas certificadas em SP: {len(gdf):,}")
print(f"Área total (ha): {gdf['area_ha'].sum():,.0f}")
print(f"CRS: {gdf.crs}")

# Mapa de parcelas
fig, ax = plt.subplots(figsize=(10, 10))
gdf.plot(ax=ax, edgecolor="green", facecolor="lightgreen", linewidth=0.2)
ax.set_title("Parcelas certificadas — SIGEF/INCRA (SP)")
ax.set_axis_off()
plt.tight_layout()
plt.savefig("parcelas_sigef_sp.png", dpi=150)
```

### Análise de concentração fundiária via SNCR

```python
import pandas as pd

# Dados do SNCR via Base dos Dados (basedosdados.org)
# pip install basedosdados
import basedosdados as bd

query = """
SELECT
    sigla_uf,
    COUNT(*) AS total_imoveis,
    SUM(area_total_hectares) AS area_total_ha,
    AVG(area_total_hectares) AS area_media_ha
FROM `basedosdados.br_incra_sncr.imoveis_rurais`
GROUP BY sigla_uf
ORDER BY area_total_ha DESC
"""

df = bd.read_sql(query, billing_project_id="SEU_PROJETO_BIGQUERY")
print("Estrutura fundiária por UF:")
print(df.to_string(index=False))
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
| `situacao` | string | Situação (certificada, em análise) |
| `geometry` | Polygon | Geometria da parcela |

### SNCR (Cadastro Rural)

| Campo | Tipo | Descrição |
|---|---|---|
| `codigo_imovel` | string | Código INCRA do imóvel |
| `denominacao` | string | Nome do imóvel rural |
| `area_total_hectares` | float | Área total em hectares |
| `municipio` | string | Município |
| `uf` | string | UF |
| `modulos_fiscais` | float | Área em módulos fiscais |

## Cruzamentos possíveis

| Cruzamento | Fonte relacionada | Chave de ligação | Finalidade |
|---|---|---|---|
| Fundiário x Limites | [IBGE Geociências](/docs/apis/dados-geoespaciais/ibge-geociencias) | Geometria, município | Analisar estrutura fundiária por município |
| Fundiário x Geologia | [CPRM Geologia](/docs/apis/dados-geoespaciais/cprm-geologia) | Geometria | Avaliar aptidão geológica e mineral de áreas rurais |
| Fundiário x CAR | [CAR](/docs/apis/meio-ambiente/car) | Geometria, município | Cruzar imóveis rurais com dados ambientais (reserva legal, APPs) |
| Fundiário x População | [Censo Demográfico](/docs/apis/ibge-estatisticas/censo-demografico) | Município | Contextualizar estrutura fundiária com dados demográficos |
| Fundiário x PIB | [PIB Municipal](/docs/apis/ibge-estatisticas/pib-municipal) | Município | Correlacionar concentração fundiária com desenvolvimento econômico |

## Limitações conhecidas

| Limitação | Detalhes |
|---|---|
| **Autenticação Gov.br** | Desde outubro de 2023, os portais interativos (SIGEF, Acervo Fundiário) requerem login Gov.br com nível Silver ou Gold. |
| **Cobertura incompleta** | O SIGEF cobre 1+ milhão de parcelas, mas muitos imóveis rurais ainda não estão georreferenciados. |
| **SNCR x SIGEF não integrados** | O cadastro tabular (SNCR) e o geoespacial (SIGEF) não estão totalmente integrados, podendo haver divergências. |
| **Sem API REST moderna** | Não há API REST dedicada. O acesso é via download de shapefiles, geoserviços WMS/WFS ou consulta na Base dos Dados. |
| **Interface web complexa** | O Acervo Fundiário e o SIGEF têm interfaces web especializadas que podem ser difíceis de navegar. |
| **Dados sensíveis** | Informações de proprietários individuais (CPF/CNPJ) não são disponibilizadas publicamente por questões de LGPD. |
| **Defasagem** | O cadastro pode não refletir transações recentes de compra e venda de imóveis rurais. |
| **Shapefiles grandes** | Os downloads para estados inteiros podem gerar arquivos muito grandes, exigindo software GIS. |
