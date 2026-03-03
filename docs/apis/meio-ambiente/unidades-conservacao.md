---
title: Unidades de Conservação — ICMBio
slug: unidades-conservacao
orgao: ICMBio
url_base: https://www.gov.br/icmbio/
tipo_acesso: Web Download / WFS
autenticacao: Não requerida
formato_dados: [Shapefile, GeoJSON, CSV, KML]
frequencia_atualizacao: Mensal
campos_chave:
  - codigo_uc
  - nome_uc
  - categoria_manejo
  - esfera_administrativa
  - area_ha
  - UF
  - coordenadas_poligono
tags:
  - meio ambiente
  - unidades de conservação
  - ICMBio
  - áreas protegidas
  - parques nacionais
  - reservas biológicas
  - SNUC
  - biodiversidade
  - geoespacial
cruzamento_com:
  - meio-ambiente/prodes
  - meio-ambiente/deter
  - meio-ambiente/ibama-infracoes
  - meio-ambiente/car
  - meio-ambiente/focos-calor
  - meio-ambiente/recursos-hidricos
status: documentado
---

# Unidades de Conservação — ICMBio

## O que é

As **Unidades de Conservação (UCs)** são áreas naturais protegidas, instituídas pelo poder público, que integram o **SNUC (Sistema Nacional de Unidades de Conservação da Natureza)**, regulado pela Lei 9.985/2000. O **ICMBio (Instituto Chico Mendes de Conservação da Biodiversidade)** é o órgão responsável pela gestão das UCs federais.

O Brasil possui mais de **2.600 unidades de conservação** nos três níveis (federal, estadual e municipal), cobrindo cerca de **18% do território terrestre** e **26% do território marinho**. As UCs se dividem em dois grandes grupos:

### Proteção Integral (uso indireto)

| Categoria | Sigla | Descrição |
|-----------|-------|-----------|
| Estação Ecológica | ESEC | Pesquisa científica e educação ambiental |
| Reserva Biológica | REBIO | Preservação integral da biota |
| Parque Nacional | PARNA | Preservação, pesquisa e turismo ecológico |
| Monumento Natural | MONAT | Preservação de sítios naturais raros |
| Refúgio de Vida Silvestre | RVS | Proteção de ambientes para reprodução de espécies |

### Uso Sustentável (uso direto)

| Categoria | Sigla | Descrição |
|-----------|-------|-----------|
| Área de Proteção Ambiental | APA | Uso sustentável com ocupação humana |
| Área de Relevante Interesse Ecológico | ARIE | Proteção de ecossistemas em pequenas áreas |
| Floresta Nacional | FLONA | Uso sustentável de recursos florestais |
| Reserva Extrativista | RESEX | Exploração sustentável por populações tradicionais |
| Reserva de Fauna | REFAU | Estudos técnico-científicos sobre fauna |
| Reserva de Desenvolvimento Sustentável | RDS | Populações tradicionais com exploração sustentável |
| Reserva Particular do Patrimônio Natural | RPPN | Conservação voluntária em propriedade privada |

Os dados geoespaciais das UCs (limites, áreas, categorias) são disponibilizados pelo ICMBio e pelo MMA para download público.

## Como acessar

### Fontes de dados

| Fonte | URL | Formato | Descrição |
|-------|-----|---------|-----------|
| **ICMBio — Dados abertos** | `https://www.gov.br/icmbio/pt-br/acesso-a-informacao/dados-abertos` | Shapefile, CSV | Limites das UCs federais |
| **MMA — CNUC** | `https://dados.mma.gov.br/dataset/unidadesdeconservacao` | Shapefile, CSV | Cadastro Nacional de UCs (federal, estadual, municipal) |
| **i3Geo / GeoServer MMA** | `https://geoserver.mma.gov.br/` | WFS/WMS | Serviço de mapas para acesso programático |
| **MapBiomas** | `https://mapbiomas.org/` | GeoTIFF, Shapefile | Dados complementares de uso e cobertura do solo em UCs |

### Autenticação

O acesso aos dados é **público e gratuito**, sem necessidade de cadastro.

### Download dos dados

```bash
# Shapefile das UCs federais (ICMBio)
wget "https://www.gov.br/icmbio/pt-br/acesso-a-informacao/dados-abertos/unidades-de-conservacao-federais.zip"

# Shapefile do CNUC — todas as UCs (federal, estadual, municipal)
# Disponível no site do MMA
```

### Acesso via WFS (Web Feature Service)

```bash
# Exemplo de requisição WFS ao GeoServer do MMA
curl "https://geoserver.mma.gov.br/geoserver/wfs?service=WFS&version=2.0.0&request=GetFeature&typeName=unidades_conservacao&outputFormat=application/json&count=10"
```

## Endpoints/recursos principais

### Camadas disponíveis

| Camada | Descrição | Registros aprox. |
|--------|-----------|------------------|
| **UCs Federais** | Unidades de conservação geridas pelo ICMBio | ~340 UCs |
| **UCs Estaduais** | Unidades de conservação geridas pelos estados | ~900 UCs |
| **UCs Municipais** | Unidades de conservação geridas pelos municípios | ~400 UCs |
| **RPPNs** | Reservas particulares do patrimônio natural | ~700 RPPNs |
| **Zonas de Amortecimento** | Áreas de entorno das UCs de proteção integral | Variável |

### WFS — Parâmetros de consulta

| Parâmetro | Tipo | Descrição |
|-----------|------|-----------|
| `typeName` | string | Nome da camada (ex: `unidades_conservacao`) |
| `CQL_FILTER` | string | Filtro CQL (ex: `categManej='Parque Nacional'`) |
| `outputFormat` | string | Formato de saída (`application/json`, `shape-zip`) |
| `count` | int | Número máximo de feições retornadas |
| `BBOX` | string | Bounding box para filtro espacial |

## Exemplo de uso

### Carregar e analisar unidades de conservação

```python
import geopandas as gpd
import pandas as pd

# Carregar shapefile de UCs federais
gdf_ucs = gpd.read_file("unidades_conservacao_federais.shp")

print(f"Total de UCs federais: {len(gdf_ucs):,}")
print(f"Colunas: {list(gdf_ucs.columns)}")
print(f"CRS: {gdf_ucs.crs}")

# Área total protegida
gdf_ucs["area_ha"] = gdf_ucs.geometry.area / 10_000
area_total = gdf_ucs["area_ha"].sum()
print(f"Área total protegida: {area_total:,.0f} ha ({area_total / 100:,.0f} km²)")

# UCs por grupo (Proteção Integral vs Uso Sustentável)
por_grupo = (
    gdf_ucs.groupby("grupo")
    .agg(
        quantidade=("nome_uc", "count"),
        area_total_ha=("area_ha", "sum"),
    )
)

print("\nUCs por grupo:")
print(por_grupo.to_string())
```

### Análise por categoria de manejo

```python
import geopandas as gpd

gdf_ucs = gpd.read_file("unidades_conservacao_federais.shp")
gdf_ucs["area_ha"] = gdf_ucs.geometry.area / 10_000

# UCs por categoria
por_categoria = (
    gdf_ucs.groupby("categManej")
    .agg(
        quantidade=("nome_uc", "count"),
        area_total_ha=("area_ha", "sum"),
    )
    .sort_values("area_total_ha", ascending=False)
)

print("UCs federais por categoria de manejo:")
print(por_categoria.to_string())

# Top 10 maiores UCs
top10 = (
    gdf_ucs.nlargest(10, "area_ha")[["nome_uc", "categManej", "uf", "area_ha"]]
)

print("\nTop 10 maiores UCs federais:")
print(top10.to_string(index=False))
```

### Acessar dados via WFS

```python
import geopandas as gpd
import requests

# Consultar UCs via Web Feature Service (WFS)
WFS_URL = "https://geoserver.mma.gov.br/geoserver/wfs"


def consultar_ucs_wfs(
    categoria: str = None,
    uf: str = None,
    limite: int = 100,
) -> gpd.GeoDataFrame:
    """
    Consulta unidades de conservação via WFS do MMA.

    Args:
        categoria: Categoria de manejo (ex: 'Parque Nacional')
        uf: Sigla da UF
        limite: Número máximo de resultados

    Returns:
        GeoDataFrame com as UCs encontradas
    """
    params = {
        "service": "WFS",
        "version": "2.0.0",
        "request": "GetFeature",
        "typeName": "unidades_conservacao",
        "outputFormat": "application/json",
        "count": limite,
    }

    filtros = []
    if categoria:
        filtros.append(f"categManej='{categoria}'")
    if uf:
        filtros.append(f"uf='{uf}'")

    if filtros:
        params["CQL_FILTER"] = " AND ".join(filtros)

    response = requests.get(WFS_URL, params=params, timeout=60)
    response.raise_for_status()

    return gpd.read_file(response.text, driver="GeoJSON") if response.text else gpd.GeoDataFrame()


# Exemplo: buscar parques nacionais no Pará
parques_pa = consultar_ucs_wfs(categoria="Parque Nacional", uf="PA")
print(f"Parques Nacionais no PA: {len(parques_pa)}")
if not parques_pa.empty:
    print(parques_pa[["nome_uc", "area_ha"]].to_string(index=False))
```

### Identificar desmatamento dentro de UCs

```python
import geopandas as gpd

# 1. Carregar UCs e dados PRODES
gdf_ucs = gpd.read_file("unidades_conservacao_federais.shp").to_crs("EPSG:4674")
gdf_prodes = gpd.read_file("prodes_amazonia_2023.shp").to_crs("EPSG:4674")

# 2. Filtrar apenas UCs de Proteção Integral
ucs_pi = gdf_ucs[gdf_ucs["grupo"] == "Proteção Integral"]

# 3. Identificar desmatamento dentro de UCs de Proteção Integral
desmat_em_uc = gpd.sjoin(gdf_prodes, ucs_pi, how="inner", predicate="intersects")

print(f"Polígonos PRODES dentro de UCs de Proteção Integral: {len(desmat_em_uc):,}")
print(f"UCs afetadas: {desmat_em_uc['nome_uc'].nunique()}")

# Ranking de UCs com mais desmatamento
ranking_ucs = (
    desmat_em_uc.groupby(["nome_uc", "categManej"])["area_km2"]
    .sum()
    .sort_values(ascending=False)
    .head(15)
)

print("\nTop 15 UCs de Proteção Integral com mais desmatamento PRODES:")
print(ranking_ucs.to_string())
```

## Campos disponíveis

### Unidades de Conservação (Shapefile)

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `codigoCnuc` | string | Código único no Cadastro Nacional de UCs |
| `nome_uc` | string | Nome da unidade de conservação |
| `categManej` | string | Categoria de manejo (Parque Nacional, RESEX, APA, etc.) |
| `grupo` | string | Grupo: Proteção Integral ou Uso Sustentável |
| `esfera` | string | Esfera administrativa: federal, estadual ou municipal |
| `uf` | string | UF(s) onde a UC está localizada |
| `municipios` | string | Municípios abrangidos |
| `biomaIBGE` | string | Bioma predominante (Amazônia, Cerrado, Mata Atlântica, etc.) |
| `area_ha` | float | Área oficial da UC em hectares |
| `ato_legal` | string | Ato legal de criação (decreto, lei) |
| `dt_criacao` | date | Data de criação da UC |
| `plano_manejo` | string | Se possui plano de manejo aprovado (sim/não) |
| `conselho` | string | Tipo de conselho gestor (consultivo/deliberativo) |
| `geometry` | polygon/multipolygon | Limites geográficos da UC |

### Campos adicionais (CNUC)

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `qualidade` | string | Qualidade do dado espacial (boa, regular, baixa) |
| `visitacao` | string | Se permite visitação pública |
| `populacao` | string | Presença de população residente |
| `zona_amortecimento` | string | Se possui zona de amortecimento definida |

## Cruzamentos possíveis

| Cruzamento | Fonte relacionada | Chave de ligação | Finalidade |
|------------|-------------------|------------------|------------|
| UCs x PRODES | [PRODES — Desmatamento Anual](/docs/apis/meio-ambiente/prodes) | Sobreposição espacial | Quantificar desmatamento dentro de áreas protegidas |
| UCs x DETER | [DETER — Alertas em Tempo Real](/docs/apis/meio-ambiente/deter) | Sobreposição espacial | Monitorar alertas de desmatamento em tempo real dentro de UCs |
| UCs x IBAMA | [IBAMA — Infrações](/docs/apis/meio-ambiente/ibama-infracoes) | Coordenadas geográficas | Mapear autuações ambientais dentro de UCs |
| UCs x CAR | [CAR — Cadastro Ambiental Rural](/docs/apis/meio-ambiente/car) | Sobreposição espacial | Identificar imóveis rurais sobrepostos a áreas protegidas |
| UCs x Focos de calor | [Focos de Calor — INPE](/docs/apis/meio-ambiente/focos-calor) | Coordenadas geográficas | Monitorar incêndios dentro de unidades de conservação |
| UCs x Recursos hídricos | [Recursos Hídricos — ANA](/docs/apis/meio-ambiente/recursos-hidricos) | Sobreposição espacial / bacia | Analisar mananciais hídricos dentro de UCs |

### Receita: monitorar desmatamento e queimadas em UCs

```python
import geopandas as gpd
import pandas as pd

# Monitoramento integrado: desmatamento + queimadas em UCs

# 1. Carregar dados
gdf_ucs = gpd.read_file("unidades_conservacao_federais.shp").to_crs("EPSG:4674")
gdf_deter = gpd.read_file("deter_amazonia_2024.shp").to_crs("EPSG:4674")
gdf_focos = gpd.read_file("focos_calor_2024.shp").to_crs("EPSG:4674")

# 2. Alertas DETER dentro de UCs
alertas_uc = gpd.sjoin(gdf_deter, gdf_ucs, how="inner", predicate="intersects")

# 3. Focos de calor dentro de UCs
focos_uc = gpd.sjoin(gdf_focos, gdf_ucs, how="inner", predicate="within")

# 4. Resumo por UC
resumo_deter = (
    alertas_uc.groupby("nome_uc")["area_km2"]
    .sum()
    .rename("area_desmatada_km2")
)

resumo_focos = (
    focos_uc.groupby("nome_uc")
    .size()
    .rename("num_focos_calor")
)

resumo = pd.concat([resumo_deter, resumo_focos], axis=1).fillna(0)
resumo = resumo.sort_values("area_desmatada_km2", ascending=False)

print("UCs com alertas de desmatamento e focos de calor:")
print(resumo.head(20).to_string())
```

## Limitações conhecidas

| Limitação | Detalhes |
|-----------|----------|
| **Completude do CNUC** | O Cadastro Nacional de UCs pode não estar completamente atualizado, especialmente para UCs estaduais e municipais recém-criadas. |
| **Qualidade dos limites** | A precisão dos polígonos varia: UCs mais antigas podem ter limites com georreferenciamento de baixa qualidade. |
| **Zonas de amortecimento** | Nem todas as UCs possuem zonas de amortecimento definidas e georreferenciadas nos dados disponíveis. |
| **UCs sobrepostas** | Existem UCs de diferentes categorias e esferas que se sobrepõem parcialmente, exigindo tratamento cuidadoso em análises de área. |
| **WFS instável** | O serviço WFS do MMA (`https://geoserver.mma.gov.br/`) pode apresentar lentidão e timeout, especialmente para consultas grandes. Recomenda-se o download do shapefile completo. Note que o servico WFS pode ter migrado para `https://geoservicos.inde.gov.br/geoserver/ICMBio/ows` — verifique a disponibilidade antes de integrar. |
| **Dados de gestão** | Informações detalhadas de gestão (orçamento, pessoal, infraestrutura) não estão disponíveis nos dados geoespaciais e requerem consulta direta ao ICMBio. |
| **RPPNs** | As RPPNs (reservas privadas) podem ter atualização menos frequente que as UCs públicas. |
| **Mosaicos e corredores** | Informações sobre mosaicos de UCs e corredores ecológicos podem não estar totalmente representadas nos dados padrão. |
