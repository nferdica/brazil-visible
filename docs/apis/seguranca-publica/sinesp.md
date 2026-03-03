---
title: SINESP — Estatísticas de Criminalidade
slug: sinesp
orgao: MJSP
url_base: https://www.gov.br/mj/pt-br/assuntos/sua-seguranca/seguranca-publica/estatistica
tipo_acesso: CSV Download
autenticacao: Não requerida
formato_dados: [CSV, XLSX]
frequencia_atualizacao: Mensal
campos_chave:
  - uf
  - municipio
  - tipo_crime
  - ocorrencias
  - vitimas
  - ano_mes
tags:
  - SINESP
  - criminalidade
  - segurança pública
  - homicídios
  - ocorrências
  - armas
  - violência
  - MJSP
cruzamento_com:
  - ibge-estatisticas/censo-demografico
  - ibge-estatisticas/pib-municipal
  - infraestrutura-transportes/prf-acidentes
  - ipea/ipeadata
status: documentado
---

# SINESP — Estatísticas de Criminalidade

## O que é

O **SINESP (Sistema Nacional de Informações de Segurança Pública)** é o sistema integrado de dados de segurança pública do Brasil, gerenciado pelo **MJSP (Ministério da Justiça e Segurança Pública)**. O sistema consolida estatísticas criminais de todo o país, incluindo:

- **Ocorrências policiais** — registros de crimes por tipo (homicídio, roubo, furto, estupro, tráfico, etc.)
- **Mortes violentas intencionais** — homicídios dolosos, latrocínios, lesão corporal seguida de morte
- **Armas de fogo** — apreensões, registros, rastreamento
- **Sistema prisional** — população carcerária, vagas, estabelecimentos penais (INFOPEN)
- **Mandados de prisão** — Banco Nacional de Mandados de Prisão (BNMP)
- **Desaparecidos** — cadastro de pessoas desaparecidas

Os dados agregados são disponibilizados publicamente no portal de estatísticas do MJSP. Dados detalhados (microdados por ocorrência) são de acesso restrito às forças de segurança.

## Como acessar

| Item | Detalhe |
|---|---|
| **Estatísticas MJSP** | `https://www.gov.br/mj/pt-br/assuntos/sua-seguranca/seguranca-publica/estatistica` |
| **Painel SINESP** | `https://app.powerbi.com/view?r=eyJrIjoiYWIxNjMzNDUtZjk3Ni00ZjlhLWExZDgtNjU` |
| **dados.gov.br** | `https://dados.gov.br/dados/conjuntos-dados/sistema-nacional-de-estatisticas-de-seguranca-publica` |
| **Fórum Brasileiro de Segurança Pública** | `https://forumseguranca.org.br/` |
| **Autenticação** | Não requerida (dados agregados) |
| **Formato** | CSV, XLSX |

### Fontes complementares

| Fonte | Descrição |
|---|---|
| **Atlas da Violência (IPEA)** | Indicadores de violência por município e UF |
| **Fórum Brasileiro de Segurança Pública** | Anuário com dados consolidados e análises |
| **SIM/DATASUS** | Mortes por causas externas (dados de saúde) |

## Endpoints/recursos principais

| Recurso | Conteúdo | Periodicidade |
|---|---|---|
| **Ocorrências policiais** | Registros por tipo de crime, UF e mês | Mensal |
| **Mortes violentas** | Homicídios dolosos, latrocínios por UF | Mensal |
| **INFOPEN** | População carcerária, vagas, estabelecimentos | Semestral |
| **Apreensões de armas** | Armas de fogo apreendidas por UF | Mensal |
| **Atlas da Violência** | Indicadores de violência (IPEA) | Anual |

## Exemplo de uso

### Análise de homicídios por UF

```python
import pandas as pd

# Download das estatísticas de segurança pública
# https://dados.gov.br/dados/conjuntos-dados/sistema-nacional-de-estatisticas-de-seguranca-publica
df = pd.read_csv(
    "indicadores_seguranca_publica.csv",
    sep=";",
    encoding="utf-8",
    dtype=str,
    decimal=","
)

print(f"Total de registros: {len(df):,}")
print(f"Colunas: {list(df.columns)}")

# Filtrar homicídios dolosos
df["OCORRENCIAS"] = pd.to_numeric(df["OCORRENCIAS"], errors="coerce")
homicidios = df[df["TIPO_CRIME"] == "Homicídio doloso"]

# Total por UF
por_uf = (
    homicidios.groupby("UF")["OCORRENCIAS"]
    .sum()
    .sort_values(ascending=False)
)

print("\nHomicídios dolosos por UF:")
print(por_uf.head(10))
```

### Série temporal de violência

```python
import pandas as pd

df = pd.read_csv(
    "indicadores_seguranca_publica.csv",
    sep=";",
    encoding="utf-8",
    dtype=str,
    decimal=","
)

df["OCORRENCIAS"] = pd.to_numeric(df["OCORRENCIAS"], errors="coerce")

# Evolução mensal de mortes violentas intencionais (MVI)
mvi = df[df["TIPO_CRIME"] == "Mortes violentas intencionais"]
serie = mvi.groupby("ANO_MES")["OCORRENCIAS"].sum()

print("Evolução de mortes violentas intencionais:")
print(serie.tail(12))
```

### Taxa de homicídios por 100 mil habitantes

```python
import pandas as pd

# Carregar dados de criminalidade e população
df_crime = pd.read_csv("indicadores_seguranca_publica.csv", sep=";", encoding="utf-8", dtype=str, decimal=",")
df_crime["OCORRENCIAS"] = pd.to_numeric(df_crime["OCORRENCIAS"], errors="coerce")

# Homicídios por UF (total anual)
homicidios = (
    df_crime[df_crime["TIPO_CRIME"] == "Homicídio doloso"]
    .groupby("UF")["OCORRENCIAS"]
    .sum()
)

# População estimada por UF (simplificado)
populacao = {
    "SP": 46e6, "MG": 21e6, "RJ": 17e6, "BA": 15e6,
    "PR": 11.5e6, "RS": 11.4e6, "PE": 9.6e6, "CE": 9.2e6,
}

# Calcular taxa
taxa = {}
for uf, pop in populacao.items():
    if uf in homicidios.index:
        taxa[uf] = (homicidios[uf] / pop) * 100000

taxa_df = pd.Series(taxa).sort_values(ascending=False)
print("Taxa de homicídios por 100 mil habitantes:")
print(taxa_df.round(1))
```

## Campos disponíveis

### Indicadores de segurança pública

| Campo | Tipo | Descrição |
|---|---|---|
| `UF` | string | Unidade da Federação |
| `MUNICIPIO` | string | Município (quando disponível) |
| `ANO` | int | Ano de referência |
| `MES` | int | Mês de referência |
| `ANO_MES` | string | Período (AAAAMM) |
| `TIPO_CRIME` | string | Tipo de crime/indicador |
| `OCORRENCIAS` | int | Número de ocorrências |
| `VITIMAS` | int | Número de vítimas |

### Tipos de crime disponíveis

| Indicador | Descrição |
|---|---|
| Homicídio doloso | Homicídio intencional |
| Latrocínio | Roubo seguido de morte |
| Lesão corporal seguida de morte | Agressão que resulta em óbito |
| Mortes violentas intencionais (MVI) | Soma dos três indicadores acima |
| Estupro | Violência sexual |
| Roubo de veículo | Roubo com uso de violência |
| Furto de veículo | Subtração sem violência |

## Cruzamentos possíveis

| Cruzamento | Fonte relacionada | Chave de ligação | Finalidade |
|---|---|---|---|
| Crime x População | [Censo Demográfico](/docs/apis/ibge-estatisticas/censo-demografico) | UF, município | Calcular taxas de criminalidade per capita |
| Crime x PIB | [PIB Municipal](/docs/apis/ibge-estatisticas/pib-municipal) | Município | Correlacionar violência com indicadores econômicos |
| Crime x Trânsito | [PRF Acidentes](/docs/apis/infraestrutura-transportes/prf-acidentes) | UF | Comparar mortes violentas com mortes no trânsito |
| Crime x Atlas Violência | [Ipeadata](/docs/apis/ipea/ipeadata) | UF, município | Complementar com indicadores do Atlas da Violência (IPEA) |

## Limitações conhecidas

| Limitação | Detalhes |
|---|---|
| **Microdados restritos** | Os microdados de ocorrências (nível individual) são restritos às forças de segurança. Dados públicos são agregados por UF/município e mês. |
| **Subnotificação** | Muitos crimes não são registrados em boletim de ocorrência, especialmente furtos, agressões e crimes sexuais. Os dados refletem apenas registros oficiais. |
| **Padronização incompleta** | As tipificações de crimes variam entre estados. O SINESP busca padronizar, mas diferenças metodológicas persistem. |
| **Defasagem na publicação** | Os dados podem ser publicados com meses de atraso em relação ao período de referência. |
| **Sem dados municipais completos** | Dados por município não estão disponíveis para todos os indicadores e períodos. |
| **INFOPEN desatualizado** | Os dados do sistema prisional (INFOPEN) são frequentemente publicados com grande atraso (anos). |
