---
title: Benefícios INSS — Aposentadorias, Pensões e Auxílios
slug: beneficios-inss
orgao: DATAPREV / INSS
url_base: https://dados.gov.br/dados/conjuntos-dados/inss-beneficios-concedidos
tipo_acesso: CSV Download
autenticacao: Não requerida
formato_dados: [CSV]
frequencia_atualizacao: Mensal
campos_chave:
  - especie_beneficio
  - codigo_municipio
  - valor_beneficio
  - data_inicio_beneficio
  - clientela
  - sexo
tags:
  - previdência
  - INSS
  - aposentadoria
  - pensão
  - auxílio-doença
  - BPC
  - benefícios sociais
  - DATAPREV
cruzamento_com:
  - trabalho-emprego/rais
  - ibge-estatisticas/censo-demografico
  - ibge-estatisticas/pib-municipal
  - transparencia-cgu/servidores-federais
status: documentado
---

# Benefícios INSS — Aposentadorias, Pensões e Auxílios

## O que é

Os **microdados de Benefícios do INSS** (Instituto Nacional do Seguro Social) compreendem informações sobre todos os benefícios previdenciários e assistenciais concedidos e mantidos pelo sistema de seguridade social brasileiro. Os dados são processados pela **DATAPREV** (Empresa de Tecnologia e Informações da Previdência) e disponibilizados no portal de dados abertos do governo federal.

Os dados cobrem:

- **Benefícios previdenciários** — aposentadorias (por idade, tempo de contribuição, invalidez), pensões por morte, auxílio-doença, auxílio-acidente, salário-maternidade
- **Benefícios assistenciais (BPC/LOAS)** — Benefício de Prestação Continuada para idosos e pessoas com deficiência
- **Benefícios concedidos** — novos benefícios deferidos no mês
- **Benefícios cessados** — benefícios encerrados no mês
- **Estoque de benefícios** — total de benefícios ativos (emitidos em folha de pagamento)

Os dados são disponibilizados em três dimensões:

| Dimensão | Descrição |
|---|---|
| **Concedidos** | Benefícios deferidos no mês de referência |
| **Cessados** | Benefícios encerrados no mês |
| **Emitidos (estoque)** | Benefícios ativos com crédito emitido na folha |

## Como acessar

| Item | Detalhe |
|---|---|
| **Portal dados.gov.br** | `https://dados.gov.br/dados/conjuntos-dados/inss-beneficios-concedidos` |
| **Painel DATAPREV** | `https://painelbi.dataprev.gov.br/` |
| **AEPS InfoLogo** | `http://www.oads.gov.br/` |
| **Autenticação** | Não requerida |
| **Formato** | CSV (delimitado por `;`) |
| **Publicação** | Mensal (~60 dias após o mês de referência) |

### Conjuntos de dados no dados.gov.br

| Conjunto | URL |
|---|---|
| Benefícios Concedidos | `https://dados.gov.br/dados/conjuntos-dados/inss-beneficios-concedidos` |
| Benefícios Cessados | `https://dados.gov.br/dados/conjuntos-dados/inss-beneficios-cessados` |
| Benefícios Emitidos | `https://dados.gov.br/dados/conjuntos-dados/inss-beneficios-emitidos` |

## Endpoints/recursos principais

| Recurso | Conteúdo | Periodicidade |
|---|---|---|
| **Benefícios Concedidos** | Novos benefícios deferidos, por espécie, UF, município, valor | Mensal |
| **Benefícios Cessados** | Benefícios encerrados, com motivo da cessação | Mensal |
| **Benefícios Emitidos** | Estoque de benefícios ativos na folha de pagamento | Mensal |
| **AEPS (Anuário Estatístico)** | Estatísticas consolidadas anuais da previdência | Anual |
| **Painel BI DATAPREV** | Dashboard interativo com indicadores previdenciários | Mensal |

## Exemplo de uso

### Leitura dos microdados de benefícios concedidos

```python
import pandas as pd

# Baixar o CSV do portal dados.gov.br
# Exemplo: benefícios concedidos em dezembro/2024
url = "https://dados.gov.br/dados/conjuntos-dados/inss-beneficios-concedidos"

# Após download manual do CSV
df = pd.read_csv(
    "beneficios_concedidos_202412.csv",
    sep=";",
    encoding="latin-1",
    dtype=str,
    decimal=","
)

print(f"Total de benefícios concedidos: {len(df):,}")
print(f"Colunas: {list(df.columns)}")

# Distribuição por espécie de benefício
contagem = df["ESPECIE"].value_counts().head(10)
print("\nTop 10 espécies de benefício:")
print(contagem)
```

### Análise do estoque de benefícios por município

```python
import pandas as pd

df = pd.read_csv(
    "beneficios_emitidos_202412.csv",
    sep=";",
    encoding="latin-1",
    dtype=str,
    decimal=","
)

# Converter valor para numérico
df["VALOR"] = pd.to_numeric(
    df["VALOR"].str.replace(".", "").str.replace(",", "."),
    errors="coerce"
)

# Total de benefícios e valor médio por UF
resumo = (
    df.groupby("UF")
    .agg(
        total_beneficios=("VALOR", "count"),
        valor_medio=("VALOR", "mean"),
        valor_total=("VALOR", "sum"),
    )
    .sort_values("total_beneficios", ascending=False)
)

print("Benefícios emitidos por UF:")
print(resumo.head(10))
```

### Evolução mensal de concessões

```python
import pandas as pd
import glob

# Ler vários meses de concessões
arquivos = sorted(glob.glob("beneficios_concedidos_2024*.csv"))
serie = []

for arq in arquivos:
    df = pd.read_csv(arq, sep=";", encoding="latin-1", dtype=str)
    competencia = arq[-10:-4]  # AAAAMM
    total = len(df)
    serie.append({"competencia": competencia, "total_concedidos": total})

serie_df = pd.DataFrame(serie)
print("Evolução mensal de benefícios concedidos:")
print(serie_df.to_string(index=False))
```

## Campos disponíveis

### Benefícios concedidos

| Campo | Tipo | Descrição |
|---|---|---|
| `COMPETENCIA` | string | Mês de referência (AAAAMM) |
| `UF` | string | Sigla da UF |
| `MUNICIPIO` | string | Código do município (IBGE) |
| `ESPECIE` | int | Código da espécie do benefício |
| `DESC_ESPECIE` | string | Descrição da espécie (ex: Aposentadoria por Idade) |
| `CLIENTELA` | int | Tipo de clientela (1=Urbana, 2=Rural) |
| `SEXO` | string | Sexo do beneficiário (M/F) |
| `FAIXA_ETARIA` | string | Faixa etária do beneficiário |
| `VALOR` | float | Valor do benefício (R$) |
| `QTD` | int | Quantidade de benefícios |
| `DIB` | date | Data de início do benefício |
| `DDB` | date | Data do despacho |

### Principais espécies de benefício

| Código | Espécie |
|---|---|
| 41 | Aposentadoria por Idade |
| 42 | Aposentadoria por Tempo de Contribuição |
| 32 | Aposentadoria por Invalidez |
| 21 | Pensão por Morte |
| 31 | Auxílio-Doença Previdenciário |
| 91 | Auxílio-Doença Acidentário |
| 87 | BPC — Idoso (LOAS) |
| 88 | BPC — Pessoa com Deficiência (LOAS) |
| 80 | Salário-Maternidade |
| 36 | Auxílio-Acidente |

## Cruzamentos possíveis

| Cruzamento | Fonte relacionada | Chave de ligação | Finalidade |
|---|---|---|---|
| Benefícios x Emprego formal | [RAIS](/docs/apis/trabalho-emprego/rais) | `municipio` | Analisar relação entre mercado de trabalho e demanda previdenciária |
| Benefícios x População | [Censo Demográfico](/docs/apis/ibge-estatisticas/censo-demografico) | `codigo_municipio` | Calcular taxa de cobertura previdenciária por município |
| Benefícios x PIB | [PIB Municipal](/docs/apis/ibge-estatisticas/pib-municipal) | `codigo_municipio` | Avaliar peso dos benefícios previdenciários na economia local |
| Benefícios x Servidores | [Servidores Federais](/docs/apis/transparencia-cgu/servidores-federais) | `UF` | Comparar aposentadorias do RGPS e do RPPS |

## Limitações conhecidas

| Limitação | Detalhes |
|---|---|
| **Dados agregados** | Os microdados públicos são agregados (não contêm CPF ou dados individuais). Para análises individuais, é necessário acesso via pesquisador credenciado. |
| **Defasagem temporal** | Os dados são publicados com ~2 meses de atraso em relação ao mês de competência. |
| **Formato inconsistente** | O formato dos CSVs (encoding, separador, nome de colunas) pode variar entre diferentes períodos. |
| **URLs instáveis** | Os links de download no dados.gov.br podem mudar periodicamente. |
| **Sem API REST** | Não existe API de consulta. Os dados são disponibilizados apenas como arquivos CSV para download. |
| **BPC em base separada** | O Benefício de Prestação Continuada (BPC/LOAS) pode estar em conjuntos de dados separados dos benefícios previdenciários. |
| **Revisões retroativas** | Os dados de meses anteriores podem ser revisados sem aviso prévio, especialmente benefícios com decisão judicial. |
