---
title: CVM DFP/ITR — Demonstrações Financeiras de Empresas Abertas
slug: cvm-dfp-itr
orgao: CVM
url_base: https://dados.cvm.gov.br/
tipo_acesso: API REST
autenticacao: Não requerida
formato_dados: [JSON, CSV]
frequencia_atualizacao: Trimestral
campos_chave:
  - cnpj_cia
  - denominacao_cia
  - cd_conta
  - ds_conta
  - vl_conta
  - dt_refer
tags:
  - CVM
  - demonstrações financeiras
  - DFP
  - ITR
  - balanço patrimonial
  - DRE
  - empresas abertas
  - bolsa de valores
  - contabilidade
cruzamento_com:
  - cvm-administradores
  - cvm-fatos-relevantes
  - b3-negociacoes
  - receita-federal/cnpj-completa
status: documentado
---

# CVM DFP/ITR — Demonstrações Financeiras de Empresas Abertas

## O que é

O portal **dados.cvm.gov.br** da **Comissão de Valores Mobiliários (CVM)** disponibiliza as demonstrações financeiras de todas as empresas com valores mobiliários negociados em mercados regulamentados no Brasil. Os dados incluem:

- **DFP (Demonstrações Financeiras Padronizadas)** — demonstrações financeiras anuais, incluindo Balanço Patrimonial, DRE, Fluxo de Caixa, DVA, Notas Explicativas
- **ITR (Informações Trimestrais)** — demonstrações financeiras trimestrais (1T, 2T, 3T)
- **FCA (Formulário Cadastral)** — dados cadastrais da companhia (endereço, auditor, escriturador)
- **FRE (Formulário de Referência)** — informações detalhadas sobre a empresa, gestão, riscos

O portal utiliza a plataforma **CKAN** como catálogo de dados abertos, oferecendo tanto download de arquivos CSV quanto acesso via API.

## Como acessar

| Item | Detalhe |
|---|---|
| **Portal CKAN** | `https://dados.cvm.gov.br/` |
| **API CKAN** | `https://dados.cvm.gov.br/api/3/action/` |
| **Autenticação** | Não requerida |
| **Rate limit** | Não documentado oficialmente |
| **Formatos** | CSV (download), JSON (API CKAN) |
| **CORS** | Habilitado |

### URLs dos conjuntos de dados

| Conjunto | URL |
|---|---|
| **DFP** | `https://dados.cvm.gov.br/dataset/cia_aberta-doc-dfp` |
| **ITR** | `https://dados.cvm.gov.br/dataset/cia_aberta-doc-itr` |
| **FCA** | `https://dados.cvm.gov.br/dataset/cia_aberta-doc-fca` |
| **FRE** | `https://dados.cvm.gov.br/dataset/cia_aberta-doc-fre` |

## Endpoints/recursos principais

### Arquivos CSV disponíveis (DFP)

| Arquivo | Conteúdo |
|---|---|
| `dfp_cia_aberta_AAAA.csv` | Metadados dos documentos DFP entregues |
| `dfp_cia_aberta_BPA_ind_AAAA.csv` | Balanço Patrimonial Ativo (individual) |
| `dfp_cia_aberta_BPP_ind_AAAA.csv` | Balanço Patrimonial Passivo (individual) |
| `dfp_cia_aberta_DRE_ind_AAAA.csv` | Demonstração do Resultado (individual) |
| `dfp_cia_aberta_DFC_MI_ind_AAAA.csv` | Fluxo de Caixa — Método Indireto (individual) |
| `dfp_cia_aberta_DVA_ind_AAAA.csv` | Demonstração do Valor Adicionado (individual) |
| `dfp_cia_aberta_BPA_con_AAAA.csv` | Balanço Patrimonial Ativo (consolidado) |
| `dfp_cia_aberta_DRE_con_AAAA.csv` | DRE (consolidado) |

### API CKAN

| Endpoint | Descrição |
|---|---|
| `package_list` | Lista todos os conjuntos de dados |
| `package_show?id={dataset_id}` | Metadados de um conjunto específico |
| `resource_show?id={resource_id}` | Metadados de um recurso (arquivo) |
| `datastore_search?resource_id={id}` | Consulta dados de um recurso via API |

## Exemplo de uso

### Download e leitura de demonstrações financeiras

```python
import pandas as pd

# DRE consolidada - ano 2023
url = (
    "https://dados.cvm.gov.br/dados/CIA_ABERTA/DOC/DFP/DADOS/"
    "dfp_cia_aberta_DRE_con_2023.csv"
)

df = pd.read_csv(url, sep=";", encoding="latin-1", dtype=str, decimal=",")

print(f"Total de registros: {len(df):,}")
print(f"Colunas: {list(df.columns)}")

# Filtrar uma empresa específica (ex: Petrobras)
petrobras = df[df["DENOM_CIA"].str.contains("PETROBRAS", case=False, na=False)]

# Receita líquida (código 3.01)
receita = petrobras[petrobras["CD_CONTA"] == "3.01"]
print("\nPetrobras — Receita Líquida:")
for _, row in receita.iterrows():
    print(f"  {row['DT_REFER']}: R$ {float(row['VL_CONTA']):,.0f}")
```

### Consulta via API CKAN

```python
import requests

# Listar recursos do dataset DFP
url = "https://dados.cvm.gov.br/api/3/action/package_show"
params = {"id": "cia_aberta-doc-dfp"}

response = requests.get(url, params=params)
response.raise_for_status()
dataset = response.json()["result"]

print(f"Dataset: {dataset['title']}")
print(f"Recursos disponíveis: {len(dataset['resources'])}")

for r in dataset["resources"][:5]:
    print(f"  - {r['name']}: {r['url']}")
```

### Balanço Patrimonial — comparar empresas

```python
import pandas as pd

# Balanço Patrimonial Ativo (consolidado)
url_bpa = (
    "https://dados.cvm.gov.br/dados/CIA_ABERTA/DOC/DFP/DADOS/"
    "dfp_cia_aberta_BPA_con_2023.csv"
)

df_bpa = pd.read_csv(url_bpa, sep=";", encoding="latin-1", dtype=str, decimal=",")
df_bpa["VL_CONTA"] = pd.to_numeric(df_bpa["VL_CONTA"], errors="coerce")

# Ativo Total (código 1) das maiores empresas
ativo_total = (
    df_bpa[df_bpa["CD_CONTA"] == "1"]
    .groupby("DENOM_CIA")["VL_CONTA"]
    .max()
    .sort_values(ascending=False)
    .head(10)
)

print("Top 10 empresas por Ativo Total (R$ milhões):")
print((ativo_total / 1e6).round(0))
```

## Campos disponíveis

### Demonstrações financeiras (DFP/ITR)

| Campo | Tipo | Descrição |
|---|---|---|
| `CNPJ_CIA` | string | CNPJ da companhia |
| `DENOM_CIA` | string | Denominação social |
| `DT_REFER` | date | Data de referência da demonstração |
| `DT_INI_EXERC` | date | Data início do exercício |
| `DT_FIM_EXERC` | date | Data fim do exercício |
| `VERSAO` | int | Versão do documento (1=original, 2+=reapresentação) |
| `CD_CONTA` | string | Código da conta contábil (ex: 1, 1.01, 3.01) |
| `DS_CONTA` | string | Descrição da conta (ex: Ativo Total, Receita Líquida) |
| `VL_CONTA` | float | Valor da conta (R$ mil) |
| `ST_CONTA_FIXA` | string | Conta fixa (S/N) — contas padronizadas pelo plano de contas CVM |
| `ORDEM_EXERC` | string | Exercício (ÚLTIMO ou PENÚLTIMO) |
| `MOEDA` | string | Moeda (REAL) |
| `ESCALA_MOEDA` | string | Escala (MIL = valores em milhares de reais) |

### Estrutura do plano de contas

| Código | Descrição |
|---|---|
| `1` | Ativo Total |
| `1.01` | Ativo Circulante |
| `1.02` | Ativo Não Circulante |
| `2` | Passivo Total |
| `2.01` | Passivo Circulante |
| `2.03` | Patrimônio Líquido |
| `3.01` | Receita de Venda de Bens e/ou Serviços |
| `3.05` | EBIT |
| `3.11` | Lucro/Prejuízo do Período |

## Cruzamentos possíveis

| Cruzamento | Fonte relacionada | Chave de ligação | Finalidade |
|---|---|---|---|
| Financeiro x Administradores | [CVM Administradores](/docs/apis/mercado-financeiro/cvm-administradores) | `CNPJ_CIA` | Correlacionar desempenho financeiro com perfil de gestão |
| Financeiro x Fatos Relevantes | [CVM Fatos Relevantes](/docs/apis/mercado-financeiro/cvm-fatos-relevantes) | `CNPJ_CIA` | Analisar impacto de eventos corporativos nos resultados |
| Financeiro x Negociações | [B3 Negociações](/docs/apis/mercado-financeiro/b3-negociacoes) | Ticker / CNPJ | Correlacionar fundamentos com preço de mercado |
| Empresas x Cadastro | [CNPJ Completa](/docs/apis/receita-federal/cnpj-completa) | `CNPJ_CIA` | Enriquecer com dados cadastrais (endereço, sócios, CNAE) |

## Limitações conhecidas

| Limitação | Detalhes |
|---|---|
| **Valores em milhares** | Os valores financeiros são expressos em milhares de reais (`ESCALA_MOEDA = MIL`). É necessário multiplicar por 1.000 para obter os valores reais. |
| **Reapresentações** | Empresas podem reapresentar demonstrações (campo `VERSAO` > 1). É necessário filtrar pela versão mais recente para evitar duplicidade. |
| **Plano de contas variável** | Embora existam contas fixas padronizadas pela CVM, empresas de setores específicos (bancos, seguradoras) podem ter contas adicionais ou diferentes. |
| **Encoding Latin-1** | Os arquivos CSV usam encoding Latin-1 com separador `;` e decimal `,`. |
| **API CKAN limitada** | A API CKAN oferece funcionalidades básicas. Para consultas mais complexas, é necessário baixar o CSV completo e filtrar localmente. |
| **Sem dados em tempo real** | As demonstrações são publicadas após o prazo regulatório (até 3 meses após o encerramento do exercício/trimestre). |
| **Dados consolidados vs. individuais** | Demonstrações consolidadas e individuais estão em arquivos separados. É necessário escolher o adequado para cada análise. |
