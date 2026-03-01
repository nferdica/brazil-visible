---
title: IBGE Geociências — Limites Territoriais e Malhas Digitais
slug: ibge-geociencias
orgao: IBGE
url_base: https://servicodados.ibge.gov.br/api/v3/malhas/
tipo_acesso: API REST
autenticacao: Não requerida
formato_dados: [GeoJSON, TopoJSON, SVG, SHP]
frequencia_atualizacao: Anual
campos_chave:
  - codigo_municipio
  - nome_municipio
  - codigo_uf
  - area_km2
  - geometry
tags:
  - IBGE
  - geociências
  - malhas digitais
  - limites territoriais
  - shapefiles
  - GeoJSON
  - municípios
  - estados
  - cartografia
cruzamento_com:
  - ibge-estatisticas/censo-demografico
  - ibge-estatisticas/pib-municipal
  - dados-geoespaciais/inde
  - infraestrutura-transportes/dnit-malha-rodoviaria
status: documentado
---

# IBGE Geociências — Limites Territoriais e Malhas Digitais

## O que é

O **IBGE Geociências** disponibiliza as malhas digitais oficiais do Brasil, incluindo limites territoriais de todas as unidades político-administrativas. Esses dados são a referência oficial para:

- **Limites municipais** — polígonos de todos os 5.570 municípios
- **Limites estaduais** — contornos de todas as 27 UFs
- **Grandes regiões** — Norte, Nordeste, Sudeste, Sul, Centro-Oeste
- **Mesorregiões e microrregiões** — divisões geográficas intermediárias
- **Regiões metropolitanas** — agrupamentos de municípios
- **Setores censitários** — menor unidade territorial do Censo
- **Biomas** — Amazônia, Cerrado, Mata Atlântica, Caatinga, Pampa, Pantanal
- **Regiões imediatas e intermediárias** — nova divisão regional do IBGE (2017)

O IBGE oferece uma **API REST** para servir as malhas em formatos GeoJSON, TopoJSON e SVG, além de disponibilizar shapefiles completos para download.

## Como acessar

| Item | Detalhe |
|---|---|
| **API de Malhas** | `https://servicodados.ibge.gov.br/api/v3/malhas/` |
| **Downloads** | `https://www.ibge.gov.br/geociencias/organizacao-do-territorio/malhas-territoriais.html` |
| **Portal de Mapas** | `https://portaldemapas.ibge.gov.br/` |
| **Autenticação** | Não requerida |
| **Formatos** | GeoJSON, TopoJSON, SVG, SHP |
| **CORS** | Habilitado |

### Estrutura da API de Malhas

```
https://servicodados.ibge.gov.br/api/v3/malhas/{id}?formato={formato}&resolucao={resolucao}&intrarregiao={nivel}
```

Parâmetros:
- `{id}` — código IBGE (país, UF, município)
- `formato` — `application/vnd.geo+json`, `application/json` (TopoJSON), `image/svg+xml`
- `resolucao` — `0` (menor), `1`, `2`, `3`, `4`, `5` (maior detalhamento)
- `intrarregiao` — nível de subdivisão (`UF`, `mesorregiao`, `microrregiao`, `municipio`)

## Endpoints/recursos principais

### API de Malhas

| Endpoint | Descrição |
|---|---|
| `/paises/BR` | Contorno do Brasil |
| `/estados` | Malha de todos os estados |
| `/estados/{uf}` | Contorno de uma UF |
| `/estados/{uf}?intrarregiao=municipio` | Municípios de uma UF |
| `/municipios/{cod}` | Contorno de um município |
| `/paises/BR?intrarregiao=UF` | Brasil dividido por UF |

### API de Localidades

| Endpoint | Descrição |
|---|---|
| `/api/v1/localidades/estados` | Lista de UFs com nome e sigla |
| `/api/v1/localidades/municipios` | Lista de todos os municípios |
| `/api/v1/localidades/distritos` | Lista de distritos |

### Downloads (Shapefiles)

| Recurso | Conteúdo |
|---|---|
| Malha municipal | Shapefiles dos limites de todos os municípios |
| Malha estadual | Shapefiles dos limites de todas as UFs |
| Setores censitários | Shapefiles dos setores (disponível após cada Censo) |
| Faces de logradouro | Eixos viários georreferenciados |

## Exemplo de uso

### Obter malha de um estado via API

```python
import requests
import json

# Malha de São Paulo dividida por municípios
url = (
    "https://servicodados.ibge.gov.br/api/v3/malhas/estados/35"
    "?formato=application/vnd.geo+json&resolucao=2&intrarregiao=municipio"
)

response = requests.get(url)
response.raise_for_status()
geojson = response.json()

print(f"Tipo: {geojson['type']}")
print(f"Municípios: {len(geojson['features'])}")

# Salvar como arquivo GeoJSON
with open("sp_municipios.geojson", "w") as f:
    json.dump(geojson, f)

print("GeoJSON salvo em sp_municipios.geojson")
```

### Mapa coroplético com GeoPandas

```python
import geopandas as gpd
import pandas as pd
import matplotlib.pyplot as plt

# Carregar malha de municípios de uma UF
url = (
    "https://servicodados.ibge.gov.br/api/v3/malhas/estados/35"
    "?formato=application/vnd.geo+json&resolucao=2&intrarregiao=municipio"
)

gdf = gpd.read_file(url)
print(f"Municípios carregados: {len(gdf)}")

# Exemplo: mapa simples
fig, ax = plt.subplots(figsize=(10, 12))
gdf.plot(ax=ax, edgecolor="gray", facecolor="lightblue", linewidth=0.3)
ax.set_title("Municípios de São Paulo")
ax.set_axis_off()
plt.tight_layout()
plt.savefig("mapa_sp.png", dpi=150)
```

### Listar todos os municípios

```python
import requests
import pandas as pd

# API de Localidades — todos os municípios
url = "https://servicodados.ibge.gov.br/api/v1/localidades/municipios"

response = requests.get(url)
response.raise_for_status()
municipios = response.json()

df = pd.DataFrame([
    {
        "id": m["id"],
        "nome": m["nome"],
        "uf": m["microrregiao"]["mesorregiao"]["UF"]["sigla"],
    }
    for m in municipios
])

print(f"Total de municípios: {len(df):,}")
print(f"\nMunicípios por UF:")
print(df["uf"].value_counts().head())
```

## Campos disponíveis

### GeoJSON (Malha de municípios)

| Campo | Tipo | Descrição |
|---|---|---|
| `codarea` | string | Código IBGE do município (7 dígitos) |
| `geometry` | Polygon/MultiPolygon | Geometria do município |

### API de Localidades (Municípios)

| Campo | Tipo | Descrição |
|---|---|---|
| `id` | int | Código IBGE (7 dígitos) |
| `nome` | string | Nome do município |
| `microrregiao.id` | int | Código da microrregião |
| `microrregiao.mesorregiao.UF.id` | int | Código da UF |
| `microrregiao.mesorregiao.UF.sigla` | string | Sigla da UF |

## Cruzamentos possíveis

| Cruzamento | Fonte relacionada | Chave de ligação | Finalidade |
|---|---|---|---|
| Malha x Censo | [Censo Demográfico](/docs/apis/ibge-estatisticas/censo-demografico) | `codigo_municipio` | Criar mapas coropléticos de indicadores populacionais |
| Malha x PIB | [PIB Municipal](/docs/apis/ibge-estatisticas/pib-municipal) | `codigo_municipio` | Visualizar distribuição espacial do PIB |
| Malha x Rodovias | [DNIT Malha Rodoviária](/docs/apis/infraestrutura-transportes/dnit-malha-rodoviaria) | Geometria | Sobrepor malha rodoviária aos limites municipais |
| Malha x INDE | [INDE](/docs/apis/dados-geoespaciais/inde) | Geometria | Integrar com dados espaciais de outras fontes via INDE |

## Limitações conhecidas

| Limitação | Detalhes |
|---|---|
| **Resolução vs. performance** | Malhas com alta resolução (resolução=5) geram arquivos grandes e requisições lentas. Para mapas web, use resolução 1-2. |
| **GeoJSON grande** | A malha completa do Brasil por município em GeoJSON pode ter dezenas de MB. Para visualizações web, use TopoJSON (menor). |
| **Setores censitários não na API** | Os setores censitários (menor unidade) estão disponíveis apenas como shapefiles para download, não via API. |
| **Mudanças de limites** | Limites municipais podem mudar quando municípios são criados ou desmembrados. Verificar a edição da malha correspondente ao ano de análise. |
| **Projeção cartográfica** | As malhas usam o sistema de referência SIRGAS 2000 (EPSG:4674). Para cálculos de área e distância, pode ser necessário reprojetar. |
