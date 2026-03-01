---
title: PRODES — Desmatamento Anual da Amazônia Legal (INPE)
slug: prodes
orgao: INPE
url_base: http://terrabrasilis.dpi.inpe.br/
tipo_acesso: Web Download / API REST
autenticacao: Não requerida
formato_dados: [Shapefile, GeoJSON, CSV]
frequencia_atualizacao: Anual
campos_chave:
  - ano_desmatamento
  - area_km2
  - municipio
  - UF
  - classe_uso
  - coordenadas_poligono
tags:
  - meio ambiente
  - desmatamento
  - PRODES
  - INPE
  - Amazônia Legal
  - floresta
  - sensoriamento remoto
  - satélite
  - TerraBrasilis
cruzamento_com:
  - meio-ambiente/deter
  - meio-ambiente/ibama-infracoes
  - meio-ambiente/car
  - meio-ambiente/unidades-conservacao
  - meio-ambiente/focos-calor
status: documentado
---

# PRODES — Desmatamento Anual da Amazônia Legal (INPE)

## O que é

O **PRODES (Projeto de Monitoramento do Desmatamento na Amazônia Legal por Satélite)** é o sistema oficial do governo brasileiro para medir a **taxa anual de desmatamento por corte raso** na Amazônia Legal. Operado pelo **INPE (Instituto Nacional de Pesquisas Espaciais)** desde 1988, o PRODES é considerado referência mundial em monitoramento florestal por satélite.

O PRODES utiliza imagens dos satélites Landsat (resolução de 30 metros) e similares para mapear incrementos de desmatamento superiores a 6,25 hectares. Os dados são publicados anualmente e incluem:

- **Taxa anual de desmatamento** — área total desmatada por ano (em km²) na Amazônia Legal
- **Incrementos de desmatamento** — polígonos individuais de cada área desmatada
- **Dados por município e UF** — desagregação geográfica completa
- **Série histórica** — dados desde 1988, permitindo análise de tendências de longo prazo

O período de referência do PRODES é de **agosto de um ano a julho do ano seguinte** (chamado "ano PRODES"), coincidindo com a época de menor cobertura de nuvens na Amazônia.

> **PRODES vs DETER:** O PRODES fornece o dado oficial e definitivo de desmatamento anual (resolução de 30m, publicação anual). O [DETER](/docs/apis/meio-ambiente/deter) fornece alertas em tempo quase-real (resolução menor, atualização diária) para apoiar a fiscalização imediata.

**Plataforma principal:** http://terrabrasilis.dpi.inpe.br/

## Como acessar

### Fontes de dados

| Fonte | URL | Formato | Descrição |
|-------|-----|---------|-----------|
| **TerraBrasilis** | `http://terrabrasilis.dpi.inpe.br/` | Shapefile, GeoJSON, CSV | Plataforma oficial de visualização e download dos dados PRODES |
| **TerraBrasilis API** | `http://terrabrasilis.dpi.inpe.br/api/v1/` | JSON | API REST para consultas programáticas |
| **Dados tabulares** | `http://www.obt.inpe.br/OBT/assuntos/programas/amazonia/prodes` | CSV/XLS | Tabelas consolidadas de taxas anuais |
| **Dados Abertos INPE** | `http://terrabrasilis.dpi.inpe.br/downloads/` | Shapefile | Download direto de shapefiles |

### Autenticação

O acesso aos dados é **público e gratuito**, sem necessidade de cadastro ou autenticação.

### TerraBrasilis — Plataforma de acesso

O TerraBrasilis é a plataforma unificada do INPE para acesso aos dados de monitoramento ambiental. Permite:

1. **Visualização de mapas** — mapas interativos com camadas de desmatamento
2. **Download de dados** — shapefiles e dados tabulares
3. **Dashboard** — gráficos e estatísticas pré-calculadas
4. **API** — acesso programático aos dados

## Endpoints/recursos principais

### API TerraBrasilis

| Endpoint | Método | Descrição |
|----------|--------|-----------|
| `/api/v1/deforestation/prodes` | GET | Dados de desmatamento PRODES |
| `/api/v1/deforestation/prodes/rates` | GET | Taxas anuais de desmatamento |
| `/api/v1/deforestation/prodes/increments` | GET | Incrementos individuais de desmatamento |

### Downloads disponíveis

| Recurso | Formato | Descrição |
|---------|---------|-----------|
| **Incrementos anuais** | Shapefile/GeoJSON | Polígonos de desmatamento por ano |
| **Taxas consolidadas** | CSV/XLS | Tabela com taxas anuais por UF e município |
| **Extensão do desmatamento** | Shapefile | Acumulado de todo o desmatamento mapeado |
| **Hidrografia / limites** | Shapefile | Camadas auxiliares (rios, limites estaduais, Amazônia Legal) |

### Parâmetros de consulta

| Parâmetro | Tipo | Descrição |
|-----------|------|-----------|
| `year` | int | Ano PRODES (ex: 2023) |
| `state` | string | Sigla da UF (ex: PA, MT, AM) |
| `municipality` | string | Código IBGE do município |
| `format` | string | Formato de saída (json, csv, shp) |

## Exemplo de uso

### Consultar taxas anuais de desmatamento

```python
import pandas as pd
import requests

# Taxas históricas de desmatamento na Amazônia Legal
# Dados consolidados disponíveis no OBT/INPE
url_taxas = "http://www.obt.inpe.br/OBT/assuntos/programas/amazonia/prodes"

# Alternativamente, os dados tabulares podem ser baixados do TerraBrasilis
# Aqui usamos um CSV previamente baixado
df_taxas = pd.read_csv(
    "prodes_taxas_anuais.csv",
    sep=";",
    encoding="utf-8",
)

print("Taxa anual de desmatamento na Amazônia Legal (km²):")
print(df_taxas[["ano", "taxa_km2"]].tail(10).to_string(index=False))

# Variação percentual ano a ano
df_taxas["variacao_pct"] = df_taxas["taxa_km2"].pct_change() * 100
print("\nVariação percentual:")
print(df_taxas[["ano", "taxa_km2", "variacao_pct"]].tail(10).to_string(index=False))
```

### Carregar e analisar shapefiles PRODES

```python
import geopandas as gpd
import matplotlib.pyplot as plt

# Carregar shapefile de incrementos PRODES
# Baixe de: http://terrabrasilis.dpi.inpe.br/downloads/
gdf_prodes = gpd.read_file("prodes_amazonia_legal_2023.shp")

print(f"Total de polígonos de desmatamento: {len(gdf_prodes):,}")
print(f"Colunas: {list(gdf_prodes.columns)}")
print(f"CRS: {gdf_prodes.crs}")
print(f"Área total desmatada: {gdf_prodes['area_km2'].sum():,.1f} km²")

# Desmatamento por UF
por_uf = (
    gdf_prodes.groupby("uf")["area_km2"]
    .sum()
    .sort_values(ascending=False)
)

print("\nDesmatamento por UF (km²):")
print(por_uf.to_string())
```

### Análise temporal por município

```python
import pandas as pd
import geopandas as gpd

# Carregar dados PRODES de múltiplos anos
anos = range(2019, 2024)
frames = []

for ano in anos:
    gdf = gpd.read_file(f"prodes_{ano}.shp")
    gdf["ano_prodes"] = ano
    frames.append(gdf)

gdf_todos = pd.concat(frames, ignore_index=True)

# Top 10 municípios com maior desmatamento acumulado (2019-2023)
top_municipios = (
    gdf_todos.groupby(["cod_municipio", "municipio", "uf"])["area_km2"]
    .sum()
    .sort_values(ascending=False)
    .head(10)
)

print("Top 10 municípios — desmatamento acumulado 2019-2023 (km²):")
print(top_municipios.to_string())

# Evolução anual dos top 5 municípios
top5_codigos = top_municipios.index.get_level_values("cod_municipio")[:5]
evolucao = (
    gdf_todos[gdf_todos["cod_municipio"].isin(top5_codigos)]
    .groupby(["municipio", "ano_prodes"])["area_km2"]
    .sum()
    .unstack(fill_value=0)
)

print("\nEvolução anual dos 5 maiores desmatadores:")
print(evolucao.to_string())
```

### Acessar dados via API TerraBrasilis

```python
import requests
import pandas as pd

BASE_URL = "http://terrabrasilis.dpi.inpe.br/api/v1"


def consultar_prodes_api(ano: int = None, uf: str = None):
    """
    Consulta dados PRODES via API TerraBrasilis.

    Args:
        ano: Ano PRODES (opcional)
        uf: Sigla da UF (opcional)

    Returns:
        Dados de desmatamento em formato dict
    """
    url = f"{BASE_URL}/deforestation/prodes"
    params = {}
    if ano:
        params["year"] = ano
    if uf:
        params["state"] = uf

    response = requests.get(url, params=params, timeout=60)
    response.raise_for_status()
    return response.json()


# Exemplo: consultar desmatamento no Pará em 2023
dados = consultar_prodes_api(ano=2023, uf="PA")
print(f"Registros retornados: {len(dados)}")
```

## Campos disponíveis

### Incrementos de desmatamento (Shapefile)

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | int | Identificador único do polígono |
| `ano_prodes` | int | Ano PRODES (agosto a julho) |
| `area_km2` | float | Área desmatada em km² |
| `area_ha` | float | Área desmatada em hectares |
| `classe` | string | Classe de uso (desmatamento, hidrografia, nuvem, etc.) |
| `uf` | string | Sigla da UF |
| `cod_municipio` | int | Código IBGE do município |
| `municipio` | string | Nome do município |
| `bioma` | string | Bioma (Amazônia) |
| `geometry` | polygon | Geometria do polígono de desmatamento |
| `satelite` | string | Satélite utilizado na detecção |
| `sensor` | string | Sensor utilizado |

### Taxas anuais consolidadas (CSV)

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `ano` | int | Ano PRODES |
| `taxa_km2` | float | Taxa de desmatamento total na Amazônia Legal (km²) |
| `uf` | string | UF (quando desagregado) |
| `municipio` | string | Município (quando desagregado) |
| `cod_municipio` | int | Código IBGE |

## Cruzamentos possíveis

| Cruzamento | Fonte relacionada | Chave de ligação | Finalidade |
|------------|-------------------|------------------|------------|
| PRODES x DETER | [DETER — Alertas em Tempo Real](/docs/apis/meio-ambiente/deter) | Coordenadas / município | Comparar alertas DETER com confirmação de desmatamento pelo PRODES |
| PRODES x IBAMA | [IBAMA — Infrações](/docs/apis/meio-ambiente/ibama-infracoes) | Coordenadas / município | Verificar se áreas desmatadas resultaram em autuações |
| PRODES x CAR | [CAR — Cadastro Ambiental Rural](/docs/apis/meio-ambiente/car) | Sobreposição espacial | Identificar desmatamento dentro de propriedades rurais cadastradas e suas áreas de preservação |
| PRODES x Unidades de Conservação | [Unidades de Conservação](/docs/apis/meio-ambiente/unidades-conservacao) | Sobreposição espacial | Mapear desmatamento dentro de áreas protegidas |
| PRODES x Focos de calor | [Focos de Calor — INPE](/docs/apis/meio-ambiente/focos-calor) | Coordenadas / município | Correlacionar queimadas com desmatamento posterior |

### Receita: cruzar PRODES com CAR para identificar desmatamento ilegal

```python
import geopandas as gpd

# 1. Carregar polígonos PRODES (incrementos de desmatamento)
gdf_prodes = gpd.read_file("prodes_amazonia_2023.shp")

# 2. Carregar dados do CAR (polígonos de propriedades e reserva legal)
gdf_car_propriedades = gpd.read_file("car_imoveis.shp")
gdf_car_reserva = gpd.read_file("car_reserva_legal.shp")
gdf_car_app = gpd.read_file("car_app.shp")

# 3. Garantir mesmo CRS
gdf_prodes = gdf_prodes.to_crs("EPSG:4674")  # SIRGAS 2000
gdf_car_reserva = gdf_car_reserva.to_crs("EPSG:4674")
gdf_car_app = gdf_car_app.to_crs("EPSG:4674")

# 4. Identificar desmatamento dentro de Reserva Legal
desmat_em_rl = gpd.overlay(gdf_prodes, gdf_car_reserva, how="intersection")
print(f"Polígonos PRODES que incidem sobre Reserva Legal: {len(desmat_em_rl):,}")

area_rl_desmatada = desmat_em_rl.geometry.area.sum() / 1e6  # m² para km²
print(f"Área de Reserva Legal desmatada: {area_rl_desmatada:,.1f} km²")

# 5. Identificar desmatamento dentro de APP
desmat_em_app = gpd.overlay(gdf_prodes, gdf_car_app, how="intersection")
print(f"Polígonos PRODES que incidem sobre APP: {len(desmat_em_app):,}")

area_app_desmatada = desmat_em_app.geometry.area.sum() / 1e6
print(f"Área de APP desmatada: {area_app_desmatada:,.1f} km²")
```

## Limitações conhecidas

| Limitação | Detalhes |
|-----------|----------|
| **Resolução espacial** | O PRODES utiliza imagens de 30m de resolução (Landsat), detectando apenas desmatamentos maiores que 6,25 ha. Desmatamentos menores não são captados. |
| **Frequência anual** | Publicação anual (dado oficial em novembro/dezembro). Para monitoramento em tempo real, utilize o [DETER](/docs/apis/meio-ambiente/deter). |
| **Cobertura de nuvens** | Na estação chuvosa, a cobertura de nuvens pode impedir a detecção em algumas áreas. O INPE utiliza imagens de múltiplas datas para minimizar o problema. |
| **Apenas corte raso** | O PRODES detecta apenas desmatamento por corte raso. Degradação florestal progressiva (extração seletiva de madeira, incêndios rasteiros) não é mapeada pelo PRODES. |
| **Amazônia Legal** | O PRODES cobre apenas a Amazônia Legal. Para Cerrado e outros biomas, existem programas complementares (PRODES Cerrado). |
| **Shapefiles grandes** | Os arquivos shapefile podem ser muito grandes (centenas de MB a vários GB), exigindo ferramentas GIS ou bibliotecas como GeoPandas. |
| **API instável** | A API do TerraBrasilis pode apresentar instabilidade e tempos de resposta longos. Implemente retry com timeout generoso. |
| **Período de referência** | O "ano PRODES" vai de agosto a julho, diferente do ano civil. Ao cruzar com dados anuais de outras fontes, é necessário atentar para esse detalhe. |
