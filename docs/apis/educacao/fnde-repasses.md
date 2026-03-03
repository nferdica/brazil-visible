---
title: FNDE (Repasses)
slug: fnde-repasses
orgao: FNDE / MEC
url_base: https://www.fnde.gov.br/dadosabertos/dataset
tipo_acesso: CSV Download
autenticacao: Não requerida
formato_dados: [CSV]
frequencia_atualizacao: Anual
campos_chave: [código município, UF, programa, valor repasse, ano referência, ente federativo, ação orçamentária]
tags:
  - educação
  - FNDE
  - FUNDEB
  - merenda escolar
  - PNAE
  - transporte escolar
  - PNATE
  - repasses
  - financiamento educação
  - dados abertos
cruzamento_com:
  - censo-escolar
  - enem
  - censo-educacao-superior
  - transparencia-cgu/emendas-parlamentares
  - tesouro-nacional/siafi
  - ibge-estatisticas/pib-municipal
status: documentado
---

# FNDE (Repasses)

## O que é

O **Fundo Nacional de Desenvolvimento da Educação (FNDE)** é a autarquia federal vinculada ao **Ministério da Educação (MEC)** responsável pela execução de políticas educacionais e pela transferência de recursos financeiros a estados, municípios e entidades voltadas à educação. O FNDE disponibiliza dados abertos sobre os repasses realizados por meio de seus diversos programas.

Os principais programas com dados disponíveis incluem:

- **FUNDEB** (Fundo de Manutenção e Desenvolvimento da Educação Básica e de Valorização dos Profissionais da Educação) — principal mecanismo de financiamento da educação básica pública no Brasil, redistribuindo recursos entre estados e municípios com base no número de matrículas
- **PNAE** (Programa Nacional de Alimentação Escolar) — repasses para a merenda escolar, atendendo alunos de toda a educação básica pública
- **PNATE** (Programa Nacional de Apoio ao Transporte do Escolar) — recursos para transporte escolar de alunos da zona rural
- **PDDE** (Programa Dinheiro Direto na Escola) — transferência de recursos diretamente às escolas para manutenção e pequenos investimentos
- **Caminho da Escola** — recursos para aquisição de veículos de transporte escolar
- **Brasil Carinhoso** — complementação de recursos para creches

Esses dados permitem acompanhar o volume de investimento público em educação, identificar desigualdades regionais nos repasses e avaliar a efetividade dos programas educacionais.

**Fonte oficial:** https://www.fnde.gov.br/dadosabertos/dataset

**Portal de consulta:** https://www.fnde.gov.br/sigefweb/index.php/liberacoes

## Como acessar

| Item | Detalhe |
|---|---|
| **URL base** | `https://www.fnde.gov.br/dadosabertos/dataset` |
| **Consulta interativa** | `https://www.fnde.gov.br/sigefweb/index.php/liberacoes` |
| **Tipo de acesso** | Download de arquivos CSV / consulta via portal |
| **Autenticação** | Não requerida |
| **Formato** | CSV (delimitado por `;`, encoding UTF-8 ou Latin-1) |
| **Tamanho** | Variável por programa e ano (~10-200 MB por arquivo) |

### Fontes de dados

O FNDE disponibiliza dados por meio de diferentes canais:

| Canal | URL | Descrição |
|---|---|---|
| Portal de Dados Abertos do FNDE | `https://www.fnde.gov.br/dadosabertos/dataset` | Conjuntos de dados em CSV para download |
| SIGEF (Sistema de Gestão Financeira) | `https://www.fnde.gov.br/sigefweb/index.php/liberacoes` | Consulta interativa de liberações (repasses) |
| Portal da Transparência | `https://portaldatransparencia.gov.br` | Dados de transferências federais incluindo FNDE |
| dados.gov.br | `https://dados.gov.br/dados/organizacoes/visualizar/fnde` | Catálogo de dados abertos do FNDE |

## Endpoints/recursos principais

Como se trata de download de arquivos (e não de uma API REST), os "recursos" são os conjuntos de dados disponíveis:

| Conjunto de dados | Conteúdo | Periodicidade |
|---|---|---|
| Liberações FUNDEB | Valores repassados para complementação do FUNDEB por município | Anual |
| Liberações PNAE | Repasses do Programa Nacional de Alimentação Escolar por ente | Anual |
| Liberações PNATE | Repasses para transporte escolar por município | Anual |
| Liberações PDDE | Repasses diretos às escolas | Anual |
| Liberações Caminho da Escola | Repasses para aquisição de ônibus escolares | Anual |
| Resumo de liberações | Visão consolidada de todos os programas | Anual |

### SIGEF — Consulta de liberações

O SIGEF permite consulta interativa por:

- **Programa** (FUNDEB, PNAE, PNATE, PDDE, etc.)
- **UF / Município**
- **Ano de referência**
- **Ação orçamentária**

A consulta pode ser exportada em CSV diretamente pela interface web.

## Exemplo de uso

### Download e leitura dos dados de repasses

```python
import pandas as pd
from pathlib import Path

# Após baixar o CSV de liberações do portal do FNDE
# (ou exportar do SIGEF)
arquivo_csv = Path("liberacoes_fnde_2023.csv")

# Ler o CSV
df = pd.read_csv(
    arquivo_csv,
    sep=";",
    encoding="utf-8",
    dtype=str,
    decimal=",",
)

print(f"Total de registros: {len(df):,}")
print(f"Colunas: {list(df.columns)}")
print(df.head())
```

### Análise de repasses do FUNDEB por UF

```python
# Converter valores para numérico
# O campo de valor pode usar vírgula como separador decimal
df["VL_REPASSE"] = (
    df["VL_REPASSE"]
    .str.replace(".", "", regex=False)
    .str.replace(",", ".", regex=False)
    .astype(float)
)

# Filtrar apenas FUNDEB
df_fundeb = df[df["NO_PROGRAMA"].str.contains("FUNDEB", case=False, na=False)]

# Total repassado por UF
repasses_uf = (
    df_fundeb.groupby("SG_UF")["VL_REPASSE"]
    .sum()
    .sort_values(ascending=False)
)

print("Repasses FUNDEB por UF (R$):")
for uf, valor in repasses_uf.items():
    print(f"  {uf}: R$ {valor:,.2f}")

total = repasses_uf.sum()
print(f"\nTotal FUNDEB: R$ {total:,.2f}")
```

### Repasses per capita por município (cruzamento com população)

```python
# Supondo que temos os dados de população do IBGE
df_pop = pd.read_csv(
    "populacao_municipios_ibge.csv",
    sep=";",
    dtype={"CO_MUNICIPIO": str},
)

# Agregar repasses por município
repasses_mun = (
    df_fundeb.groupby("CO_MUNICIPIO")["VL_REPASSE"]
    .sum()
    .reset_index()
)

# Cruzar com população
df_per_capita = repasses_mun.merge(
    df_pop[["CO_MUNICIPIO", "POPULACAO", "NO_MUNICIPIO"]],
    on="CO_MUNICIPIO",
    how="left",
)

df_per_capita["REPASSE_PER_CAPITA"] = (
    df_per_capita["VL_REPASSE"] / df_per_capita["POPULACAO"]
)

# Top 10 municípios com maior repasse per capita
top10 = df_per_capita.nlargest(10, "REPASSE_PER_CAPITA")
print("Top 10 municípios — FUNDEB per capita:")
for _, row in top10.iterrows():
    print(f"  {row['NO_MUNICIPIO']}: R$ {row['REPASSE_PER_CAPITA']:,.2f}/hab")
```

### Evolução dos repasses ao longo dos anos

```python
import glob

# Carregar dados de múltiplos anos
arquivos = sorted(glob.glob("liberacoes_fnde_*.csv"))
dfs = []

for arq in arquivos:
    df_ano = pd.read_csv(arq, sep=";", encoding="utf-8", dtype=str, decimal=",")
    dfs.append(df_ano)

df_todos = pd.concat(dfs, ignore_index=True)

# Converter valor
df_todos["VL_REPASSE"] = (
    df_todos["VL_REPASSE"]
    .str.replace(".", "", regex=False)
    .str.replace(",", ".", regex=False)
    .astype(float)
)

# Evolução por programa
evolucao = (
    df_todos.groupby(["NU_ANO", "NO_PROGRAMA"])["VL_REPASSE"]
    .sum()
    .unstack(fill_value=0)
)

print("Evolução dos repasses por programa (R$ bilhões):")
print((evolucao / 1e9).round(2).to_string())
```

### Análise de merenda escolar (PNAE) por município

```python
# Filtrar PNAE
df_pnae = df[df["NO_PROGRAMA"].str.contains("PNAE|Alimentação", case=False, na=False)]

df_pnae["VL_REPASSE"] = (
    df_pnae["VL_REPASSE"]
    .str.replace(".", "", regex=False)
    .str.replace(",", ".", regex=False)
    .astype(float)
)

# Total repassado para merenda por UF
pnae_uf = (
    df_pnae.groupby("SG_UF")["VL_REPASSE"]
    .sum()
    .sort_values(ascending=False)
)

print("Repasses PNAE (Merenda Escolar) por UF:")
for uf, valor in pnae_uf.items():
    print(f"  {uf}: R$ {valor:,.2f}")
```

## Campos disponíveis

### Dados de liberações (repasses)

| Campo | Tipo | Descrição |
|---|---|---|
| `NU_ANO` | int | Ano de referência do repasse |
| `CO_PROGRAMA` | string | Código do programa (ex: FUNDEB, PNAE) |
| `NO_PROGRAMA` | string | Nome do programa |
| `DS_ACAO` | string | Descrição da ação orçamentária |
| `SG_UF` | string | Sigla da UF do beneficiário |
| `CO_MUNICIPIO` | string | Código do município (IBGE) |
| `NO_MUNICIPIO` | string | Nome do município |
| `CO_ENTIDADE` | string | Código da entidade beneficiária (quando aplicável) |
| `NO_ENTIDADE` | string | Nome da entidade beneficiária |
| `VL_REPASSE` | float | Valor do repasse (R$) |
| `DT_REPASSE` | date | Data do repasse |
| `TP_ESFERA` | string | Esfera: Estadual ou Municipal |

### Dados específicos do FUNDEB

| Campo | Tipo | Descrição |
|---|---|---|
| `VL_COMPLEMENTACAO_UNIAO` | float | Valor da complementação da União ao FUNDEB |
| `QT_MATRICULAS` | int | Quantidade de matrículas utilizadas como base de cálculo |
| `VL_POR_ALUNO` | float | Valor por aluno repassado |
| `TP_ETAPA_ENSINO` | string | Etapa de ensino (creche, pré-escola, fundamental, médio) |

### Dados específicos do PNAE

| Campo | Tipo | Descrição |
|---|---|---|
| `QT_ALUNOS_ATENDIDOS` | int | Quantidade de alunos atendidos pela alimentação escolar |
| `VL_PER_CAPITA_DIA` | float | Valor per capita por dia letivo |
| `TP_MODALIDADE` | string | Modalidade de ensino atendida |

> **Nota:** Os campos disponíveis podem variar conforme o programa e o formato de exportação. Verifique a documentação específica de cada conjunto de dados.

## Cruzamentos possíveis

| Cruzamento | Fonte relacionada | Chave de ligação | Finalidade |
|---|---|---|---|
| FUNDEB x Censo Escolar | [Censo Escolar](/docs/apis/educacao/censo-escolar) | `CO_MUNICIPIO` | Avaliar se repasses do FUNDEB refletem em melhorias na infraestrutura escolar |
| FUNDEB x ENEM | [ENEM (Microdados)](/docs/apis/educacao/enem) | `CO_MUNICIPIO` | Correlacionar investimento em educação com desempenho dos alunos no ENEM |
| Repasses x Emendas parlamentares | [Emendas Parlamentares](/docs/apis/transparencia-cgu/emendas-parlamentares) | `CO_MUNICIPIO` | Identificar municípios que recebem recursos adicionais via emendas para educação |
| Repasses x SIAFI | [Tesouro Nacional — SIAFI](/docs/apis/tesouro-nacional/siafi) | Ação orçamentária | Detalhar a execução orçamentária das transferências para educação |
| Repasses x PIB Municípios | IBGE — PIB Municípios | `CO_MUNICIPIO` | Analisar a proporção de repasses educacionais em relação ao PIB municipal |
| Repasses x Censo Demográfico | IBGE — Censo Demográfico | `CO_MUNICIPIO` | Calcular repasse per capita e comparar com indicadores socioeconômicos |

### Exemplo de cruzamento: FUNDEB x Censo Escolar

```python
import pandas as pd

# 1. Carregar repasses FUNDEB
df_fundeb = pd.read_csv(
    "liberacoes_fnde_2023.csv",
    sep=";",
    encoding="utf-8",
    dtype=str,
    decimal=",",
)

df_fundeb["VL_REPASSE"] = (
    df_fundeb["VL_REPASSE"]
    .str.replace(".", "", regex=False)
    .str.replace(",", ".", regex=False)
    .astype(float)
)

# Filtrar FUNDEB e agregar por município
fundeb_mun = (
    df_fundeb[df_fundeb["NO_PROGRAMA"].str.contains("FUNDEB", case=False, na=False)]
    .groupby("CO_MUNICIPIO")["VL_REPASSE"]
    .sum()
    .reset_index()
)

# 2. Carregar dados de escolas (Censo Escolar)
df_escolas = pd.read_csv(
    "dados_censo_escolar/ESCOLAS.CSV",
    sep="|",
    encoding="latin-1",
    dtype=str,
    usecols=["CO_MUNICIPIO", "CO_ENTIDADE", "TP_DEPENDENCIA",
             "IN_INTERNET", "IN_BIBLIOTECA", "IN_LABORATORIO_INFORMATICA"],
)

# Filtrar escolas públicas (estadual + municipal)
df_publicas = df_escolas[df_escolas["TP_DEPENDENCIA"].isin(["2", "3"])]

# Calcular indicadores de infraestrutura por município
for col in ["IN_INTERNET", "IN_BIBLIOTECA", "IN_LABORATORIO_INFORMATICA"]:
    df_publicas[col] = pd.to_numeric(df_publicas[col], errors="coerce")

infra_mun = (
    df_publicas.groupby("CO_MUNICIPIO")
    .agg(
        qtd_escolas=("CO_ENTIDADE", "count"),
        pct_internet=("IN_INTERNET", "mean"),
        pct_biblioteca=("IN_BIBLIOTECA", "mean"),
    )
    .reset_index()
)

# 3. Cruzar FUNDEB com infraestrutura
df_analise = fundeb_mun.merge(infra_mun, on="CO_MUNICIPIO", how="inner")
df_analise["REPASSE_POR_ESCOLA"] = df_analise["VL_REPASSE"] / df_analise["qtd_escolas"]

# Correlação entre repasse por escola e infraestrutura
correlacao = df_analise[["REPASSE_POR_ESCOLA", "pct_internet", "pct_biblioteca"]].corr()
print("Correlação entre repasse por escola e infraestrutura:")
print(correlacao.round(3).to_string())
```

## Limitações conhecidas

| Limitação | Detalhes |
|---|---|
| **Dados fragmentados** | Os dados do FNDE estão espalhados em diferentes portais (site do FNDE, SIGEF, Portal da Transparência, dados.gov.br), sem um ponto centralizado de acesso. |
| **Formato inconsistente** | Os arquivos CSV podem ter estruturas diferentes dependendo do programa e do ano. Campos e nomes de colunas podem variar entre edições. |
| **Valores com formato brasileiro** | Valores monetários usam ponto como separador de milhar e vírgula como separador decimal (ex: `1.234.567,89`). Requer tratamento antes de converter para numérico. |
| **Granularidade variável** | Alguns programas reportam dados por município, outros por escola, e outros por ente federativo. A granularidade depende do programa consultado. |
| **Defasagem na publicação** | Os dados consolidados de um exercício podem levar meses para serem publicados no portal de dados abertos. |
| **SIGEF com navegação complexa** | O SIGEF (Sistema de Gestão Financeira) permite consulta detalhada, mas a interface web pode ser lenta e difícil de navegar programaticamente. |
| **Sem API REST** | Não existe uma API REST padronizada para consulta automatizada. É necessário baixar arquivos ou fazer scraping do portal de consulta. |
| **Encoding variável** | O encoding dos arquivos pode ser UTF-8 ou Latin-1 dependendo da fonte e do ano de publicação. |
| **Dados de complementação do FUNDEB** | Os valores de complementação da União ao FUNDEB podem ser encontrados em fontes diferentes com pequenas divergências, dependendo se o dado é da liberação ou da execução. |
| **Nomenclatura de programas muda** | Programas podem ter seus nomes alterados entre anos (ex: FUNDEF -> FUNDEB), exigindo mapeamento para análises históricas. |
