---
title: "Desmatamento x CAR x Embargos"
dificuldade: avançado
fontes_utilizadas:
  - meio-ambiente/deter
  - meio-ambiente/prodes
  - meio-ambiente/car
  - meio-ambiente/ibama-infracoes
campos_ponte: [coordenadas geográficas, código IBGE município, CPF/CNPJ]
tags: [desmatamento, meio ambiente, CAR, embargos, IBAMA, INPE, fiscalização ambiental]
sidebar_position: 5
---

# Desmatamento x CAR x Embargos

## Objetivo

Cruzar alertas de desmatamento detectados por satelite (DETER/PRODES) com o cadastro de propriedades rurais (CAR) e acoes de fiscalizacao do IBAMA para responder perguntas como:

- **Quem e o dono** da propriedade onde ocorreu desmatamento ilegal?
- O desmatamento ocorreu dentro de **Area de Preservacao Permanente (APP)** ou **Reserva Legal** cadastrada?
- O proprietario ja foi **autuado ou embargado** pelo IBAMA anteriormente?
- Existem propriedades com **desmatamento recorrente** sem fiscalizacao?
- O responsavel pela propriedade tem **outras propriedades** com historico de desmatamento?

Este cruzamento e fundamental para monitoramento ambiental e responsabilizacao de desmatadores.

## Fluxo de dados

```
  INPE (DETER/PRODES)         SICAR (CAR)              IBAMA
  Alertas de desmatamento      Cadastro Ambiental       Infracoes/Embargos
  +---------------------+   +---------------------+   +------------------+
  | Poligono alerta     |   | Poligono imovel     |   | CPF/CNPJ         |
  | Data deteccao       |   | CPF/CNPJ dono       |   | Municipio/UF     |
  | Area (km2)          |   | Municipio/UF        |   | Auto de infracao |
  | Municipio/UF        |   | Area total (ha)     |   | Valor multa      |
  | Classe (corte raso, |   | Reserva Legal       |   | Area embargada   |
  |   degradacao, etc.) |   | APP                 |   | Tipo infracao    |
  +---------------------+   | Veg. nativa         |   +------------------+
           |                 +---------------------+           |
           |                          |                        |
           v                          v                        v
  +------------------------------------------------------------------+
  |                 CRUZAMENTO GEOESPACIAL                           |
  |------------------------------------------------------------------|
  | 1. Sobreposicao espacial: poligono DETER  ∩  poligono CAR       |
  | 2. Identificacao do proprietario (CPF/CNPJ) via CAR              |
  | 3. Verificacao: desmatamento em APP/RL?                          |
  | 4. Cruzamento CPF/CNPJ proprietario x autos IBAMA               |
  +------------------------------------------------------------------+

  CAMPOS-PONTE:
  DETER/PRODES --[geometria]--> CAR (sobreposicao espacial)
  CAR --[CPF/CNPJ]--> IBAMA (autuacoes do proprietario)
  DETER/PRODES --[municipio]--> IBAMA (mesmo municipio)
```

## Passo a passo

### 1. Obter alertas de desmatamento (DETER ou PRODES)

Baixe os dados de alertas do [DETER](../apis/meio-ambiente/deter) (alertas diarios/semanais) ou do [PRODES](../apis/meio-ambiente/prodes) (desmatamento anual consolidado) via TerraBrasilis. Os dados vem em formato Shapefile ou GeoJSON com poligonos georreferenciados.

### 2. Obter cadastro de propriedades rurais (CAR)

Baixe os dados do [CAR](../apis/meio-ambiente/car) para o(s) estado(s) de interesse via SICAR. Os dados incluem poligonos dos imoveis rurais, areas de Reserva Legal e APP, e identificacao do proprietario (CPF/CNPJ).

### 3. Sobreposicao espacial (Spatial Join)

Use GeoPandas para realizar a sobreposicao dos poligonos de desmatamento (DETER/PRODES) com os poligonos das propriedades rurais (CAR). Isso identifica **em qual propriedade** cada alerta de desmatamento esta localizado.

### 4. Identificar proprietarios e verificar APP/RL

Para cada sobreposicao encontrada, extraia o CPF/CNPJ do proprietario e verifique se o desmatamento ocorreu dentro da Reserva Legal ou APP cadastrada.

### 5. Cruzar com autos de infracao do IBAMA

Para cada CPF/CNPJ identificado, consulte os dados de [IBAMA — Infracoes e Embargos](../apis/meio-ambiente/ibama-infracoes) para verificar se o proprietario ja foi autuado ou se a area ja esta embargada.

### 6. Consolidar e classificar

Gere um ranking de propriedades/proprietarios por gravidade:
- Area total desmatada
- Desmatamento em APP ou Reserva Legal
- Reincidencia (multiplos alertas ou autuacoes anteriores)
- Area sob embargo ativo

## Exemplo de codigo

```python
import pandas as pd
import geopandas as gpd
from pathlib import Path

# ============================================================
# CONFIGURACAO
# ============================================================
# Caminhos dos dados (previamente baixados)
CAMINHO_DETER = Path("./dados_geo/deter_amazonia.shp")
CAMINHO_CAR = Path("./dados_geo/car_pa.shp")  # CAR do Para (exemplo)
CAMINHO_IBAMA_AUTOS = Path("./dados_geo/ibama_autos_infracao.csv")
CAMINHO_IBAMA_EMBARGOS = Path("./dados_geo/ibama_areas_embargadas.shp")

# CRS padrao: EPSG:4674 (SIRGAS 2000) ou EPSG:4326 (WGS84)
CRS_PADRAO = "EPSG:4674"


# ============================================================
# PASSO 1: Carregar alertas de desmatamento (DETER)
# ============================================================
print("Carregando alertas DETER...")
gdf_deter = gpd.read_file(CAMINHO_DETER)
gdf_deter = gdf_deter.to_crs(CRS_PADRAO)

# Filtrar alertas recentes (ultimo ano)
gdf_deter["data_alerta"] = pd.to_datetime(gdf_deter["view_date"])
gdf_deter = gdf_deter[
    gdf_deter["data_alerta"] >= pd.Timestamp.now() - pd.DateOffset(years=1)
]

print(f"Alertas DETER carregados: {len(gdf_deter)}")
print(f"Area total alertada: {gdf_deter['area_km2'].sum():.2f} km2")


# ============================================================
# PASSO 2: Carregar cadastro de propriedades rurais (CAR)
# ============================================================
print("\nCarregando CAR...")
gdf_car = gpd.read_file(CAMINHO_CAR)
gdf_car = gdf_car.to_crs(CRS_PADRAO)

print(f"Imoveis rurais carregados: {len(gdf_car)}")
print(f"Area total cadastrada: {gdf_car['area_ha'].sum():,.0f} ha")


# ============================================================
# PASSO 3: Sobreposicao espacial (Spatial Join)
# ============================================================
print("\nExecutando sobreposicao espacial DETER x CAR...")

# Spatial join: encontrar em qual propriedade CAR cada alerta DETER esta
cruzamento_geo = gpd.sjoin(
    gdf_deter,
    gdf_car,
    how="inner",
    predicate="intersects",  # Poligonos que se intersectam
)

print(f"Alertas com sobreposicao em propriedades CAR: {len(cruzamento_geo)}")
print(f"Propriedades afetadas: {cruzamento_geo['cod_imovel'].nunique()}")
print(f"Proprietarios unicos: {cruzamento_geo['cpf_cnpj'].nunique()}")


# ============================================================
# PASSO 4: Calcular area de sobreposicao
# ============================================================
# Reprojetar para sistema metrico para calculo de area preciso
CRS_METRICO = "EPSG:5880"  # SIRGAS 2000 / Brazil Polyconic

def calcular_area_sobreposicao(row, gdf_car_metrico):
    """Calcula a area de intersecao entre alerta e propriedade."""
    try:
        geom_alerta = row.geometry
        imovel = gdf_car_metrico[
            gdf_car_metrico["cod_imovel"] == row["cod_imovel"]
        ]
        if imovel.empty:
            return 0
        intersecao = geom_alerta.intersection(imovel.iloc[0].geometry)
        return intersecao.area / 10_000  # m2 -> hectares
    except Exception:
        return 0


gdf_deter_metrico = gdf_deter.to_crs(CRS_METRICO)
gdf_car_metrico = gdf_car.to_crs(CRS_METRICO)

# Para grandes volumes, use batch processing
cruzamento_geo["area_sobreposicao_ha"] = cruzamento_geo.apply(
    lambda row: calcular_area_sobreposicao(row, gdf_car_metrico),
    axis=1,
)

print(f"\nArea total de desmatamento em propriedades CAR: "
      f"{cruzamento_geo['area_sobreposicao_ha'].sum():,.1f} ha")


# ============================================================
# PASSO 5: Verificar desmatamento em APP/RL
# ============================================================
# Se disponiveis os shapefiles de APP e RL do CAR
CAMINHO_CAR_RL = Path("./dados_geo/car_pa_reserva_legal.shp")
CAMINHO_CAR_APP = Path("./dados_geo/car_pa_app.shp")

alertas_em_rl = pd.DataFrame()
alertas_em_app = pd.DataFrame()

if CAMINHO_CAR_RL.exists():
    print("\nVerificando desmatamento em Reserva Legal...")
    gdf_rl = gpd.read_file(CAMINHO_CAR_RL).to_crs(CRS_PADRAO)
    alertas_em_rl = gpd.sjoin(gdf_deter, gdf_rl, how="inner", predicate="intersects")
    print(f"Alertas em Reserva Legal: {len(alertas_em_rl)}")

if CAMINHO_CAR_APP.exists():
    print("Verificando desmatamento em APP...")
    gdf_app = gpd.read_file(CAMINHO_CAR_APP).to_crs(CRS_PADRAO)
    alertas_em_app = gpd.sjoin(gdf_deter, gdf_app, how="inner", predicate="intersects")
    print(f"Alertas em APP: {len(alertas_em_app)}")


# ============================================================
# PASSO 6: Cruzar com autos de infracao do IBAMA
# ============================================================
print("\nCruzando com autos de infracao do IBAMA...")

# Carregar autos de infracao (CSV)
df_ibama = pd.read_csv(CAMINHO_IBAMA_AUTOS, dtype=str, encoding="latin-1")
df_ibama["cpf_cnpj_norm"] = df_ibama["cpf_cnpj_autuado"].str.replace(
    r"[.\-/]", "", regex=True
)

# Normalizar CPF/CNPJ no cruzamento
cruzamento_geo["cpf_cnpj_norm"] = cruzamento_geo["cpf_cnpj"].str.replace(
    r"[.\-/]", "", regex=True
)

# Verificar se proprietarios ja foram autuados
proprietarios_autuados = cruzamento_geo.merge(
    df_ibama[["cpf_cnpj_norm", "num_auto_infracao", "dat_auto_infracao",
              "val_auto_infracao", "des_auto_infracao"]],
    on="cpf_cnpj_norm",
    how="inner",
)

print(f"Proprietarios com autuacoes previas do IBAMA: "
      f"{proprietarios_autuados['cpf_cnpj_norm'].nunique()}")


# Carregar areas embargadas (Shapefile)
if CAMINHO_IBAMA_EMBARGOS.exists():
    print("\nVerificando sobreposicao com areas embargadas...")
    gdf_embargos = gpd.read_file(CAMINHO_IBAMA_EMBARGOS).to_crs(CRS_PADRAO)
    alertas_em_embargo = gpd.sjoin(
        gdf_deter, gdf_embargos, how="inner", predicate="intersects"
    )
    print(f"Alertas em areas ja embargadas: {len(alertas_em_embargo)}")


# ============================================================
# RESULTADO: Consolidar e rankear
# ============================================================
print("\n=== RANKING DE PROPRIEDADES POR GRAVIDADE ===\n")

ranking = (
    cruzamento_geo
    .groupby(["cod_imovel", "cpf_cnpj"])
    .agg(
        num_alertas=("data_alerta", "count"),
        area_total_desmatada_ha=("area_sobreposicao_ha", "sum"),
        primeiro_alerta=("data_alerta", "min"),
        ultimo_alerta=("data_alerta", "max"),
    )
    .reset_index()
    .sort_values("area_total_desmatada_ha", ascending=False)
)

# Adicionar flag de reincidencia IBAMA
cpfs_autuados = set(proprietarios_autuados["cpf_cnpj_norm"].unique())
ranking["cpf_cnpj_norm"] = ranking["cpf_cnpj"].str.replace(
    r"[.\-/]", "", regex=True
)
ranking["autuado_ibama"] = ranking["cpf_cnpj_norm"].isin(cpfs_autuados)

# Exibir top 20
for i, (_, row) in enumerate(ranking.head(20).iterrows(), 1):
    flag_ibama = " [REINCIDENTE IBAMA]" if row["autuado_ibama"] else ""
    print(f"{i:2d}. Imovel: {row['cod_imovel']}")
    print(f"    Proprietario: {row['cpf_cnpj']}{flag_ibama}")
    print(f"    Alertas: {row['num_alertas']}")
    print(f"    Area desmatada: {row['area_total_desmatada_ha']:,.1f} ha")
    print(f"    Periodo: {row['primeiro_alerta'].date()} a "
          f"{row['ultimo_alerta'].date()}")
    print()

# Salvar resultado
ranking.to_csv("ranking_desmatamento_car.csv", index=False)
print(f"Ranking salvo em ranking_desmatamento_car.csv ({len(ranking)} propriedades)")
```

## Resultado esperado

O script produz um ranking de propriedades rurais por gravidade de desmatamento:

```
=== RANKING DE PROPRIEDADES POR GRAVIDADE ===

 1. Imovel: PA-1234567-ABCDEFGH
    Proprietario: 123.456.789-00 [REINCIDENTE IBAMA]
    Alertas: 12
    Area desmatada: 1.523,4 ha
    Periodo: 2024-03-15 a 2025-01-22

 2. Imovel: PA-7654321-ZYXWVUTS
    Proprietario: 12.345.678/0001-90
    Alertas: 8
    Area desmatada: 876,2 ha
    Periodo: 2024-06-01 a 2024-12-10

 3. Imovel: PA-9876543-MNOPQRST
    Proprietario: 987.654.321-00 [REINCIDENTE IBAMA]
    Alertas: 5
    Area desmatada: 432,7 ha
    Periodo: 2024-08-20 a 2025-02-03
```

O arquivo CSV permite analise detalhada e producao de mapas tematicos via QGIS ou GeoPandas.

## Limitacoes

| Limitacao | Impacto | Mitigacao |
|---|---|---|
| **Resolucao do DETER** | DETER detecta areas >= 3 ha (Amazonia) e >= 1 ha (Cerrado); areas menores nao sao captadas | Complementar com PRODES (resolucao 6,25 ha) para dados anuais consolidados |
| **Cobertura de nuvens** | Nuvens impedem deteccao por satelite, especialmente no periodo chuvoso (dez-mai na Amazonia) | Usar serie temporal; considerar que alertas ausentes nao significam ausencia de desmatamento |
| **CAR autodeclaratorio** | O CAR e autodeclaratorio e pode conter erros de poligono ou dados do proprietario | Validar com imagens de satelite; considerar sobreposicoes parciais |
| **CAR incompleto** | Nem todas as propriedades estao cadastradas; cobertura varia por estado | Desmatamento fora de areas CAR requer investigacao adicional |
| **CPF/CNPJ do CAR** | Dados do proprietario podem estar desatualizados ou ser de posseiros | Cruzar com Receita Federal para validar titularidade |
| **Projecao cartografica** | Calculos de area imprecisos se usar CRS geografico (graus) em vez de projetado (metros) | Sempre reprojetar para CRS metrico (ex: EPSG:5880) antes de calcular areas |
| **Volume de dados** | CAR nacional tem milhoes de poligonos; processamento pode ser lento | Processar por estado/municipio; usar Dask-GeoPandas para paralelizar |
| **Dados IBAMA podem estar defasados** | Autos de infracao podem nao refletir a situacao processual atual (recursos, anulacoes) | Usar como indicativo, nao como prova definitiva |
