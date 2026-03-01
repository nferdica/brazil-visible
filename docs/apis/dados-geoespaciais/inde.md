---
title: INDE — Infraestrutura Nacional de Dados Espaciais
slug: inde
orgao: Governo Federal
url_base: https://inde.gov.br/
tipo_acesso: Web Interface
autenticacao: Não requerida
formato_dados: [WMS, WFS, SHP, GeoJSON]
frequencia_atualizacao: Variável
campos_chave:
  - camada
  - metadado
  - organizacao
  - geometria
  - tema
tags:
  - INDE
  - dados espaciais
  - geoespacial
  - WMS
  - WFS
  - geoserviços
  - OGC
  - IDE
cruzamento_com:
  - dados-geoespaciais/ibge-geociencias
  - dados-geoespaciais/inpe-satelite
  - dados-geoespaciais/cprm-geologia
  - dados-geoespaciais/incra-fundiario
status: stub
---

# INDE — Infraestrutura Nacional de Dados Espaciais

## O que é

A **INDE (Infraestrutura Nacional de Dados Espaciais)** é o conjunto de políticas, padrões, tecnologias e mecanismos de acesso que possibilita o compartilhamento de dados geoespaciais entre instituições governamentais, setor privado e sociedade civil. Instituída pelo Decreto 6.666/2008, a INDE funciona como:

- **Catálogo central** — portal para descobrir e acessar dados geoespaciais de diversas instituições
- **Padrões** — especificações técnicas baseadas nos padrões OGC (Open Geospatial Consortium)
- **Geoserviços** — acesso a camadas de dados via WMS (mapas) e WFS (dados vetoriais)
- **Metadados** — catálogo de metadados seguindo perfil MGB (Metadados Geoespaciais do Brasil)

A INDE integra dados de diversas instituições: IBGE, INPE, ANA, CPRM, INCRA, Marinha, Exército, ICMBio, entre outras.

## Como acessar

| Item | Detalhe |
|---|---|
| **Portal** | `https://inde.gov.br/` |
| **Catálogo de metadados** | `https://metadados.snig.gov.br/geonetwork/` |
| **Visualizador** | `https://visualizador.inde.gov.br/` |
| **Autenticação** | Não requerida |
| **Formatos** | WMS, WFS, SHP, GeoJSON, KML |

### Geoserviços disponíveis

A INDE agrega geoserviços de diversas instituições, acessíveis via protocolos OGC:

| Protocolo | URL padrão | Uso |
|---|---|---|
| **WMS** | `{url}/wms?service=WMS&request=GetMap` | Visualização de mapas (imagens) |
| **WFS** | `{url}/wfs?service=WFS&request=GetFeature` | Download de dados vetoriais |
| **CSW** | `{url}/csw?service=CSW&request=GetRecords` | Busca de metadados |

## Endpoints/recursos principais

| Recurso | Conteúdo | Formato |
|---|---|---|
| **Catálogo de metadados** | Busca de camadas por tema, instituição, região | CSW/HTML |
| **Visualizador de mapas** | Visualização interativa de camadas sobrepostas | WMS |
| **Geoserviços federais** | Camadas de dados de diversas instituições | WMS/WFS |

### Principais provedores de dados via INDE

| Instituição | Dados disponíveis |
|---|---|
| IBGE | Limites territoriais, malhas, localidades |
| INPE | Imagens de satélite, desmatamento |
| ANA | Bacias hidrográficas, recursos hídricos |
| CPRM | Geologia, recursos minerais |
| INCRA | Imóveis rurais, assentamentos |
| ICMBio | Unidades de conservação |
| Marinha do Brasil | Cartas náuticas, batimetria |

## Exemplo de uso

### Acessar camada WMS com Python

```python
import requests
from PIL import Image
from io import BytesIO

# Exemplo: camada de unidades de conservação via WMS
url_wms = "https://geoservicos.ibge.gov.br/geoserver/wms"
params = {
    "service": "WMS",
    "request": "GetMap",
    "layers": "CCAR:BC250_Unidade_Conservacao_Federal_A",
    "bbox": "-74,-34,-34,6",
    "width": 800,
    "height": 600,
    "srs": "EPSG:4326",
    "format": "image/png",
}

response = requests.get(url_wms, params=params)
img = Image.open(BytesIO(response.content))
img.save("unidades_conservacao.png")
print("Imagem salva em unidades_conservacao.png")
```

### Buscar dados vetoriais via WFS

```python
import geopandas as gpd

# Acessar camada via WFS
url_wfs = (
    "https://geoservicos.ibge.gov.br/geoserver/wfs"
    "?service=WFS&request=GetFeature"
    "&typeName=CCAR:BC250_Localidade_P"
    "&outputFormat=application/json"
    "&maxFeatures=100"
)

gdf = gpd.read_file(url_wfs)
print(f"Localidades carregadas: {len(gdf)}")
print(gdf[["nome", "geometry"]].head())
```

## Campos disponíveis

Os campos variam por camada e instituição provedora. O catálogo de metadados descreve os atributos de cada camada.

### Metadados (padrão MGB)

| Campo | Descrição |
|---|---|
| `título` | Nome da camada |
| `resumo` | Descrição do conteúdo |
| `responsável` | Instituição provedora |
| `extensão geográfica` | Abrangência territorial |
| `sistema de referência` | Projeção cartográfica (ex: SIRGAS 2000) |
| `formato de distribuição` | Formatos disponíveis |
| `data de publicação` | Data de publicação |
| `palavras-chave` | Termos para busca |

## Cruzamentos possíveis

| Cruzamento | Fonte relacionada | Chave de ligação | Finalidade |
|---|---|---|---|
| INDE x IBGE | [IBGE Geociências](/docs/apis/dados-geoespaciais/ibge-geociencias) | Geometria | Integrar limites territoriais com outros dados espaciais |
| INDE x Satélite | [INPE Satélite](/docs/apis/dados-geoespaciais/inpe-satelite) | Coordenadas | Sobrepor imagens de satélite com camadas vetoriais |
| INDE x Geologia | [CPRM Geologia](/docs/apis/dados-geoespaciais/cprm-geologia) | Geometria | Cruzar dados geológicos com outros temas |
| INDE x Fundiário | [INCRA](/docs/apis/dados-geoespaciais/incra-fundiario) | Geometria | Integrar dados fundiários com outras camadas |

## Limitações conhecidas

| Limitação | Detalhes |
|---|---|
| **Catálogo fragmentado** | Os dados estão distribuídos em diversos servidores de diferentes instituições, com níveis variados de disponibilidade. |
| **Geoserviços instáveis** | Muitos geoserviços governamentais apresentam indisponibilidade frequente. |
| **Metadados incompletos** | Nem todos os dados possuem metadados completos ou atualizados. |
| **Curva de aprendizado** | O uso de protocolos OGC (WMS, WFS, CSW) requer conhecimento técnico de GIS. |
| **Performance variável** | Consultas WFS de grandes áreas podem ser muito lentas ou falhar por timeout. |
| **Sem padronização de atributos** | Cada instituição define seus próprios campos e nomenclatura, dificultando integração automática. |
