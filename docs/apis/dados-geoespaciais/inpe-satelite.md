---
title: INPE Imagens de Satélite — Landsat, Sentinel, CBERS
slug: inpe-satelite
orgao: INPE
url_base: http://www.dgi.inpe.br/catalogo/
tipo_acesso: Web Interface
autenticacao: Cadastro gratuito
formato_dados: [GeoTIFF, HDF, JP2]
frequencia_atualizacao: Diária
campos_chave:
  - satelite
  - sensor
  - data_imagem
  - orbita_ponto
  - resolucao_espacial
  - cobertura_nuvens
tags:
  - INPE
  - satélite
  - sensoriamento remoto
  - Landsat
  - Sentinel
  - CBERS
  - imagens
  - geoprocessamento
  - desmatamento
  - PRODES
  - DETER
cruzamento_com:
  - dados-geoespaciais/ibge-geociencias
  - dados-geoespaciais/inde
  - meio-ambiente/ibama-prodes
status: parcial
---

# INPE Imagens de Satélite — Landsat, Sentinel, CBERS

## O que é

O **INPE (Instituto Nacional de Pesquisas Espaciais)** é a principal instituição brasileira de sensoriamento remoto e disponibiliza imagens de satélite e produtos derivados para uso livre. Os dados incluem:

- **CBERS** — satélites sino-brasileiros (CBERS-4, CBERS-4A), com câmeras PAN, MUX, IRS e WFI
- **Amazonia-1** — satélite brasileiro para monitoramento ambiental
- **Landsat** — imagens redistribuídas do programa Landsat (NASA/USGS)
- **Sentinel** — imagens redistribuídas do programa Copernicus (ESA)
- **PRODES** — taxa anual de desmatamento na Amazônia Legal
- **DETER** — alertas de desmatamento em tempo quase real
- **Queimadas** — focos de incêndio detectados por satélite
- **TerraBrasilis** — plataforma de visualização de dados de desmatamento

O catálogo de imagens do INPE é um dos maiores acervos públicos de dados de sensoriamento remoto da América Latina.

## Como acessar

| Item | Detalhe |
|---|---|
| **Catálogo de imagens** | `http://www.dgi.inpe.br/catalogo/` |
| **TerraBrasilis** | `http://terrabrasilis.dpi.inpe.br/` |
| **PRODES** | `http://www.obt.inpe.br/OBT/assuntos/programas/amazonia/prodes` |
| **DETER** | `http://www.obt.inpe.br/OBT/assuntos/programas/amazonia/deter` |
| **Queimadas** | `https://queimadas.dgi.inpe.br/queimadas/portal` |
| **Autenticação** | Cadastro gratuito para download de imagens |
| **Formatos** | GeoTIFF, HDF, JP2, Shapefile |

### Plataformas complementares

| Plataforma | Descrição |
|---|---|
| **Google Earth Engine** | Acesso a imagens CBERS, Landsat e Sentinel via computação em nuvem |
| **Copernicus Open Access Hub** | Imagens Sentinel (europeu) |
| **USGS Earth Explorer** | Imagens Landsat (americano) |

## Endpoints/recursos principais

| Recurso | Conteúdo | Formato |
|---|---|---|
| **Catálogo DGI** | Busca e download de imagens de satélite | Web/FTP |
| **PRODES dados** | Polígonos de desmatamento anual (shapefile) | SHP |
| **DETER dados** | Alertas de desmatamento (shapefile) | SHP |
| **Focos de queimadas** | Pontos de focos de incêndio | CSV/SHP |
| **TerraBrasilis API** | Dados de desmatamento via API | GeoJSON |

## Exemplo de uso

### Download de focos de queimadas

```python
import requests
import pandas as pd

# API de focos de queimadas do INPE
# https://queimadas.dgi.inpe.br/queimadas/bdqueimadas
url = (
    "https://queimadas.dgi.inpe.br/queimadas/portal/csv/"
    "focos_qmd_inpe_24h.csv"
)

df = pd.read_csv(url, encoding="utf-8")
print(f"Focos de queimadas (últimas 24h): {len(df):,}")
print(f"Colunas: {list(df.columns)}")
print(df.head())
```

### Dados de desmatamento via TerraBrasilis

```python
import requests

# API do TerraBrasilis — dados de desmatamento (PRODES)
url = "http://terrabrasilis.dpi.inpe.br/api/v1/prodes/rates"

response = requests.get(url)
if response.status_code == 200:
    dados = response.json()
    print("Taxas de desmatamento (PRODES):")
    for item in dados:
        print(f"  {item.get('year')}: {item.get('rate')} km²")
```

### Busca no catálogo de imagens

```python
# O catálogo de imagens do INPE requer acesso via interface web
# ou scripts específicos para interação com o sistema.

# Para acesso programático, recomenda-se usar o Google Earth Engine:
# pip install earthengine-api

import ee

# Inicializar (requer autenticação prévia)
ee.Initialize()

# Buscar imagens CBERS-4 de uma região
colecao = (
    ee.ImageCollection("CBERS/CBERS4/MUX")
    .filterBounds(ee.Geometry.Point([-47.9, -15.8]))  # Brasília
    .filterDate("2024-01-01", "2024-12-31")
    .filterMetadata("CLOUD_COVER", "less_than", 20)
)

print(f"Imagens encontradas: {colecao.size().getInfo()}")
```

## Campos disponíveis

### Focos de queimadas

| Campo | Tipo | Descrição |
|---|---|---|
| `lat` | float | Latitude do foco |
| `lon` | float | Longitude do foco |
| `data_hora_gmt` | datetime | Data e hora (GMT) |
| `satelite` | string | Satélite que detectou (AQUA, TERRA, NPP-375, GOES-16) |
| `municipio` | string | Município |
| `estado` | string | UF |
| `bioma` | string | Bioma (Amazônia, Cerrado, etc.) |
| `frp` | float | Fire Radiative Power (MW) |
| `risco_fogo` | float | Risco de fogo (0-1) |

### PRODES (desmatamento)

| Campo | Tipo | Descrição |
|---|---|---|
| `ano` | int | Ano do desmatamento |
| `area_km2` | float | Área desmatada (km²) |
| `estado` | string | UF |
| `municipio` | string | Município |
| `geometry` | Polygon | Polígono do desmatamento |

## Cruzamentos possíveis

| Cruzamento | Fonte relacionada | Chave de ligação | Finalidade |
|---|---|---|---|
| Satélite x Limites | [IBGE Geociências](/docs/apis/dados-geoespaciais/ibge-geociencias) | Geometria | Recortar imagens por município ou UF |
| Desmatamento x INDE | [INDE](/docs/apis/dados-geoespaciais/inde) | Geometria | Integrar dados de desmatamento com outras camadas |
| Queimadas x Municípios | [Censo Demográfico](/docs/apis/ibge-estatisticas/censo-demografico) | Município | Correlacionar queimadas com dados populacionais |

## Limitações conhecidas

| Limitação | Detalhes |
|---|---|
| **Cadastro necessário** | O download de imagens do catálogo DGI requer cadastro (gratuito). |
| **Cobertura de nuvens** | Imagens ópticas (visível/infravermelho) são afetadas por nuvens, especialmente na Amazônia. |
| **Arquivos muito grandes** | Imagens de satélite podem ter centenas de MB ou GB cada. |
| **Interface web antiga** | O catálogo DGI tem interface web antiga e pouco amigável para acesso programático. |
| **Sem API REST moderna** | O catálogo não oferece API REST moderna. Para acesso programático, é mais prático usar Google Earth Engine ou STAC (SpatioTemporal Asset Catalog). |
| **PRODES e DETER apenas Amazônia** | Os dados de desmatamento do PRODES e DETER focam na Amazônia Legal. Outros biomas têm projetos separados (PRODES Cerrado, MapBiomas). |
