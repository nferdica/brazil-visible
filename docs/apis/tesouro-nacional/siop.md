---
title: SIOP (Planejamento e Orçamento Federal)
slug: siop
orgao: Tesouro Nacional
url_base: https://www.siop.planejamento.gov.br/
tipo_acesso: Web Interface
autenticacao: Não requerida
formato_dados: CSV, XLSX, PDF
frequencia_atualizacao: Anual
campos_chave:
  - codigo_orgao
  - funcao
  - subfuncao
  - programa
  - acao
  - exercicio
  - autor_emenda
tags:
  - orçamento
  - LOA
  - LDO
  - PPA
  - emendas parlamentares
  - planejamento
  - orçamento federal
  - créditos adicionais
  - SIOP
cruzamento_com:
  - tesouro-nacional/siafi
  - tesouro-nacional/siconfi
  - transparencia-cgu/emendas-parlamentares
  - transparencia-cgu/contratos-federais
status: documentado
---

# SIOP — Sistema Integrado de Planejamento e Orçamento

## O que é

O **SIOP** (Sistema Integrado de Planejamento e Orçamento) é o sistema do Governo Federal utilizado para a elaboração, acompanhamento e revisão do orçamento da União. Ele é operado pela **Secretaria de Orçamento Federal (SOF)**, vinculada ao Ministério do Planejamento e Orçamento, e contém:

- **LOA** (Lei Orçamentária Anual) — o orçamento aprovado pelo Congresso Nacional para cada exercício
- **LDO** (Lei de Diretrizes Orçamentárias) — metas e prioridades fiscais que orientam a LOA
- **PPA** (Plano Plurianual) — planejamento de médio prazo (4 anos) das políticas públicas
- **Emendas parlamentares** — propostas de alteração no orçamento feitas por deputados e senadores
- **Créditos adicionais** — suplementações e remanejamentos aprovados durante o exercício
- **Execução orçamentária** — acompanhamento da execução dos programas e ações

O SIOP é essencialmente uma **interface web** com funcionalidade de consulta e exportação de dados. Não possui uma API REST pública formal, mas oferece painéis interativos e downloads de dados abertos em formatos estruturados.

**Site oficial:** https://www.siop.planejamento.gov.br

**Painel de Orçamento:** https://www.siop.planejamento.gov.br/siop/

**Dados abertos (download):** https://www.gov.br/economia/pt-br/acesso-a-informacao/dados-abertos

## Como acessar

### Painel de Consultas Públicas

O SIOP disponibiliza um painel web de consultas que permite filtrar e exportar dados:

| Item | Detalhe |
|------|---------|
| **URL do painel** | `https://www.siop.planejamento.gov.br/siop/` |
| **Autenticação** | Não requerida para consultas públicas |
| **Exportação** | CSV, XLSX, PDF |
| **Módulos públicos** | LOA, Emendas, Créditos Adicionais, Execução |

### Downloads de dados abertos

A SOF publica arquivos para download no Portal de Dados Abertos:

| Recurso | URL | Formato |
|---------|-----|---------|
| LOA (projeto e lei) | https://www.gov.br/economia/pt-br/acesso-a-informacao/dados-abertos | CSV, XLSX |
| Emendas parlamentares | https://www.siop.planejamento.gov.br/siop/ (módulo Emendas) | CSV, XLSX |
| Créditos adicionais | https://www.siop.planejamento.gov.br/siop/ (módulo Créditos) | CSV, XLSX |
| PPA | https://www.gov.br/economia/pt-br/acesso-a-informacao/dados-abertos | CSV, PDF |

### Acesso programático via web scraping

Como o SIOP não possui API REST, o acesso programático é feito por meio de downloads manuais ou automação da interface web. Os arquivos exportados podem ser processados com Python.

```
https://www.siop.planejamento.gov.br/siop/
```

## Endpoints/recursos principais

O SIOP não expõe endpoints REST convencionais. Os dados são organizados em módulos de consulta na interface web:

### Módulos de consulta

| Módulo | Descrição | Dados disponíveis |
|--------|-----------|-------------------|
| **LOA** | Lei Orçamentária Anual | Dotação por órgão, função, subfunção, programa, ação |
| **Emendas** | Emendas Parlamentares ao Orçamento | Autor, tipo, valor, programa, ação, localidade |
| **Créditos Adicionais** | Suplementações e remanejamentos | Órgão, ação, valor original, valor suplementado |
| **Execução** | Acompanhamento da execução | Empenhado, liquidado, pago por órgão e ação |
| **PPA** | Plano Plurianual | Programas, objetivos, metas, indicadores |
| **LDO** | Lei de Diretrizes Orçamentárias | Metas fiscais, projeções de receita e despesa |

### Classificação orçamentária

| Classificador | Descrição | Exemplo |
|---------------|-----------|---------|
| **Órgão** | Ministério ou entidade responsável | `26000` — Ministério da Educação |
| **UO** | Unidade Orçamentária | `26101` — CAPES |
| **Função** | Área de atuação do governo | `12` — Educação |
| **Subfunção** | Desdobramento da função | `364` — Ensino Superior |
| **Programa** | Programa do PPA | `5014` — Educação Básica de Qualidade |
| **Ação** | Operação orçamentária específica | `20RI` — Apoio à Alimentação Escolar |
| **Grupo de despesa** | Natureza do gasto | `3` — Outras Despesas Correntes |
| **Modalidade de aplicação** | Forma de execução | `90` — Aplicações Diretas |
| **Fonte de recurso** | Origem dos recursos | `100` — Recursos do Tesouro |

## Exemplo de uso

### Processar arquivo da LOA baixado do SIOP

```python
import pandas as pd


def carregar_loa(caminho_arquivo: str):
    """
    Carrega e processa um arquivo da LOA exportado do SIOP.

    O arquivo deve ser um CSV ou XLSX exportado da consulta de LOA
    no painel do SIOP.

    Args:
        caminho_arquivo: Caminho para o arquivo CSV ou XLSX

    Returns:
        DataFrame com os dados da LOA
    """
    if caminho_arquivo.endswith(".csv"):
        df = pd.read_csv(caminho_arquivo, encoding="latin-1", sep=";", decimal=",")
    elif caminho_arquivo.endswith(".xlsx"):
        df = pd.read_excel(caminho_arquivo)
    else:
        raise ValueError("Formato não suportado. Use CSV ou XLSX.")

    return df


# Exemplo: carregar LOA 2024
df_loa = carregar_loa("loa_2024.csv")
print(f"Registros: {len(df_loa)}")
print(f"Colunas: {list(df_loa.columns)}")
print(df_loa.head())
```

### Analisar orçamento por função

```python
def analisar_por_funcao(df: pd.DataFrame, coluna_funcao: str = "Função",
                         coluna_valor: str = "Dotação Atual"):
    """
    Agrupa a LOA por função orçamentária e calcula totais.

    Args:
        df: DataFrame da LOA
        coluna_funcao: Nome da coluna de função
        coluna_valor: Nome da coluna de valor

    Returns:
        DataFrame resumido por função
    """
    resumo = (
        df.groupby(coluna_funcao)[coluna_valor]
        .sum()
        .sort_values(ascending=False)
        .reset_index()
    )
    resumo["percentual"] = (resumo[coluna_valor] / resumo[coluna_valor].sum() * 100).round(2)
    return resumo


# Exemplo: distribuição do orçamento por função
resumo_funcao = analisar_por_funcao(df_loa)
print("Distribuição do orçamento por função:")
print(resumo_funcao.head(10).to_string(index=False))
```

### Analisar emendas parlamentares

```python
def carregar_emendas(caminho_arquivo: str):
    """
    Carrega dados de emendas parlamentares exportados do SIOP.

    Args:
        caminho_arquivo: Caminho para o arquivo CSV ou XLSX

    Returns:
        DataFrame com emendas parlamentares
    """
    if caminho_arquivo.endswith(".csv"):
        df = pd.read_csv(caminho_arquivo, encoding="latin-1", sep=";", decimal=",")
    else:
        df = pd.read_excel(caminho_arquivo)

    return df


def resumo_emendas(df: pd.DataFrame, coluna_autor: str = "Autor da Emenda",
                    coluna_valor: str = "Valor Aprovado"):
    """
    Gera resumo de emendas por parlamentar.

    Args:
        df: DataFrame de emendas
        coluna_autor: Nome da coluna com o autor
        coluna_valor: Nome da coluna com o valor

    Returns:
        DataFrame com total de emendas por autor
    """
    resumo = (
        df.groupby(coluna_autor)
        .agg(
            total_emendas=(coluna_valor, "count"),
            valor_total=(coluna_valor, "sum"),
        )
        .sort_values("valor_total", ascending=False)
        .reset_index()
    )
    return resumo


# Exemplo: resumo de emendas por parlamentar
df_emendas = carregar_emendas("emendas_2024.csv")
resumo = resumo_emendas(df_emendas)
print("Top 10 autores de emendas:")
print(resumo.head(10).to_string(index=False))
```

### Comparar dotação inicial com créditos adicionais

```python
def analisar_creditos_adicionais(
    df_loa: pd.DataFrame,
    coluna_orgao: str = "Órgão",
    coluna_dotacao_inicial: str = "Dotação Inicial",
    coluna_dotacao_atual: str = "Dotação Atual",
):
    """
    Analisa o impacto dos créditos adicionais sobre a dotação inicial.

    Args:
        df_loa: DataFrame com dados da LOA (incluindo dotação atualizada)
        coluna_orgao: Coluna com o nome do órgão
        coluna_dotacao_inicial: Coluna com dotação inicial (LOA aprovada)
        coluna_dotacao_atual: Coluna com dotação atualizada (após créditos)

    Returns:
        DataFrame com variação por órgão
    """
    resumo = (
        df_loa.groupby(coluna_orgao)
        .agg(
            dotacao_inicial=(coluna_dotacao_inicial, "sum"),
            dotacao_atual=(coluna_dotacao_atual, "sum"),
        )
        .reset_index()
    )

    resumo["creditos_adicionais"] = resumo["dotacao_atual"] - resumo["dotacao_inicial"]
    resumo["variacao_%"] = (
        (resumo["creditos_adicionais"] / resumo["dotacao_inicial"]) * 100
    ).round(2)

    return resumo.sort_values("creditos_adicionais", ascending=False)


# Exemplo: impacto dos créditos adicionais por órgão
variacao = analisar_creditos_adicionais(df_loa)
print("Variação por créditos adicionais:")
print(variacao.head(10).to_string(index=False))
```

## Campos disponíveis

### LOA — Lei Orçamentária Anual

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `Exercício` | int | Ano do exercício fiscal |
| `Órgão` | string | Nome do ministério ou entidade |
| `Código Órgão` | string | Código SIAFI do órgão |
| `Unidade Orçamentária` | string | Nome da UO |
| `Código UO` | string | Código da Unidade Orçamentária |
| `Função` | string | Função orçamentária (ex: Saúde, Educação) |
| `Código Função` | string | Código da função (2 dígitos) |
| `Subfunção` | string | Subfunção orçamentária |
| `Código Subfunção` | string | Código da subfunção (3 dígitos) |
| `Programa` | string | Programa do PPA |
| `Código Programa` | string | Código do programa (4 dígitos) |
| `Ação` | string | Ação orçamentária |
| `Código Ação` | string | Código alfanumérico da ação |
| `Grupo de Despesa` | string | Pessoal, Custeio, Investimentos, etc. |
| `Modalidade de Aplicação` | string | Direta, Transferência, etc. |
| `Fonte de Recurso` | string | Origem dos recursos |
| `Dotação Inicial` | float | Valor aprovado na LOA (R$) |
| `Dotação Atual` | float | Valor atualizado com créditos adicionais (R$) |

### Emendas Parlamentares

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `Exercício` | int | Ano do exercício |
| `Número da Emenda` | string | Identificador único da emenda |
| `Autor da Emenda` | string | Parlamentar ou bancada autora |
| `Tipo de Emenda` | string | Individual, Bancada, Comissão, Relator |
| `Partido` | string | Partido do autor |
| `UF` | string | Unidade federativa do autor |
| `Ação` | string | Ação orçamentária beneficiada |
| `Programa` | string | Programa beneficiado |
| `Localidade` | string | Município ou estado beneficiado |
| `Valor Aprovado` | float | Valor da emenda aprovada (R$) |
| `Valor Empenhado` | float | Valor empenhado (R$) |
| `Valor Pago` | float | Valor efetivamente pago (R$) |

### PPA — Plano Plurianual

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `Código Programa` | string | Código do programa |
| `Nome Programa` | string | Nome do programa |
| `Objetivo` | string | Objetivo do programa |
| `Meta` | string | Meta quantitativa |
| `Indicador` | string | Indicador de desempenho |
| `Órgão Responsável` | string | Órgão responsável pelo programa |
| `Período PPA` | string | Período de vigência (ex: 2024-2027) |

## Cruzamentos possíveis

| Cruzamento | Fonte relacionada | Chave de ligação | Finalidade |
|------------|-------------------|------------------|------------|
| SIOP x SIAFI | [SIAFI](/docs/apis/tesouro-nacional/siafi) | `Código órgão / ação / programa` | Comparar orçamento aprovado (LOA) com execução orçamentária real |
| SIOP x SICONFI | [SICONFI](/docs/apis/tesouro-nacional/siconfi) | `Exercício` | Contextualizar o orçamento federal com as finanças de estados e municípios |
| SIOP x Emendas (CGU) | [Emendas Parlamentares](/docs/apis/transparencia-cgu/emendas-parlamentares) | `Número da emenda / autor` | Cruzar emendas do SIOP com dados de pagamento do Portal da Transparência |
| SIOP x Contratos | [Contratos Federais](/docs/apis/transparencia-cgu/contratos-federais) | `Código órgão / ação` | Vincular dotações orçamentárias a contratos firmados |
| SIOP x TSE | TSE — Candidaturas | `Autor da emenda (nome / CPF)` | Identificar parlamentares autores de emendas e suas bases eleitorais |
| SIOP x IBGE | IBGE — Agregados | `Código IBGE / UF` | Correlacionar investimentos federais com indicadores socioeconômicos |

### Receita: comparar LOA aprovada com execução (SIAFI)

```python
import pandas as pd

# Supondo que os arquivos foram baixados do SIOP e do Tesouro Transparente
df_loa = pd.read_csv("loa_2024.csv", encoding="latin-1", sep=";", decimal=",")
df_execucao = pd.read_csv("execucao_2024.csv", encoding="latin-1", sep=";", decimal=",")

# Padronizar nomes de colunas para o cruzamento
df_loa_resumo = (
    df_loa.groupby("Código Ação")
    .agg(dotacao_loa=("Dotação Inicial", "sum"))
    .reset_index()
)

df_exec_resumo = (
    df_execucao.groupby("Código Ação")
    .agg(
        empenhado=("Empenhado", "sum"),
        pago=("Pago", "sum"),
    )
    .reset_index()
)

# Cruzar LOA com execução
comparativo = pd.merge(df_loa_resumo, df_exec_resumo, on="Código Ação", how="outer")
comparativo["taxa_execucao_%"] = (
    comparativo["pago"] / comparativo["dotacao_loa"] * 100
).round(2)

# Ações com menor taxa de execução
baixa_execucao = comparativo.sort_values("taxa_execucao_%").head(20)
print("Ações com menor taxa de execução:")
print(baixa_execucao.to_string(index=False))
```

## Limitações conhecidas

| Limitação | Detalhes |
|-----------|----------|
| **Sem API REST pública** | O SIOP não possui uma API REST. Os dados são acessados via interface web com exportação manual de arquivos. |
| **Automação limitada** | A ausência de API dificulta pipelines automatizados. Web scraping da interface pode ser frágil e sujeito a mudanças. |
| **Formato dos arquivos** | Arquivos exportados podem usar encoding `latin-1`, separador `;` e vírgula como decimal, exigindo tratamento na importação. |
| **Nomes de colunas inconsistentes** | Os nomes das colunas nos arquivos exportados podem variar entre versões e módulos. Sempre verifique os cabeçalhos. |
| **Cobertura temporal** | Dados disponíveis no painel variam por módulo. LOA está disponível a partir de 2000; emendas detalhadas, a partir de 2014. |
| **Dados de emendas** | As emendas do tipo "relator" (emendas RP9, conhecidas como "orçamento secreto") tiveram publicação descontinuada em 2022 após decisão do STF. Dados anteriores podem estar incompletos. |
| **Atualização** | Os dados da LOA são atualizados uma vez por ano (após sanção presidencial). Créditos adicionais são atualizados ao longo do exercício, mas com defasagem. |
| **Complementaridade necessária** | Para análise completa do ciclo orçamentário, é necessário combinar dados do SIOP (planejamento/aprovação) com dados do SIAFI (execução), pois o SIOP sozinho não mostra quanto foi efetivamente gasto. |
