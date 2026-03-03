---
title: ANATEL Telecomunicações — Banda Larga e Telefonia
slug: anatel
orgao: ANATEL
url_base: https://www.anatel.gov.br/paineis/acessos
tipo_acesso: CSV Download
autenticacao: Não requerida
formato_dados: [CSV]
frequencia_atualizacao: Mensal
campos_chave:
  - municipio
  - operadora
  - tecnologia
  - acessos
  - tipo_servico
tags:
  - ANATEL
  - telecomunicações
  - banda larga
  - telefonia
  - celular
  - internet
  - fibra óptica
  - 5G
  - inclusão digital
cruzamento_com:
  - ibge-estatisticas/censo-demografico
  - ibge-estatisticas/pib-municipal
  - educacao/censo-escolar
status: documentado
---

# ANATEL Telecomunicações — Banda Larga e Telefonia

## O que é

A **ANATEL (Agência Nacional de Telecomunicações)** disponibiliza dados detalhados sobre o setor de telecomunicações brasileiro. Os principais conjuntos de dados incluem:

- **Acessos de banda larga fixa** — conexões por município, operadora, tecnologia (fibra, cabo, DSL, rádio), velocidade
- **Acessos de telefonia móvel** — linhas celulares por município, operadora, tipo (pré-pago, pós-pago)
- **Telefonia fixa** — linhas fixas por município e operadora
- **TV por assinatura** — assinantes por operadora e tecnologia
- **Cobertura** — áreas atendidas por cada tecnologia (4G, 5G, fibra)
- **Qualidade** — indicadores de qualidade das operadoras

Os dados são publicados em painéis interativos e em formato de microdados CSV no portal de dados abertos da ANATEL.

## Como acessar

| Item | Detalhe |
|---|---|
| **Painéis ANATEL** | `https://informacoes.anatel.gov.br/paineis/acessos` |
| **Dados abertos** | `https://www.gov.br/anatel/pt-br/dados/dados-abertos` |
| **dados.gov.br** | `https://dados.gov.br/dados/organizacoes/visualizar/agencia-nacional-de-telecomunicacoes-anatel` |
| **Autenticação** | Não requerida |
| **Formato** | CSV |
| **Publicação** | Mensal |

## Endpoints/recursos principais

| Recurso | Conteúdo | Periodicidade |
|---|---|---|
| **Banda larga fixa** | Acessos por município, operadora, tecnologia, velocidade | Mensal |
| **Telefonia móvel** | Linhas celulares por município, operadora, tipo | Mensal |
| **Telefonia fixa** | Linhas fixas por município | Mensal |
| **TV por assinatura** | Assinantes por operadora e tecnologia | Mensal |
| **Cobertura 4G/5G** | Municípios atendidos por cada tecnologia | Atualização contínua |
| **Indicadores de qualidade** | Métricas de qualidade por operadora | Trimestral |

## Exemplo de uso

### Análise de banda larga fixa por município

```python
import pandas as pd

# Download dos microdados de banda larga fixa
# https://www.anatel.gov.br/dados/
df = pd.read_csv(
    "acessos_banda_larga_fixa.csv",
    sep=";",
    encoding="utf-8",
    dtype=str,
    decimal=","
)

print(f"Total de registros: {len(df):,}")
print(f"Colunas: {list(df.columns)}")

# Converter acessos para numérico
df["Acessos"] = pd.to_numeric(df["Acessos"], errors="coerce")

# Total de acessos por tecnologia
por_tecnologia = df.groupby("Tecnologia")["Acessos"].sum().sort_values(ascending=False)
print("\nAcessos de banda larga por tecnologia:")
print(por_tecnologia)
```

### Penetração de internet por UF

```python
import pandas as pd

df = pd.read_csv(
    "acessos_banda_larga_fixa.csv",
    sep=";",
    encoding="utf-8",
    dtype=str,
    decimal=","
)

df["Acessos"] = pd.to_numeric(df["Acessos"], errors="coerce")

# Filtrar mês mais recente
mes_recente = df["Mês"].max()
df_recente = df[df["Mês"] == mes_recente]

# Total de acessos por UF
por_uf = df_recente.groupby("UF")["Acessos"].sum().sort_values(ascending=False)
print(f"Acessos de banda larga fixa por UF ({mes_recente}):")
print(por_uf)
```

## Campos disponíveis

### Banda larga fixa

| Campo | Tipo | Descrição |
|---|---|---|
| `Ano` | int | Ano de referência |
| `Mês` | int | Mês de referência |
| `UF` | string | UF |
| `Município` | string | Nome do município |
| `Código IBGE` | int | Código IBGE do município |
| `Empresa` | string | Nome da operadora |
| `CNPJ` | string | CNPJ da operadora |
| `Tecnologia` | string | Fibra Óptica, Cabo Coaxial (HFC), DSL, Rádio, Satélite |
| `Meio de Acesso` | string | Fibra, Metálico, Rádio, Satélite |
| `Velocidade` | string | Faixa de velocidade contratada |
| `Acessos` | int | Número de acessos |
| `Tipo de Pessoa` | string | Física ou Jurídica |

### Telefonia móvel

| Campo | Tipo | Descrição |
|---|---|---|
| `UF` | string | UF |
| `Município` | string | Nome do município |
| `Operadora` | string | Nome da operadora |
| `Tipo` | string | Pré-pago, Pós-pago |
| `Tecnologia` | string | 2G, 3G, 4G, 5G |
| `Acessos` | int | Número de linhas ativas |

## Cruzamentos possíveis

| Cruzamento | Fonte relacionada | Chave de ligação | Finalidade |
|---|---|---|---|
| Internet x População | [Censo Demográfico](/docs/apis/ibge-estatisticas/censo-demografico) | Município | Calcular taxa de penetração de internet per capita |
| Internet x PIB | [PIB Municipal](/docs/apis/ibge-estatisticas/pib-municipal) | Município | Correlacionar conectividade com desenvolvimento econômico |
| Internet x Educação | [Censo Escolar](/docs/apis/educacao/censo-escolar) | Município | Analisar inclusão digital nas escolas vs. cobertura residencial |

## Limitações conhecidas

| Limitação | Detalhes |
|---|---|
| **Sem API REST** | Os dados são disponibilizados como CSVs para download. Não há API de consulta programática. |
| **Arquivos grandes** | Os microdados de acessos por município podem ser muito grandes (milhões de registros). |
| **Velocidade contratada ≠ real** | Os dados refletem velocidade contratada, não a velocidade efetivamente entregue. |
| **Sem dados de qualidade por localização** | Indicadores de qualidade são agregados por operadora, sem detalhamento geográfico fino. |
| **Encoding e formato variáveis** | Verificar separador e encoding de cada arquivo. |
| **Dados de cobertura aproximados** | As informações de cobertura 4G/5G são declaratórias das operadoras, podendo não refletir a cobertura efetiva. |
