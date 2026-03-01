---
title: DETER — Alertas de Desmatamento em Tempo Real (INPE)
slug: deter
orgao: INPE
url_base: http://terrabrasilis.dpi.inpe.br/
tipo_acesso: Web Download / API REST
autenticacao: Não requerida
formato_dados: [Shapefile, GeoJSON, CSV]
frequencia_atualizacao: Diária
campos_chave:
  - data_alerta
  - area_km2
  - municipio
  - UF
  - classe_alerta
  - coordenadas_poligono
tags:
  - meio ambiente
  - desmatamento
  - DETER
  - INPE
  - alertas
  - tempo real
  - Amazônia Legal
  - Cerrado
  - sensoriamento remoto
  - TerraBrasilis
cruzamento_com:
  - meio-ambiente/prodes
  - meio-ambiente/ibama-infracoes
  - meio-ambiente/car
  - meio-ambiente/unidades-conservacao
  - meio-ambiente/focos-calor
status: documentado
---

# DETER — Alertas de Desmatamento em Tempo Real (INPE)

## O que é

O **DETER (Sistema de Detecção de Desmatamento em Tempo Real)** é um sistema de alertas operado pelo **INPE (Instituto Nacional de Pesquisas Espaciais)** que detecta alterações na cobertura florestal em **tempo quase-real**. Diferente do [PRODES](/docs/apis/meio-ambiente/prodes), que fornece o dado oficial anual, o DETER é uma ferramenta de apoio à **fiscalização imediata** do desmatamento.

O sistema utiliza imagens dos satélites CBERS, Amazonia-1 e outros sensores de média resolução para emitir alertas diários de:

- **Desmatamento por corte raso** — remoção completa da vegetação
- **Degradação florestal** — extração seletiva de madeira, incêndios rasteiros
- **Mineração** — atividade garimpeira em área florestal
- **Cicatriz de incêndio** — áreas queimadas em floresta

O DETER cobre dois biomas:

- **DETER Amazônia** — Amazônia Legal (desde 2004)
- **DETER Cerrado** — bioma Cerrado (desde 2018)

Os alertas são enviados diretamente ao IBAMA e aos órgãos estaduais de meio ambiente para orientar ações de fiscalização em campo. Os dados públicos são disponibilizados na plataforma **TerraBrasilis**.

> **DETER vs PRODES:** O DETER é o sistema de alerta rápido (resolução ~60m, atualização diária). O [PRODES](/docs/apis/meio-ambiente/prodes) é o sistema de medição oficial (resolução 30m, publicação anual). O DETER detecta áreas a partir de 3 hectares, enquanto o PRODES mapeia áreas acima de 6,25 ha.

## Como acessar

### Fontes de dados

| Fonte | URL | Formato | Descrição |
|-------|-----|---------|-----------|
| **TerraBrasilis** | `http://terrabrasilis.dpi.inpe.br/` | Shapefile, GeoJSON, CSV | Plataforma oficial de download e visualização |
| **TerraBrasilis API** | `http://terrabrasilis.dpi.inpe.br/api/v1/` | JSON | API REST para consultas programáticas |
| **Dashboard DETER** | `http://terrabrasilis.dpi.inpe.br/app/dashboard/deforestation/biomes/legal_amazon/rates` | HTML | Painel interativo com gráficos e mapas |
| **Download direto** | `http://terrabrasilis.dpi.inpe.br/downloads/` | Shapefile | Shapefiles para download direto |

### Autenticação

O acesso aos dados é **público e gratuito**, sem necessidade de cadastro.

### Periodicidade dos alertas

| Aspecto | Detalhe |
|---------|---------|
| **Frequência de revisita** | Diária (condições atmosféricas permitem) |
| **Resolução espacial** | ~60 metros (CBERS/Amazonia-1) |
| **Área mínima detectada** | 3 hectares |
| **Latência** | Alertas publicados em até 24-48 horas após a passagem do satélite |
| **Cobertura** | Amazônia Legal e Cerrado |

## Endpoints/recursos principais

### API TerraBrasilis

| Endpoint | Método | Descrição |
|----------|--------|-----------|
| `/api/v1/deforestation/deter` | GET | Alertas DETER para Amazônia |
| `/api/v1/deforestation/deter/cerrado` | GET | Alertas DETER para Cerrado |
| `/api/v1/deforestation/deter/alerts` | GET | Alertas recentes (últimos 30 dias) |
| `/api/v1/deforestation/deter/municipality` | GET | Alertas agregados por município |

### Downloads disponíveis

| Recurso | Formato | Descrição |
|---------|---------|-----------|
| **Alertas diários** | Shapefile/GeoJSON | Polígonos de alertas por data |
| **Consolidado mensal** | Shapefile/CSV | Alertas agregados por mês |
| **Consolidado anual** | Shapefile/CSV | Todos os alertas de um ano PRODES |
| **Alertas por município** | CSV | Área alertada por município e período |

### Parâmetros de consulta

| Parâmetro | Tipo | Descrição |
|-----------|------|-----------|
| `startDate` | date | Data inicial do período (YYYY-MM-DD) |
| `endDate` | date | Data final do período (YYYY-MM-DD) |
| `state` | string | Sigla da UF (ex: PA, MT) |
| `municipality` | string | Código IBGE do município |
| `classname` | string | Classe do alerta (desmatamento, degradação, mineração) |

## Exemplo de uso

### Baixar e analisar alertas DETER

```python
import geopandas as gpd
import pandas as pd

# Baixar shapefile de alertas DETER do TerraBrasilis
# Disponível em: http://terrabrasilis.dpi.inpe.br/downloads/
gdf_deter = gpd.read_file("deter_amazonia_legal_2024.shp")

print(f"Total de alertas: {len(gdf_deter):,}")
print(f"Colunas: {list(gdf_deter.columns)}")
print(f"CRS: {gdf_deter.crs}")
print(f"Período: {gdf_deter['date'].min()} a {gdf_deter['date'].max()}")

# Área total alertada
area_total = gdf_deter["area_km2"].sum()
print(f"Área total alertada: {area_total:,.1f} km²")
```

### Análise de alertas por classe e UF

```python
import pandas as pd
import geopandas as gpd

gdf_deter = gpd.read_file("deter_amazonia_legal_2024.shp")

# Alertas por classe (tipo de alteração)
por_classe = (
    gdf_deter.groupby("classname")["area_km2"]
    .agg(["count", "sum"])
    .rename(columns={"count": "num_alertas", "sum": "area_km2"})
    .sort_values("area_km2", ascending=False)
)

print("Alertas DETER por classe:")
print(por_classe.to_string())

# Alertas por UF
por_uf = (
    gdf_deter.groupby("uf")["area_km2"]
    .agg(["count", "sum"])
    .rename(columns={"count": "num_alertas", "sum": "area_km2"})
    .sort_values("area_km2", ascending=False)
)

print("\nAlertas DETER por UF:")
print(por_uf.to_string())

# Top 20 municípios com mais alertas
top_municipios = (
    gdf_deter.groupby(["cod_municipio", "municipio", "uf"])["area_km2"]
    .sum()
    .sort_values(ascending=False)
    .head(20)
)

print("\nTop 20 municípios — maior área alertada:")
print(top_municipios.to_string())
```

### Consultar alertas via API TerraBrasilis

```python
import requests
import pandas as pd

BASE_URL = "http://terrabrasilis.dpi.inpe.br/api/v1"


def consultar_alertas_deter(
    data_inicio: str,
    data_fim: str,
    uf: str = None,
):
    """
    Consulta alertas DETER via API TerraBrasilis.

    Args:
        data_inicio: Data inicial (YYYY-MM-DD)
        data_fim: Data final (YYYY-MM-DD)
        uf: Sigla da UF (opcional)

    Returns:
        Lista de alertas em formato dict
    """
    url = f"{BASE_URL}/deforestation/deter/alerts"
    params = {
        "startDate": data_inicio,
        "endDate": data_fim,
    }
    if uf:
        params["state"] = uf

    response = requests.get(url, params=params, timeout=120)
    response.raise_for_status()
    return response.json()


# Consultar alertas no Pará nos últimos 30 dias
alertas = consultar_alertas_deter(
    data_inicio="2024-01-01",
    data_fim="2024-01-31",
    uf="PA",
)

print(f"Alertas retornados: {len(alertas)}")
if alertas:
    df = pd.DataFrame(alertas)
    print(f"Área total alertada: {df['area_km2'].sum():,.1f} km²")
```

### Monitoramento temporal — série mensal de alertas

```python
import pandas as pd
import geopandas as gpd

gdf_deter = gpd.read_file("deter_amazonia_legal_2024.shp")
gdf_deter["date"] = pd.to_datetime(gdf_deter["date"])
gdf_deter["mes"] = gdf_deter["date"].dt.to_period("M")

# Série mensal de alertas
serie_mensal = (
    gdf_deter.groupby("mes")
    .agg(
        num_alertas=("area_km2", "count"),
        area_total_km2=("area_km2", "sum"),
    )
)

print("Série mensal de alertas DETER:")
print(serie_mensal.to_string())

# Identificar meses com pico de desmatamento
media = serie_mensal["area_total_km2"].mean()
desvio = serie_mensal["area_total_km2"].std()

picos = serie_mensal[serie_mensal["area_total_km2"] > media + desvio]
print(f"\nMeses com alertas acima da média + 1 desvio ({media + desvio:,.1f} km²):")
print(picos.to_string())
```

## Campos disponíveis

### Alertas DETER (Shapefile)

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | int | Identificador único do alerta |
| `date` | date | Data de detecção do alerta |
| `classname` | string | Classe do alerta: DESMATAMENTO_CR (corte raso), DEGRADACAO, MINERACAO, CICATRIZ_DE_QUEIMADA |
| `area_km2` | float | Área do polígono em km² |
| `area_ha` | float | Área do polígono em hectares |
| `uf` | string | Sigla da UF |
| `cod_municipio` | int | Código IBGE do município |
| `municipio` | string | Nome do município |
| `bioma` | string | Bioma (Amazônia ou Cerrado) |
| `satelite` | string | Satélite utilizado na detecção |
| `sensor` | string | Sensor do satélite |
| `orbita` | string | Órbita/ponto da imagem |
| `geometry` | polygon | Geometria do polígono de alerta |

### Classes de alerta

| Classe | Descrição |
|--------|-----------|
| `DESMATAMENTO_CR` | Corte raso — remoção completa da cobertura florestal |
| `DEGRADACAO` | Degradação florestal — extração seletiva, incêndio rasteiro |
| `MINERACAO` | Atividade de mineração em área florestal |
| `CICATRIZ_DE_QUEIMADA` | Área com cicatriz de incêndio florestal |
| `CS_DESORDENADO` | Corte seletivo desordenado |
| `CS_GEOMETRICO` | Corte seletivo geométrico (padrão de exploração madeireira) |

## Cruzamentos possíveis

| Cruzamento | Fonte relacionada | Chave de ligação | Finalidade |
|------------|-------------------|------------------|------------|
| DETER x PRODES | [PRODES — Desmatamento Anual](/docs/apis/meio-ambiente/prodes) | Coordenadas / município | Validar quais alertas DETER se confirmam como desmatamento no PRODES |
| DETER x IBAMA | [IBAMA — Infrações](/docs/apis/meio-ambiente/ibama-infracoes) | Coordenadas / município | Verificar se alertas DETER resultaram em operações de fiscalização |
| DETER x CAR | [CAR — Cadastro Ambiental Rural](/docs/apis/meio-ambiente/car) | Sobreposição espacial | Identificar alertas dentro de propriedades rurais e determinar o responsável |
| DETER x Unidades de Conservação | [Unidades de Conservação](/docs/apis/meio-ambiente/unidades-conservacao) | Sobreposição espacial | Identificar alertas dentro de áreas protegidas federais |
| DETER x Focos de calor | [Focos de Calor — INPE](/docs/apis/meio-ambiente/focos-calor) | Coordenadas / data | Correlacionar focos de incêndio com alertas de degradação florestal |

### Receita: cruzar alertas DETER com propriedades do CAR

```python
import geopandas as gpd
import pandas as pd

# 1. Carregar alertas DETER recentes
gdf_deter = gpd.read_file("deter_amazonia_2024.shp")
gdf_deter = gdf_deter.to_crs("EPSG:4674")  # SIRGAS 2000

# 2. Carregar polígonos do CAR (imóveis rurais)
gdf_car = gpd.read_file("car_imoveis_pa.shp")  # Ex: imóveis do Pará
gdf_car = gdf_car.to_crs("EPSG:4674")

# 3. Spatial join: alertas DETER dentro de imóveis do CAR
alertas_em_car = gpd.sjoin(gdf_deter, gdf_car, how="inner", predicate="within")

print(f"Alertas DETER dentro de imóveis do CAR: {len(alertas_em_car):,}")
print(f"Imóveis afetados: {alertas_em_car['cod_imovel'].nunique():,}")

# 4. Ranking de imóveis com maior área de alertas
ranking = (
    alertas_em_car.groupby(["cod_imovel", "nom_imovel"])["area_km2"]
    .sum()
    .sort_values(ascending=False)
    .head(20)
)

print("\nTop 20 imóveis CAR com maior área de alertas DETER:")
print(ranking.to_string())

# 5. Identificar alertas dentro de Reserva Legal
gdf_rl = gpd.read_file("car_reserva_legal_pa.shp").to_crs("EPSG:4674")
alertas_em_rl = gpd.sjoin(gdf_deter, gdf_rl, how="inner", predicate="intersects")

print(f"\nAlertas DETER que incidem sobre Reserva Legal: {len(alertas_em_rl):,}")
```

## Limitações conhecidas

| Limitação | Detalhes |
|-----------|----------|
| **Resolução espacial** | O DETER usa imagens de ~60m de resolução, inferior ao PRODES (30m). Polígonos podem ter contornos menos precisos. |
| **Área mínima** | Detecta apenas alterações acima de 3 hectares. Desmatamentos menores não são captados. |
| **Cobertura de nuvens** | Nas regiões equatoriais, a cobertura de nuvens persistente pode impedir a detecção por semanas ou meses, gerando lacunas nos alertas. |
| **Não é dado oficial** | O DETER é um sistema de alerta para apoio à fiscalização, não um dado oficial de desmatamento. O dado oficial é o PRODES. |
| **Sobre-estimação** | Devido à menor resolução, os polígonos DETER podem incluir áreas não desmatadas, levando a sobre-estimação da área real afetada. |
| **Latência variável** | Embora a meta seja 24-48h, condições atmosféricas e processamento podem causar atrasos maiores. |
| **API instável** | A API do TerraBrasilis pode apresentar timeout e indisponibilidade. Recomenda-se usar os downloads de shapefile para análises de grande volume. |
| **Classificação** | A classificação das classes de alerta (corte raso vs degradação vs mineração) tem margem de erro; a validação em campo é necessária para confirmação. |
| **Cobertura temporal** | O DETER Cerrado começou apenas em 2018, tendo série histórica menor que o DETER Amazônia (2004). |
