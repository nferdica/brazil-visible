---
title: CAR — Cadastro Ambiental Rural (SICAR/MMA)
slug: car
orgao: SICAR / MMA
url_base: https://www.car.gov.br/
tipo_acesso: Web Download
autenticacao: Não requerida
formato_dados: [Shapefile, CSV]
frequencia_atualizacao: Contínua
campos_chave:
  - codigo_imovel_car
  - CPF_CNPJ
  - municipio
  - UF
  - area_total_ha
  - area_reserva_legal
  - area_app
  - coordenadas_poligono
tags:
  - meio ambiente
  - CAR
  - cadastro ambiental
  - propriedade rural
  - reserva legal
  - APP
  - SICAR
  - georreferenciamento
  - uso do solo
cruzamento_com:
  - meio-ambiente/prodes
  - meio-ambiente/deter
  - meio-ambiente/ibama-infracoes
  - meio-ambiente/unidades-conservacao
  - meio-ambiente/focos-calor
  - receita-federal/cnpj-completa
status: documentado
---

# CAR — Cadastro Ambiental Rural (SICAR/MMA)

## O que é

O **CAR (Cadastro Ambiental Rural)** é um registro público eletrônico, obrigatório para todos os imóveis rurais do Brasil, que integra informações ambientais das propriedades e posses rurais. Instituído pelo **Código Florestal (Lei 12.651/2012)** e gerenciado pelo **SICAR (Sistema Nacional de Cadastro Ambiental Rural)** vinculado ao **MMA (Ministério do Meio Ambiente)**, o CAR é a principal base de dados de uso e cobertura do solo em propriedades rurais no país.

O CAR registra para cada imóvel rural:

- **Identificação do proprietário/possuidor** — CPF ou CNPJ
- **Perímetro e área total** — polígono georreferenciado do imóvel
- **Remanescentes de vegetação nativa** — áreas com cobertura vegetal preservada
- **Reserva Legal (RL)** — área obrigatória de preservação dentro da propriedade (20% a 80%, conforme o bioma)
- **Áreas de Preservação Permanente (APP)** — margens de rios, topos de morro, nascentes
- **Áreas de uso consolidado** — áreas já convertidas para uso agropecuário antes de 22/07/2008
- **Áreas de uso restrito** — áreas com restrições de uso (ex: várzeas, pantanais)

O CAR é fundamental para:

- Monitoramento da conformidade ambiental de propriedades rurais
- Planejamento de recuperação de áreas degradadas
- Cruzamento com dados de desmatamento (PRODES/DETER) para identificar desmatamento ilegal em áreas protegidas
- Rastreamento de cadeias produtivas (soja, gado, madeira) até a propriedade de origem

> **Importância para fiscalização:** O CAR permite vincular alertas de desmatamento (DETER) e dados de multas (IBAMA) a proprietários específicos, sendo peça-chave na cadeia de responsabilização por crimes ambientais.

## Como acessar

### Fontes de dados

| Fonte | URL | Formato | Descrição |
|-------|-----|---------|-----------|
| **SICAR** | `https://www.car.gov.br/publico/imoveis/index` | Shapefile | Download de dados por UF |
| **SICAR — Consulta pública** | `https://www.car.gov.br/publico/imoveis/index` | HTML | Consulta individual de imóveis |
| **Dados Abertos MMA** | `https://dados.gov.br/dados/conjuntos-dados/` (buscar por CAR) | Shapefile, CSV | Dados consolidados |

### Autenticação

O download dos dados geoespaciais **não requer autenticação**. O acesso é público, conforme previsto no Código Florestal.

### Download por UF

O SICAR disponibiliza os dados por unidade da federação. O download inclui shapefiles com os polígonos de cada tipo de área cadastrada:

```bash
# Acessar a página de downloads do SICAR
# https://www.car.gov.br/publico/imoveis/index
# Selecionar a UF desejada e o tipo de dado

# Os arquivos são disponibilizados por UF e incluem:
# - Imóveis rurais (perímetro)
# - Reserva Legal
# - APP
# - Vegetação nativa
# - Uso consolidado
# - Hidrografia
```

### Estrutura dos downloads

```
car_dados_uf/
├── AREA_IMOVEL.shp          # Perímetro dos imóveis rurais
├── RESERVA_LEGAL.shp         # Áreas de Reserva Legal declaradas
├── APP.shp                    # Áreas de Preservação Permanente
├── VEGETACAO_NATIVA.shp       # Remanescentes de vegetação nativa
├── USO_CONSOLIDADO.shp        # Áreas de uso agropecuário consolidado
├── AREA_USO_RESTRITO.shp      # Áreas com restrições de uso
├── SERVIDAO_ADMINISTRATIVA.shp # Servidões administrativas
└── HIDROGRAFIA.shp            # Corpos d'água declarados
```

## Endpoints/recursos principais

### Camadas geoespaciais disponíveis

| Camada | Descrição | Tamanho aprox. (por UF) |
|--------|-----------|------------------------|
| **AREA_IMOVEL** | Polígono do perímetro de cada imóvel rural cadastrado | 100 MB - 2 GB |
| **RESERVA_LEGAL** | Polígonos de Reserva Legal declarada | 50 MB - 1 GB |
| **APP** | Áreas de Preservação Permanente | 50 MB - 500 MB |
| **VEGETACAO_NATIVA** | Remanescentes de vegetação nativa mapeados | 50 MB - 1 GB |
| **USO_CONSOLIDADO** | Áreas de uso agropecuário consolidado | 50 MB - 500 MB |
| **HIDROGRAFIA** | Rede hidrográfica declarada pelo proprietário | 10 MB - 200 MB |

### Consulta pública (Web)

A consulta pública permite buscar imóveis por:

| Parâmetro | Descrição |
|-----------|-----------|
| UF / Município | Localização geográfica |
| Código do imóvel no CAR | Identificador único (ex: PA-1234567-ABCDEF...) |
| CPF/CNPJ do proprietário | Identificação do responsável |

## Exemplo de uso

### Carregar dados do CAR e analisar imóveis rurais

```python
import geopandas as gpd
import pandas as pd

# Carregar shapefile de imóveis rurais de um estado
# Baixe de: https://www.car.gov.br/publico/imoveis/index
gdf_imoveis = gpd.read_file("AREA_IMOVEL_PA.shp")

print(f"Total de imóveis cadastrados: {len(gdf_imoveis):,}")
print(f"Colunas: {list(gdf_imoveis.columns)}")
print(f"CRS: {gdf_imoveis.crs}")

# Distribuição por tamanho de imóvel
gdf_imoveis["area_ha"] = gdf_imoveis.geometry.area / 10_000  # m² para hectares

faixas = pd.cut(
    gdf_imoveis["area_ha"],
    bins=[0, 4, 20, 100, 500, 2500, float("inf")],
    labels=["<4 ha (minifúndio)", "4-20 ha", "20-100 ha", "100-500 ha", "500-2500 ha", ">2500 ha"],
)

print("\nDistribuição de imóveis por faixa de área:")
print(faixas.value_counts().sort_index().to_string())
```

### Verificar conformidade da Reserva Legal

```python
import geopandas as gpd
import pandas as pd

# Carregar imóveis e reserva legal
gdf_imoveis = gpd.read_file("AREA_IMOVEL_PA.shp")
gdf_reserva = gpd.read_file("RESERVA_LEGAL_PA.shp")

# Calcular área dos imóveis e da reserva legal
gdf_imoveis["area_imovel_ha"] = gdf_imoveis.geometry.area / 10_000
gdf_reserva["area_rl_ha"] = gdf_reserva.geometry.area / 10_000

# Agregar reserva legal por imóvel
rl_por_imovel = (
    gdf_reserva.groupby("cod_imovel")["area_rl_ha"]
    .sum()
    .reset_index()
)

# Merge: imóvel + reserva legal
df_check = gdf_imoveis[["cod_imovel", "area_imovel_ha"]].merge(
    rl_por_imovel, on="cod_imovel", how="left"
)

df_check["area_rl_ha"] = df_check["area_rl_ha"].fillna(0)
df_check["pct_rl"] = (df_check["area_rl_ha"] / df_check["area_imovel_ha"]) * 100

# Na Amazônia, a Reserva Legal deve ser >= 80%
LIMITE_RL_AMAZONIA = 80

df_check["conforme"] = df_check["pct_rl"] >= LIMITE_RL_AMAZONIA

print(f"Imóveis analisados: {len(df_check):,}")
print(f"Imóveis com RL >= {LIMITE_RL_AMAZONIA}%: {df_check['conforme'].sum():,}")
print(f"Imóveis com RL < {LIMITE_RL_AMAZONIA}%: {(~df_check['conforme']).sum():,}")
print(f"Imóveis sem RL declarada: {(df_check['area_rl_ha'] == 0).sum():,}")

# Déficit de Reserva Legal
nao_conformes = df_check[~df_check["conforme"]].copy()
nao_conformes["deficit_ha"] = (
    (LIMITE_RL_AMAZONIA / 100) * nao_conformes["area_imovel_ha"]
    - nao_conformes["area_rl_ha"]
)

deficit_total = nao_conformes["deficit_ha"].sum()
print(f"\nDéficit total de Reserva Legal: {deficit_total:,.0f} hectares")
```

### Cruzar CAR com alertas DETER

```python
import geopandas as gpd

# 1. Carregar dados
gdf_car = gpd.read_file("AREA_IMOVEL_PA.shp").to_crs("EPSG:4674")
gdf_deter = gpd.read_file("deter_amazonia_2024.shp").to_crs("EPSG:4674")

# 2. Spatial join: alertas dentro de imóveis do CAR
alertas_no_car = gpd.sjoin(gdf_deter, gdf_car, how="inner", predicate="intersects")

print(f"Total de alertas DETER: {len(gdf_deter):,}")
print(f"Alertas dentro de imóveis CAR: {len(alertas_no_car):,}")
print(f"Imóveis afetados: {alertas_no_car['cod_imovel'].nunique():,}")

# 3. Ranking: imóveis com maior desmatamento recente
ranking = (
    alertas_no_car.groupby("cod_imovel")
    .agg(
        num_alertas=("area_km2", "count"),
        area_alertada_km2=("area_km2", "sum"),
    )
    .sort_values("area_alertada_km2", ascending=False)
    .head(20)
)

print("\nTop 20 imóveis com mais desmatamento recente (DETER):")
print(ranking.to_string())
```

### Analisar sobreposição com Unidades de Conservação

```python
import geopandas as gpd

# Carregar CAR e Unidades de Conservação
gdf_car = gpd.read_file("AREA_IMOVEL_PA.shp").to_crs("EPSG:4674")
gdf_uc = gpd.read_file("unidades_conservacao_icmbio.shp").to_crs("EPSG:4674")

# Identificar imóveis CAR que se sobrepõem a UCs
sobreposicao = gpd.sjoin(gdf_car, gdf_uc, how="inner", predicate="intersects")

print(f"Imóveis CAR sobrepostos a Unidades de Conservação: {len(sobreposicao):,}")
print(f"UCs afetadas: {sobreposicao['nome_uc'].nunique()}")

# Detalhar por tipo de UC
por_tipo_uc = (
    sobreposicao.groupby("tipo_uc")["cod_imovel"]
    .nunique()
    .sort_values(ascending=False)
)

print("\nImóveis sobrepostos por tipo de UC:")
print(por_tipo_uc.to_string())
```

## Campos disponíveis

### Imóveis rurais (AREA_IMOVEL)

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `cod_imovel` | string | Código único do imóvel no SICAR (ex: PA-1500107-ABCDEF...) |
| `nom_imovel` | string | Nome do imóvel rural |
| `municipio` | string | Nome do município |
| `cod_municipio` | int | Código IBGE do município |
| `uf` | string | Sigla da UF |
| `num_area` | float | Área declarada do imóvel (hectares) |
| `ind_status` | string | Status do cadastro (ativo, pendente, cancelado) |
| `ind_tipo` | string | Tipo do cadastro (imóvel rural, assentamento, etc.) |
| `num_modulo_fiscal` | float | Número de módulos fiscais do imóvel |
| `dat_cadastro` | date | Data do cadastro no CAR |
| `dat_retificacao` | date | Data da última retificação |
| `geometry` | polygon | Polígono do perímetro do imóvel |

### Reserva Legal (RESERVA_LEGAL)

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `cod_imovel` | string | Código do imóvel vinculado |
| `num_area` | float | Área da Reserva Legal (hectares) |
| `des_tipo` | string | Tipo (proposta, averbada, aprovada) |
| `geometry` | polygon | Polígono da Reserva Legal |

### APP (Áreas de Preservação Permanente)

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `cod_imovel` | string | Código do imóvel vinculado |
| `num_area` | float | Área da APP (hectares) |
| `des_tipo` | string | Tipo de APP (margem de rio, nascente, topo de morro) |
| `geometry` | polygon | Polígono da APP |

### Vegetação nativa (VEGETACAO_NATIVA)

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `cod_imovel` | string | Código do imóvel vinculado |
| `num_area` | float | Área de vegetação nativa (hectares) |
| `geometry` | polygon | Polígono de vegetação nativa |

## Cruzamentos possíveis

| Cruzamento | Fonte relacionada | Chave de ligação | Finalidade |
|------------|-------------------|------------------|------------|
| CAR x PRODES | [PRODES — Desmatamento Anual](/docs/apis/meio-ambiente/prodes) | Sobreposição espacial | Identificar desmatamento dentro de propriedades cadastradas e quantificar supressão de Reserva Legal |
| CAR x DETER | [DETER — Alertas em Tempo Real](/docs/apis/meio-ambiente/deter) | Sobreposição espacial | Vincular alertas de desmatamento em tempo real a proprietários específicos |
| CAR x IBAMA | [IBAMA — Infrações](/docs/apis/meio-ambiente/ibama-infracoes) | CPF/CNPJ / coordenadas | Verificar se proprietários autuados possuem imóveis cadastrados no CAR |
| CAR x Unidades de Conservação | [Unidades de Conservação](/docs/apis/meio-ambiente/unidades-conservacao) | Sobreposição espacial | Detectar imóveis rurais sobrepostos a áreas de proteção ambiental |
| CAR x Focos de calor | [Focos de Calor — INPE](/docs/apis/meio-ambiente/focos-calor) | Sobreposição espacial | Identificar queimadas dentro de imóveis rurais |
| CAR x CNPJ | [Receita Federal — CNPJ](/docs/apis/receita-federal/cnpj-completa) | `CNPJ` | Identificar sócios e estrutura societária de empresas proprietárias de imóveis rurais |

### Receita: pipeline completo — CAR + DETER + IBAMA

```python
import geopandas as gpd
import pandas as pd

# Este pipeline identifica proprietários com:
# (1) alertas de desmatamento (DETER) dentro de suas propriedades (CAR)
# (2) que já possuem autuações anteriores (IBAMA)

# 1. Carregar dados
gdf_car = gpd.read_file("AREA_IMOVEL_MT.shp").to_crs("EPSG:4674")
gdf_deter = gpd.read_file("deter_amazonia_2024.shp").to_crs("EPSG:4674")
df_ibama = pd.read_csv("IBAMA-auto-infracao.csv", sep=";", encoding="latin-1", dtype=str)

# 2. Cruzamento espacial: alertas DETER em imóveis CAR
alertas_car = gpd.sjoin(gdf_deter, gdf_car, how="inner", predicate="intersects")

# 3. Extrair CPFs/CNPJs dos imóveis com alertas
cpfs_alertados = alertas_car["cpf_cnpj"].dropna().unique()

# 4. Verificar quais desses CPFs/CNPJs possuem autos de infração
df_ibama["cpf_cnpj_limpo"] = (
    df_ibama["cpf_cnpj_infrator"]
    .str.replace(r"[.\-/]", "", regex=True)
)

reincidentes = df_ibama[
    df_ibama["cpf_cnpj_limpo"].isin(cpfs_alertados)
]

print(f"Imóveis com alertas DETER: {alertas_car['cod_imovel'].nunique():,}")
print(f"CPFs/CNPJs com alertas: {len(cpfs_alertados):,}")
print(f"Já autuados pelo IBAMA: {reincidentes['cpf_cnpj_limpo'].nunique():,}")

if not reincidentes.empty:
    print("\nInfratores reincidentes (com alertas DETER + autos IBAMA):")
    resumo = (
        reincidentes.groupby("cpf_cnpj_limpo")
        .agg(
            num_autos=("num_auto_infracao", "count"),
            valor_total=("val_auto_infracao", "first"),
        )
        .sort_values("num_autos", ascending=False)
        .head(10)
    )
    print(resumo.to_string())
```

## Limitações conhecidas

| Limitação | Detalhes |
|-----------|----------|
| **Autodeclaratório** | O CAR é baseado em informações declaradas pelo proprietário, sem verificação em campo obrigatória no momento do cadastro. Pode haver inconsistências nos polígonos e áreas declaradas. |
| **Validação pendente** | Grande parte dos cadastros ainda não passou pela etapa de análise e validação pelos órgãos estaduais. Cadastros pendentes podem conter erros de georreferenciamento. |
| **Sobreposições** | Existem milhões de hectares de sobreposição entre imóveis cadastrados, indicando conflitos fundiários ou erros de cadastro. |
| **Download por UF** | Os dados são disponibilizados por estado, sem API de consulta por coordenada ou município. Para análises nacionais, é necessário baixar e processar 27 conjuntos de dados. |
| **Shapefiles grandes** | Os arquivos shapefile de estados como PA, MT e MA podem ter vários GB, exigindo hardware adequado para processamento. |
| **Sem API REST** | Não há API REST para consulta programática. O acesso é via download de shapefiles ou consulta web individual. |
| **Qualidade do georreferenciamento** | Imóveis menores frequentemente possuem georreferenciamento de baixa precisão, realizado com GPS de navegação em vez de equipamento geodésico. |
| **Áreas de assentamento** | Assentamentos da reforma agrária podem ter cadastro coletivo ou individual, gerando inconsistências na contagem de imóveis. |
| **Dados de proprietário** | Os dados de CPF/CNPJ dos proprietários podem ter acesso restrito por questões de privacidade, dependendo da política do estado. |
| **Atualização variável** | A frequência de atualização varia por estado; alguns atualizam os dados disponíveis com meses de defasagem. |
