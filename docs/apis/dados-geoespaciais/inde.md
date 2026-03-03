---
title: INDE — Infraestrutura Nacional de Dados Espaciais
slug: inde
orgao: Governo Federal (coordenação IBGE)
url_base: https://visualizador.inde.gov.br/
tipo_acesso: WMS/WFS/CSW (padrões OGC)
autenticacao: Não requerida
formato_dados: [WMS, WFS, SHP, GeoJSON, KML]
frequencia_atualizacao: Variável (por instituição provedora)
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
status: documentado
---

# INDE — Infraestrutura Nacional de Dados Espaciais

## O que é

A **INDE (Infraestrutura Nacional de Dados Espaciais)** é o conjunto de políticas, padrões, tecnologias e mecanismos de acesso que possibilita o compartilhamento de dados geoespaciais entre instituições governamentais, setor privado e sociedade civil. Instituída pelo **Decreto 6.666/2008** e coordenada pelo **IBGE** através do **DBDG (Diretório Brasileiro de Dados Geoespaciais)**, a INDE funciona como:

- **Catálogo central** — portal para descobrir e acessar dados geoespaciais de dezenas de instituições
- **Padrões OGC** — especificações técnicas baseadas nos padrões do Open Geospatial Consortium
- **Geoserviços federados** — acesso a camadas de dados via WMS (mapas) e WFS (dados vetoriais)
- **Metadados padronizados** — catálogo seguindo o perfil MGB (Metadados Geoespaciais do Brasil)

A INDE integra dados de: IBGE, INPE, ANA, SGB-CPRM, INCRA, Marinha, Exército, ICMBio, DNIT, entre outras instituições.

> **Atualização 2025:** O visualizador foi atualizado para a versão 2.0.0, com upgrade de infraestrutura em agosto de 2025 melhorando a performance. O IBGE conduz treinamentos regulares sobre a INDE para instituições governamentais.

## Como acessar

### Portais principais

| Portal | URL | Descrição |
|---|---|---|
| **Portal INDE** | `https://inde.gov.br/` | Portal principal e notícias |
| **Visualizador** | `https://visualizador.inde.gov.br/` | Visualização interativa de camadas (versão 2.0.0) |
| **Catálogo de metadados** | `https://metadados.snig.gov.br/geonetwork/` | Busca de camadas por tema/instituição |

### Protocolos de acesso

| Protocolo | URL padrão | Uso |
|---|---|---|
| **WMS** | `{url}/wms?service=WMS&request=GetMap` | Visualização de mapas (imagens rasterizadas) |
| **WFS** | `{url}/wfs?service=WFS&request=GetFeature` | Download de dados vetoriais (pontos, linhas, polígonos) |
| **CSW** | `{url}/csw?service=CSW&request=GetRecords` | Busca de metadados |
| **WCS** | `{url}/wcs?service=WCS&request=GetCoverage` | Download de dados raster (elevação, etc.) |

### Principais geoserviços por instituição

| Instituição | URL do GeoServer | Dados |
|---|---|---|
| **IBGE** | `https://geoservicos.ibge.gov.br/geoserver/` | Limites territoriais, malhas, localidades |
| **INPE** | `http://terrabrasilis.dpi.inpe.br/geoserver/` | Desmatamento, queimadas, cobertura vegetal |
| **ANA** | `https://metadados.snirh.gov.br/geoserver/` | Bacias hidrográficas, recursos hídricos |
| **SGB-CPRM** | `https://geoservicos.sgb.gov.br/geoserver/` | Geologia, recursos minerais |
| **ICMBio** | `https://geoserver.ides.ide.icmbio.gov.br/geoserver/` | Unidades de conservação |

## Endpoints/recursos principais

| Recurso | Conteúdo | Formato |
|---|---|---|
| **Catálogo de metadados** | Busca de camadas por tema, instituição, região | CSW/HTML |
| **Visualizador de mapas** | Visualização interativa de camadas sobrepostas | WMS |
| **Geoserviços federados** | Camadas de dados de diversas instituições | WMS/WFS |

### Principais provedores de dados via INDE

| Instituição | Dados disponíveis | Exemplos de camadas |
|---|---|---|
| IBGE | Limites territoriais, malhas, localidades | `BC250_Unidade_Conservacao_Federal_A`, `BC250_Localidade_P` |
| INPE | Imagens de satélite, desmatamento | PRODES, DETER, focos de calor |
| ANA | Bacias hidrográficas, recursos hídricos | Bacias hidrográficas, estações pluviométricas |
| SGB-CPRM | Geologia, recursos minerais | Mapa geológico, SIAGAS |
| INCRA | Imóveis rurais, assentamentos | Parcelas certificadas, assentamentos |
| ICMBio | Unidades de conservação | UC federais, RPPN |
| Marinha do Brasil | Cartas náuticas, batimetria | Cartas náuticas |
| DNIT | Malha rodoviária | Rodovias federais |

## Exemplo de uso

### Acessar camada WMS com Python

```python
import requests
from PIL import Image
from io import BytesIO

# Exemplo: unidades de conservação federais via WMS do IBGE
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
if response.status_code == 200:
    img = Image.open(BytesIO(response.content))
    img.save("unidades_conservacao.png")
    print("Imagem salva em unidades_conservacao.png")
```

### Buscar dados vetoriais via WFS

```python
import geopandas as gpd

# Acessar localidades via WFS do IBGE
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

### Listar camadas disponíveis via GetCapabilities

```python
import requests
from xml.etree import ElementTree

# Listar camadas WMS disponíveis no IBGE
url = "https://geoservicos.ibge.gov.br/geoserver/wms?service=WMS&request=GetCapabilities"
response = requests.get(url)
response.raise_for_status()

root = ElementTree.fromstring(response.content)
ns = {"wms": "http://www.opengis.net/wms"}

layers = root.findall(".//wms:Layer/wms:Layer", ns)
print(f"Camadas disponíveis: {len(layers)}")
for layer in layers[:10]:
    name = layer.find("wms:Name", ns)
    title = layer.find("wms:Title", ns)
    if name is not None and title is not None:
        print(f"  {name.text}: {title.text}")
```

## Campos disponíveis

Os campos variam por camada e instituição provedora. O catálogo de metadados descreve os atributos de cada camada.

### Metadados (padrão MGB)

| Campo | Descrição |
|---|---|
| `título` | Nome da camada |
| `resumo` | Descrição do conteúdo |
| `responsável` | Instituição provedora |
| `extensão geográfica` | Abrangência territorial (bounding box) |
| `sistema de referência` | Projeção cartográfica (ex: SIRGAS 2000 / EPSG:4674) |
| `formato de distribuição` | Formatos disponíveis (WMS, WFS, SHP, etc.) |
| `data de publicação` | Data de publicação dos dados |
| `palavras-chave` | Termos para busca |
| `tipo de recurso` | Série, dataset, serviço |

## Cruzamentos possíveis

| Cruzamento | Fonte relacionada | Chave de ligação | Finalidade |
|---|---|---|---|
| INDE x IBGE | [IBGE Geociências](/docs/apis/dados-geoespaciais/ibge-geociencias) | Geometria | Integrar limites territoriais com outros dados espaciais |
| INDE x Satélite | [INPE Satélite](/docs/apis/dados-geoespaciais/inpe-satelite) | Coordenadas | Sobrepor imagens de satélite com camadas vetoriais |
| INDE x Geologia | [SGB-CPRM](/docs/apis/dados-geoespaciais/cprm-geologia) | Geometria | Cruzar dados geológicos com outros temas |
| INDE x Fundiário | [INCRA](/docs/apis/dados-geoespaciais/incra-fundiario) | Geometria | Integrar dados fundiários com outras camadas |

## Limitações conhecidas

| Limitação | Detalhes |
|---|---|
| **Catálogo fragmentado** | Os dados estão distribuídos em dezenas de servidores de diferentes instituições, com níveis variados de disponibilidade e performance. |
| **Geoserviços instáveis** | Muitos geoserviços governamentais apresentam indisponibilidade frequente, especialmente de instituições menores. |
| **Metadados incompletos** | Nem todos os dados possuem metadados completos ou atualizados no catálogo da INDE. |
| **Curva de aprendizado** | O uso de protocolos OGC (WMS, WFS, CSW) requer conhecimento técnico de GIS e cartografia. |
| **Performance variável** | Consultas WFS de grandes áreas podem ser muito lentas ou falhar por timeout. Recomenda-se limitar `maxFeatures` e usar bounding box. |
| **Sem padronização de atributos** | Cada instituição define seus próprios campos e nomenclatura, dificultando integração automática entre camadas de diferentes provedores. |
| **Sem autenticação centralizada** | Cada instituição gerencia seu próprio servidor de geoserviços. Não há ponto único de acesso. |
