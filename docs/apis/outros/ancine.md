---
title: ANCINE Audiovisual — Bilheteria e Produção
slug: ancine
orgao: ANCINE
url_base: https://oca.ancine.gov.br/
tipo_acesso: CSV Download
autenticacao: Não requerida
formato_dados: [CSV, XLSX, PDF]
frequencia_atualizacao: Anual
campos_chave:
  - titulo_filme
  - publico
  - renda
  - distribuidora
  - pais_origem
  - ano_lancamento
tags:
  - ANCINE
  - audiovisual
  - cinema
  - bilheteria
  - produção
  - fomento
  - TV paga
cruzamento_com:
  - ibge-estatisticas/censo-demografico
  - ibge-estatisticas/pib-municipal
status: stub
---

# ANCINE Audiovisual — Bilheteria e Produção

## O que é

A **ANCINE (Agência Nacional do Cinema)** é responsável pelo fomento, regulação e fiscalização do mercado audiovisual brasileiro. O **OCA (Observatório Brasileiro do Cinema e do Audiovisual)** é o braço estatístico da ANCINE que disponibiliza dados sobre:

- **Bilheteria de cinema** — público, renda, filmes exibidos, distribuidoras
- **Produção audiovisual** — filmes e séries brasileiras produzidos, registros na ANCINE
- **Fomento** — recursos públicos investidos em produção audiovisual (FSA, Lei do Audiovisual, Lei Rouanet)
- **TV por assinatura** — canais, programação brasileira, conteúdo nacional
- **Mercado de vídeo** — home video, streaming, VOD
- **Infraestrutura** — salas de cinema por município, complexos, redes exibidoras

## Como acessar

| Item | Detalhe |
|---|---|
| **OCA** | `https://oca.ancine.gov.br/` |
| **Portal ANCINE** | `https://www.gov.br/ancine/` |
| **dados.gov.br** | `https://dados.gov.br/dados/organizacoes/visualizar/agencia-nacional-do-cinema-ancine` |
| **Autenticação** | Não requerida |
| **Formato** | CSV, XLSX, PDF |

## Endpoints/recursos principais

| Recurso | Conteúdo | Periodicidade |
|---|---|---|
| **Dados de bilheteria** | Público e renda por filme, distribuidora, semana | Semanal/Anual |
| **Listagem de filmes** | Filmes brasileiros registrados na ANCINE | Atualização contínua |
| **Salas de cinema** | Complexos e salas por município | Anual |
| **Dados de fomento** | Projetos aprovados, valores investidos (FSA) | Anual |
| **Programação TV paga** | Canais brasileiros, conteúdo nacional | Anual |

## Exemplo de uso

### Análise de bilheteria anual

```python
import pandas as pd

# Download do relatório de bilheteria do OCA
df = pd.read_csv(
    "bilheteria_anual.csv",
    sep=";",
    encoding="utf-8",
    dtype=str,
    decimal=","
)

print(f"Total de filmes: {len(df):,}")

# Converter público para numérico
df["PUBLICO"] = pd.to_numeric(df["PUBLICO"], errors="coerce")
df["RENDA"] = pd.to_numeric(
    df["RENDA"].str.replace(".", "").str.replace(",", "."),
    errors="coerce"
)

# Top 10 filmes por público
top10 = df.nlargest(10, "PUBLICO")[["TITULO", "PUBLICO", "RENDA", "DISTRIBUIDORA"]]
print("\nTop 10 filmes por público:")
print(top10.to_string(index=False))

# Filmes brasileiros vs. estrangeiros
br = df[df["PAIS_ORIGEM"] == "Brasil"]["PUBLICO"].sum()
total = df["PUBLICO"].sum()
print(f"\nParticipação filmes brasileiros: {br/total*100:.1f}%")
```

### Salas de cinema por município

```python
import pandas as pd

df_salas = pd.read_csv(
    "salas_cinema.csv",
    sep=";",
    encoding="utf-8",
    dtype=str,
)

df_salas["SALAS"] = pd.to_numeric(df_salas["SALAS"], errors="coerce")

# Municípios com mais salas
por_municipio = df_salas.groupby("MUNICIPIO")["SALAS"].sum().sort_values(ascending=False)
print("Top 10 municípios por número de salas de cinema:")
print(por_municipio.head(10))
```

## Campos disponíveis

### Bilheteria

| Campo | Tipo | Descrição |
|---|---|---|
| `TITULO` | string | Título do filme |
| `TITULO_ORIGINAL` | string | Título original |
| `PAIS_ORIGEM` | string | País de origem |
| `GENERO` | string | Gênero (drama, comédia, ação, etc.) |
| `DISTRIBUIDORA` | string | Distribuidora no Brasil |
| `PUBLICO` | int | Número de espectadores |
| `RENDA` | float | Bilheteria bruta (R$) |
| `ANO_LANCAMENTO` | int | Ano de lançamento |
| `DATA_LANCAMENTO` | date | Data de lançamento |
| `CLASSIFICACAO` | string | Classificação indicativa |

## Cruzamentos possíveis

| Cruzamento | Fonte relacionada | Chave de ligação | Finalidade |
|---|---|---|---|
| Cinema x População | [Censo Demográfico](/docs/apis/ibge-estatisticas/censo-demografico) | Município | Calcular frequência ao cinema per capita |
| Cinema x PIB | [PIB Municipal](/docs/apis/ibge-estatisticas/pib-municipal) | Município | Correlacionar mercado cinematográfico com riqueza |

## Limitações conhecidas

| Limitação | Detalhes |
|---|---|
| **Sem API REST** | Os dados são disponibilizados como planilhas (CSV, XLSX) para download. Não há API. |
| **Dados de bilheteria incompletos** | Os dados cobrem apenas exibição em salas de cinema. Plataformas de streaming (Netflix, etc.) não são incluídas. |
| **Formato inconsistente** | Os relatórios do OCA variam em formato e estrutura entre anos. |
| **Defasagem** | Dados anuais consolidados são publicados com atraso. |
| **Fomento complexo** | Dados de fomento envolvem múltiplos mecanismos (FSA, Lei Rouanet, Lei do Audiovisual) com regras diferentes. |
