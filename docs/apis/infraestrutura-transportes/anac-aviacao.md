---
title: ANAC Aviação Civil — Voos, Passageiros e Aeroportos
slug: anac-aviacao
orgao: ANAC
url_base: https://www.gov.br/anac/pt-br/assuntos/dados-e-estatisticas
tipo_acesso: CSV Download
autenticacao: Não requerida
formato_dados: [CSV]
frequencia_atualizacao: Mensal
campos_chave:
  - empresa_aerea
  - aeroporto_origem
  - aeroporto_destino
  - passageiros_pagos
  - carga_kg
  - assentos_ofertados
  - RPK
  - ASK
tags:
  - ANAC
  - aviação civil
  - voos
  - passageiros
  - aeroportos
  - RAB
  - companhias aéreas
  - transporte aéreo
cruzamento_com:
  - ibge-estatisticas/pib-municipal
  - ibge-estatisticas/censo-demografico
  - infraestrutura-transportes/antt-concessoes
status: documentado
---

# ANAC Aviação Civil — Voos, Passageiros e Aeroportos

## O que é

A **ANAC (Agência Nacional de Aviação Civil)** disponibiliza dados estatísticos abrangentes sobre o transporte aéreo brasileiro. Os principais conjuntos de dados incluem:

- **Dados estatísticos do transporte aéreo** — microdados de voos domésticos e internacionais, incluindo passageiros transportados, carga, RPK (Revenue Passenger Kilometers), ASK (Available Seat Kilometers)
- **RAB (Registro Aeronáutico Brasileiro)** — cadastro de todas as aeronaves registradas no Brasil
- **Aeródromos** — cadastro de aeroportos e aeródromos com localização, pista, categoria
- **Tarifas aéreas** — preços de passagens coletados
- **Pontualidade** — indicadores de atrasos e cancelamentos
- **Segurança** — ocorrências aeronáuticas (investigadas pelo CENIPA)

Os dados estatísticos do transporte aéreo são especialmente ricos, com microdados mensais de cada combinação empresa-origem-destino.

## Como acessar

| Item | Detalhe |
|---|---|
| **Portal de dados** | `https://www.gov.br/anac/pt-br/assuntos/dados-e-estatisticas` |
| **Dados estatísticos** | `https://www.gov.br/anac/pt-br/assuntos/dados-e-estatisticas/dados-estatisticos/dados-estatisticos` |
| **RAB** | `https://www.gov.br/anac/pt-br/assuntos/regulados/aeronaves/rab` |
| **dados.gov.br** | `https://dados.gov.br/dados/conjuntos-dados/dados-estatisticos-do-transporte-aereo` |
| **Autenticação** | Não requerida |
| **Formato** | CSV (delimitado por `;`) |

### Estrutura dos dados estatísticos

Os microdados estão organizados em dois arquivos principais:

| Arquivo | Conteúdo |
|---|---|
| `Dados_Estatísticos.csv` | Dados agregados por empresa-origem-destino-mês |
| `Dados_Tarifas.csv` | Tarifas coletadas por trecho |

## Endpoints/recursos principais

| Recurso | Conteúdo | Periodicidade |
|---|---|---|
| **Dados Estatísticos** | Passageiros, carga, RPK, ASK por empresa e rota | Mensal |
| **RAB** | Cadastro de aeronaves (tipo, fabricante, proprietário) | Atualização contínua |
| **Aeródromos** | Lista de aeroportos (ICAO, localização, pista) | Atualização contínua |
| **Tarifas aéreas** | Preços de passagens por trecho | Trimestral |
| **Pontualidade** | Atrasos e cancelamentos por voo | Mensal |
| **Voos autorizados (HOTRAN)** | Horários de transporte autorizados | Atualização contínua |

## Exemplo de uso

### Análise de passageiros por aeroporto

```python
import pandas as pd

# Microdados estatísticos do transporte aéreo
# Download: https://www.gov.br/anac/pt-br/assuntos/dados-e-estatisticas/dados-estatisticos
df = pd.read_csv(
    "Dados_Estatisticos.csv",
    sep=";",
    encoding="utf-8",
    dtype=str,
    decimal=","
)

print(f"Total de registros: {len(df):,}")
print(f"Colunas: {list(df.columns)}")

# Converter passageiros para numérico
df["PASSAGEIROS_PAGOS"] = pd.to_numeric(df["PASSAGEIROS_PAGOS"], errors="coerce")

# Passageiros por aeroporto de origem (voos domésticos)
df_dom = df[df["NATUREZA"] == "DOMÉSTICA"]
por_origem = (
    df_dom.groupby("AEROPORTO_ORIGEM")["PASSAGEIROS_PAGOS"]
    .sum()
    .sort_values(ascending=False)
)

print("\nTop 10 aeroportos por passageiros embarcados:")
print(por_origem.head(10))
```

### Evolução mensal do tráfego aéreo

```python
import pandas as pd

df = pd.read_csv(
    "Dados_Estatisticos.csv",
    sep=";",
    encoding="utf-8",
    dtype=str,
    decimal=","
)

df["PASSAGEIROS_PAGOS"] = pd.to_numeric(df["PASSAGEIROS_PAGOS"], errors="coerce")
df["ANO_MES"] = df["ANO"].astype(str) + "-" + df["MES"].astype(str).str.zfill(2)

# Série mensal de passageiros
serie = df.groupby("ANO_MES")["PASSAGEIROS_PAGOS"].sum()
print("Passageiros por mês:")
print(serie.tail(12))
```

### Consultar aeronaves no RAB

```python
import pandas as pd

# Registro Aeronáutico Brasileiro
df_rab = pd.read_csv(
    "RAB.csv",
    sep=";",
    encoding="utf-8",
    dtype=str,
)

print(f"Aeronaves registradas: {len(df_rab):,}")

# Distribuição por tipo de aeronave
tipo = df_rab["TIPO_AERONAVE"].value_counts()
print("\nAeronaves por tipo:")
print(tipo.head(10))
```

## Campos disponíveis

### Dados estatísticos do transporte aéreo

| Campo | Tipo | Descrição |
|---|---|---|
| `ANO` | int | Ano de referência |
| `MES` | int | Mês de referência |
| `EMPRESA` | string | Nome da empresa aérea |
| `SIGLA_EMPRESA` | string | Sigla ICAO da empresa |
| `AEROPORTO_ORIGEM` | string | Código ICAO do aeroporto de origem |
| `AEROPORTO_DESTINO` | string | Código ICAO do aeroporto de destino |
| `NATUREZA` | string | DOMÉSTICA ou INTERNACIONAL |
| `PASSAGEIROS_PAGOS` | int | Número de passageiros pagos |
| `PASSAGEIROS_GRATIS` | int | Número de passageiros gratuitos |
| `CARGA_PAGA_KG` | float | Carga paga transportada (kg) |
| `CORREIO_KG` | float | Correio transportado (kg) |
| `ASK` | float | Available Seat Kilometers (oferta) |
| `RPK` | float | Revenue Passenger Kilometers (demanda) |
| `ATK` | float | Available Ton Kilometers |
| `RTK` | float | Revenue Ton Kilometers |
| `DECOLAGENS` | int | Número de decolagens |
| `HORAS_VOADAS` | float | Horas voadas |

### RAB (Registro Aeronáutico Brasileiro)

| Campo | Tipo | Descrição |
|---|---|---|
| `MARCA` | string | Matrícula da aeronave (ex: PR-XXX) |
| `PROPRIETARIO` | string | Nome do proprietário |
| `OPERADOR` | string | Nome do operador |
| `FABRICANTE` | string | Fabricante da aeronave |
| `MODELO` | string | Modelo da aeronave |
| `TIPO_AERONAVE` | string | Avião, Helicóptero, etc. |
| `ANO_FABRICACAO` | int | Ano de fabricação |
| `CATEGORIA` | string | Categoria de registro |

## Cruzamentos possíveis

| Cruzamento | Fonte relacionada | Chave de ligação | Finalidade |
|---|---|---|---|
| Tráfego x PIB | [PIB Municipal](/docs/apis/ibge-estatisticas/pib-municipal) | Município do aeroporto | Correlacionar tráfego aéreo com atividade econômica |
| Tráfego x População | [Censo Demográfico](/docs/apis/ibge-estatisticas/censo-demografico) | Município | Calcular passageiros per capita por região |
| Aéreo x Rodoviário | [ANTT Concessões](/docs/apis/infraestrutura-transportes/antt-concessoes) | Rota / UF | Comparar modais de transporte |

## Limitações conhecidas

| Limitação | Detalhes |
|---|---|
| **Arquivos grandes** | Os microdados acumulados de vários anos podem ocupar vários GB. |
| **Sem API REST** | Os dados são disponibilizados como arquivos CSV para download. Não há API de consulta. |
| **Encoding e separador variáveis** | Verificar encoding (UTF-8 ou Latin-1) e separador (`;` ou `,`) para cada arquivo. |
| **Dados de tarifas limitados** | As tarifas aéreas coletadas pela ANAC cobrem amostra de trechos, não a totalidade. |
| **RAB pode estar desatualizado** | O arquivo do RAB disponível para download pode não refletir alterações mais recentes. |
| **Códigos ICAO** | Aeroportos são identificados por código ICAO (4 letras, ex: SBGR), não IATA (3 letras, ex: GRU). É necessário tabela de correspondência. |
