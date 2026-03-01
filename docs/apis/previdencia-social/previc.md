---
title: PREVIC — Previdência Complementar Fechada
slug: previc
orgao: PREVIC
url_base: https://www.gov.br/previc/pt-br/acesso-a-informacao/dados-abertos
tipo_acesso: CSV Download
autenticacao: Não requerida
formato_dados: [CSV, XLSX]
frequencia_atualizacao: Trimestral
campos_chave:
  - cnpj_efpc
  - nome_entidade
  - patrocinador
  - total_ativos
  - patrimonio_liquido
  - numero_participantes
tags:
  - previdência complementar
  - fundos de pensão
  - EFPC
  - PREVIC
  - investimentos
  - aposentadoria privada
cruzamento_com:
  - previdencia-social/beneficios-inss
  - mercado-financeiro/cvm-dfp-itr
  - receita-federal/cnpj-completa
status: stub
---

# PREVIC — Previdência Complementar Fechada

## O que é

A **PREVIC (Superintendência Nacional de Previdência Complementar)** é a autarquia responsável pela fiscalização e supervisão das **Entidades Fechadas de Previdência Complementar (EFPC)**, popularmente conhecidas como **fundos de pensão**. Os dados publicados pela PREVIC incluem informações sobre:

- **Entidades** — cadastro de EFPCs ativas, em liquidação e encerradas
- **Planos de benefícios** — planos administrados por cada entidade, modalidade (BD, CD, CV)
- **Investimentos** — carteira de investimentos, alocação por segmento (renda fixa, variável, imóveis, etc.)
- **Participantes** — número de participantes ativos, assistidos e autopatrocinados
- **Patrocinadores** — empresas e entidades patrocinadoras de cada plano
- **Demonstrações contábeis** — balanço patrimonial e demonstrações de resultado

Os fundos de pensão brasileiros administram um patrimônio superior a R$ 1 trilhão, sendo os maiores fundos públicos (Previ, Petros, Funcef) responsáveis por parcela significativa dos investimentos institucionais no país.

## Como acessar

| Item | Detalhe |
|---|---|
| **Portal PREVIC** | `https://www.gov.br/previc/pt-br/acesso-a-informacao/dados-abertos` |
| **Sistema CADPREVIC** | `https://cadprevic.previc.gov.br/` |
| **Autenticação** | Não requerida para dados públicos |
| **Formato** | CSV, XLSX |
| **Publicação** | Trimestral (demonstrações contábeis) e sob demanda |

### Dados disponíveis

Os dados da PREVIC são acessíveis principalmente via:

1. **Portal de dados abertos** — arquivos CSV/XLSX para download
2. **CADPREVIC** — sistema de cadastro com consulta a entidades e planos
3. **Relatórios estatísticos** — publicações periódicas com dados agregados

## Endpoints/recursos principais

| Recurso | Conteúdo | Periodicidade |
|---|---|---|
| **Cadastro de EFPCs** | Lista de entidades ativas, com CNPJ, nome, situação | Atualização contínua |
| **Planos de benefícios** | Detalhes dos planos, modalidade, patrocinador | Atualização contínua |
| **Demonstrações contábeis** | Balanço, DRE, investimentos por segmento | Trimestral |
| **Estatísticas de investimentos** | Alocação da carteira de investimentos por segmento | Trimestral |
| **Participantes** | Número de participantes ativos, assistidos e autopatrocinados | Trimestral |
| **Informe Estatístico** | Relatório consolidado do setor | Trimestral |

## Exemplo de uso

### Consultar cadastro de fundos de pensão

```python
import pandas as pd

# Após download do cadastro de entidades do portal PREVIC
df = pd.read_csv(
    "cadastro_efpc.csv",
    sep=";",
    encoding="utf-8",
    dtype=str,
)

print(f"Total de EFPCs cadastradas: {len(df):,}")

# Filtrar entidades ativas
ativas = df[df["SITUACAO"] == "ATIVA"]
print(f"EFPCs ativas: {len(ativas):,}")

# Maiores entidades por número de participantes
ativas["PARTICIPANTES"] = pd.to_numeric(ativas["PARTICIPANTES"], errors="coerce")
top10 = ativas.nlargest(10, "PARTICIPANTES")[["NOME_ENTIDADE", "PARTICIPANTES"]]
print("\nTop 10 fundos de pensão por participantes:")
print(top10.to_string(index=False))
```

### Análise de investimentos do setor

```python
import pandas as pd

# Dados de investimentos trimestrais
df_inv = pd.read_csv(
    "investimentos_efpc.csv",
    sep=";",
    encoding="utf-8",
    dtype=str,
    decimal=","
)

# Converter valores
colunas_valor = ["RENDA_FIXA", "RENDA_VARIAVEL", "IMOVEIS", "OPERACOES_PARTICIPANTES"]
for col in colunas_valor:
    df_inv[col] = pd.to_numeric(
        df_inv[col].str.replace(".", "").str.replace(",", "."),
        errors="coerce"
    )

# Total investido por segmento
totais = df_inv[colunas_valor].sum()
print("Investimentos do setor por segmento (R$ bilhões):")
print((totais / 1e9).round(1))
```

## Campos disponíveis

### Cadastro de entidades

| Campo | Tipo | Descrição |
|---|---|---|
| `CNPJ_EFPC` | string | CNPJ da entidade |
| `NOME_ENTIDADE` | string | Nome da EFPC |
| `SIGLA` | string | Sigla da entidade (ex: PREVI, PETROS) |
| `SITUACAO` | string | Ativa, Em Liquidação, Encerrada |
| `UF` | string | UF da sede |
| `DATA_CRIACAO` | date | Data de criação da entidade |
| `PATROCINADORES` | string | Lista de patrocinadores |
| `PARTICIPANTES_ATIVOS` | int | Número de participantes ativos |
| `ASSISTIDOS` | int | Número de assistidos (aposentados e pensionistas) |
| `PATRIMONIO_LIQUIDO` | float | Patrimônio líquido total (R$) |

### Investimentos

| Campo | Tipo | Descrição |
|---|---|---|
| `CNPJ_EFPC` | string | CNPJ da entidade |
| `COMPETENCIA` | string | Trimestre de referência |
| `RENDA_FIXA` | float | Valor investido em renda fixa (R$) |
| `RENDA_VARIAVEL` | float | Valor investido em renda variável (R$) |
| `ESTRUTURADO` | float | Investimentos estruturados (R$) |
| `IMOVEIS` | float | Investimentos imobiliários (R$) |
| `OPERACOES_PARTICIPANTES` | float | Empréstimos a participantes (R$) |
| `EXTERIOR` | float | Investimentos no exterior (R$) |

## Cruzamentos possíveis

| Cruzamento | Fonte relacionada | Chave de ligação | Finalidade |
|---|---|---|---|
| Fundos x INSS | [Benefícios INSS](/docs/apis/previdencia-social/beneficios-inss) | UF, município | Comparar cobertura previdenciária complementar e básica |
| Patrocinadores x Empresas | [CNPJ Completa](/docs/apis/receita-federal/cnpj-completa) | `CNPJ` | Identificar porte e setor das empresas patrocinadoras |
| Investimentos x Mercado | [CVM DFP/ITR](/docs/apis/mercado-financeiro/cvm-dfp-itr) | Ativos investidos | Analisar participação dos fundos de pensão como investidores institucionais |

## Limitações conhecidas

| Limitação | Detalhes |
|---|---|
| **Dados limitados** | Os dados públicos são agregados. Informações detalhadas de carteira de investimentos e dados individuais de participantes não são divulgados. |
| **Sem API REST** | Não existe API de consulta. Os dados são disponibilizados apenas como arquivos para download ou via consulta no CADPREVIC. |
| **Formato inconsistente** | Os formatos dos arquivos (CSV, XLSX) e a estrutura das colunas podem variar entre períodos. |
| **Cobertura parcial** | Apenas entidades fechadas (fundos de pensão) são cobertas. Previdência aberta (PGBL/VGBL) é regulada pela SUSEP, não pela PREVIC. |
| **Defasagem** | Demonstrações contábeis são publicadas com atraso de ~3-6 meses em relação ao trimestre de referência. |
| **Acesso ao CADPREVIC** | O sistema CADPREVIC pode apresentar instabilidade e interface pouco amigável para extração de dados em lote. |
