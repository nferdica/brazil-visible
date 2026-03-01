---
title: DNIT Malha Rodoviária — Infraestrutura Rodoviária Federal
slug: dnit-malha-rodoviaria
orgao: DNIT
url_base: https://www.gov.br/dnit/pt-br/assuntos/atlas-e-mapas
tipo_acesso: CSV Download
autenticacao: Não requerida
formato_dados: [SHP, GeoJSON, CSV]
frequencia_atualizacao: Anual
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
cruzamento_com:
  - infraestrutura-transportes/antt-concessoes
  - infraestrutura-transportes/prf-acidentes
  - dados-geoespaciais/ibge-geociencias
status: stub
---

# DNIT Malha Rodoviária — Infraestrutura Rodoviária Federal

## O que é

O **DNIT (Departamento Nacional de Infraestrutura de Transportes)** é responsável pela implementação da política de infraestrutura do sistema federal de viação, incluindo rodovias e ferrovias federais. O DNIT disponibiliza dados sobre:

- **SNV (Sistema Nacional de Viação)** — mapeamento de todas as rodovias federais e estaduais planejadas
- **Condições das rodovias** — estado de conservação, tipo de superfície (pavimentada, não pavimentada)
- **Extensão da malha** — quilometragem por rodovia, UF e tipo
- **Obras** — projetos de construção, manutenção e restauração
- **Pesagem** — postos de pesagem e dados de tráfego de cargas

Os dados geoespaciais da malha rodoviária são disponibilizados em formatos SHP (Shapefile) e podem ser utilizados em sistemas de informação geográfica (GIS).

## Como acessar

| Item | Detalhe |
|---|---|
| **Atlas/Mapas** | `https://www.gov.br/dnit/pt-br/assuntos/atlas-e-mapas` |
| **SNV Online** | `https://www.gov.br/dnit/pt-br/assuntos/planejamento-e-pesquisa/snv` |
| **VGEO (GeoPortal)** | `https://servicos.dnit.gov.br/vgeo/` |
| **Dados abertos** | `https://dados.gov.br/dados/organizacoes/visualizar/departamento-nacional-de-infraestrutura-de-transportes-dnit` |
| **Autenticação** | Não requerida |
| **Formatos** | SHP, GeoJSON, CSV, KML |

## Endpoints/recursos principais

| Recurso | Conteúdo | Formato |
|---|---|---|
| **SNV (malha rodoviária)** | Traçado georreferenciado das rodovias federais | SHP |
| **Condições das rodovias** | Estado de conservação por trecho | CSV/SHP |
| **VGEO** | Portal de geoserviços (WMS/WFS) | WMS/WFS |
| **Extensão da malha** | Quilometragem por rodovia e UF | CSV |
| **Obras e contratos** | Obras de infraestrutura em andamento | CSV |

## Exemplo de uso

### Leitura de shapefile da malha rodoviária

```python
import geopandas as gpd

# Após download do shapefile do SNV
gdf = gpd.read_file("snv_rodovias_federais.shp")

print(f"Total de trechos: {len(gdf):,}")
print(f"Colunas: {list(gdf.columns)}")
print(f"CRS: {gdf.crs}")

# Extensão total por tipo de superfície
extensao = gdf.groupby("SUPERFICIE")["EXTENSAO_KM"].sum()
print("\nExtensão por tipo de superfície (km):")
print(extensao)
```

### Visualização da malha rodoviária

```python
import geopandas as gpd
import matplotlib.pyplot as plt

gdf = gpd.read_file("snv_rodovias_federais.shp")

fig, ax = plt.subplots(figsize=(12, 14))
gdf.plot(ax=ax, linewidth=0.5, color="gray")
ax.set_title("Malha Rodoviária Federal")
ax.set_axis_off()
plt.tight_layout()
plt.savefig("malha_rodoviaria.png", dpi=150)
print("Mapa salvo em malha_rodoviaria.png")
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
| `geometry` | geometry | Geometria do trecho (LineString) |

## Cruzamentos possíveis

| Cruzamento | Fonte relacionada | Chave de ligação | Finalidade |
|---|---|---|---|
| Malha x Concessões | [ANTT Concessões](/docs/apis/infraestrutura-transportes/antt-concessoes) | Rodovia, UF | Identificar trechos concedidos vs. sob gestão direta do DNIT |
| Malha x Acidentes | [PRF Acidentes](/docs/apis/infraestrutura-transportes/prf-acidentes) | Rodovia, km | Georreferenciar acidentes na malha rodoviária |
| Malha x Limites | [IBGE Geociências](/docs/apis/dados-geoespaciais/ibge-geociencias) | Geometria | Cruzamento espacial com limites municipais e estaduais |

## Limitações conhecidas

| Limitação | Detalhes |
|---|---|
| **Sem API REST** | Os dados são disponibilizados apenas como arquivos para download (SHP, CSV). |
| **Shapefiles grandes** | Os arquivos geoespaciais podem ser grandes e requerem software GIS ou bibliotecas como GeoPandas. |
| **Atualização irregular** | Os dados de condição das rodovias podem não ser atualizados com regularidade. |
| **Cobertura federal** | O SNV foca na malha federal. Rodovias estaduais e municipais têm cobertura parcial. |
| **VGEO instável** | O portal de geoserviços (VGEO) pode apresentar indisponibilidade. |
| **Formato variável** | Diferentes datasets usam formatos e projeções cartográficas diferentes. |
