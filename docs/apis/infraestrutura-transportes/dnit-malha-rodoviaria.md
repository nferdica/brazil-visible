---
title: DNIT Malha Rodoviária — Infraestrutura Rodoviária Federal
slug: dnit-malha-rodoviaria
orgao: DNIT
url_base: https://servicos.dnit.gov.br/dadosabertos/
tipo_acesso: Download (SHP, CSV, Excel) / WMS (VGEO)
autenticacao: Não requerida
formato_dados: [SHP, GeoJSON, CSV, KML, XLSX]
frequencia_atualizacao: Anual (SNV atualizado fev/2026)
campos_chave:
  - rodovia
  - tipo_trecho
  - extensao_km
  - superficie
  - uf
  - condicao
tags:
  - DNIT
  - malha rodoviária
  - rodovias federais
  - infraestrutura
  - SNV
  - geoespacial
  - VGEO
cruzamento_com:
  - infraestrutura-transportes/antt-concessoes
  - infraestrutura-transportes/prf-acidentes
  - dados-geoespaciais/ibge-geociencias
status: documentado
---

# DNIT Malha Rodoviária — Infraestrutura Rodoviária Federal

## O que é

O **DNIT (Departamento Nacional de Infraestrutura de Transportes)** é responsável pela implementação da política de infraestrutura do sistema federal de viação, incluindo rodovias e ferrovias federais. O DNIT disponibiliza dados sobre:

- **SNV (Sistema Nacional de Viação)** — mapeamento de todas as rodovias federais e estaduais planejadas (última atualização: fevereiro de 2026)
- **Condições das rodovias** — estado de conservação, tipo de superfície (pavimentada, não pavimentada)
- **Extensão da malha** — quilometragem por rodovia, UF e tipo
- **Obras** — projetos de construção, manutenção e restauração
- **Pesagem e tráfego** — postos de pesagem, contagens de tráfego contínuo, estudos de origem-destino
- **Hidrovias** — dados da malha hidroviária federal

Os dados geoespaciais da malha rodoviária são disponibilizados em formatos SHP, GeoJSON, CSV e KML, acessíveis via portal de dados abertos e via **VGEO** (Visualizador de Informações Geográficas).

> **Em desenvolvimento:** O DNIT está implementando uma arquitetura de APIs REST (Portaria 595/2024), com previsão de disponibilidade progressiva a partir de 2026.

## Como acessar

| Plataforma | URL | Descrição |
|---|---|---|
| **Portal de Dados Abertos** | `https://servicos.dnit.gov.br/dadosabertos/` | Download de datasets (SNV, tráfego, obras) |
| **VGEO** | `https://servicos.dnit.gov.br/vgeo/` | Visualizador geográfico interativo com download |
| **Atlas/Mapas** | `https://www.gov.br/dnit/pt-br/assuntos/atlas-e-mapas` | Mapas e PNV/SNV |
| **SNV Online** | `https://www.gov.br/dnit/pt-br/assuntos/planejamento-e-pesquisa/snv` | Sistema Nacional de Viação |
| **Dados abertos (gov.br)** | `https://www.gov.br/dnit/pt-br/acesso-a-informacao/dados-abertos` | Página institucional |
| **Autenticação** | Não requerida | |
| **Formatos** | SHP, GeoJSON, CSV, KML, Excel | |

## Endpoints/recursos principais

| Recurso | Conteúdo | Formato | Atualização |
|---|---|---|---|
| **SNV (malha rodoviária)** | Traçado georreferenciado das rodovias federais | SHP, Excel | Fev/2026 |
| **Hidrovias** | Malha hidroviária federal | Excel | Anual |
| **Condições das rodovias** | Estado de conservação por trecho | CSV/SHP | Variável |
| **VGEO** | Portal de geoserviços (WMS/WFS) com download | WMS/SHP/GeoJSON/KML | Contínuo |
| **Contagem de tráfego** | Dados contínuos de tráfego (VDMa) | CSV | Anual |
| **Estudos origem-destino** | Fluxo de cargas e passageiros | CSV/PDF | Periódico |
| **Obras e contratos** | Obras de infraestrutura em andamento | CSV | Variável |

### VGEO — Formatos de exportação

| Formato | Extensão | Descrição |
|---|---|---|
| Shapefile | `.shp` (ZIP) | Formato GIS padrão |
| GeoJSON | `.geojson` | Formato leve para web |
| KML | `.kml` | Google Earth / Maps |
| Excel | `.xlsx` | Dados tabulares |
| CSV | `.csv` | Dados tabulares simples |

## Exemplo de uso

### Leitura de shapefile da malha rodoviária

```python
import geopandas as gpd

# Após download do shapefile do SNV via VGEO ou Portal de Dados Abertos
gdf = gpd.read_file("snv_rodovias_federais.shp")

print(f"Total de trechos: {len(gdf):,}")
print(f"Colunas: {list(gdf.columns)}")
print(f"CRS: {gdf.crs}")

# Extensão total por tipo de superfície
extensao = gdf.groupby("SUPERFICIE")["EXTENSAO_KM"].sum()
print("\nExtensão por tipo de superfície (km):")
print(extensao)

# Extensão por UF
por_uf = gdf.groupby("UF")["EXTENSAO_KM"].sum().sort_values(ascending=False)
print("\nExtensão da malha federal por UF (top 10):")
print(por_uf.head(10))
```

### Visualização da malha rodoviária

```python
import geopandas as gpd
import matplotlib.pyplot as plt

gdf = gpd.read_file("snv_rodovias_federais.shp")

# Colorir por tipo de superfície
fig, ax = plt.subplots(figsize=(12, 14))
cores = {"Pavimentada": "gray", "Não Pavimentada": "brown", "Planejada": "lightblue"}
for tipo, cor in cores.items():
    subset = gdf[gdf["SUPERFICIE"] == tipo]
    if not subset.empty:
        subset.plot(ax=ax, linewidth=0.5, color=cor, label=tipo)

ax.set_title("Malha Rodoviária Federal — SNV/DNIT")
ax.legend()
ax.set_axis_off()
plt.tight_layout()
plt.savefig("malha_rodoviaria.png", dpi=150)
print("Mapa salvo em malha_rodoviaria.png")
```

### Análise dos dados SNV em formato Excel

```python
import pandas as pd

# O SNV também é disponibilizado em Excel
df = pd.read_excel("snv_completo.xlsx", dtype=str)

print(f"Total de trechos: {len(df):,}")
print(f"Colunas: {list(df.columns)}")

# Resumo por rodovia
df["EXTENSAO_KM"] = pd.to_numeric(df["EXTENSAO_KM"], errors="coerce")
por_rodovia = df.groupby("BR")["EXTENSAO_KM"].sum().sort_values(ascending=False)
print("\nRodovias mais extensas:")
print(por_rodovia.head(10))
```

## Campos disponíveis

### Malha rodoviária (SNV)

| Campo | Tipo | Descrição |
|---|---|---|
| `BR` | string | Identificação da rodovia (ex: BR-101) |
| `UF` | string | Unidade da Federação |
| `TIPO_TRECHO` | string | Federal, estadual, municipal |
| `SUPERFICIE` | string | Pavimentada, não pavimentada, planejada |
| `EXTENSAO_KM` | float | Extensão do trecho em km |
| `SITUACAO` | string | Em operação, em obras, planejada |
| `geometry` | LineString | Geometria do trecho |

### Contagem de tráfego

| Campo | Tipo | Descrição |
|---|---|---|
| `BR` | string | Rodovia |
| `UF` | string | UF |
| `KM` | float | Quilômetro do posto de contagem |
| `VDMa` | int | Volume Diário Médio anual |
| `ANO` | int | Ano de referência |

## Cruzamentos possíveis

| Cruzamento | Fonte relacionada | Chave de ligação | Finalidade |
|---|---|---|---|
| Malha x Concessões | [ANTT Concessões](/docs/apis/infraestrutura-transportes/antt-concessoes) | Rodovia, UF | Identificar trechos concedidos vs. gestão direta |
| Malha x Acidentes | [PRF Acidentes](/docs/apis/infraestrutura-transportes/prf-acidentes) | Rodovia, km | Georreferenciar acidentes na malha rodoviária |
| Malha x Limites | [IBGE Geociências](/docs/apis/dados-geoespaciais/ibge-geociencias) | Geometria | Cruzamento espacial com limites municipais e estaduais |

## Limitações conhecidas

| Limitação | Detalhes |
|---|---|
| **Sem API REST (em desenvolvimento)** | Os dados são disponibilizados como arquivos para download. A Portaria 595/2024 prevê APIs REST, mas ainda em implantação. |
| **Shapefiles grandes** | Os arquivos geoespaciais do SNV completo podem ser grandes e requerem software GIS ou GeoPandas. |
| **Atualização irregular** | Os dados de condição das rodovias podem não ser atualizados com regularidade em todas as UFs. |
| **Cobertura federal** | O SNV foca na malha federal. Rodovias estaduais e municipais têm cobertura parcial e menos detalhada. |
| **VGEO instável** | O portal de geoserviços (VGEO) pode apresentar indisponibilidade ou lentidão. |
| **Formato variável** | Diferentes datasets usam formatos, projeções cartográficas e estruturas de colunas diferentes. |
| **Dados de tráfego limitados** | As contagens de tráfego contínuo cobrem apenas pontos específicos da malha, não toda a extensão. |
