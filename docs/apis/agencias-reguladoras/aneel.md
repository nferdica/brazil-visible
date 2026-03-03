---
title: ANEEL Energia Elétrica — Geração, Distribuição e Tarifas
slug: aneel
orgao: ANEEL
url_base: https://dadosabertos.aneel.gov.br/
tipo_acesso: API REST
autenticacao: Não requerida
formato_dados: [JSON, CSV]
frequencia_atualizacao: Mensal
campos_chave:
  - empreendimento
  - potencia_kw
  - tipo_geracao
  - distribuidora
  - tarifa
  - consumo_mwh
tags:
  - ANEEL
  - energia elétrica
  - geração
  - distribuição
  - tarifas
  - usinas
  - energia solar
  - energia eólica
  - matriz energética
cruzamento_com:
  - agencias-reguladoras/anp
  - ibge-estatisticas/pib-municipal
  - ibge-estatisticas/censo-demografico
  - dados-geoespaciais/ibge-geociencias
status: documentado
---

# ANEEL Energia Elétrica — Geração, Distribuição e Tarifas

## O que é

A **ANEEL (Agência Nacional de Energia Elétrica)** disponibiliza dados abertos sobre o setor elétrico brasileiro por meio de um portal baseado em CKAN. Os dados cobrem:

- **Empreendimentos de geração** — usinas hidrelétricas, termelétricas, eólicas, solares, biomassa (SIGA)
- **Geração distribuída** — micro e minigeração (sistemas fotovoltaicos residenciais e comerciais)
- **Tarifas** — tarifas de energia por distribuidora, classe de consumo, componentes tarifários
- **Distribuidoras** — indicadores de qualidade (DEC/FEC), área de concessão, consumidores atendidos
- **Compensação ambiental** — recursos financeiros destinados a compensação ambiental
- **Leilões** — resultados dos leilões de energia

O portal utiliza a plataforma CKAN, oferecendo API REST para consulta programática.

## Como acessar

| Item | Detalhe |
|---|---|
| **Portal CKAN** | `https://dadosabertos.aneel.gov.br/` |
| **API CKAN** | `https://dadosabertos.aneel.gov.br/api/3/action/` |
| **SIGA** | `https://app.powerbi.com/view?r=eyJrIjoiNjc4OGYyYjQtYWM2ZC00YjllLWJlYmEtYzdkNTQ1MTc1NjM2IiwidCI6IjQwZDZmOWI4LWVjYTctNDZhMi05MmQ0LWVhNGU5YzAxNzBlMSIsImMiOjR9` |
| **Autenticação** | Não requerida |
| **Formatos** | JSON (API), CSV (download) |

## Endpoints/recursos principais

### Datasets no portal CKAN

| Dataset | Conteúdo |
|---|---|
| `siga-sistema-de-informacoes-de-geracao-da-aneel` | Empreendimentos de geração |
| `relacao-de-empreendimentos-de-geracao-distribuida` | Geração distribuída (micro/mini) |
| `tarifas-de-energia-eletrica` | Tarifas por distribuidora |
| `indicadores-coletivos-de-continuidade` | DEC/FEC por distribuidora |
| `consumo-de-energia-eletrica` | Consumo por classe e distribuidora |

### API CKAN

| Endpoint | Descrição |
|---|---|
| `package_list` | Lista todos os datasets |
| `package_show?id={id}` | Metadados de um dataset |
| `datastore_search?resource_id={id}` | Consulta dados de um recurso |
| `datastore_search_sql?sql={query}` | Consulta SQL nos dados |

## Exemplo de uso

### Consultar empreendimentos de geração via API

```python
import requests
import pandas as pd

# Listar datasets disponíveis
url = "https://dadosabertos.aneel.gov.br/api/3/action/package_list"
response = requests.get(url)
datasets = response.json()["result"]
print(f"Datasets disponíveis: {len(datasets)}")

# Consultar dados de geração via datastore
url_siga = "https://dadosabertos.aneel.gov.br/api/3/action/datastore_search"
params = {
    "resource_id": "11ec447d-698d-4ab8-977f-b424d5deee6a",  # ID do recurso SIGA
    "limit": 100,
}

response = requests.get(url_siga, params=params)
dados = response.json()["result"]["records"]

df = pd.DataFrame(dados)
print(f"\nEmpreendimentos de geração: {len(df)}")
print(df[["NomEmpreendimento", "SigTipoGeracao", "MdaPotenciaFiscalizadaKw"]].head())
```

### Matriz energética brasileira

```python
import pandas as pd

# Download do CSV de empreendimentos de geração
df = pd.read_csv(
    "siga_empreendimentos.csv",
    sep=";",
    encoding="utf-8",
    dtype=str,
    decimal=","
)

df["MdaPotenciaFiscalizadaKw"] = pd.to_numeric(
    df["MdaPotenciaFiscalizadaKw"], errors="coerce"
)

# Potência instalada por tipo de geração
matriz = (
    df.groupby("SigTipoGeracao")["MdaPotenciaFiscalizadaKw"]
    .sum()
    .sort_values(ascending=False)
)

# Converter para GW
matriz_gw = (matriz / 1e6).round(1)
print("Matriz energética brasileira (GW instalado):")
print(matriz_gw)
```

## Campos disponíveis

### Empreendimentos de geração (SIGA)

| Campo | Tipo | Descrição |
|---|---|---|
| `NomEmpreendimento` | string | Nome do empreendimento |
| `SigTipoGeracao` | string | Tipo (UHE, PCH, UTE, EOL, UFV, etc.) |
| `DscFaseUsina` | string | Fase (Operação, Construção, Outorgado) |
| `MdaPotenciaOutorgadaKw` | float | Potência outorgada (kW) |
| `MdaPotenciaFiscalizadaKw` | float | Potência fiscalizada (kW) |
| `NomMunicipio` | string | Município |
| `SigUF` | string | UF |
| `NomRio` | string | Rio (para hidrelétricas) |
| `DscCombustivel` | string | Combustível (para termelétricas) |
| `DatEntradaOperacao` | date | Data de entrada em operação |

### Geração distribuída

| Campo | Tipo | Descrição |
|---|---|---|
| `MdaPotenciaInstaladaKW` | float | Potência instalada (kW) |
| `SigTipoConsumidor` | string | Tipo (Residencial, Comercial, Industrial) |
| `NomMunicipio` | string | Município |
| `NumCPFCNPJ` | string | CPF/CNPJ do titular (parcialmente mascarado) |
| `QtdUCRecebeCredito` | int | Unidades consumidoras que recebem crédito |
| `NomFonteGeracao` | string | Fonte (Solar, Eólica, etc.) |

## Cruzamentos possíveis

| Cruzamento | Fonte relacionada | Chave de ligação | Finalidade |
|---|---|---|---|
| Energia x PIB | [PIB Municipal](/docs/apis/ibge-estatisticas/pib-municipal) | Município | Correlacionar consumo de energia com atividade econômica |
| Energia x População | [Censo Demográfico](/docs/apis/ibge-estatisticas/censo-demografico) | Município | Calcular consumo per capita de energia |
| Energia x Petróleo | [ANP Petróleo e Gás](/docs/apis/agencias-reguladoras/anp) | UF | Analisar matriz energética completa (elétrica + combustíveis) |
| Usinas x Mapas | [IBGE Geociências](/docs/apis/dados-geoespaciais/ibge-geociencias) | Município, coordenadas | Georreferenciar empreendimentos de geração |

## Limitações conhecidas

| Limitação | Detalhes |
|---|---|
| **API CKAN limitada** | A API CKAN tem limitação de 32.000 registros por consulta. Para datasets maiores, é necessário paginar ou baixar o CSV completo. |
| **IDs de recurso instáveis** | Os IDs dos recursos no CKAN podem mudar quando os dados são atualizados. |
| **Dados de geração distribuída muito grandes** | O dataset de geração distribuída tem milhões de registros (cada instalação solar residencial é um registro). |
| **Tarifas complexas** | A estrutura tarifária é complexa (horário, fora de ponta, bandeira, etc.) e requer conhecimento do setor para interpretação correta. |
| **Sem dados de consumo individual** | Dados de consumo são agregados por distribuidora/classe, não por consumidor individual. |
