---
title: ANTT Concessões Rodoviárias — Frotas, Tarifas e Concessões
slug: antt-concessoes
orgao: ANTT
url_base: https://dados.antt.gov.br/
tipo_acesso: CSV Download
autenticacao: Não requerida
formato_dados: [CSV]
frequencia_atualizacao: Mensal
campos_chave:
  - concessionaria
  - rodovia
  - praca_pedagio
  - tarifa
  - volume_trafego
tags:
  - ANTT
  - concessões rodoviárias
  - pedágio
  - transporte rodoviário
  - frotas
  - tarifas
  - rodovias
cruzamento_com:
  - infraestrutura-transportes/dnit-malha-rodoviaria
  - infraestrutura-transportes/denatran-renavam
  - infraestrutura-transportes/prf-acidentes
status: documentado
---

# ANTT Concessões Rodoviárias — Frotas, Tarifas e Concessões

## O que é

A **ANTT (Agência Nacional de Transportes Terrestres)** regula e fiscaliza as concessões de rodovias federais, transporte rodoviário de cargas e passageiros, e ferrovias. O portal de dados abertos da ANTT disponibiliza informações sobre:

- **Concessões rodoviárias** — concessionárias, trechos, quilometragem, prazo de concessão
- **Pedágio** — praças de pedágio, tarifas vigentes, volume de tráfego
- **Transporte de cargas** — RNTRC (Registro Nacional de Transportadores Rodoviários de Cargas), frotas
- **Transporte de passageiros** — linhas, horários, empresas autorizadas
- **Ferrovias** — malha ferroviária concedida, volume de carga transportada

## Como acessar

| Item | Detalhe |
|---|---|
| **Portal de dados** | `https://dados.antt.gov.br/` |
| **Portal ANTT** | `https://www.gov.br/antt/` |
| **Autenticação** | Não requerida |
| **Formato** | CSV |
| **Plataforma** | CKAN |

## Endpoints/recursos principais

| Recurso | Conteúdo | Periodicidade |
|---|---|---|
| **Concessões rodoviárias** | Lista de concessões ativas, trechos, concessionária | Atualização contínua |
| **Praças de pedágio** | Localização, tarifas por categoria de veículo | Mensal |
| **Volume de tráfego** | Veículos por praça de pedágio | Mensal |
| **RNTRC** | Cadastro de transportadores de cargas | Atualização contínua |
| **Linhas de ônibus** | Transporte rodoviário interestadual de passageiros | Atualização contínua |
| **Ferrovias** | Malha concedida, volume de carga | Anual |

## Exemplo de uso

### Consultar tarifas de pedágio

```python
import pandas as pd

# Download do dataset de tarifas de pedágio do portal CKAN da ANTT
# URL varia — consultar https://dados.antt.gov.br/
df = pd.read_csv(
    "tarifas_pedagio.csv",
    sep=";",
    encoding="utf-8",
    dtype=str,
    decimal=","
)

print(f"Total de praças de pedágio: {len(df):,}")
print(f"Colunas: {list(df.columns)}")

# Converter tarifa para numérico
df["TARIFA"] = pd.to_numeric(
    df["TARIFA"].str.replace(",", "."), errors="coerce"
)

# Média de tarifa por concessionária
media = df.groupby("CONCESSIONARIA")["TARIFA"].mean().sort_values(ascending=False)
print("\nTarifa média por concessionária:")
print(media.round(2))
```

### Análise de volume de tráfego

```python
import pandas as pd

df_trafego = pd.read_csv(
    "volume_trafego.csv",
    sep=";",
    encoding="utf-8",
    dtype=str,
    decimal=","
)

df_trafego["VOLUME"] = pd.to_numeric(df_trafego["VOLUME"], errors="coerce")

# Volume total por rodovia
por_rodovia = df_trafego.groupby("RODOVIA")["VOLUME"].sum().sort_values(ascending=False)
print("Volume de tráfego por rodovia:")
print(por_rodovia.head(10))
```

## Campos disponíveis

### Concessões rodoviárias

| Campo | Tipo | Descrição |
|---|---|---|
| `CONCESSIONARIA` | string | Nome da concessionária |
| `RODOVIA` | string | Identificação da rodovia (ex: BR-116) |
| `TRECHO` | string | Descrição do trecho concedido |
| `EXTENSAO_KM` | float | Extensão em quilômetros |
| `UF` | string | UF(s) do trecho |
| `DATA_CONTRATO` | date | Data de assinatura do contrato |
| `PRAZO_CONCESSAO` | int | Prazo da concessão em anos |

### Praças de pedágio

| Campo | Tipo | Descrição |
|---|---|---|
| `PRACA` | string | Nome da praça de pedágio |
| `RODOVIA` | string | Rodovia |
| `KM` | float | Quilômetro da praça |
| `CONCESSIONARIA` | string | Concessionária |
| `TARIFA` | float | Tarifa básica (automóvel) em R$ |
| `CATEGORIA` | int | Categoria do veículo |

## Cruzamentos possíveis

| Cruzamento | Fonte relacionada | Chave de ligação | Finalidade |
|---|---|---|---|
| Concessões x Malha rodoviária | [DNIT Malha Rodoviária](/docs/apis/infraestrutura-transportes/dnit-malha-rodoviaria) | Rodovia, UF | Comparar trechos concedidos com malha total |
| Tráfego x Frota | [DENATRAN/RENAVAM](/docs/apis/infraestrutura-transportes/denatran-renavam) | UF | Relacionar volume de tráfego com frota de veículos |
| Concessões x Acidentes | [PRF Acidentes](/docs/apis/infraestrutura-transportes/prf-acidentes) | Rodovia, km | Analisar acidentes em trechos concedidos vs. não concedidos |

## Limitações conhecidas

| Limitação | Detalhes |
|---|---|
| **Portal CKAN instável** | O portal dados.antt.gov.br pode apresentar indisponibilidade. |
| **Dados nem sempre atualizados** | Alguns datasets podem estar desatualizados no portal. |
| **Sem API REST** | Os dados são disponibilizados apenas como arquivos CSV para download. |
| **Formato inconsistente** | O formato dos CSVs pode variar entre datasets (separador, encoding, nomes de colunas). |
| **Cobertura parcial** | Apenas concessões federais. Concessões estaduais (ex: ARTESP em SP) são reguladas por agências estaduais. |
