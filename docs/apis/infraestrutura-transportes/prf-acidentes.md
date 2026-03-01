---
title: PRF Acidentes — Acidentes em Rodovias Federais
slug: prf-acidentes
orgao: PRF
url_base: https://dados.gov.br/dados/conjuntos-dados/acidentes-de-transito-nas-rodovias-federais
tipo_acesso: CSV Download
autenticacao: Não requerida
formato_dados: [CSV]
frequencia_atualizacao: Anual
campos_chave:
  - data_hora
  - rodovia
  - km
  - municipio
  - causa_acidente
  - tipo_acidente
  - mortos
  - feridos
  - latitude
  - longitude
tags:
  - PRF
  - acidentes
  - rodovias federais
  - trânsito
  - mortes no trânsito
  - segurança viária
cruzamento_com:
  - infraestrutura-transportes/dnit-malha-rodoviaria
  - infraestrutura-transportes/antt-concessoes
  - infraestrutura-transportes/denatran-renavam
  - ibge-estatisticas/censo-demografico
status: documentado
---

# PRF Acidentes — Acidentes em Rodovias Federais

## O que é

A **PRF (Polícia Rodoviária Federal)** disponibiliza microdados de todos os acidentes de trânsito registrados em **rodovias federais** brasileiras. Os dados são publicados no portal dados.gov.br e constituem a principal fonte pública de dados detalhados sobre sinistros de trânsito no Brasil.

Cada registro contém informações sobre:

- **Localização** — rodovia, quilômetro, município, UF, coordenadas geográficas (latitude/longitude)
- **Temporalidade** — data, hora, dia da semana, fase do dia
- **Características do acidente** — tipo (colisão frontal, capotamento, atropelamento, etc.), causa presumida
- **Condições** — condição meteorológica, tipo de pista, traçado da via
- **Vítimas** — número de mortos, feridos graves, feridos leves, ilesos
- **Veículos envolvidos** — tipo e quantidade de veículos

Os dados estão disponíveis desde 2007, permitindo análises de séries históricas de segurança viária.

## Como acessar

| Item | Detalhe |
|---|---|
| **dados.gov.br** | `https://dados.gov.br/dados/conjuntos-dados/acidentes-de-transito-nas-rodovias-federais` |
| **Portal PRF** | `https://www.gov.br/prf/pt-br/acesso-a-informacao/dados-abertos` |
| **Autenticação** | Não requerida |
| **Formato** | CSV (delimitado por `;`) |
| **Publicação** | Anual (com atualizações retroativas) |

### Arquivos disponíveis

| Arquivo | Conteúdo |
|---|---|
| `datatran{AAAA}.csv` | Acidentes do ano (um registro por acidente) |
| `datatran{AAAA}_pessoas.csv` | Pessoas envolvidas nos acidentes |

## Endpoints/recursos principais

| Recurso | Conteúdo | Granularidade |
|---|---|---|
| **Acidentes por ocorrência** | Um registro por acidente com localização e classificação | Cada acidente |
| **Acidentes por pessoa** | Um registro por pessoa envolvida (vítimas e condutores) | Cada envolvido |
| **Dados georreferenciados** | Latitude e longitude de cada acidente | Ponto GPS |

## Exemplo de uso

### Análise de acidentes por causa

```python
import pandas as pd

# Microdados de acidentes — ano 2023
df = pd.read_csv(
    "datatran2023.csv",
    sep=";",
    encoding="latin-1",
    dtype=str,
    decimal=","
)

print(f"Total de acidentes: {len(df):,}")
print(f"Colunas: {list(df.columns)}")

# Converter campos numéricos
df["mortos"] = pd.to_numeric(df["mortos"], errors="coerce")
df["feridos"] = pd.to_numeric(df["feridos"], errors="coerce")

# Acidentes por causa
por_causa = (
    df.groupby("causa_acidente")
    .agg(
        total_acidentes=("causa_acidente", "size"),
        total_mortos=("mortos", "sum"),
    )
    .sort_values("total_acidentes", ascending=False)
)

print("\nTop 10 causas de acidentes:")
print(por_causa.head(10))
```

### Mapa de acidentes fatais

```python
import pandas as pd

df = pd.read_csv(
    "datatran2023.csv",
    sep=";",
    encoding="latin-1",
    dtype=str,
    decimal=","
)

df["mortos"] = pd.to_numeric(df["mortos"], errors="coerce")
df["latitude"] = pd.to_numeric(df["latitude"].str.replace(",", "."), errors="coerce")
df["longitude"] = pd.to_numeric(df["longitude"].str.replace(",", "."), errors="coerce")

# Filtrar acidentes fatais com coordenadas válidas
fatais = df[(df["mortos"] > 0) & df["latitude"].notna()]
print(f"Acidentes fatais georreferenciados: {len(fatais):,}")

# Exportar para GeoJSON (para uso em QGIS ou mapas web)
import json

features = []
for _, row in fatais.head(1000).iterrows():
    features.append({
        "type": "Feature",
        "geometry": {
            "type": "Point",
            "coordinates": [row["longitude"], row["latitude"]],
        },
        "properties": {
            "rodovia": row.get("br", ""),
            "km": row.get("km", ""),
            "causa": row.get("causa_acidente", ""),
            "mortos": int(row["mortos"]),
        },
    })

geojson = {"type": "FeatureCollection", "features": features}
with open("acidentes_fatais.geojson", "w") as f:
    json.dump(geojson, f)

print("GeoJSON salvo em acidentes_fatais.geojson")
```

### Série histórica de mortes

```python
import pandas as pd
import glob

# Ler todos os anos disponíveis
arquivos = sorted(glob.glob("datatran*.csv"))
serie = []

for arq in arquivos:
    if "pessoas" in arq:
        continue
    df = pd.read_csv(arq, sep=";", encoding="latin-1", dtype=str, decimal=",")
    df["mortos"] = pd.to_numeric(df["mortos"], errors="coerce")
    ano = arq.replace("datatran", "").replace(".csv", "")
    total = df["mortos"].sum()
    serie.append({"ano": ano, "mortes": total})

serie_df = pd.DataFrame(serie)
print("Mortes em rodovias federais por ano:")
print(serie_df.to_string(index=False))
```

## Campos disponíveis

### Acidentes por ocorrência (`datatranAAAA.csv`)

| Campo | Tipo | Descrição |
|---|---|---|
| `id` | int | Identificador único do acidente |
| `data_inversa` | date | Data do acidente (AAAA-MM-DD) |
| `dia_semana` | string | Dia da semana |
| `horario` | time | Horário (HH:MM:SS) |
| `uf` | string | UF |
| `br` | string | Número da rodovia federal |
| `km` | float | Quilômetro da ocorrência |
| `municipio` | string | Nome do município |
| `causa_acidente` | string | Causa principal |
| `tipo_acidente` | string | Tipo (colisão frontal, capotamento, etc.) |
| `classificacao_acidente` | string | Com vítimas fatais, com vítimas feridas, sem vítimas |
| `fase_dia` | string | Pleno dia, anoitecer, plena noite, amanhecer |
| `sentido_via` | string | Crescente, decrescente |
| `condicao_metereologica` | string | Céu claro, chuva, nublado, etc. |
| `tipo_pista` | string | Simples, dupla, múltipla |
| `tracado_via` | string | Reta, curva, interseção |
| `mortos` | int | Número de mortos |
| `feridos_leves` | int | Número de feridos leves |
| `feridos_graves` | int | Número de feridos graves |
| `ilesos` | int | Número de ilesos |
| `ignorados` | int | Número de vítimas sem informação |
| `feridos` | int | Total de feridos |
| `veiculos` | int | Quantidade de veículos envolvidos |
| `pessoas` | int | Total de pessoas envolvidas |
| `latitude` | float | Latitude (graus decimais) |
| `longitude` | float | Longitude (graus decimais) |

## Cruzamentos possíveis

| Cruzamento | Fonte relacionada | Chave de ligação | Finalidade |
|---|---|---|---|
| Acidentes x Malha rodoviária | [DNIT Malha Rodoviária](/docs/apis/infraestrutura-transportes/dnit-malha-rodoviaria) | BR, km, coordenadas | Georreferenciar acidentes na malha e analisar trechos críticos |
| Acidentes x Concessões | [ANTT Concessões](/docs/apis/infraestrutura-transportes/antt-concessoes) | BR, km | Comparar segurança em trechos concedidos vs. não concedidos |
| Acidentes x Frota | [DENATRAN/RENAVAM](/docs/apis/infraestrutura-transportes/denatran-renavam) | UF | Normalizar acidentes pela frota de veículos |
| Acidentes x População | [Censo Demográfico](/docs/apis/ibge-estatisticas/censo-demografico) | Município | Calcular taxa de mortalidade no trânsito per capita |

## Limitações conhecidas

| Limitação | Detalhes |
|---|---|
| **Apenas rodovias federais** | Os dados cobrem somente rodovias federais (BR-xxx). Acidentes em rodovias estaduais e vias urbanas não estão incluídos. |
| **Encoding Latin-1** | Arquivos usam encoding Latin-1 com separador `;` e decimal `,`. |
| **Coordenadas imprecisas** | Algumas coordenadas GPS podem ter imprecisões ou estar ausentes. |
| **Causa presumida** | A causa do acidente registrada é uma avaliação inicial do policial no local, podendo não refletir a investigação posterior. |
| **Defasagem na publicação** | Os dados anuais completos podem demorar meses após o encerramento do ano para serem publicados. |
| **Subnotificação** | Acidentes sem registro policial (ex: pequenas colisões sem vítimas em que as partes não acionam a PRF) não aparecem nos dados. |
| **Mudanças no layout** | O formato e os nomes das colunas podem variar entre os anos. |
