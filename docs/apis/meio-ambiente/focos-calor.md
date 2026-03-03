---
title: Focos de Calor / Queimadas — INPE (BDQUEIMADAS)
slug: focos-calor
orgao: INPE
url_base: https://terrabrasilis.dpi.inpe.br/queimadas/bdqueimadas/
tipo_acesso: API REST / CSV Download
autenticacao: Não requerida
formato_dados: [CSV, JSON, Shapefile, KML]
frequencia_atualizacao: Diária (tempo real)
campos_chave:
  - data_hora_gmt
  - latitude
  - longitude
  - satelite
  - municipio
  - UF
  - bioma
  - FRP
tags:
  - meio ambiente
  - queimadas
  - focos de calor
  - incêndio
  - INPE
  - BDQUEIMADAS
  - satélite
  - tempo real
  - fogo
  - monitoramento
cruzamento_com:
  - meio-ambiente/prodes
  - meio-ambiente/deter
  - meio-ambiente/ibama-infracoes
  - meio-ambiente/car
  - meio-ambiente/unidades-conservacao
  - meio-ambiente/recursos-hidricos
status: documentado
---

# Focos de Calor / Queimadas — INPE (BDQUEIMADAS)

## O que é

O **Programa Queimadas** do **INPE (Instituto Nacional de Pesquisas Espaciais)** opera o sistema de monitoramento de **focos de calor** por satélite em todo o território brasileiro e na América do Sul. O sistema detecta pontos de calor anômalo na superfície terrestre utilizando sensores infravermelhos a bordo de múltiplos satélites, sendo o principal indicador de ocorrência de incêndios florestais e queimadas.

O sistema está disponível através do **BDQUEIMADAS (Banco de Dados de Queimadas)**, que consolida:

- **Focos de calor em tempo real** — detecções atualizadas a cada passagem de satélite (várias vezes ao dia)
- **Série histórica** — dados desde 1998, com mais de 20 anos de registros
- **Múltiplos satélites** — dados de AQUA, TERRA, NOAA, GOES, NPP-SUOMI, entre outros
- **Cobertura continental** — monitoramento de todo o Brasil e América do Sul

Cada foco de calor representa um pixel de satélite (1 km x 1 km no satélite de referência AQUA/MODIS) onde foi detectada temperatura anormalmente elevada, indicando possível ocorrência de fogo. O sistema detecta tanto incêndios florestais quanto queimadas agrícolas.

O satélite de **referência** para a série histórica é o **AQUA** (sensor MODIS, passagem às 13h30 e 01h30), garantindo consistência temporal para análises de tendência.

> **Importância:** Os dados de focos de calor são utilizados pelo IBAMA, Corpo de Bombeiros e órgãos estaduais para coordenar combate a incêndios e são insumo fundamental para análises de desmatamento (queimadas frequentemente precedem ou acompanham o desmatamento).

## Como acessar

### Fontes de dados

| Fonte | URL | Formato | Descrição |
|-------|-----|---------|-----------|
| **BDQUEIMADAS** | `https://terrabrasilis.dpi.inpe.br/queimadas/bdqueimadas` | CSV, Shapefile | Portal principal de consulta e download |
| **API BDQUEIMADAS** | `https://terrabrasilis.dpi.inpe.br/queimadas/bdqueimadas/api/` | JSON, CSV | API para consultas programáticas |
| **Dados abertos** | `https://dataserver-coids.inpe.br/queimadas/` | CSV | Servidor de dados para download direto |
| **Painel de monitoramento** | `https://terrabrasilis.dpi.inpe.br/queimadas/portal` | HTML | Dashboard interativo com mapas e gráficos |
| **FIRMS/NASA** | `https://firms.modaps.eosdis.nasa.gov/` | CSV, SHP | Dados globais (inclui Brasil) — alternativa internacional |

### Autenticação

O acesso aos dados é **público e gratuito**, sem necessidade de cadastro.

### Download direto

```bash
# Focos de calor do último mês (satélite de referência AQUA)
wget "https://dataserver-coids.inpe.br/queimadas/queimadas/focos/csv/mensal/Brasil/focos_mensal_br_202401.csv"

# Focos de calor do ano completo
wget "https://dataserver-coids.inpe.br/queimadas/queimadas/focos/csv/anual/Brasil/focos_anual_br_2024.csv"

# Dados diários
wget "https://dataserver-coids.inpe.br/queimadas/queimadas/focos/csv/diario/Brasil/focos_diario_br_20240115.csv"
```

## Endpoints/recursos principais

### API BDQUEIMADAS

| Endpoint | Método | Descrição |
|----------|--------|-----------|
| `/api/focos` | GET | Consulta focos de calor com filtros |
| `/api/focos/count` | GET | Contagem de focos por período e região |
| `/api/satelites` | GET | Lista de satélites disponíveis |
| `/api/paises` | GET | Lista de países com cobertura |

### Parâmetros de consulta

| Parâmetro | Tipo | Descrição |
|-----------|------|-----------|
| `dataInicial` | date | Data inicial (YYYY-MM-DD) |
| `dataFinal` | date | Data final (YYYY-MM-DD) |
| `pais` | string | País (ex: Brazil) |
| `estado` | string | Sigla da UF |
| `municipio` | string | Nome do município |
| `bioma` | string | Bioma (Amazônia, Cerrado, Mata Atlântica, etc.) |
| `satelite` | string | Satélite (AQUA_M-T, TERRA_M-T, NPP-375, GOES-16, etc.) |
| `formato` | string | Formato de saída (csv, json, shp, kml) |

### Downloads disponíveis

| Recurso | Periodicidade | Descrição |
|---------|---------------|-----------|
| **Diário** | Atualizado a cada passagem de satélite | Focos detectados nas últimas 24/48h |
| **Mensal** | Consolidado mensal | Todos os focos de um mês |
| **Anual** | Consolidado anual | Todos os focos de um ano |
| **Histórico** | Desde 1998 | Arquivo completo da série histórica |
| **Por bioma** | Variável | Focos filtrados por bioma |

## Exemplo de uso

### Baixar e analisar focos de calor

```python
import pandas as pd

# Baixar dados de focos de calor (CSV mensal)
url = "https://dataserver-coids.inpe.br/queimadas/queimadas/focos/csv/mensal/Brasil/focos_mensal_br_202408.csv"

df_focos = pd.read_csv(url, encoding="latin-1")

print(f"Total de focos de calor: {len(df_focos):,}")
print(f"Colunas: {list(df_focos.columns)}")
print(f"Período: {df_focos['data_hora_gmt'].min()} a {df_focos['data_hora_gmt'].max()}")

# Focos por bioma
por_bioma = df_focos["bioma"].value_counts()
print("\nFocos de calor por bioma:")
print(por_bioma.to_string())

# Focos por UF
por_uf = df_focos["estado"].value_counts().head(10)
print("\nTop 10 UFs com mais focos:")
print(por_uf.to_string())
```

### Análise temporal — série mensal de focos

```python
import pandas as pd

# Carregar dados anuais
df_focos = pd.read_csv(
    "focos_anual_br_2024.csv",
    encoding="latin-1",
    parse_dates=["data_hora_gmt"],
)

# Filtrar apenas satélite de referência (AQUA) para consistência
df_aqua = df_focos[df_focos["satelite"] == "AQUA_M-T"].copy()

# Série diária de focos
df_aqua["data"] = df_aqua["data_hora_gmt"].dt.date
serie_diaria = df_aqua.groupby("data").size()

print("Série diária de focos (AQUA):")
print(f"  Mínimo: {serie_diaria.min():,} focos/dia")
print(f"  Máximo: {serie_diaria.max():,} focos/dia")
print(f"  Média: {serie_diaria.mean():,.0f} focos/dia")

# Série mensal
df_aqua["mes"] = df_aqua["data_hora_gmt"].dt.to_period("M")
serie_mensal = df_aqua.groupby("mes").size()

print("\nSérie mensal de focos (AQUA):")
print(serie_mensal.to_string())
```

### Consultar focos via API

```python
import requests
import pandas as pd

BASE_URL = "https://terrabrasilis.dpi.inpe.br/queimadas/bdqueimadas/api"


def consultar_focos(
    data_inicial: str,
    data_final: str,
    estado: str = None,
    bioma: str = None,
    satelite: str = "AQUA_M-T",
):
    """
    Consulta focos de calor via API BDQUEIMADAS.

    Args:
        data_inicial: Data inicial (YYYY-MM-DD)
        data_final: Data final (YYYY-MM-DD)
        estado: Sigla da UF (opcional)
        bioma: Nome do bioma (opcional)
        satelite: Nome do satélite (padrão: AQUA_M-T)

    Returns:
        DataFrame com focos de calor
    """
    url = f"{BASE_URL}/focos"
    params = {
        "dataInicial": data_inicial,
        "dataFinal": data_final,
        "pais": "Brazil",
        "satelite": satelite,
    }
    if estado:
        params["estado"] = estado
    if bioma:
        params["bioma"] = bioma

    response = requests.get(url, params=params, timeout=120)
    response.raise_for_status()
    return pd.DataFrame(response.json())


# Exemplo: focos na Amazônia em agosto/2024
df = consultar_focos(
    data_inicial="2024-08-01",
    data_final="2024-08-31",
    bioma="Amazônia",
)

print(f"Focos na Amazônia em agosto/2024: {len(df):,}")
```

### Análise espacial — focos de calor e unidades de conservação

```python
import geopandas as gpd
import pandas as pd

# 1. Carregar focos de calor como GeoDataFrame
df_focos = pd.read_csv("focos_anual_br_2024.csv", encoding="latin-1")
gdf_focos = gpd.GeoDataFrame(
    df_focos,
    geometry=gpd.points_from_xy(df_focos["longitude"], df_focos["latitude"]),
    crs="EPSG:4326",
)

# 2. Carregar unidades de conservação
gdf_ucs = gpd.read_file("unidades_conservacao_federais.shp").to_crs("EPSG:4326")

# 3. Identificar focos dentro de UCs
focos_em_uc = gpd.sjoin(gdf_focos, gdf_ucs, how="inner", predicate="within")

print(f"Total de focos: {len(gdf_focos):,}")
print(f"Focos dentro de UCs federais: {len(focos_em_uc):,}")
print(f"UCs afetadas: {focos_em_uc['nome_uc'].nunique()}")

# Ranking de UCs com mais focos
ranking = (
    focos_em_uc.groupby(["nome_uc", "categManej"])
    .size()
    .sort_values(ascending=False)
    .head(20)
    .rename("num_focos")
)

print("\nTop 20 UCs com mais focos de calor:")
print(ranking.to_string())
```

### Comparar focos entre anos (sazonalidade)

```python
import pandas as pd

# Carregar dados de múltiplos anos
frames = []
for ano in range(2020, 2025):
    df = pd.read_csv(
        f"focos_anual_br_{ano}.csv",
        encoding="latin-1",
        parse_dates=["data_hora_gmt"],
    )
    df["ano"] = ano
    frames.append(df)

df_todos = pd.concat(frames, ignore_index=True)

# Filtrar satélite de referência
df_aqua = df_todos[df_todos["satelite"] == "AQUA_M-T"].copy()
df_aqua["mes"] = df_aqua["data_hora_gmt"].dt.month

# Média mensal por ano
tabela = pd.pivot_table(
    df_aqua,
    index="mes",
    columns="ano",
    aggfunc="size",
    fill_value=0,
)

print("Focos de calor por mês e ano (AQUA):")
print(tabela.to_string())

# Calcular anomalia em relação à média histórica
tabela["media_historica"] = tabela.mean(axis=1)
for ano in range(2020, 2025):
    tabela[f"anomalia_{ano}"] = (
        (tabela[ano] - tabela["media_historica"]) / tabela["media_historica"] * 100
    ).round(1)

print("\nAnomalia percentual por mês:")
colunas_anomalia = [c for c in tabela.columns if "anomalia" in str(c)]
print(tabela[colunas_anomalia].to_string())
```

## Campos disponíveis

### Focos de calor (CSV)

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | int | Identificador único do foco |
| `latitude` | float | Latitude do foco (graus decimais) |
| `longitude` | float | Longitude do foco (graus decimais) |
| `data_hora_gmt` | datetime | Data e hora da detecção (UTC/GMT) |
| `satelite` | string | Nome do satélite (AQUA_M-T, TERRA_M-T, NPP-375, GOES-16, etc.) |
| `municipio` | string | Nome do município |
| `estado` | string | Sigla da UF |
| `pais` | string | País |
| `bioma` | string | Bioma (Amazônia, Cerrado, Mata Atlântica, Caatinga, Pampa, Pantanal) |
| `FRP` | float | Fire Radiative Power — potência radiativa do fogo (MW) |
| `risco_fogo` | float | Índice de risco de fogo (0 a 1) |
| `precipitacao` | float | Precipitação estimada na região (mm) |
| `dias_sem_chuva` | int | Número de dias consecutivos sem chuva |
| `numero_dias_sem_chuva` | int | Dias sem precipitação significativa |

### Satélites disponíveis

| Satélite | Sensor | Resolução | Passagens/dia | Observação |
|----------|--------|-----------|---------------|------------|
| **AQUA** | MODIS | 1 km | 2 | **Satélite de referência** para a série histórica |
| **TERRA** | MODIS | 1 km | 2 | Complementar ao AQUA |
| **NPP-SUOMI** | VIIRS | 375 m | 2 | Maior resolução espacial |
| **NOAA-20** | VIIRS | 375 m | 2 | Complementar ao NPP |
| **GOES-16** | ABI | 2 km | Contínuo | Satélite geoestacionário — detecção a cada 10-15 min |
| **MSG** | SEVIRI | 3 km | Contínuo | Cobertura sobre o Atlântico e leste do Brasil |

## Cruzamentos possíveis

| Cruzamento | Fonte relacionada | Chave de ligação | Finalidade |
|------------|-------------------|------------------|------------|
| Focos x PRODES | [PRODES — Desmatamento Anual](/docs/apis/meio-ambiente/prodes) | Coordenadas / município | Correlacionar queimadas com desmatamento confirmado |
| Focos x DETER | [DETER — Alertas em Tempo Real](/docs/apis/meio-ambiente/deter) | Coordenadas / data | Verificar se focos de calor coincidem com alertas de desmatamento |
| Focos x IBAMA | [IBAMA — Infrações](/docs/apis/meio-ambiente/ibama-infracoes) | Coordenadas / município | Verificar se queimadas resultaram em autuações |
| Focos x CAR | [CAR — Cadastro Ambiental Rural](/docs/apis/meio-ambiente/car) | Sobreposição espacial | Identificar queimadas dentro de propriedades rurais e vincular a proprietários |
| Focos x UCs | [Unidades de Conservação](/docs/apis/meio-ambiente/unidades-conservacao) | Sobreposição espacial | Monitorar incêndios dentro de áreas protegidas |
| Focos x Recursos hídricos | [Recursos Hídricos — ANA](/docs/apis/meio-ambiente/recursos-hidricos) | Coordenadas / bacia | Avaliar impacto de queimadas sobre bacias hidrográficas |

### Receita: pipeline de monitoramento de queimadas em propriedades rurais

```python
import pandas as pd
import geopandas as gpd

# Pipeline: focos de calor -> propriedades CAR -> verificar infrações IBAMA

# 1. Carregar focos recentes
df_focos = pd.read_csv("focos_diario_br_20240815.csv", encoding="latin-1")
gdf_focos = gpd.GeoDataFrame(
    df_focos,
    geometry=gpd.points_from_xy(df_focos["longitude"], df_focos["latitude"]),
    crs="EPSG:4326",
).to_crs("EPSG:4674")

# Filtrar Amazônia Legal
gdf_focos_amz = gdf_focos[gdf_focos["bioma"] == "Amazônia"]

# 2. Carregar imóveis do CAR
gdf_car = gpd.read_file("AREA_IMOVEL_PA.shp").to_crs("EPSG:4674")

# 3. Identificar focos dentro de propriedades
focos_no_car = gpd.sjoin(gdf_focos_amz, gdf_car, how="inner", predicate="within")

print(f"Focos na Amazônia: {len(gdf_focos_amz):,}")
print(f"Focos dentro de imóveis CAR: {len(focos_no_car):,}")
print(f"Propriedades com focos: {focos_no_car['cod_imovel'].nunique():,}")

# 4. Verificar se proprietários possuem infrações IBAMA
df_ibama = pd.read_csv("IBAMA-auto-infracao.csv", sep=";", encoding="latin-1", dtype=str)

cpfs_com_focos = focos_no_car["cpf_cnpj"].dropna().unique()
infratores_reincidentes = df_ibama[
    df_ibama["cpf_cnpj_infrator"].isin(cpfs_com_focos)
]

print(f"\nProprietários com focos que já possuem infrações IBAMA: "
      f"{infratores_reincidentes['cpf_cnpj_infrator'].nunique():,}")
```

## Limitações conhecidas

| Limitação | Detalhes |
|-----------|----------|
| **Resolução espacial** | O satélite de referência (AQUA/MODIS) tem resolução de 1 km. Um foco não representa necessariamente 1 km² de área queimada — pode ser uma queimada pontual detectada dentro de um pixel. |
| **Falsos positivos** | Superfícies altamente refletivas (telhados metálicos, mineração) e processos industriais podem gerar detecções falsas, especialmente em áreas urbanas. |
| **Cobertura de nuvens** | Nuvens densas impedem a detecção de focos. Em períodos chuvosos, o número de focos pode ser subestimado. |
| **Passagem do satélite** | O AQUA passa sobre cada ponto apenas duas vezes ao dia. Incêndios que ocorrem e se extinguem entre passagens não são detectados. |
| **Comparação entre satélites** | Satélites diferentes possuem resoluções, horários e sensibilidades distintas. Análises temporais devem usar sempre o mesmo satélite de referência (AQUA). |
| **FRP variável** | O Fire Radiative Power (FRP) é influenciado por ângulo de visada, cobertura de nuvens parcial e tipo de vegetação, dificultando comparações diretas. |
| **Queimadas controladas** | O sistema não distingue entre queimadas ilegais e queimadas controladas autorizadas (ex: manejo agrícola em áreas permitidas). |
| **Download de séries longas** | Downloads de séries históricas longas (vários anos, todo o Brasil) geram arquivos muito grandes. Recomenda-se filtrar por período, estado ou bioma. |
| **Período noturno** | Focos detectados à noite (passagem noturna do satélite) podem ter menor precisão de localização. |
