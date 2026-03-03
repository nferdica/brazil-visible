---
title: Justiça em Números
slug: justica-numeros
orgao: CNJ
url_base: https://justica-em-numeros.cnj.jus.br/
tipo_acesso: Download / Painel interativo
autenticacao: Não requerida
formato_dados: [CSV, XLSX, PDF]
frequencia_atualizacao: Anual
campos_chave:
  - tribunal
  - indicador
  - ano_referencia
  - casos_novos
  - casos_pendentes
  - taxa_congestionamento
tags:
  - estatísticas judiciais
  - poder judiciário
  - CNJ
  - desempenho tribunais
  - produtividade
  - taxa de congestionamento
  - acervo processual
  - justiça em números
cruzamento_com:
  - poder-judiciario-cnj/datajud
  - tesouro-nacional/siop
  - tesouro-nacional/siconfi
  - portais-centrais/portal-dados-abertos
status: documentado
---

# Justiça em Números

## O que é

O **Justiça em Números** é o principal relatório estatístico do Poder Judiciário brasileiro, publicado anualmente pelo **Conselho Nacional de Justiça (CNJ)**. Desde 2004, o relatório consolida indicadores de desempenho de todos os 90 tribunais do país, abrangendo os cinco ramos da Justiça: Estadual, Federal, Trabalhista, Eleitoral e Militar.

O relatório apresenta dados sobre:

- **Litigiosidade** — casos novos, processos pendentes, processos baixados
- **Produtividade** — taxa de congestionamento, índice de produtividade dos magistrados, índice de atendimento à demanda
- **Recursos humanos** — número de magistrados, servidores, terceirizados e estagiários
- **Despesas** — orçamento do judiciário, custo por processo, despesas com pessoal
- **Infraestrutura** — informatização, processo eletrônico, unidades judiciárias
- **Acesso à justiça** — assistência judiciária gratuita, justiça itinerante, conciliação

Os dados estão disponíveis em painéis interativos (QlikView/QlikSense) no portal do CNJ e também em formato aberto (CSV/XLSX) no portal de dados abertos do CNJ.

> **Importante:** O Justiça em Números não é uma API REST. Os dados são acessados via painéis interativos ou download de arquivos.

## Como acessar

### Via painéis interativos

| Item | Detalhe |
|---|---|
| **URL** | `https://justica-em-numeros.cnj.jus.br/` |
| **Painéis QlikView (legado)** | `https://paineis.cnj.jus.br/QvAJAXZfc/opendoc.htm` |
| **Tecnologia** | QlikView / QlikSense |
| **Autenticação** | Não requerida |
| **Interatividade** | Filtros por tribunal, ano, indicador |

### Via dados abertos do CNJ

| Item | Detalhe |
|---|---|
| **URL** | `https://www.cnj.jus.br/pesquisas-judiciarias/justica-em-numeros/` |
| **Formatos** | CSV, XLSX, PDF (relatórios completos) |
| **Autenticação** | Não requerida |
| **Organização** | Por ano de publicação |

### Via Base dos Dados (recomendado)

| Item | Detalhe |
|---|---|
| **URL** | `https://basedosdados.org/` |
| **Descrição** | Dados do Justiça em Números tratados e disponibilizados via BigQuery |
| **Formato** | SQL (BigQuery), CSV |

## Endpoints/recursos principais

Como não se trata de uma API REST, os "recursos" são os conjuntos de dados e painéis disponíveis:

### Painéis interativos

| Painel | Descrição | Cobertura |
|---|---|---|
| Justiça em Números — Visão Geral | Indicadores consolidados de todos os tribunais | 2009 a atual |
| Justiça em Números — Detalhamento | Dados detalhados por tribunal e indicador | 2009 a atual |
| Grandes Litigantes | Ranking dos maiores demandantes do judiciário | Últimos 3 anos |
| Índice de Produtividade Comparada (IPC-Jus) | Indicador de eficiência relativa dos tribunais | 2013 a atual |
| Metas Nacionais | Acompanhamento das metas de desempenho definidas pelo CNJ | Anual |

### Indicadores principais

| Indicador | Descrição | Fórmula |
|---|---|---|
| Taxa de congestionamento | Percentual de processos que permaneceram sem solução | Pendentes / (Novos + Pendentes) x 100 |
| Índice de atendimento à demanda | Capacidade de dar vazão aos processos novos | Baixados / Novos x 100 |
| Índice de produtividade dos magistrados | Processos baixados por magistrado | Baixados / Magistrados |
| Tempo médio de tramitação | Duração média dos processos | Dias entre distribuição e baixa |
| Despesa por habitante | Gasto do judiciário per capita | Orçamento / População |
| Carga de trabalho por magistrado | Processos em tramitação por magistrado | (Novos + Pendentes) / Magistrados |

## Exemplo de uso

### Download e análise de dados do Justiça em Números

```python
import pandas as pd

# Os dados do Justiça em Números podem ser obtidos em CSV no portal do CNJ
# ou via Base dos Dados (basedosdados.org)
#
# Após download do CSV disponível em:
# https://www.cnj.jus.br/pesquisas-judiciarias/justica-em-numeros/

# Exemplo: leitura de dados previamente baixados
# df = pd.read_csv("justica_em_numeros_2023.csv", sep=";", encoding="utf-8")

# Exemplo com dados hipotéticos para demonstração
dados = {
    "tribunal": ["TJSP", "TJRJ", "TJMG", "TJRS", "TJPR"],
    "ano": [2023, 2023, 2023, 2023, 2023],
    "casos_novos": [7_500_000, 3_200_000, 2_800_000, 1_900_000, 1_600_000],
    "casos_pendentes": [28_000_000, 13_500_000, 10_200_000, 6_800_000, 5_100_000],
    "casos_baixados": [7_200_000, 3_100_000, 2_700_000, 1_800_000, 1_550_000],
    "magistrados": [2_600, 850, 1_200, 800, 700],
    "despesa_total_mi": [18_500, 8_200, 6_900, 4_800, 3_600],
}

df = pd.DataFrame(dados)

# Calcular indicadores
df["taxa_congestionamento"] = (
    df["casos_pendentes"] / (df["casos_novos"] + df["casos_pendentes"]) * 100
)
df["produtividade_magistrado"] = df["casos_baixados"] / df["magistrados"]
df["atendimento_demanda"] = df["casos_baixados"] / df["casos_novos"] * 100

print("Indicadores de desempenho dos tribunais (2023):")
print(
    df[
        [
            "tribunal",
            "taxa_congestionamento",
            "produtividade_magistrado",
            "atendimento_demanda",
        ]
    ].to_string(index=False)
)
```

### Consultar dados via Base dos Dados (BigQuery)

```python
import basedosdados as bd

# Consultar dados do Justiça em Números via BigQuery
# Requer configuração de projeto Google Cloud
# Documentação: https://basedosdados.github.io/mais/

query = """
SELECT
    ano,
    sigla_tribunal,
    casos_novos,
    casos_pendentes,
    casos_baixados,
    magistrados
FROM `basedosdados.br_cnj_justica_numeros.tribunal`
WHERE ano >= 2018
ORDER BY ano DESC, casos_novos DESC
LIMIT 20
"""

df = bd.read_sql(query, billing_project_id="SEU_PROJETO_GCP")
print(df.head(20))
```

### Análise comparativa entre tribunais

```python
import pandas as pd

# Exemplo de análise de evolução temporal (dados hipotéticos)
dados_historicos = {
    "tribunal": ["TJSP"] * 5 + ["TJRJ"] * 5,
    "ano": [2019, 2020, 2021, 2022, 2023] * 2,
    "taxa_congestionamento": [
        78.5, 79.2, 77.8, 76.5, 75.3,  # TJSP
        80.1, 81.5, 79.9, 78.2, 77.0,  # TJRJ
    ],
    "casos_novos_mi": [
        7.1, 6.2, 6.8, 7.3, 7.5,  # TJSP
        2.9, 2.5, 2.7, 3.0, 3.2,  # TJRJ
    ],
}

df = pd.DataFrame(dados_historicos)

# Variação da taxa de congestionamento
for tribunal in df["tribunal"].unique():
    dados_t = df[df["tribunal"] == tribunal].sort_values("ano")
    variacao = dados_t["taxa_congestionamento"].iloc[-1] - dados_t["taxa_congestionamento"].iloc[0]
    print(f"{tribunal}: variação de {variacao:+.1f} p.p. na taxa de congestionamento (2019-2023)")
```

## Campos disponíveis

### Dados por tribunal (campos principais)

| Campo | Tipo | Descrição |
|---|---|---|
| `sigla_tribunal` | string | Sigla do tribunal (ex: TJSP, TRF1, TRT2) |
| `ramo_justica` | string | Ramo da justiça (Estadual, Federal, Trabalhista, Eleitoral, Militar) |
| `grau` | string | Grau de jurisdição (1º Grau, 2º Grau, Juizados Especiais, Turmas Recursais) |
| `ano` | int | Ano de referência |
| `casos_novos` | int | Processos distribuídos no ano |
| `casos_pendentes` | int | Processos em tramitação ao final do ano |
| `casos_baixados` | int | Processos encerrados/baixados no ano |
| `sentencas` | int | Sentenças proferidas no ano |
| `decisoes` | int | Decisões proferidas no ano |
| `magistrados` | int | Número de magistrados em exercício |
| `servidores` | int | Número de servidores efetivos |
| `terceirizados` | int | Número de trabalhadores terceirizados |
| `despesa_total` | decimal | Despesa total do tribunal (R$) |
| `despesa_pessoal` | decimal | Despesa com pessoal (R$) |
| `despesa_informatica` | decimal | Despesa com informática (R$) |
| `taxa_congestionamento` | decimal | Taxa de congestionamento (%) |
| `indice_produtividade` | decimal | Índice de produtividade dos magistrados |
| `processos_eletronicos_pct` | decimal | Percentual de processos eletrônicos |

## Cruzamentos possíveis

| Cruzamento | Fonte relacionada | Chave de ligação | Finalidade |
|---|---|---|---|
| Estatísticas x Processos | [DataJud](/docs/apis/poder-judiciario-cnj/datajud) | `tribunal` | Complementar estatísticas agregadas com dados processuais individuais |
| Estatísticas x Orçamento federal | [SIOP](/docs/apis/tesouro-nacional/siop) | `orgao` / `ano` | Cruzar despesas do judiciário federal com dados orçamentários do SIOP |
| Estatísticas x Finanças públicas | [SICONFI](/docs/apis/tesouro-nacional/siconfi) | `ente` / `ano` | Comparar gastos estaduais com o judiciário em relação ao orçamento total |
| Estatísticas x Dados abertos | [Portal de Dados Abertos](/docs/apis/portais-centrais/portal-dados-abertos) | Metadados | Acessar dados complementares disponibilizados pelo CNJ |

### Exemplo de cruzamento: despesa do judiciário vs. orçamento estadual

```python
import pandas as pd

# Dados hipotéticos para demonstração
despesas_judiciario = {
    "uf": ["SP", "RJ", "MG", "RS", "PR"],
    "tribunal": ["TJSP", "TJRJ", "TJMG", "TJRS", "TJPR"],
    "despesa_total_bi": [18.5, 8.2, 6.9, 4.8, 3.6],
}

orcamento_estados = {
    "uf": ["SP", "RJ", "MG", "RS", "PR"],
    "orcamento_total_bi": [280, 95, 110, 65, 55],
}

df_jud = pd.DataFrame(despesas_judiciario)
df_orc = pd.DataFrame(orcamento_estados)

df = pd.merge(df_jud, df_orc, on="uf")
df["pct_orcamento"] = df["despesa_total_bi"] / df["orcamento_total_bi"] * 100

print("Participação do judiciário no orçamento estadual:")
print(df[["uf", "tribunal", "despesa_total_bi", "orcamento_total_bi", "pct_orcamento"]].to_string(index=False))
```

## Limitações conhecidas

| Limitação | Detalhes |
|---|---|
| **Sem API REST** | Os dados não estão disponíveis via API REST. O acesso é feito por painéis interativos (QlikView) ou download de arquivos. |
| **Atualização anual** | O relatório é publicado uma vez por ano, com dados referentes ao ano anterior. Dados em tempo real não estão disponíveis. |
| **Painéis QlikView** | Os painéis interativos utilizam tecnologia QlikView/QlikSense, que pode ser lenta e não permite exportação automatizada via scripts. |
| **Dados auto-declarados** | Os dados são informados pelos próprios tribunais ao CNJ, podendo haver inconsistências metodológicas entre tribunais. |
| **Mudanças metodológicas** | A metodologia de cálculo de indicadores sofreu alterações ao longo dos anos, dificultando comparações temporais diretas em séries longas. |
| **Granularidade limitada** | Os dados públicos são geralmente agregados por tribunal e ano. Dados por vara ou comarca exigem acesso a relatórios detalhados. |
| **Formato dos downloads** | Os arquivos CSV/XLSX podem ter formatos inconsistentes entre edições do relatório. |
| **Cobertura do 1º Grau** | Dados do 1º grau podem ser menos completos que os do 2º grau em alguns tribunais, devido à dificuldade de coleta em comarcas menores. |
