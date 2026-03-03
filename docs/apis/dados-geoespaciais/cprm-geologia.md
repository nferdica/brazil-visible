---
title: SGB-CPRM — Geologia, Recursos Minerais e Hidrogeologia
slug: cprm-geologia
orgao: SGB-CPRM (Serviço Geológico do Brasil)
url_base: https://geosgb.sgb.gov.br/
tipo_acesso: WMS/WFS / REST API (ArcGIS Server)
autenticacao: Não requerida
formato_dados: [WMS, WFS, SHP, GeoJSON, JSON]
frequencia_atualizacao: Anual
campos_chave:
  - unidade_geologica
  - tipo_rocha
  - idade_geologica
  - recurso_mineral
  - bacia_hidrografica
tags:
  - CPRM
  - SGB
  - geologia
  - recursos minerais
  - hidrogeologia
  - águas subterrâneas
  - mapa geológico
  - geoespacial
  - SIAGAS
cruzamento_com:
  - dados-geoespaciais/ibge-geociencias
  - dados-geoespaciais/inde
  - dados-geoespaciais/incra-fundiario
  - meio-ambiente/recursos-hidricos
status: documentado
---

# SGB-CPRM — Geologia, Recursos Minerais e Hidrogeologia

## O que é

O **SGB-CPRM (Serviço Geológico do Brasil — Companhia de Pesquisa de Recursos Minerais)** é a instituição responsável pelo levantamento geológico do território brasileiro, vinculada ao Ministério de Minas e Energia. A denominação oficial mantém ambas as siglas: **SGB** (nome de marca) e **CPRM** (razão social, desde 1969).

Os dados disponibilizados incluem:

- **Mapa Geológico do Brasil** — litologia, estratigrafia, estruturas geológicas
- **Recursos minerais** — ocorrências e depósitos minerais, minas ativas
- **Hidrogeologia (SIAGAS)** — aquíferos, poços tubulares, águas subterrâneas
- **Geoquímica** — amostras geoquímicas de solos e sedimentos
- **Geodiversidade** — Atlas da Geodiversidade do Brasil
- **Riscos geológicos** — áreas suscetíveis a deslizamentos, inundações, erosão
- **Monitoramento hidrológico (SACE)** — alertas de cheias e níveis de rios em tempo real

Os dados são acessíveis por múltiplas plataformas: **GeoSGB** (geoserviços WMS/WFS), **Geoportal** (REST API via ArcGIS Server), **OpenData** (dados abertos) e **SIAGAS** (sistema de águas subterrâneas).

## Como acessar

### Portais e plataformas

| Plataforma | URL | Descrição |
|---|---|---|
| **GeoSGB** | `https://geosgb.sgb.gov.br/` | Portal principal de geoserviços (WMS/WFS) |
| **Geoportal** | `https://geoportal.sgb.gov.br/` | Portal com REST API (ArcGIS Server) |
| **OpenData** | `https://opendata.sgb.gov.br/` | Dados abertos com GeoServer |
| **SIAGAS** | `https://siagasweb.sgb.gov.br/layout/` | Sistema de Informações de Águas Subterrâneas |
| **RIGEO** | `https://rigeo.sgb.gov.br/` | Repositório Institucional de Geociências |
| **Portal SGB** | `https://www.sgb.gov.br/` | Site institucional |
| **Mapeamento Geológico** | `https://www.sgb.gov.br/mapeamento_geologico/` | Plataforma de mapeamento (lançada 2024) |
| **P3M** | `https://p3m.sgb.gov.br/` | Plataforma de Pesquisa e Produção Mineral |
| **SACE** | `https://sace.sgb.gov.br/` | Sistema de Alerta de Cheias |

### Endpoints técnicos

| Protocolo | URL | Uso |
|---|---|---|
| **WMS (GeoServer)** | `https://geoservicos.sgb.gov.br/geoserver/geosgb/wms` | Mapas em formato imagem |
| **WFS (GeoServer)** | `https://geoservicos.sgb.gov.br/geoserver/geosgb/wfs` | Dados vetoriais |
| **WMS (OpenData)** | `https://opendata.sgb.gov.br/geoserver/ows` | Dados abertos geoespaciais |
| **WMS (SACE)** | `https://sace.sgb.gov.br/geoserver/ows` | Dados hidrológicos em tempo real |
| **REST (ArcGIS)** | `https://geoportal.sgb.gov.br/server/rest/services` | API REST com MapServer/FeatureServer |

## Endpoints/recursos principais

### Camadas disponíveis via REST API (ArcGIS Server)

| Camada | Endpoint | Formato |
|---|---|---|
| **Afloramentos geológicos** | `/geologia/afloramentos/MapServer` | JSON, GeoJSON |
| **Ocorrências minerais** | `/geologia/ocorrencias/MapServer` | JSON, GeoJSON |
| **Litoestratigrafia estadual** | `/geologia/litoestratigrafia_estados/MapServer` | JSON, GeoJSON |
| **Domínios tectônicos** | `/sigs_especiais/tecams/FeatureServer` | JSON, GeoJSON |
| **SIAGAS (poços)** | `/hidrologia/SIAGAS_MODDAD/MapServer` | JSON, GeoJSON |
| **Manchas de inundação** | `/gestaoterritorial/inundacao/MapServer` | JSON, GeoJSON |
| **Geodiversidade** | `/gestaoterritorial/geodiversidade_estados/MapServer` | JSON, GeoJSON |

### Recursos de download/consulta

| Recurso | Conteúdo | Formato |
|---|---|---|
| **Mapa Geológico** | Unidades litoestratigráficas | WMS/WFS |
| **Recursos Minerais** | Ocorrências minerais por tipo | WMS/WFS/REST |
| **SIAGAS** | Poços tubulares, aquíferos, águas subterrâneas | Web/CSV/REST |
| **Carta geológica** | Mapas geológicos por folha | PDF/SHP (RIGEO) |
| **Geodiversidade** | Atlas da Geodiversidade | WMS/REST |
| **Áreas de risco** | Setores de risco geológico | WMS/SHP |
| **Mapeamento Geológico** | Dashboard interativo PlanGeo 2025-2034 | Web |

### Limites técnicos da REST API

| Parâmetro | Valor |
|---|---|
| MaxRecordCount | 1.000 por requisição |
| MaxImageHeight/Width | 4.096 pixels |
| Formatos de query | JSON, GeoJSON, PBF |
| Operações | Export Map, Identify, Query, Find |

## Exemplo de uso

### Acessar mapa geológico via WMS

```python
import requests
from PIL import Image
from io import BytesIO

# WMS do Mapa Geológico do Brasil via GeoServer
url = "https://geoservicos.sgb.gov.br/geoserver/geosgb/wms"
params = {
    "service": "WMS",
    "request": "GetMap",
    "layers": "geosgb:unidades_litoestratigraficas",
    "bbox": "-55,-15,-45,-10",
    "width": 800,
    "height": 600,
    "srs": "EPSG:4326",
    "format": "image/png",
}

response = requests.get(url, params=params)
if response.status_code == 200 and "image" in response.headers.get("content-type", ""):
    img = Image.open(BytesIO(response.content))
    img.save("mapa_geologico.png")
    print("Mapa geológico salvo em mapa_geologico.png")
else:
    print(f"Erro: {response.status_code}")
```

### Consultar dados via REST API (ArcGIS Server)

```python
import requests
import pandas as pd

# Consultar ocorrências minerais via REST API
url = "https://geoportal.sgb.gov.br/server/rest/services/geologia/afloramentos/MapServer/0/query"
params = {
    "where": "UF = 'MG'",
    "outFields": "*",
    "returnGeometry": "true",
    "f": "geojson",
    "resultRecordCount": 100,
}

response = requests.get(url, params=params)
response.raise_for_status()
dados = response.json()

features = dados.get("features", [])
print(f"Afloramentos geológicos em MG: {len(features)}")

if features:
    props = [f["properties"] for f in features]
    df = pd.DataFrame(props)
    print(f"Colunas: {list(df.columns)}")
    print(df.head())
```

### Consultar poços no SIAGAS via MapServer

```python
import requests

# SIAGAS — poços tubulares via REST API
url = (
    "https://geoportal.sgb.gov.br/server/rest/services"
    "/hidrologia/SIAGAS_MODDAD/MapServer/0/query"
)
params = {
    "where": "UF = 'SP'",
    "outFields": "POCO_ID,LATITUDE,LONGITUDE,PROFUNDIDADE,VAZAO,AQUIFERO,MUNICIPIO",
    "returnGeometry": "false",
    "f": "json",
    "resultRecordCount": 50,
}

response = requests.get(url, params=params)
response.raise_for_status()
dados = response.json()

features = dados.get("features", [])
print(f"Poços em SP: {len(features)}")
for f in features[:5]:
    attrs = f["attributes"]
    print(f"  {attrs.get('MUNICIPIO')} — Prof: {attrs.get('PROFUNDIDADE')}m, Vazão: {attrs.get('VAZAO')} m³/h")
```

## Campos disponíveis

### Mapa Geológico (WMS/WFS)

| Campo | Tipo | Descrição |
|---|---|---|
| `SIGLA` | string | Sigla da unidade litoestratigráfica |
| `NOME` | string | Nome da unidade |
| `TIPO_ROCHA` | string | Tipo de rocha (ígnea, sedimentar, metamórfica) |
| `IDADE` | string | Idade geológica (era, período) |
| `geometry` | Polygon | Geometria da unidade |

### SIAGAS (poços)

| Campo | Tipo | Descrição |
|---|---|---|
| `POCO_ID` | int | Identificador do poço |
| `LATITUDE` | float | Latitude |
| `LONGITUDE` | float | Longitude |
| `PROFUNDIDADE` | float | Profundidade do poço (m) |
| `VAZAO` | float | Vazão (m³/h) |
| `AQUIFERO` | string | Nome do aquífero |
| `MUNICIPIO` | string | Município |
| `UF` | string | UF |

### REST API (ArcGIS Server)

| Campo | Tipo | Descrição |
|---|---|---|
| `OBJECTID` | int | Identificador do registro |
| `UF` | string | Unidade federativa |
| `TIPO` | string | Tipo do registro (varia por camada) |
| `DESCRICAO` | string | Descrição textual |
| `geometry` | object | Geometria (ponto, linha ou polígono) |

## Cruzamentos possíveis

| Cruzamento | Fonte relacionada | Chave de ligação | Finalidade |
|---|---|---|---|
| Geologia x Limites | [IBGE Geociências](/docs/apis/dados-geoespaciais/ibge-geociencias) | Geometria, UF | Caracterizar geologia por município e estado |
| Geologia x Fundiário | [INCRA](/docs/apis/dados-geoespaciais/incra-fundiario) | Geometria | Analisar aptidão geológica de imóveis rurais |
| Geologia x INDE | [INDE](/docs/apis/dados-geoespaciais/inde) | Geometria | Integrar com outras camadas via infraestrutura nacional |
| Hidrogeologia x Recursos hídricos | [ANA — Recursos Hídricos](/docs/apis/meio-ambiente/recursos-hidricos) | Bacia hidrográfica | Cruzar dados de poços com bacias e outorgas |

## Limitações conhecidas

| Limitação | Detalhes |
|---|---|
| **Geoserviços instáveis** | Os serviços WMS/WFS do GeoSGB podem apresentar indisponibilidade ou lentidão, especialmente para áreas grandes. |
| **MaxRecordCount** | A REST API limita a 1.000 registros por requisição. Para grandes volumes, é necessário paginar com `resultOffset`. |
| **Dados técnicos** | A interpretação dos dados geológicos requer conhecimento especializado em geologia e GIS. |
| **Escala variável** | Os mapas geológicos estão disponíveis em diferentes escalas (1:250.000, 1:1.000.000). A cobertura em escala de detalhe não é completa para todo o território. |
| **SIAGAS com interface antiga** | A interface web do SIAGAS é funcional mas antiga. A REST API via ArcGIS é a melhor alternativa para acesso programático. |
| **Sem API REST dedicada** | Não há API REST moderna com documentação OpenAPI. O acesso é via protocolos OGC (WMS/WFS) ou ArcGIS Server REST. |
| **Duplicidade de plataformas** | GeoSGB, Geoportal e OpenData são plataformas complementares com sobreposição parcial de dados, o que pode causar confusão. |
