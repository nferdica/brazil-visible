---
title: PNAD Contínua — Pesquisa Nacional por Amostra de Domicílios
slug: pnad-continua
orgao: IBGE
url_base: https://servicodados.ibge.gov.br/api/v3/agregados
tipo_acesso: API REST
autenticacao: Não requerida
formato_dados: [JSON, CSV]
frequencia_atualizacao: Trimestral
campos_chave:
  - taxa_desocupacao
  - populacao_ocupada
  - rendimento_medio
  - taxa_informalidade
  - nivel_instrucao
tags:
  - IBGE
  - PNAD
  - emprego
  - desemprego
  - renda
  - informalidade
  - mercado de trabalho
  - pesquisa amostral
cruzamento_com:
  - trabalho-emprego/caged
  - trabalho-emprego/rais
  - ibge-estatisticas/censo-demografico
  - ibge-estatisticas/ipca-inflacao
status: documentado
---

# PNAD Contínua — Pesquisa Nacional por Amostra de Domicílios

## O que é

A **PNAD Contínua (Pesquisa Nacional por Amostra de Domicílios Contínua)** é a principal pesquisa amostral do **IBGE** sobre o mercado de trabalho brasileiro. Realizada trimestralmente, cobre todo o território nacional e produz indicadores fundamentais como:

- **Taxa de desocupação** — percentual de pessoas desempregadas na força de trabalho
- **População ocupada** — total de pessoas trabalhando (formal e informal)
- **Rendimento médio real** — renda média habitual do trabalho
- **Taxa de informalidade** — percentual de trabalhadores sem carteira/registro
- **Subutilização** — subocupados por insuficiência de horas e desalentados
- **Nível de instrução** — escolaridade da população ocupada

A PNAD Contínua substitui a antiga PNAD (anual) e a PME (mensal), oferecendo dados trimestrais com representatividade para Brasil, Grandes Regiões e UFs. Divulgações mensais e anuais complementam os dados trimestrais.

## Como acessar

| Item | Detalhe |
|---|---|
| **API Agregados (SIDRA)** | `https://servicodados.ibge.gov.br/api/v3/agregados` |
| **API SIDRA clássica** | `https://apisidra.ibge.gov.br/` |
| **Microdados** | `https://www.ibge.gov.br/estatisticas/sociais/trabalho/17270-pnad-continua.html` |
| **Autenticação** | Não requerida |
| **Formatos** | JSON (API), CSV (microdados) |
| **CORS** | Habilitado |
| **Periodicidade** | Trimestral (microdados) / Mensal (indicadores selecionados) |

### Principais tabelas SIDRA

| Tabela | Código | Conteúdo | Periodicidade |
|---|---|---|---|
| Taxa de desocupação | 4099 | Desemprego por UF | Trimestral |
| População ocupada | 4093 | Ocupados por posição na ocupação | Trimestral |
| Rendimento médio | 5439 | Rendimento habitual médio | Trimestral |
| Nível de instrução | 4094 | Ocupados por escolaridade | Trimestral |
| Taxa de informalidade | 4099 | Informalidade por UF | Trimestral |

## Endpoints/recursos principais

### API SIDRA — Tabelas da PNAD Contínua

| Endpoint | Descrição |
|---|---|
| `/values/t/4099/n1/all/v/4099/p/last` | Taxa de desocupação — Brasil (último trimestre) |
| `/values/t/4099/n3/all/v/4099/p/last` | Taxa de desocupação — por UF |
| `/values/t/4093/n1/all/v/1641/p/last` | População ocupada — Brasil |
| `/values/t/5439/n1/all/v/5935/p/last` | Rendimento médio habitual — Brasil |

### Parâmetros da API

- `t/{codigo}` — código da tabela
- `n1` = Brasil, `n3` = UF
- `v/{variavel}` — código da variável
- `p/last` = último período disponível, `p/last 4` = últimos 4 trimestres
- `c11913/{codigo}` — classificação (ex: posição na ocupação)

## Exemplo de uso

### Taxa de desocupação por UF

```python
import requests
import pandas as pd

# Taxa de desocupação por UF — último trimestre
url = "https://apisidra.ibge.gov.br/values/t/4099/n3/all/v/4099/p/last"

response = requests.get(url)
response.raise_for_status()
dados = response.json()

# Converter para DataFrame (primeira linha é cabeçalho)
df = pd.DataFrame(dados[1:])
df.columns = dados[0].values()

df["Valor"] = pd.to_numeric(df["Valor"], errors="coerce")

print("Taxa de desocupação por UF (%):")
print(
    df[["Unidade da Federação", "Valor"]]
    .sort_values("Valor", ascending=False)
    .to_string(index=False)
)
```

### Série histórica trimestral

```python
import requests
import pandas as pd

# Taxa de desocupação — Brasil — últimos 20 trimestres
url = "https://apisidra.ibge.gov.br/values/t/4099/n1/all/v/4099/p/last%2020"

response = requests.get(url)
response.raise_for_status()
dados = response.json()

df = pd.DataFrame(dados[1:])
df.columns = dados[0].values()
df["Valor"] = pd.to_numeric(df["Valor"], errors="coerce")

print("Evolução da taxa de desocupação (%):")
for _, row in df.iterrows():
    print(f"  {row['Trimestre (Código)']}: {row['Valor']:.1f}%")
```

### Microdados da PNAD Contínua

```python
import pandas as pd

# Após download dos microdados do site do IBGE
# https://www.ibge.gov.br/estatisticas/sociais/trabalho/17270-pnad-continua.html

df = pd.read_csv(
    "PNADC_2024_trimestre1.csv",
    sep=",",
    dtype=str,
)

print(f"Total de registros: {len(df):,}")

# Calcular taxa de desocupação (VD4002: condição de ocupação)
df["peso"] = pd.to_numeric(df["V1028"], errors="coerce")
df["VD4002"] = pd.to_numeric(df["VD4002"], errors="coerce")

# VD4002: 1=Ocupado, 2=Desocupado
pea = df[df["VD4002"].isin([1, 2])]
desocupados = pea[pea["VD4002"] == 2]["peso"].sum()
total_pea = pea["peso"].sum()

taxa = (desocupados / total_pea) * 100
print(f"Taxa de desocupação calculada: {taxa:.1f}%")
```

## Campos disponíveis

### Indicadores via API (tabelas SIDRA)

| Variável | Código | Descrição |
|---|---|---|
| Taxa de desocupação | 4099 | % de desocupados na força de trabalho |
| População ocupada | 1641 | Total de pessoas ocupadas (milhares) |
| Rendimento médio | 5935 | Rendimento habitual médio real (R$) |
| Taxa de informalidade | 4099 | % de informais na população ocupada |
| Nível de instrução | variável | Distribuição por escolaridade |

### Microdados (campos selecionados)

| Campo | Tipo | Descrição |
|---|---|---|
| `UF` | int | Código da UF |
| `V1028` | float | Peso amostral |
| `V2007` | int | Sexo (1=Homem, 2=Mulher) |
| `V2009` | int | Idade |
| `V2010` | int | Cor/raça |
| `VD3004` | int | Nível de instrução |
| `VD4001` | int | Condição em relação à força de trabalho |
| `VD4002` | int | Condição de ocupação (1=Ocupado, 2=Desocupado) |
| `VD4009` | int | Posição na ocupação |
| `VD4016` | float | Rendimento habitual do trabalho principal |
| `VD4019` | float | Rendimento habitual de todos os trabalhos |
| `VD4020` | float | Rendimento efetivo de todos os trabalhos |

## Cruzamentos possíveis

| Cruzamento | Fonte relacionada | Chave de ligação | Finalidade |
|---|---|---|---|
| Desemprego x CAGED | [CAGED](/docs/apis/trabalho-emprego/caged) | UF, período | Comparar indicadores amostrais com registros administrativos |
| Emprego x RAIS | [RAIS](/docs/apis/trabalho-emprego/rais) | UF, setor | Comparar emprego total (PNAD) com emprego formal (RAIS) |
| Renda x Inflação | [IPCA/Inflação](/docs/apis/ibge-estatisticas/ipca-inflacao) | período | Analisar rendimento real vs. inflação |
| Emprego x População | [Censo Demográfico](/docs/apis/ibge-estatisticas/censo-demografico) | UF | Comparar estimativas da PNAD com dados censitários |

## Limitações conhecidas

| Limitação | Detalhes |
|---|---|
| **Pesquisa amostral** | A PNAD Contínua é uma pesquisa amostral, não um registro administrativo. Estimativas para áreas menores (municípios) não são disponíveis trimestralmente. |
| **Representatividade** | Dados trimestrais são representativos para Brasil, Grandes Regiões e UFs. Dados anuais cobrem capitais e regiões metropolitanas. |
| **Defasagem** | Os microdados trimestrais são publicados com ~3 meses de atraso. |
| **Microdados complexos** | Os microdados requerem aplicação de peso amostral (`V1028`) para produzir estimativas corretas. |
| **Quebra de série** | A PNAD Contínua iniciou em 2012, substituindo a PNAD e a PME. Comparações com anos anteriores requerem cuidados metodológicos. |
| **Informalidade** | O conceito de informalidade pode variar entre publicações (inclui ou não MEIs, empregadores sem CNPJ, etc.). |
