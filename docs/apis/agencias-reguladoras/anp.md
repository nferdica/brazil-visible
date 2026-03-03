---
title: ANP Petróleo e Gás — Produção e Preços de Combustíveis
slug: anp
orgao: ANP
url_base: https://www.gov.br/anp/pt-br/centrais-de-conteudo/dados-abertos
tipo_acesso: CSV Download
autenticacao: Não requerida
formato_dados: [CSV, XLSX]
frequencia_atualizacao: Semanal
campos_chave:
  - municipio
  - produto
  - preco_revenda
  - preco_distribuicao
  - bandeira
  - producao_petroleo
  - producao_gas
tags:
  - ANP
  - petróleo
  - gás natural
  - combustíveis
  - gasolina
  - diesel
  - etanol
  - preços
  - biocombustíveis
  - postos
cruzamento_com:
  - ibge-estatisticas/ipca-inflacao
  - infraestrutura-transportes/denatran-renavam
  - ibge-estatisticas/pib-municipal
  - agencias-reguladoras/aneel
status: documentado
---

# ANP Petróleo e Gás — Produção e Preços de Combustíveis

## O que é

A **ANP (Agência Nacional do Petróleo, Gás Natural e Biocombustíveis)** disponibiliza dados abertos sobre a indústria de petróleo, gás e combustíveis no Brasil. Os principais conjuntos de dados incluem:

- **Levantamento de Preços de Combustíveis** — preços semanais de gasolina, etanol, diesel, GNV e GLP em postos de revenda de todo o Brasil
- **Produção de Petróleo e Gás** — volumes de produção por campo, bacia, operador
- **Boletim de Produção** — dados mensais de produção de petróleo e gás natural
- **Distribuição de combustíveis** — volumes comercializados por distribuidora
- **Biocombustíveis** — produção de etanol e biodiesel por usina
- **Royalties** — valores pagos às entidades beneficiárias

O Levantamento de Preços é um dos datasets mais utilizados, cobrindo ~27.000 postos pesquisados semanalmente.

## Como acessar

| Item | Detalhe |
|---|---|
| **Dados abertos** | `https://www.gov.br/anp/pt-br/centrais-de-conteudo/dados-abertos` |
| **Levantamento de Preços** | `https://www.gov.br/anp/pt-br/assuntos/precos-e-defesa-da-concorrencia/precos/levantamento-de-precos-de-combustiveis` |
| **Dados de Produção** | `https://www.gov.br/anp/pt-br/centrais-de-conteudo/publicacoes/boletins-anp/bmp` |
| **dados.gov.br** | `https://dados.gov.br/dados/conjuntos-dados/serie-historica-de-precos-de-combustiveis-e-de-glp` |
| **Autenticação** | Não requerida |
| **Formato** | CSV, XLSX |
| **Periodicidade** | Semanal (preços), Mensal (produção) |

## Endpoints/recursos principais

| Recurso | Conteúdo | Periodicidade |
|---|---|---|
| **Preços por revenda** | Preços de combustíveis em postos por município | Semanal |
| **Preços por distribuidora** | Preços praticados por distribuidoras | Semanal |
| **Produção de Petróleo** | Volume por campo e operador | Mensal |
| **Produção de Gás Natural** | Volume de gás por campo | Mensal |
| **Produção de Biocombustíveis** | Etanol e biodiesel por usina | Mensal |
| **Royalties e participações** | Valores pagos a municípios e estados | Mensal |

## Exemplo de uso

### Preços de combustíveis por município

```python
import pandas as pd

# Download da série histórica de preços
# https://dados.gov.br/dados/conjuntos-dados/serie-historica-de-precos-de-combustiveis-e-de-glp
df = pd.read_csv(
    "precos_combustiveis_2024_01.csv",
    sep=";",
    encoding="utf-8",
    dtype=str,
    decimal=","
)

print(f"Total de registros: {len(df):,}")
print(f"Colunas: {list(df.columns)}")

# Converter preço para numérico
df["Valor de Venda"] = pd.to_numeric(
    df["Valor de Venda"].str.replace(",", "."), errors="coerce"
)

# Preço médio da gasolina por UF
gasolina = df[df["Produto"] == "GASOLINA COMUM"]
media_uf = (
    gasolina.groupby("Estado - Sigla")["Valor de Venda"]
    .mean()
    .sort_values(ascending=False)
)

print("\nPreço médio da gasolina por UF (R$/litro):")
print(media_uf.round(3))
```

### Evolução semanal do preço do diesel

```python
import pandas as pd
import glob

# Concatenar vários arquivos semanais
arquivos = sorted(glob.glob("precos_combustiveis_2024_*.csv"))
dfs = []

for arq in arquivos:
    df = pd.read_csv(arq, sep=";", encoding="utf-8", dtype=str, decimal=",")
    dfs.append(df)

df_total = pd.concat(dfs, ignore_index=True)
df_total["Valor de Venda"] = pd.to_numeric(
    df_total["Valor de Venda"].str.replace(",", "."), errors="coerce"
)

# Diesel S-10 — média semanal
diesel = df_total[df_total["Produto"] == "DIESEL S10"]
serie = diesel.groupby("Data da Coleta")["Valor de Venda"].mean()

print("Evolução do preço do Diesel S-10 (R$/litro):")
print(serie.tail(10))
```

## Campos disponíveis

### Levantamento de preços de combustíveis

| Campo | Tipo | Descrição |
|---|---|---|
| `Regiao - Sigla` | string | Região geográfica |
| `Estado - Sigla` | string | UF |
| `Municipio` | string | Nome do município |
| `Revenda` | string | Nome do posto/revenda |
| `CNPJ da Revenda` | string | CNPJ do posto |
| `Produto` | string | Tipo de combustível |
| `Data da Coleta` | date | Data da pesquisa de preço |
| `Valor de Venda` | float | Preço de revenda (R$/litro ou R$/m³) |
| `Valor de Compra` | float | Preço de compra pela revenda |
| `Bandeira` | string | Bandeira do posto (BR, Shell, Ipiranga, etc.) |
| `Unidade de Medida` | string | Litro, m³ ou kg |

### Produtos pesquisados

| Produto | Unidade |
|---|---|
| GASOLINA COMUM | R$/litro |
| GASOLINA ADITIVADA | R$/litro |
| ETANOL HIDRATADO | R$/litro |
| DIESEL | R$/litro |
| DIESEL S10 | R$/litro |
| GNV | R$/m³ |
| GLP | R$/kg (botijão 13 kg) |

## Cruzamentos possíveis

| Cruzamento | Fonte relacionada | Chave de ligação | Finalidade |
|---|---|---|---|
| Combustível x Inflação | [IPCA/Inflação](/docs/apis/ibge-estatisticas/ipca-inflacao) | Período | Analisar peso dos combustíveis na inflação (grupo Transportes) |
| Combustível x Frota | [DENATRAN/RENAVAM](/docs/apis/infraestrutura-transportes/denatran-renavam) | UF, município | Correlacionar preços com tamanho da frota |
| Combustível x PIB | [PIB Municipal](/docs/apis/ibge-estatisticas/pib-municipal) | Município | Relacionar preços com atividade econômica regional |
| Petróleo x Energia | [ANEEL](/docs/apis/agencias-reguladoras/aneel) | UF | Analisar matriz energética (petróleo + eletricidade) |

## Limitações conhecidas

| Limitação | Detalhes |
|---|---|
| **Arquivos semanais separados** | Cada semana gera um arquivo CSV separado. Para análises longas, é necessário concatenar vários arquivos. |
| **Sem API REST** | Os dados são disponibilizados como CSVs para download. Não há API de consulta. |
| **Amostra de postos** | O levantamento de preços cobre ~27.000 postos, não a totalidade (~42.000 postos no Brasil). |
| **Encoding variável** | Alguns arquivos usam UTF-8, outros Latin-1. O separador pode ser `;` ou `,`. |
| **Dados de produção restritos** | Dados detalhados de produção por campo podem ter informações confidenciais omitidas. |
| **Bandeira "Branca"** | Postos sem bandeira ("bandeira branca") podem comprar de qualquer distribuidora, dificultando análises por bandeira. |
