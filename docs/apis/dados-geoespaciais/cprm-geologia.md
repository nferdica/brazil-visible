---
title: CPRM Geologia — Recursos Minerais e Hidrogeologia
slug: cprm-geologia
orgao: CPRM / SGB
url_base: https://geosgb.sgb.gov.br/
tipo_acesso: Web Interface
autenticacao: Não requerida
formato_dados: [WMS, WFS, SHP, GeoJSON]
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
cruzamento_com:
  - dados-geoespaciais/ibge-geociencias
  - dados-geoespaciais/inde
  - dados-geoespaciais/incra-fundiario
status: stub
---

# CPRM Geologia — Recursos Minerais e Hidrogeologia

## O que é

O **CPRM (Serviço Geológico do Brasil)**, atual **SGB (Serviço Geológico do Brasil)**, é a instituição responsável pelo levantamento geológico do território brasileiro. Os dados disponibilizados incluem:

- **Mapa Geológico do Brasil** — litologia, estratigrafia, estruturas geológicas
- **Recursos minerais** — ocorrências e depósitos minerais, minas ativas
- **Hidrogeologia** — aquíferos, poços, águas subterrâneas
- **Geoquímica** — amostras geoquímicas de solos e sedimentos
- **Geodiversidade** — Atlas da Geodiversidade do Brasil
- **Riscos geológicos** — áreas suscetíveis a deslizamentos, inundações, erosão

Os dados são acessíveis pelo **GeoSGB**, portal de geoserviços que oferece camadas em formato WMS/WFS.

## Como acessar

| Item | Detalhe |
|---|---|
| **GeoSGB** | `https://geosgb.sgb.gov.br/` |
| **RIGEO** | `https://rigeo.sgb.gov.br/` |
| **Portal SGB** | `https://www.sgb.gov.br/` |
| **Autenticação** | Não requerida para visualização; cadastro para download em alguns casos |
| **Formatos** | WMS, WFS, SHP, PDF (mapas) |

## Endpoints/recursos principais

| Recurso | Conteúdo | Formato |
|---|---|---|
| **Mapa Geológico** | Unidades litoestratigráficas | WMS/WFS |
| **Recursos Minerais** | Ocorrências minerais por tipo | WMS/WFS |
| **SIAGAS** | Sistema de Informações de Águas Subterrâneas (poços) | Web/CSV |
| **Carta geológica** | Mapas geológicos por folha | PDF/SHP |
| **Geodiversidade** | Atlas da Geodiversidade | WMS |
| **Áreas de risco** | Setores de risco geológico | WMS/SHP |

## Exemplo de uso

### Acessar mapa geológico via WMS

```python
import requests
from PIL import Image
from io import BytesIO

# WMS do Mapa Geológico do Brasil
url = "https://geosgb.sgb.gov.br/geoserver/wms"
params = {
    "service": "WMS",
    "request": "GetMap",
    "layers": "geologia:unidades_litoestratigraficas",
    "bbox": "-55,-15,-45,-10",
    "width": 800,
    "height": 600,
    "srs": "EPSG:4326",
    "format": "image/png",
}

response = requests.get(url, params=params)
if response.status_code == 200:
    img = Image.open(BytesIO(response.content))
    img.save("mapa_geologico.png")
    print("Mapa geológico salvo")
```

### Consultar poços no SIAGAS

```python
import pandas as pd

# O SIAGAS disponibiliza dados de poços tubulares
# Acesso via: http://siagasweb.sgb.gov.br/layout/
# Os dados podem ser exportados em CSV após consulta

# Exemplo de leitura do CSV exportado
df = pd.read_csv(
    "pocos_siagas.csv",
    sep=";",
    encoding="utf-8",
    dtype=str,
)

print(f"Poços cadastrados: {len(df):,}")
print(f"Colunas: {list(df.columns)}")
```

## Campos disponíveis

### Mapa Geológico

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

## Cruzamentos possíveis

| Cruzamento | Fonte relacionada | Chave de ligação | Finalidade |
|---|---|---|---|
| Geologia x Limites | [IBGE Geociências](/docs/apis/dados-geoespaciais/ibge-geociencias) | Geometria | Caracterizar geologia por município |
| Geologia x Fundiário | [INCRA](/docs/apis/dados-geoespaciais/incra-fundiario) | Geometria | Analisar aptidão geológica de imóveis rurais |
| Geologia x INDE | [INDE](/docs/apis/dados-geoespaciais/inde) | Geometria | Integrar com outras camadas via INDE |

## Limitações conhecidas

| Limitação | Detalhes |
|---|---|
| **Geoserviços instáveis** | Os serviços WMS/WFS do GeoSGB podem apresentar indisponibilidade. |
| **Dados técnicos** | A interpretação dos dados geológicos requer conhecimento especializado em geologia. |
| **Escala variável** | Os mapas geológicos estão disponíveis em diferentes escalas (1:250.000, 1:1.000.000). A cobertura em escala de detalhe não é completa para todo o território. |
| **SIAGAS com interface antiga** | O sistema SIAGAS tem interface web antiga e funcionalidades limitadas de exportação. |
| **Sem API REST moderna** | Não há API REST com endpoints documentados. O acesso é via WMS/WFS ou interface web. |
