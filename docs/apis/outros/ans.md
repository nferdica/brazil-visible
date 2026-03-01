---
title: ANS Saúde Suplementar — Planos de Saúde e Operadoras
slug: ans
orgao: ANS
url_base: https://dadosabertos.ans.gov.br/
tipo_acesso: API REST
autenticacao: Não requerida
formato_dados: [JSON, CSV]
frequencia_atualizacao: Mensal
campos_chave:
  - registro_ans
  - operadora
  - beneficiarios
  - tipo_plano
  - uf
  - faixa_etaria
  - reclamacoes
tags:
  - ANS
  - saúde suplementar
  - planos de saúde
  - operadoras
  - beneficiários
  - reclamações
cruzamento_com:
  - saude-datasus/sih
  - saude-datasus/cnes
  - ibge-estatisticas/censo-demografico
  - receita-federal/cnpj-completa
status: parcial
---

# ANS Saúde Suplementar — Planos de Saúde e Operadoras

## O que é

A **ANS (Agência Nacional de Saúde Suplementar)** é responsável pela regulação do setor de planos de saúde no Brasil. O portal de dados abertos da ANS disponibiliza informações sobre:

- **Beneficiários** — número de pessoas cobertas por planos de saúde, por UF, município, faixa etária, tipo de plano
- **Operadoras** — cadastro de operadoras de planos de saúde (nome, CNPJ, registro ANS, situação)
- **Reclamações** — reclamações de consumidores contra operadoras
- **Demonstrações contábeis** — dados financeiros das operadoras
- **Procedimentos** — rol de procedimentos obrigatórios
- **TUSS** — Terminologia Unificada da Saúde Suplementar

O portal utiliza a plataforma CKAN, permitindo acesso via API.

## Como acessar

| Item | Detalhe |
|---|---|
| **Portal CKAN** | `https://dadosabertos.ans.gov.br/` |
| **API CKAN** | `https://dadosabertos.ans.gov.br/api/3/action/` |
| **TabNet ANS** | `https://www.ans.gov.br/anstabnet/` |
| **Autenticação** | Não requerida |
| **Formatos** | JSON (API), CSV (download) |

## Endpoints/recursos principais

| Recurso | Conteúdo | Periodicidade |
|---|---|---|
| **Beneficiários** | Total de beneficiários por operadora, UF, tipo | Mensal |
| **Operadoras ativas** | Cadastro de operadoras com registro ativo | Atualização contínua |
| **Reclamações (NIP)** | Índice de reclamações por operadora | Trimestral |
| **Demonstrações contábeis** | Balanço, DRE das operadoras | Trimestral |
| **Reajustes** | Índices de reajuste autorizados | Anual |

## Exemplo de uso

### Consultar beneficiários de planos de saúde

```python
import pandas as pd

# Download do CSV de beneficiários
df = pd.read_csv(
    "beneficiarios_ans.csv",
    sep=";",
    encoding="utf-8",
    dtype=str,
)

print(f"Total de registros: {len(df):,}")

# Converter beneficiários para numérico
df["QT_BENEFICIARIOS"] = pd.to_numeric(df["QT_BENEFICIARIOS"], errors="coerce")

# Total de beneficiários por UF
por_uf = df.groupby("UF")["QT_BENEFICIARIOS"].sum().sort_values(ascending=False)
print("\nBeneficiários de planos de saúde por UF:")
print(por_uf.head(10))
```

### Ranking de operadoras por reclamações

```python
import pandas as pd

df_rec = pd.read_csv(
    "reclamacoes_ans.csv",
    sep=";",
    encoding="utf-8",
    dtype=str,
    decimal=","
)

df_rec["INDICE_RECLAMACAO"] = pd.to_numeric(df_rec["INDICE_RECLAMACAO"], errors="coerce")

# Operadoras com mais reclamações (por índice)
ranking = df_rec.sort_values("INDICE_RECLAMACAO", ascending=False)
print("Operadoras com maior índice de reclamações:")
print(ranking[["OPERADORA", "INDICE_RECLAMACAO"]].head(10).to_string(index=False))
```

## Campos disponíveis

### Beneficiários

| Campo | Tipo | Descrição |
|---|---|---|
| `COMPETENCIA` | string | Mês de referência (AAAAMM) |
| `REG_ANS` | string | Registro da operadora na ANS |
| `OPERADORA` | string | Nome da operadora |
| `UF` | string | UF |
| `MUNICIPIO` | string | Município |
| `TIPO_PLANO` | string | Individual, Coletivo empresarial, Coletivo por adesão |
| `CONTRATACAO` | string | Tipo de contratação |
| `FAIXA_ETARIA` | string | Faixa etária do beneficiário |
| `SEXO` | string | Masculino, Feminino |
| `QT_BENEFICIARIOS` | int | Quantidade de beneficiários |

## Cruzamentos possíveis

| Cruzamento | Fonte relacionada | Chave de ligação | Finalidade |
|---|---|---|---|
| ANS x SUS | [SIH](/docs/apis/saude-datasus/sih) | UF, município | Comparar cobertura SUS vs. saúde suplementar |
| ANS x CNES | [CNES](/docs/apis/saude-datasus/cnes) | Município | Avaliar infraestrutura de saúde vs. beneficiários de planos |
| ANS x População | [Censo Demográfico](/docs/apis/ibge-estatisticas/censo-demografico) | Município | Calcular taxa de cobertura de planos de saúde |
| Operadoras x Empresas | [CNPJ Completa](/docs/apis/receita-federal/cnpj-completa) | CNPJ | Enriquecer dados das operadoras |

## Limitações conhecidas

| Limitação | Detalhes |
|---|---|
| **API CKAN limitada** | A API CKAN tem limitação de registros por consulta. Para datasets maiores, baixar o CSV completo. |
| **Dados agregados** | Os dados de beneficiários são agregados (sem dados individuais de segurados). |
| **Defasagem** | Os dados de beneficiários são publicados com ~2 meses de atraso. |
| **Reclamações vs. qualidade** | O índice de reclamações não reflete necessariamente a qualidade do serviço (operadoras maiores tendem a ter mais reclamações em números absolutos). |
| **TabNet ANS** | O TabNet da ANS tem interface similar ao TabNet do DATASUS, com as mesmas limitações de usabilidade. |
