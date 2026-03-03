---
title: IBAMA — Autos de Infração e Embargos Ambientais
slug: ibama-infracoes
orgao: IBAMA
url_base: https://servicos.ibama.gov.br/
tipo_acesso: CSV Download / API REST
autenticacao: Não requerida
formato_dados: [CSV, JSON]
frequencia_atualizacao: Diária
campos_chave:
  - numero_auto_infracao
  - CPF_CNPJ
  - municipio
  - UF
  - tipo_infracao
  - valor_multa
  - data_auto
  - area_embargada
tags:
  - meio ambiente
  - IBAMA
  - multas ambientais
  - autos de infração
  - embargos
  - desmatamento
  - DOF
  - fiscalização ambiental
  - crimes ambientais
cruzamento_com:
  - meio-ambiente/prodes
  - meio-ambiente/deter
  - meio-ambiente/car
  - meio-ambiente/unidades-conservacao
  - receita-federal/cnpj-completa
  - transparencia-cgu/ceis
status: documentado
---

# IBAMA — Autos de Infração e Embargos Ambientais

## O que é

O **IBAMA (Instituto Brasileiro do Meio Ambiente e dos Recursos Naturais Renováveis)** disponibiliza dados abertos sobre a fiscalização ambiental no Brasil, incluindo três conjuntos de dados principais:

- **Autos de Infração** — registros de multas aplicadas por infrações ambientais (desmatamento ilegal, poluição, fauna silvestre, pesca irregular, etc.)
- **Áreas Embargadas** — polígonos e coordenadas de áreas onde atividades econômicas foram proibidas por degradação ambiental
- **DOF (Documento de Origem Florestal)** — registros de transporte de produtos de origem florestal, permitindo rastrear a cadeia de custódia da madeira

Esses dados são fundamentais para:

- Monitoramento da aplicação da legislação ambiental
- Identificação de infratores reincidentes
- Cruzamento com dados de desmatamento (PRODES/DETER) para verificar efetividade da fiscalização
- Rastreamento de empresas envolvidas em crimes ambientais
- Verificação de conformidade de propriedades rurais cadastradas no CAR

> **Dados abertos:** Os conjuntos de dados estão disponíveis em https://dados.gov.br/dados/conjuntos-dados/ (buscar por "IBAMA") e no portal de serviços do IBAMA em https://servicos.ibama.gov.br/.

## Como acessar

### Fontes de dados

| Fonte | URL | Formato | Descrição |
|-------|-----|---------|-----------|
| **Dados Abertos (CSV)** | `https://dados.gov.br/dados/conjuntos-dados/` | CSV | Autos de infração, embargos e DOF em formato tabular |
| **Serviços IBAMA** | `https://servicos.ibama.gov.br/` | JSON/CSV | Portal de consulta e download de dados de fiscalização |
| **Consulta pública** | `https://servicos.ibama.gov.br/ctf/publico/areasembargadas/ConsultaPublicaAreasEmbargadas.php` | HTML/CSV | Consulta de áreas embargadas por CPF/CNPJ ou município |

### Autenticação

O acesso aos dados abertos **não requer autenticação**. Os arquivos CSV estão disponíveis para download direto.

### Download dos dados

Os arquivos são publicados no portal de dados abertos do governo federal e atualizados diariamente:

```bash
# Autos de infração (arquivo ZIP; o link exato pode mudar — consulte dados.gov.br)
wget "https://dadosabertos.ibama.gov.br/dados/SIFISC/auto_infracao/auto_infracao/auto_infracao_csv.zip"
unzip auto_infracao_csv.zip

# Áreas embargadas
# NOTA: o caminho de download pode variar. Consulte a página do dataset para
# obter o link atualizado:
# https://dadosabertos.ibama.gov.br/dataset/fiscalizacao-auto-de-infracao
wget "https://dadosabertos.ibama.gov.br/dados/IBAMA-areas-embargadas.csv"
```

## Endpoints/recursos principais

### Conjuntos de dados disponíveis

| Conjunto | Descrição | Registros aprox. |
|----------|-----------|------------------|
| **Autos de Infração** | Multas ambientais aplicadas pelo IBAMA em todo o Brasil | ~400 mil registros |
| **Áreas Embargadas** | Áreas com atividades econômicas suspensas por infração ambiental | ~10 mil registros |
| **DOF — Documento de Origem Florestal** | Registros de transporte de produtos florestais | Variável |
| **Apreensões** | Bens apreendidos em operações de fiscalização | Variável |

### Consulta de áreas embargadas (Web)

A consulta pública de áreas embargadas permite buscar por:

| Parâmetro | Descrição |
|-----------|-----------|
| CPF/CNPJ | Identificação do autuado |
| Município | Nome do município |
| UF | Unidade da Federação |
| Número do auto | Número do auto de infração vinculado |

## Exemplo de uso

### Carregar e analisar autos de infração

```python
import pandas as pd
import zipfile
import io

# O arquivo de autos de infração é distribuído em formato ZIP.
# Faça o download e descompacte antes de carregar:
#   wget "https://dadosabertos.ibama.gov.br/dados/SIFISC/auto_infracao/auto_infracao/auto_infracao_csv.zip"
#   unzip auto_infracao_csv.zip
#
# Ou descompacte diretamente no Python:
# with zipfile.ZipFile("auto_infracao_csv.zip") as zf:
#     csv_name = zf.namelist()[0]
#     with zf.open(csv_name) as f:
#         df_autos = pd.read_csv(f, sep=";", encoding="latin-1", dtype=str, low_memory=False)

df_autos = pd.read_csv(
    "auto_infracao.csv",  # arquivo descompactado
    sep=";",
    encoding="latin-1",
    dtype=str,
    low_memory=False,
)

print(f"Total de autos de infração: {len(df_autos):,}")
print(f"Colunas disponíveis: {list(df_autos.columns)}")
print(df_autos.head())
```

### Análise de multas por UF e tipo de infração

```python
import pandas as pd

# Converter valor da multa para numérico
df_autos["valor_multa"] = (
    df_autos["val_auto_infracao"]
    .str.replace(".", "", regex=False)
    .str.replace(",", ".", regex=False)
    .astype(float)
)

# Total de multas por UF
multas_por_uf = (
    df_autos.groupby("des_uf")
    .agg(
        quantidade=("num_auto_infracao", "count"),
        valor_total=("valor_multa", "sum"),
    )
    .sort_values("valor_total", ascending=False)
)

print("Multas ambientais por UF (maiores valores):")
print(multas_por_uf.head(10).to_string())

# Tipos de infração mais frequentes
tipos_infracao = (
    df_autos["des_tipo_infracao"]
    .value_counts()
    .head(10)
)

print("\nTipos de infração mais frequentes:")
print(tipos_infracao.to_string())
```

### Cruzar autos de infração com áreas embargadas

```python
import pandas as pd

# Carregar áreas embargadas
# NOTA: o caminho de download pode variar. Consulte o dataset em:
# https://dadosabertos.ibama.gov.br/dataset/fiscalizacao-auto-de-infracao
url_embargos = "https://dadosabertos.ibama.gov.br/dados/IBAMA-areas-embargadas.csv"

df_embargos = pd.read_csv(
    url_embargos,
    sep=";",
    encoding="latin-1",
    dtype=str,
)

# Cruzar autos de infração com áreas embargadas
# Identificar infratores que possuem áreas embargadas
cruzamento = pd.merge(
    df_autos,
    df_embargos,
    left_on="cpf_cnpj_infrator",
    right_on="cpf_cnpj_embargado",
    how="inner",
    suffixes=("_auto", "_embargo"),
)

print(f"Infratores com áreas embargadas: {cruzamento['cpf_cnpj_infrator'].nunique():,}")
print(f"Total de registros cruzados: {len(cruzamento):,}")

# Identificar reincidentes (múltiplos autos + embargo)
reincidentes = (
    cruzamento.groupby("cpf_cnpj_infrator")
    .agg(
        num_autos=("num_auto_infracao_auto", "nunique"),
        num_embargos=("num_auto_infracao_embargo", "nunique"),
    )
    .query("num_autos > 1")
    .sort_values("num_autos", ascending=False)
)

print(f"\nInfratores reincidentes com embargos: {len(reincidentes):,}")
print(reincidentes.head(10))
```

### Verificar se empresa está vinculada a infrações ambientais

```python
def verificar_infracoes_empresa(cnpj: str, df_autos: pd.DataFrame) -> pd.DataFrame:
    """
    Verifica se uma empresa possui autos de infração no IBAMA.

    Args:
        cnpj: CNPJ da empresa (apenas números)
        df_autos: DataFrame com autos de infração

    Returns:
        DataFrame com as infrações encontradas
    """
    # Normalizar CNPJ (remover formatação)
    cnpj_limpo = cnpj.replace(".", "").replace("/", "").replace("-", "")

    resultado = df_autos[
        df_autos["cpf_cnpj_infrator"].str.replace(r"[.\-/]", "", regex=True)
        == cnpj_limpo
    ]

    if len(resultado) > 0:
        print(f"ALERTA: Empresa {cnpj} possui {len(resultado)} auto(s) de infração!")
        for _, row in resultado.iterrows():
            print(f"  Auto: {row.get('num_auto_infracao', 'N/A')}")
            print(f"  Tipo: {row.get('des_tipo_infracao', 'N/A')}")
            print(f"  Valor: R$ {row.get('val_auto_infracao', 'N/A')}")
            print(f"  Data: {row.get('dat_auto_infracao', 'N/A')}")
            print(f"  Município: {row.get('des_municipio', 'N/A')}/{row.get('des_uf', 'N/A')}")
            print()
    else:
        print(f"Empresa {cnpj} não possui autos de infração no IBAMA.")

    return resultado


# Exemplo de uso
verificar_infracoes_empresa("00000000000191", df_autos)
```

## Campos disponíveis

### Autos de Infração

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `num_auto_infracao` | string | Número do auto de infração |
| `ser_auto_infracao` | string | Série do auto |
| `dat_auto_infracao` | date | Data da lavratura do auto |
| `dat_ciencia_autuacao` | date | Data de ciência pelo autuado |
| `cpf_cnpj_infrator` | string | CPF ou CNPJ do infrator |
| `nom_infrator` | string | Nome ou razão social do infrator |
| `des_tipo_infracao` | string | Tipo da infração (flora, fauna, poluição, etc.) |
| `des_infracao` | string | Descrição detalhada da infração |
| `val_auto_infracao` | decimal | Valor da multa aplicada (R$) |
| `des_municipio` | string | Município da infração |
| `des_uf` | string | UF da infração |
| `cod_municipio` | int | Código IBGE do município |
| `num_latitude` | float | Latitude do local da infração |
| `num_longitude` | float | Longitude do local da infração |
| `des_situacao_debito` | string | Situação do débito (pendente, pago, inscrito em dívida ativa) |
| `des_enquadramento` | string | Enquadramento legal da infração |

### Áreas Embargadas

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `num_auto_infracao` | string | Número do auto vinculado |
| `cpf_cnpj_embargado` | string | CPF/CNPJ do responsável |
| `nom_embargado` | string | Nome do embargado |
| `des_municipio` | string | Município da área embargada |
| `des_uf` | string | UF |
| `dat_embargo` | date | Data do embargo |
| `dat_desembargo` | date | Data do desembargo (se houver) |
| `qtd_area_embargada` | float | Área embargada em hectares |
| `num_latitude` | float | Latitude |
| `num_longitude` | float | Longitude |
| `des_situacao` | string | Situação do embargo (ativo/desembargado) |

## Cruzamentos possíveis

| Cruzamento | Fonte relacionada | Chave de ligação | Finalidade |
|------------|-------------------|------------------|------------|
| Infrações x PRODES | [PRODES — Desmatamento Anual](/docs/apis/meio-ambiente/prodes) | Coordenadas geográficas / município | Correlacionar multas com taxas de desmatamento anual por município |
| Infrações x DETER | [DETER — Alertas em Tempo Real](/docs/apis/meio-ambiente/deter) | Coordenadas geográficas / município | Verificar se alertas de desmatamento resultaram em autuações |
| Infrações x CAR | [CAR — Cadastro Ambiental Rural](/docs/apis/meio-ambiente/car) | CPF/CNPJ / coordenadas | Identificar propriedades rurais cadastradas que possuem infrações ambientais |
| Infrações x Unidades de Conservação | [Unidades de Conservação — ICMBio](/docs/apis/meio-ambiente/unidades-conservacao) | Coordenadas geográficas | Mapear infrações dentro de unidades de conservação |
| Infrações x CNPJ | [Receita Federal — CNPJ](/docs/apis/receita-federal/cnpj-completa) | `CNPJ` | Identificar sócios e quadro societário de empresas autuadas |
| Infrações x CEIS | [CEIS — Empresas Inidôneas](/docs/apis/transparencia-cgu/ceis) | `CNPJ` | Verificar se empresas autuadas também constam em cadastros de sanções |
| Infrações x Focos de calor | [Focos de Calor — INPE](/docs/apis/meio-ambiente/focos-calor) | Coordenadas geográficas / município | Correlacionar queimadas detectadas por satélite com autuações |

### Receita: cruzar infrações IBAMA com desmatamento PRODES

```python
import pandas as pd
import geopandas as gpd
from shapely.geometry import Point

# 1. Carregar autos de infração do IBAMA (arquivo descompactado do ZIP)
df_autos = pd.read_csv(
    "auto_infracao.csv",
    sep=";",
    encoding="latin-1",
    dtype=str,
)

# Filtrar infrações de flora (desmatamento)
df_flora = df_autos[df_autos["des_tipo_infracao"].str.contains("Flora", na=False)].copy()
df_flora["num_latitude"] = pd.to_numeric(df_flora["num_latitude"], errors="coerce")
df_flora["num_longitude"] = pd.to_numeric(df_flora["num_longitude"], errors="coerce")
df_flora = df_flora.dropna(subset=["num_latitude", "num_longitude"])

# Converter para GeoDataFrame
gdf_autos = gpd.GeoDataFrame(
    df_flora,
    geometry=gpd.points_from_xy(df_flora["num_longitude"], df_flora["num_latitude"]),
    crs="EPSG:4326",
)

# 2. Carregar polígonos de desmatamento PRODES (shapefile)
gdf_prodes = gpd.read_file("prodes_amazonia_2023.shp")

# 3. Spatial join: identificar autos dentro de áreas desmatadas
cruzamento = gpd.sjoin(gdf_autos, gdf_prodes, how="inner", predicate="within")

print(f"Autos de infração dentro de áreas PRODES: {len(cruzamento):,}")
print(f"Municípios afetados: {cruzamento['des_municipio'].nunique()}")
```

## Limitações conhecidas

| Limitação | Detalhes |
|-----------|----------|
| **URLs de download instáveis** | Os links diretos para os arquivos CSV podem mudar sem aviso prévio. Sempre verifique a URL atual em `dados.gov.br`. |
| **Encoding e separador** | Os arquivos CSV utilizam encoding Latin-1 e separador `;`. É necessário especificar esses parâmetros ao importar. |
| **Coordenadas ausentes** | Nem todos os autos de infração possuem coordenadas geográficas preenchidas, limitando análises espaciais. |
| **Valores de multa** | O campo de valor usa formato brasileiro (vírgula decimal, ponto milhar). Requer tratamento antes de operações numéricas. |
| **Situação processual** | Os dados refletem o auto lavrado, mas não necessariamente a decisão final (o auto pode ser anulado em recurso administrativo). |
| **Sem API REST formal** | Não há API REST documentada com endpoints estruturados. O acesso é via download de arquivos CSV ou consulta web. |
| **Dados de DOF restritos** | Os dados completos do DOF (Documento de Origem Florestal) podem ter acesso mais restrito que os autos de infração. |
| **Atualização** | Embora a frequência seja diária, pode haver defasagem entre a lavratura do auto e sua publicação nos dados abertos. |
| **Georreferenciamento impreciso** | As coordenadas informadas nos autos podem ter baixa precisão, especialmente em áreas remotas da Amazônia. |
