---
title: CVM Fatos Relevantes — Comunicados ao Mercado
slug: cvm-fatos-relevantes
orgao: CVM
url_base: https://dados.cvm.gov.br/dataset/cia_aberta-doc-fato_relevante
tipo_acesso: CSV Download
autenticacao: Não requerida
formato_dados: [CSV]
frequencia_atualizacao: Diária
campos_chave:
  - cnpj_cia
  - denominacao_cia
  - data_referencia
  - assunto
  - link_documento
tags:
  - CVM
  - fatos relevantes
  - comunicados
  - mercado de capitais
  - eventos corporativos
  - empresas abertas
  - disclosure
cruzamento_com:
  - cvm-dfp-itr
  - cvm-administradores
  - b3-negociacoes
status: documentado
---

# CVM Fatos Relevantes — Comunicados ao Mercado

## O que é

Os **Fatos Relevantes** são comunicados obrigatórios que empresas com valores mobiliários negociados em mercado devem divulgar à **CVM (Comissão de Valores Mobiliários)** e ao mercado sempre que ocorre um evento que possa influenciar significativamente o preço dos valores mobiliários ou a decisão dos investidores. A divulgação é regulada pela Instrução CVM 358/2002.

Exemplos de fatos relevantes incluem:

- **Fusões e aquisições** — aquisições, incorporações, cisões
- **Mudanças na administração** — renúncia ou eleição de diretores e conselheiros
- **Resultados financeiros** — antecipação de resultados, revisão de projeções
- **Operações societárias** — emissão de ações, distribuição de dividendos
- **Eventos judiciais** — processos relevantes, acordos, condenações
- **Mudanças regulatórias** — impactos de novas regulamentações no negócio

Os dados estão disponíveis no portal **dados.cvm.gov.br** em formato CSV.

## Como acessar

| Item | Detalhe |
|---|---|
| **Portal CKAN** | `https://dados.cvm.gov.br/dataset/cia_aberta-doc-fato_relevante` |
| **URL dos arquivos** | `https://dados.cvm.gov.br/dados/CIA_ABERTA/DOC/FATO_RELEVANTE/DADOS/` |
| **Autenticação** | Não requerida |
| **Formato** | CSV (delimitado por `;`, encoding Latin-1) |
| **Atualização** | Diária (fatos relevantes são publicados em tempo real) |

## Endpoints/recursos principais

| Arquivo | Conteúdo |
|---|---|
| `fato_relevante_cia_aberta_AAAA.csv` | Metadados dos fatos relevantes publicados no ano |
| Documento PDF/HTML | Texto completo do fato relevante (link no CSV) |

### Campos do arquivo CSV

O arquivo CSV contém os metadados de cada fato relevante, incluindo um link para o documento completo hospedado no sistema de Empresas.Net da CVM.

## Exemplo de uso

### Listar fatos relevantes de um ano

```python
import pandas as pd

url = (
    "https://dados.cvm.gov.br/dados/CIA_ABERTA/DOC/FATO_RELEVANTE/DADOS/"
    "fato_relevante_cia_aberta_2024.csv"
)

df = pd.read_csv(url, sep=";", encoding="latin-1", dtype=str)

print(f"Total de fatos relevantes em 2024: {len(df):,}")
print(f"Colunas: {list(df.columns)}")
print(f"Empresas distintas: {df['DENOM_CIA'].nunique()}")

# Empresas com mais fatos relevantes
top_empresas = df["DENOM_CIA"].value_counts().head(10)
print("\nEmpresas com mais fatos relevantes:")
print(top_empresas)
```

### Filtrar fatos relevantes de uma empresa

```python
import pandas as pd

url = (
    "https://dados.cvm.gov.br/dados/CIA_ABERTA/DOC/FATO_RELEVANTE/DADOS/"
    "fato_relevante_cia_aberta_2024.csv"
)

df = pd.read_csv(url, sep=";", encoding="latin-1", dtype=str)

# Fatos relevantes da Vale
vale = df[df["DENOM_CIA"].str.contains("VALE", case=False, na=False)]
print(f"Fatos relevantes da Vale em 2024: {len(vale)}")

for _, row in vale.iterrows():
    print(f"  {row['DT_REFER']} — {row.get('ASSUNTO', 'N/A')}")
    print(f"    Link: {row.get('LINK_DOC', 'N/A')}")
```

### Análise temporal de fatos relevantes

```python
import pandas as pd

url = (
    "https://dados.cvm.gov.br/dados/CIA_ABERTA/DOC/FATO_RELEVANTE/DADOS/"
    "fato_relevante_cia_aberta_2024.csv"
)

df = pd.read_csv(url, sep=";", encoding="latin-1", dtype=str)
df["DT_REFER"] = pd.to_datetime(df["DT_REFER"], errors="coerce")

# Fatos relevantes por mês
por_mes = df.groupby(df["DT_REFER"].dt.to_period("M")).size()
print("Fatos relevantes por mês:")
print(por_mes)
```

## Campos disponíveis

| Campo | Tipo | Descrição |
|---|---|---|
| `CNPJ_CIA` | string | CNPJ da companhia |
| `DENOM_CIA` | string | Denominação social |
| `DT_REFER` | date | Data de referência / publicação |
| `DT_ENTREGA` | date | Data de entrega à CVM |
| `VERSAO` | int | Versão do documento |
| `ASSUNTO` | string | Assunto/título do fato relevante |
| `LINK_DOC` | string | URL para o documento completo (PDF/HTML) |
| `PROTOCOLO` | string | Número do protocolo de entrega |
| `CATEGORIA_DOC` | string | Categoria do documento |

## Cruzamentos possíveis

| Cruzamento | Fonte relacionada | Chave de ligação | Finalidade |
|---|---|---|---|
| Eventos x Financeiro | [CVM DFP/ITR](/docs/apis/mercado-financeiro/cvm-dfp-itr) | `CNPJ_CIA` | Analisar impacto de eventos corporativos nos resultados financeiros |
| Eventos x Gestão | [CVM Administradores](/docs/apis/mercado-financeiro/cvm-administradores) | `CNPJ_CIA` | Identificar mudanças de gestão comunicadas via fatos relevantes |
| Eventos x Preço | [B3 Negociações](/docs/apis/mercado-financeiro/b3-negociacoes) | Ticker / CNPJ | Estudar impacto de fatos relevantes no preço das ações (event study) |

## Limitações conhecidas

| Limitação | Detalhes |
|---|---|
| **Texto não estruturado** | O conteúdo do fato relevante é um documento PDF/HTML não estruturado. Para análise de conteúdo, é necessário NLP/mineração de texto. |
| **CSV contém apenas metadados** | O arquivo CSV contém metadados (data, empresa, link). O texto completo do fato relevante está no documento vinculado. |
| **Categorização limitada** | Não há categorização padronizada dos tipos de fato relevante (M&A, dividendos, etc.). É necessário análise do texto para classificar. |
| **Links podem quebrar** | Os links para os documentos no sistema Empresas.Net podem mudar ou ficar indisponíveis. |
| **Encoding Latin-1** | Arquivos CSV usam encoding Latin-1 com separador `;`. |
| **Sem notificações em tempo real** | Não há API de streaming ou webhook para receber fatos relevantes em tempo real. |
