---
title: Recursos Hídricos — ANA (Agência Nacional de Águas)
slug: recursos-hidricos
orgao: ANA
url_base: https://dadosabertos.ana.gov.br/
tipo_acesso: API REST / CSV Download
autenticacao: Não requerida
formato_dados: [JSON, CSV, Shapefile, GeoJSON]
frequencia_atualizacao: Diária a Mensal
campos_chave:
  - codigo_estacao
  - bacia_hidrografica
  - sub_bacia
  - codigo_outorga
  - vazao
  - nivel_rio
  - municipio
  - UF
tags:
  - meio ambiente
  - recursos hídricos
  - ANA
  - água
  - outorgas
  - bacias hidrográficas
  - monitoramento hídrico
  - rios
  - reservatórios
  - hidroweb
cruzamento_com:
  - meio-ambiente/unidades-conservacao
  - meio-ambiente/car
  - meio-ambiente/ibama-infracoes
  - meio-ambiente/focos-calor
status: documentado
---

# Recursos Hídricos — ANA (Agência Nacional de Águas)

## O que é

A **ANA (Agência Nacional de Águas e Saneamento Básico)** é a autarquia federal responsável pela gestão dos recursos hídricos de domínio da União e pela regulação do setor de saneamento no Brasil. A ANA disponibiliza um amplo conjunto de dados abertos sobre o monitoramento e a gestão das águas brasileiras.

Os principais conjuntos de dados incluem:

- **Outorgas de direito de uso** — autorizações para uso de recursos hídricos (irrigação, abastecimento, indústria, geração de energia)
- **Monitoramento hidrológico** — dados de estações fluviométricas e pluviométricas (vazão, nível do rio, precipitação)
- **Bacias hidrográficas** — divisão hidrográfica do Brasil em bacias, sub-bacias e microbacias
- **Reservatórios** — monitoramento de volume e operação de reservatórios
- **Qualidade da água** — parâmetros físico-químicos e biológicos monitorados em rios e reservatórios
- **SNIRH (Sistema Nacional de Informações sobre Recursos Hídricos)** — base consolidada de dados hidrológicos

A ANA mantém a **maior rede de monitoramento hidrológico** da América do Sul, com mais de 4.600 estações fluviométricas e 11.000 estações pluviométricas operadas diretamente ou por entidades conveniadas.

> **Portal de dados abertos:** https://dadosabertos.ana.gov.br/ — portal com APIs REST documentadas e downloads de dados.

## Como acessar

### Fontes de dados

| Fonte | URL | Formato | Descrição |
|-------|-----|---------|-----------|
| **Dados Abertos ANA** | `https://dadosabertos.ana.gov.br/` | JSON, CSV | Portal principal com APIs REST |
| **HidroWeb** | `https://www.snirh.gov.br/hidroweb/` | CSV | Dados de estações hidrológicas |
| **SAR** | `https://www.snirh.gov.br/sar/` | JSON/CSV | Sistema de Acompanhamento de Reservatórios |
| **SNIRH** | `https://www.snirh.gov.br/` | Variados | Sistema Nacional de Informações sobre Recursos Hídricos |
| **GeoNetwork ANA** | `https://metadados.snirh.gov.br/geonetwork/` | Shapefile, WFS | Dados geoespaciais (bacias, estações, outorgas) |

### Autenticação

O acesso às APIs e downloads é **público e gratuito**, sem necessidade de cadastro ou token.

### APIs REST disponíveis

A ANA disponibiliza APIs REST documentadas em seu portal de dados abertos:

```
Base URL: https://dadosabertos.ana.gov.br/api/3/action/
```

## Endpoints/recursos principais

### API de dados abertos

| Endpoint | Método | Descrição |
|----------|--------|-----------|
| `/api/3/action/package_list` | GET | Lista todos os conjuntos de dados disponíveis |
| `/api/3/action/package_show?id={id}` | GET | Detalhes de um conjunto de dados |
| `/api/3/action/datastore_search?resource_id={id}` | GET | Consulta dados de um recurso específico |

### HidroWeb — Dados hidrológicos

| Recurso | URL | Descrição |
|---------|-----|-----------|
| **Inventário de estações** | `https://www.snirh.gov.br/hidroweb/rest/api/estacao/` | Lista de estações de monitoramento |
| **Dados de vazão** | `https://www.snirh.gov.br/hidroweb/rest/api/documento/convencionais` | Séries históricas de vazão |
| **Dados de chuva** | `https://www.snirh.gov.br/hidroweb/rest/api/documento/convencionais` | Séries históricas de precipitação |

### Conjuntos de dados principais

| Conjunto | Descrição | Atualização |
|----------|-----------|-------------|
| **Outorgas** | Outorgas de direito de uso de recursos hídricos emitidas pela ANA | Mensal |
| **Estações fluviométricas** | Inventário e dados de 4.600+ estações de medição de rios | Diária |
| **Estações pluviométricas** | Inventário e dados de 11.000+ estações de chuva | Diária |
| **Reservatórios (SAR)** | Volume, vazão afluente e defluente de reservatórios | Diária |
| **Bacias hidrográficas** | Divisão hidrográfica do Brasil (Otto Pfafstetter) | Estática |
| **Qualidade da água** | Parâmetros de qualidade monitorados (IQA) | Trimestral |
| **Massas d'água** | Rios, lagos e reservatórios georreferenciados | Anual |

### Parâmetros de consulta — HidroWeb

| Parâmetro | Tipo | Descrição |
|-----------|------|-----------|
| `codEstacao` | string | Código da estação hidrológica |
| `codBacia` | string | Código da bacia hidrográfica |
| `uf` | string | Sigla da UF |
| `tipoEstacao` | int | Tipo: 1=Fluviométrica, 2=Pluviométrica |
| `dataInicio` | date | Data inicial do período |
| `dataFim` | date | Data final do período |

## Exemplo de uso

### Consultar inventário de estações

```python
import requests
import pandas as pd

# Consultar estações fluviométricas via HidroWeb
url = "https://www.snirh.gov.br/hidroweb/rest/api/estacao/"

params = {
    "uf": "AM",  # Amazonas
    "tipoEstacao": 1,  # Fluviométrica
}

response = requests.get(url, params=params, timeout=60)
response.raise_for_status()
estacoes = response.json()

df_estacoes = pd.DataFrame(estacoes)
print(f"Estações fluviométricas no AM: {len(df_estacoes):,}")
print(df_estacoes[["codigo", "nome", "bacia", "rio", "municipio"]].head(10))
```

### Baixar dados de vazão de uma estação

```python
import requests
import pandas as pd
from io import StringIO

# Baixar série histórica de vazão de uma estação
# Exemplo: estação 15030000 (Rio Amazonas em Óbidos)
COD_ESTACAO = "15030000"

url = f"https://www.snirh.gov.br/hidroweb/rest/api/documento/convencionais"
params = {
    "tipo": 3,  # Tipo 3 = vazão
    "codEstacao": COD_ESTACAO,
    "dataInicio": "2020-01-01",
    "dataFim": "2024-12-31",
}

response = requests.get(url, params=params, timeout=120)
response.raise_for_status()

# O retorno pode ser um arquivo CSV ou JSON dependendo do endpoint
# Processar conforme o formato retornado
print(f"Dados de vazão para estação {COD_ESTACAO}")
print(f"Tamanho da resposta: {len(response.content):,} bytes")
```

### Consultar outorgas de uso da água

```python
import requests
import pandas as pd

# API de dados abertos da ANA — consultar outorgas
BASE_URL = "https://dadosabertos.ana.gov.br/api/3/action"

# Primeiro, identificar o ID do recurso de outorgas
resp = requests.get(
    f"{BASE_URL}/package_show",
    params={"id": "outorgas"},
    timeout=30,
)

if resp.status_code == 200:
    dados = resp.json()
    recursos = dados.get("result", {}).get("resources", [])
    print("Recursos de outorgas disponíveis:")
    for r in recursos:
        print(f"  - {r['name']}: {r['format']} ({r['id']})")


# Consultar dados de outorgas via datastore
def consultar_outorgas(uf: str = None, finalidade: str = None, limite: int = 100):
    """
    Consulta outorgas de uso de recursos hídricos.

    Args:
        uf: Sigla da UF
        finalidade: Finalidade de uso (irrigação, abastecimento, etc.)
        limite: Número máximo de registros

    Returns:
        DataFrame com outorgas
    """
    url = f"{BASE_URL}/datastore_search"
    params = {
        "resource_id": "RESOURCE_ID_OUTORGAS",  # Substituir pelo ID real
        "limit": limite,
    }

    filtros = {}
    if uf:
        filtros["uf"] = uf
    if finalidade:
        filtros["finalidade"] = finalidade

    if filtros:
        import json
        params["filters"] = json.dumps(filtros)

    response = requests.get(url, params=params, timeout=30)
    response.raise_for_status()
    resultado = response.json()

    registros = resultado.get("result", {}).get("records", [])
    return pd.DataFrame(registros)


# Exemplo: outorgas no Mato Grosso
df_outorgas = consultar_outorgas(uf="MT")
print(f"Outorgas encontradas: {len(df_outorgas)}")
```

### Monitorar reservatórios (SAR)

```python
import requests
import pandas as pd

# Sistema de Acompanhamento de Reservatórios
SAR_URL = "https://www.snirh.gov.br/sar/"

# Consultar nível dos principais reservatórios
# Os dados são publicados diariamente


def consultar_reservatorios():
    """
    Consulta o nível atual dos reservatórios monitorados pela ANA.

    Returns:
        DataFrame com dados dos reservatórios
    """
    url = f"{SAR_URL}rest/api/reservatorio"
    response = requests.get(url, timeout=30)
    response.raise_for_status()
    return pd.DataFrame(response.json())


df_reservatorios = consultar_reservatorios()
print(f"Reservatórios monitorados: {len(df_reservatorios):,}")
print(df_reservatorios[["nome", "bacia", "volume_util_pct"]].head(10))

# Reservatórios em estado crítico (volume < 30%)
criticos = df_reservatorios[
    pd.to_numeric(df_reservatorios["volume_util_pct"], errors="coerce") < 30
]
print(f"\nReservatórios em estado crítico (<30%): {len(criticos)}")
print(criticos[["nome", "bacia", "volume_util_pct"]].to_string(index=False))
```

### Carregar dados geoespaciais de bacias hidrográficas

```python
import geopandas as gpd

# Carregar divisão hidrográfica do Brasil
gdf_bacias = gpd.read_file("bacias_hidrograficas_brasil.shp")

print(f"Total de bacias: {len(gdf_bacias):,}")
print(f"Colunas: {list(gdf_bacias.columns)}")

# Área por bacia de nível 1
por_bacia = (
    gdf_bacias.groupby("nome_bacia")
    .agg(area_km2=("area_km2", "sum"))
    .sort_values("area_km2", ascending=False)
)

print("\nBacias hidrográficas por área:")
print(por_bacia.to_string())
```

## Campos disponíveis

### Estações hidrológicas (HidroWeb)

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `codigo` | string | Código da estação (8 dígitos) |
| `nome` | string | Nome da estação |
| `tipo_estacao` | int | 1=Fluviométrica, 2=Pluviométrica |
| `latitude` | float | Latitude da estação |
| `longitude` | float | Longitude da estação |
| `altitude` | float | Altitude (metros) |
| `bacia` | string | Nome da bacia hidrográfica |
| `sub_bacia` | string | Nome da sub-bacia |
| `rio` | string | Nome do rio |
| `municipio` | string | Município |
| `uf` | string | UF |
| `responsavel` | string | Entidade responsável pela operação |
| `operando` | boolean | Se a estação está em operação |

### Dados de vazão (séries históricas)

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `data` | date | Data da medição |
| `vazao_media` | float | Vazão média diária (m³/s) |
| `vazao_maxima` | float | Vazão máxima diária (m³/s) |
| `vazao_minima` | float | Vazão mínima diária (m³/s) |
| `nivel` | float | Nível do rio (cm) |
| `consistencia` | int | Nível de consistência (1=bruto, 2=consistido) |

### Outorgas

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `numero_outorga` | string | Número da resolução de outorga |
| `cpf_cnpj` | string | CPF/CNPJ do outorgado |
| `nome_outorgado` | string | Nome do outorgado |
| `finalidade` | string | Finalidade do uso (irrigação, abastecimento, indústria, etc.) |
| `vazao_outorgada` | float | Vazão máxima autorizada (m³/s ou L/s) |
| `volume_outorgado` | float | Volume autorizado (m³/ano) |
| `corpo_hidrico` | string | Nome do rio/corpo d'água |
| `bacia` | string | Bacia hidrográfica |
| `municipio` | string | Município |
| `uf` | string | UF |
| `latitude` | float | Latitude do ponto de captação |
| `longitude` | float | Longitude do ponto de captação |
| `data_vigencia` | date | Data de início da vigência |
| `data_validade` | date | Data de validade da outorga |

### Reservatórios (SAR)

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `nome` | string | Nome do reservatório |
| `bacia` | string | Bacia hidrográfica |
| `rio` | string | Rio barrado |
| `volume_util_pct` | float | Volume útil atual (%) |
| `volume_total_hm3` | float | Volume total (hm³) |
| `vazao_afluente` | float | Vazão afluente (m³/s) |
| `vazao_defluente` | float | Vazão defluente (m³/s) |
| `data_medicao` | date | Data da medição |

## Cruzamentos possíveis

| Cruzamento | Fonte relacionada | Chave de ligação | Finalidade |
|------------|-------------------|------------------|------------|
| Outorgas x CAR | [CAR — Cadastro Ambiental Rural](/docs/apis/meio-ambiente/car) | CPF/CNPJ / coordenadas | Verificar se propriedades com outorga possuem APP e RL preservadas |
| Estações x UCs | [Unidades de Conservação](/docs/apis/meio-ambiente/unidades-conservacao) | Coordenadas / bacia | Monitorar recursos hídricos dentro de áreas protegidas |
| Outorgas x IBAMA | [IBAMA — Infrações](/docs/apis/meio-ambiente/ibama-infracoes) | CPF/CNPJ | Verificar se outorgados possuem infrações ambientais |
| Bacias x Desmatamento | [PRODES / DETER](/docs/apis/meio-ambiente/prodes) | Sobreposição espacial | Correlacionar desmatamento com impactos sobre bacias hidrográficas |
| Bacias x Focos de calor | [Focos de Calor — INPE](/docs/apis/meio-ambiente/focos-calor) | Sobreposição espacial | Avaliar impacto de queimadas sobre mananciais hídricos |

### Receita: verificar outorgas em áreas desmatadas

```python
import geopandas as gpd
import pandas as pd

# Verificar se áreas com outorgas de irrigação apresentam desmatamento recente

# 1. Carregar outorgas com coordenadas
df_outorgas = pd.read_csv("outorgas_ana.csv", sep=";", encoding="utf-8")
df_outorgas = df_outorgas.dropna(subset=["latitude", "longitude"])

gdf_outorgas = gpd.GeoDataFrame(
    df_outorgas,
    geometry=gpd.points_from_xy(df_outorgas["longitude"], df_outorgas["latitude"]),
    crs="EPSG:4674",
)

# 2. Carregar polígonos PRODES
gdf_prodes = gpd.read_file("prodes_amazonia_2023.shp").to_crs("EPSG:4674")

# 3. Buffer de 5km ao redor dos pontos de outorga
gdf_outorgas_buffer = gdf_outorgas.copy()
gdf_outorgas_buffer["geometry"] = gdf_outorgas_buffer.geometry.buffer(0.05)  # ~5km

# 4. Cruzamento espacial
outorgas_com_desmat = gpd.sjoin(
    gdf_outorgas_buffer, gdf_prodes, how="inner", predicate="intersects"
)

print(f"Outorgas próximas a áreas desmatadas: {len(outorgas_com_desmat):,}")
print(f"Outorgados afetados: {outorgas_com_desmat['cpf_cnpj'].nunique():,}")
```

## Limitações conhecidas

| Limitação | Detalhes |
|-----------|----------|
| **HidroWeb lento** | O sistema HidroWeb pode ser muito lento para download de séries históricas longas. Considere downloads parciais por período. |
| **Séries com falhas** | As séries históricas de vazão e precipitação frequentemente possuem lacunas (dias sem medição), especialmente em estações remotas. |
| **Dados brutos vs. consistidos** | Os dados passam por um processo de consistência (validação). Dados brutos (nível 1) podem conter erros; dados consistidos (nível 2) podem ter anos de defasagem. |
| **API não padronizada** | Os diferentes sistemas da ANA (HidroWeb, SAR, Dados Abertos) possuem APIs distintas, sem padronização de formato ou parâmetros. |
| **Outorgas estaduais ausentes** | A ANA emite outorgas apenas para rios de domínio da União. Outorgas de rios estaduais são emitidas pelos órgãos estaduais e não estão consolidadas na base da ANA. |
| **Georreferenciamento variável** | Estações mais antigas podem ter coordenadas com precisão limitada. |
| **Dados de qualidade da água** | O monitoramento de qualidade da água tem frequência menor (trimestral) e cobertura espacial limitada em comparação com dados de quantidade. |
| **Formato de download** | Alguns dados do HidroWeb são disponibilizados em formato proprietário ou CSV com estrutura complexa (múltiplos cabeçalhos), exigindo pré-processamento. |
| **Timeout em consultas grandes** | Requisições que retornam muitos dados podem sofrer timeout. Recomenda-se consultar por período ou por estação individual. |
| **Portal ArcGIS Hub** | O portal dadosabertos.ana.gov.br utiliza a plataforma ArcGIS Hub, não CKAN. Os endpoints CKAN documentados podem não funcionar. Utilize a interface web do portal ou a API de busca ArcGIS. |
