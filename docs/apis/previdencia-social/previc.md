---
title: PREVIC — Previdência Complementar Fechada
slug: previc
orgao: PREVIC (Superintendência Nacional de Previdência Complementar)
url_base: https://www.gov.br/previc/pt-br/acesso-a-informacao/dados-abertos
tipo_acesso: Download (CSV, XLSX) / Portal web (CADPREVIC, PREVIC-Cidadão)
autenticacao: Não requerida (dados públicos) / Gov.br (CADPREVIC restrito)
formato_dados: [CSV, XLSX, PDF, JSON (CADPREVIC)]
frequencia_atualizacao: Trimestral (demonstrações) / Contínuo (CADPREVIC)
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
  - CADPREVIC
  - PREVIC-Cidadão
cruzamento_com:
  - previdencia-social/beneficios-inss
  - mercado-financeiro/cvm-dfp-itr
  - receita-federal/cnpj-completa
  - transparencia-cgu/servidores-federais
status: documentado
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
- **Estatísticas do setor** — indicadores consolidados de solvência, liquidez e rentabilidade

### Números do setor (2025)

| Indicador | Valor |
|---|---|
| Patrimônio total administrado | R$ 1,2+ trilhão |
| Entidades ativas | ~250 EFPCs |
| Participantes e assistidos | ~8 milhões de pessoas |
| Planos de benefícios | ~1.100 planos |
| Maiores fundos | Previ, Petros, Funcef, Fundação Copel, Real Grandeza |

> **Atualização 2025-2026:** O **PREVIC-Cidadão**, dashboard interativo de consulta pública, foi lançado em setembro de 2025. O **CADPREVIC** foi modernizado em janeiro de 2026 com nova interface e endpoints atualizados (`cad.previc.gov.br/cadspc/`).

### Tipos de previdência no Brasil

| Tipo | Regulador | Escopo |
|---|---|---|
| **RGPS (Regime Geral)** | INSS | Trabalhadores CLT, contribuintes individuais |
| **RPPS (Regime Próprio)** | Secretaria de Previdência | Servidores públicos efetivos |
| **Previdência Complementar Fechada** | **PREVIC** | Fundos de pensão (vinculados a empregador/associação) |
| **Previdência Complementar Aberta** | SUSEP | PGBL/VGBL (seguradoras, bancos) |

## Como acessar

| Plataforma | URL | Autenticação | Descrição |
|---|---|---|---|
| **Portal de dados abertos** | `https://www.gov.br/previc/pt-br/acesso-a-informacao/dados-abertos` | Não requerida | Downloads de CSV/XLSX |
| **PREVIC-Cidadão** | `https://www.gov.br/previc/pt-br/previc-cidadao` | Não requerida | Dashboard interativo (set/2025) |
| **CADPREVIC (público)** | `https://cad.previc.gov.br/cadspc/` | Não requerida | Consulta a entidades e planos |
| **CADPREVIC (restrito)** | `https://cadprevic.previc.gov.br/` | Gov.br (entidades) | Envio de demonstrações pelas EFPCs |
| **Informe Estatístico** | `https://www.gov.br/previc/pt-br/acesso-a-informacao/dados-abertos/informes-estatisticos` | Não requerida | Relatórios trimestrais consolidados |
| **Relatório de Estabilidade** | `https://www.gov.br/previc/pt-br/centrais-de-conteudo/publicacoes/relatorio-de-estabilidade` | Não requerida | Relatório anual de estabilidade do setor |
| **dados.gov.br** | `https://dados.gov.br/dados/organizacoes/visualizar/superintendencia-nacional-de-previdencia-complementar-previc` | Não requerida | Catálogo no portal federal |

### Processo de consulta no CADPREVIC

1. Acesse `https://cad.previc.gov.br/cadspc/`
2. Pesquise por nome, CNPJ ou sigla da entidade
3. Visualize dados cadastrais, planos de benefícios e patrocinadores
4. Para dados financeiros detalhados, utilize o portal de dados abertos

## Endpoints/recursos principais

### Dados para download

| Recurso | Conteúdo | Formato | Periodicidade |
|---|---|---|---|
| **Cadastro de EFPCs** | Lista de entidades ativas, com CNPJ, nome, situação, UF | CSV/XLSX | Contínuo |
| **Planos de benefícios** | Detalhes dos planos, modalidade (BD/CD/CV), patrocinador | CSV/XLSX | Contínuo |
| **Demonstrações contábeis** | Balanço patrimonial, DRE, investimentos por segmento | CSV/XLSX | Trimestral |
| **Estatísticas de investimentos** | Alocação da carteira por segmento e classe de ativo | CSV/XLSX | Trimestral |
| **Participantes** | Ativos, assistidos, autopatrocinados, designados | CSV/XLSX | Trimestral |
| **Informe Estatístico** | Relatório consolidado com gráficos e análises | PDF | Trimestral |
| **Relatório de Estabilidade** | Indicadores de solvência, liquidez, rentabilidade | PDF | Anual |

### PREVIC-Cidadão (dashboard — set/2025)

| Recurso | Descrição |
|---|---|
| Consulta por entidade | Dados cadastrais, planos, patrocinadores |
| Indicadores do setor | Patrimônio total, número de entidades, participantes |
| Comparativo | Comparação entre entidades por indicadores financeiros |
| Série histórica | Evolução de indicadores ao longo do tempo |

### CADPREVIC — Dados de consulta

| Recurso | Descrição |
|---|---|
| Entidades | CNPJ, razão social, sigla, situação, data de criação, UF |
| Planos | Nome, CNPB, modalidade (BD/CD/CV), patrocinador, situação |
| Patrocinadores | CNPJ, razão social, tipo (público/privado) |
| Dirigentes | Nome, cargo, mandato |

## Exemplo de uso

### Consultar cadastro de fundos de pensão

```python
import pandas as pd

# Após download do cadastro de entidades do portal PREVIC
# https://www.gov.br/previc/pt-br/acesso-a-informacao/dados-abertos
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
ativas = ativas.copy()
ativas["PARTICIPANTES"] = pd.to_numeric(ativas["PARTICIPANTES"], errors="coerce")
top10 = ativas.nlargest(10, "PARTICIPANTES")[["NOME_ENTIDADE", "SIGLA", "PARTICIPANTES"]]
print("\nTop 10 fundos de pensão por participantes:")
print(top10.to_string(index=False))

# Distribuição por UF
print("\nDistribuição de EFPCs por UF:")
print(ativas["UF"].value_counts().head(10))
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
    decimal=",",
)

# Converter valores
colunas_valor = [
    "RENDA_FIXA",
    "RENDA_VARIAVEL",
    "ESTRUTURADO",
    "IMOVEIS",
    "OPERACOES_PARTICIPANTES",
    "EXTERIOR",
]
for col in colunas_valor:
    if col in df_inv.columns:
        df_inv[col] = pd.to_numeric(
            df_inv[col].str.replace(".", "").str.replace(",", "."),
            errors="coerce",
        )

# Total investido por segmento
totais = df_inv[colunas_valor].sum()
print("Investimentos do setor por segmento (R$ bilhões):")
print((totais / 1e9).round(1))

# Proporção por segmento
total_geral = totais.sum()
print("\nProporção por segmento:")
print((totais / total_geral * 100).round(1).to_string() + "%")
```

### Análise de concentração do setor

```python
import pandas as pd

# Dados patrimoniais por entidade
df = pd.read_csv(
    "demonstracoes_efpc.csv",
    sep=";",
    encoding="utf-8",
    dtype=str,
    decimal=",",
)

df["PATRIMONIO_LIQUIDO"] = pd.to_numeric(
    df["PATRIMONIO_LIQUIDO"].str.replace(".", "").str.replace(",", "."),
    errors="coerce",
)

# Ordenar por patrimônio
df_sorted = df.sort_values("PATRIMONIO_LIQUIDO", ascending=False)

# Top 10 = qual % do total?
top10_pl = df_sorted.head(10)["PATRIMONIO_LIQUIDO"].sum()
total_pl = df_sorted["PATRIMONIO_LIQUIDO"].sum()
print(f"Top 10 fundos concentram {top10_pl / total_pl * 100:.1f}% do patrimônio total")

# Maiores fundos
print("\nMaiores fundos de pensão por patrimônio:")
for _, row in df_sorted.head(10).iterrows():
    nome = row.get("SIGLA", row.get("NOME_ENTIDADE", "N/A"))
    pl = row["PATRIMONIO_LIQUIDO"] / 1e9
    print(f"  {nome}: R$ {pl:.1f} bilhões")
```

## Campos disponíveis

### Cadastro de entidades

| Campo | Tipo | Descrição |
|---|---|---|
| `CNPJ_EFPC` | string | CNPJ da entidade |
| `NOME_ENTIDADE` | string | Razão social da EFPC |
| `SIGLA` | string | Sigla da entidade (ex: PREVI, PETROS, FUNCEF) |
| `SITUACAO` | string | Ativa, Em Liquidação Extrajudicial, Encerrada |
| `UF` | string | UF da sede |
| `MUNICIPIO` | string | Município da sede |
| `DATA_CRIACAO` | date | Data de criação da entidade |
| `NATUREZA` | string | Pública, Privada |
| `PATROCINADORES` | string | Lista de patrocinadores |
| `PARTICIPANTES_ATIVOS` | int | Número de participantes ativos |
| `ASSISTIDOS` | int | Número de assistidos (aposentados e pensionistas) |
| `AUTOPATROCINADOS` | int | Número de autopatrocinados |
| `PATRIMONIO_LIQUIDO` | float | Patrimônio líquido total (R$) |

### Planos de benefícios

| Campo | Tipo | Descrição |
|---|---|---|
| `CNPB` | string | Código Nacional do Plano de Benefícios |
| `NOME_PLANO` | string | Nome do plano |
| `CNPJ_EFPC` | string | CNPJ da entidade administradora |
| `MODALIDADE` | string | BD (Benefício Definido), CD (Contribuição Definida), CV (Contribuição Variável) |
| `SITUACAO_PLANO` | string | Ativo, Em extinção, Encerrado |
| `PATROCINADOR` | string | Empresa/entidade patrocinadora |
| `CNPJ_PATROCINADOR` | string | CNPJ do patrocinador |

### Investimentos

| Campo | Tipo | Descrição |
|---|---|---|
| `CNPJ_EFPC` | string | CNPJ da entidade |
| `COMPETENCIA` | string | Trimestre de referência (ex: 2025T3) |
| `RENDA_FIXA` | float | Valor investido em renda fixa (R$) |
| `RENDA_VARIAVEL` | float | Valor investido em renda variável (R$) |
| `ESTRUTURADO` | float | Investimentos estruturados — FIPs, FIIs (R$) |
| `IMOVEIS` | float | Investimentos imobiliários diretos (R$) |
| `OPERACOES_PARTICIPANTES` | float | Empréstimos a participantes (R$) |
| `EXTERIOR` | float | Investimentos no exterior (R$) |
| `TOTAL_INVESTIMENTOS` | float | Total da carteira de investimentos (R$) |

## Cruzamentos possíveis

| Cruzamento | Fonte relacionada | Chave de ligação | Finalidade |
|---|---|---|---|
| Fundos x INSS | [Benefícios INSS](/docs/apis/previdencia-social/beneficios-inss) | UF, município | Comparar cobertura previdenciária complementar e básica por região |
| Patrocinadores x Empresas | [CNPJ Completa](/docs/apis/receita-federal/cnpj-completa) | `CNPJ_PATROCINADOR` | Identificar porte, setor e situação cadastral das empresas patrocinadoras |
| Investimentos x Mercado | [CVM DFP/ITR](/docs/apis/mercado-financeiro/cvm-dfp-itr) | Ativos investidos | Analisar participação dos fundos de pensão como investidores institucionais |
| Dirigentes x Servidores | [Servidores Federais](/docs/apis/transparencia-cgu/servidores-federais) | CPF (via busca nominal) | Verificar se dirigentes de fundos de estatais são servidores federais |

## Limitações conhecidas

| Limitação | Detalhes |
|---|---|
| **Dados agregados** | Os dados públicos são agregados por entidade e segmento. A composição detalhada da carteira de investimentos (ativos individuais) não é divulgada publicamente. |
| **Sem API REST pública** | Não existe API REST de consulta pública. Os dados são disponibilizados como arquivos para download (CSV/XLSX) ou via consulta no CADPREVIC. |
| **Formato inconsistente** | Os formatos dos arquivos e a estrutura das colunas podem variar entre trimestres, dificultando séries históricas automatizadas. |
| **Cobertura parcial** | Apenas entidades fechadas (fundos de pensão vinculados a empregador/associação) são cobertas. Previdência aberta (PGBL/VGBL) é regulada pela SUSEP, não pela PREVIC. |
| **Defasagem** | Demonstrações contábeis trimestrais são publicadas com atraso de 3-6 meses. O Informe Estatístico consolidado pode demorar mais. |
| **CADPREVIC instável** | O sistema CADPREVIC, mesmo após a modernização de janeiro de 2026, pode apresentar instabilidade e tempos de resposta lentos. |
| **Dados individuais sigilosos** | Informações de participantes individuais (nome, CPF, benefícios) são protegidas por LGPD e sigilo fiscal, não sendo disponibilizadas publicamente. |
| **PREVIC-Cidadão em evolução** | O dashboard lançado em setembro de 2025 ainda está em expansão de funcionalidades. Nem todos os dados históricos estão disponíveis. |
