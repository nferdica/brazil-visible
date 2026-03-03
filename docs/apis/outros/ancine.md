---
title: ANCINE/OCA — Audiovisual, Bilheteria e Produção
slug: ancine
orgao: ANCINE
url_base: https://www.gov.br/ancine/pt-br/oca
tipo_acesso: Download (CSV, XLSX) / API parcial (CRT)
autenticacao: Não requerida
formato_dados: [CSV, XLSX, PDF, JSON]
frequencia_atualizacao: Semanal (bilheteria) / Anual (consolidados)
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
  - OCA
cruzamento_com:
  - ibge-estatisticas/censo-demografico
  - ibge-estatisticas/pib-municipal
status: documentado
---

# ANCINE/OCA — Audiovisual, Bilheteria e Produção

## O que é

A **ANCINE (Agência Nacional do Cinema)** é responsável pelo fomento, regulação e fiscalização do mercado audiovisual brasileiro. O **OCA (Observatório Brasileiro do Cinema e do Audiovisual)** é o braço estatístico da ANCINE que disponibiliza dados sobre:

- **Bilheteria de cinema** — público, renda, filmes exibidos, distribuidoras (dados semanais via SCB)
- **Produção audiovisual** — filmes e séries brasileiras produzidos, registros na ANCINE
- **Fomento** — recursos públicos investidos em produção (FSA, Lei do Audiovisual, Lei Rouanet)
- **TV por assinatura** — canais, programação brasileira, conteúdo nacional
- **Mercado de vídeo** — home video, streaming, VOD
- **Infraestrutura** — salas de cinema por município, complexos, redes exibidoras
- **Certificado de Registro de Título (CRT)** — registro de obras audiovisuais

> **Atualização 2025:** O OCA foi significativamente reformulado em 2025, com nova organização em 4 áreas: Painéis Interativos, Dados Abertos, Publicações Técnicas e Anuário Consolidado. Também foram lançadas APIs para dados de CRT.

### Mudanças regulatórias recentes

| Lei | Descrição |
|---|---|
| **Lei 14.815/2024** | Ampliou poderes da ANCINE para combate à pirataria (30+ serviços bloqueados em 2025) |
| **Lei 14.852/2024** | Estendeu competência da ANCINE para incluir jogos eletrônicos |

## Como acessar

| Plataforma | URL | Descrição |
|---|---|---|
| **OCA** | `https://oca.ancine.gov.br/` | Portal principal de dados do audiovisual |
| **OCA (Gov.br)** | `https://www.gov.br/ancine/pt-br/oca/` | Portal integrado ao Gov.br |
| **Dados Abertos** | `https://www.gov.br/ancine/pt-br/oca/dados-abertos` | 25+ datasets com 58 campos |
| **Portal ANCINE** | `https://www.gov.br/ancine/` | Site institucional |
| **dados.gov.br** | `https://dados.gov.br/dados/organizacoes/visualizar/agencia-nacional-do-cinema-ancine` | Catálogo no portal federal |
| **Autenticação** | Não requerida | |
| **Formatos** | CSV, XLSX, PDF, JSON (API CRT) | |

## Endpoints/recursos principais

### Dados disponíveis no OCA (reformulado 2025)

| Área | Conteúdo | Formato | Periodicidade |
|---|---|---|---|
| **Painéis Interativos** | Monitoramento de obras, agentes econômicos, indicadores de mercado, TV paga | Web | Contínuo |
| **Dados de bilheteria (SCB)** | Público e renda por filme, distribuidora, semana | CSV/XLSX | Semanal |
| **Lançamentos comerciais** | Filmes lançados por distribuidora | CSV | Mensal |
| **Listagem de filmes** | Filmes brasileiros registrados na ANCINE | CSV/XLSX | Contínuo |
| **Salas de cinema** | Complexos e salas por município | CSV/XLSX | Anual |
| **Dados de fomento (FSA)** | Projetos aprovados, valores investidos | CSV/PDF | Anual |
| **Programação TV paga** | Canais brasileiros, conteúdo nacional | CSV | Anual |
| **CRT** | Certificados de Registro de Título | JSON (API) | Contínuo |
| **Anuário Estatístico** | Dados consolidados da cadeia produtiva | PDF/XLSX | Anual |

### Fontes de dados de bilheteria

| Sistema | Descrição |
|---|---|
| **SCB (Sistema de Controle de Bilheteria)** | Relatórios diretos das empresas exibidoras |
| **Sadis** | Sistema de Acompanhamento da Distribuição em Salas de Exibição |

### API de CRT (novo 2025)

| Recurso | Descrição | Formato |
|---|---|---|
| Consulta de CRT | Certificados de Registro de Título de obras audiovisuais | JSON |

## Exemplo de uso

### Análise de bilheteria anual

```python
import pandas as pd

# Download do relatório de bilheteria do OCA
# https://www.gov.br/ancine/pt-br/oca/dados-abertos
df = pd.read_csv(
    "bilheteria_anual.csv",
    sep=";",
    encoding="utf-8",
    dtype=str,
    decimal=",",
)

print(f"Total de filmes: {len(df):,}")

# Converter público e renda para numérico
df["PUBLICO"] = pd.to_numeric(df["PUBLICO"], errors="coerce")
df["RENDA"] = pd.to_numeric(
    df["RENDA"].str.replace(".", "").str.replace(",", "."),
    errors="coerce",
)

# Top 10 filmes por público
top10 = df.nlargest(10, "PUBLICO")[["TITULO", "PUBLICO", "RENDA", "DISTRIBUIDORA"]]
print("\nTop 10 filmes por público:")
print(top10.to_string(index=False))

# Filmes brasileiros vs. estrangeiros
br = df[df["PAIS_ORIGEM"] == "Brasil"]["PUBLICO"].sum()
total = df["PUBLICO"].sum()
print(f"\nParticipação filmes brasileiros: {br / total * 100:.1f}%")
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

# Cobertura municipal
total_municipios = df_salas["MUNICIPIO"].nunique()
print(f"\nMunicípios com cinema: {total_municipios}")
print(f"Percentual de cobertura: {total_municipios / 5570 * 100:.1f}%")
```

### Análise de fomento ao audiovisual

```python
import pandas as pd

# Dados de fomento do FSA (Fundo Setorial do Audiovisual)
df_fomento = pd.read_csv(
    "fomento_fsa.csv",
    sep=";",
    encoding="utf-8",
    dtype=str,
    decimal=",",
)

df_fomento["VALOR"] = pd.to_numeric(
    df_fomento["VALOR"].str.replace(".", "").str.replace(",", "."),
    errors="coerce",
)

# Total investido por mecanismo
por_mecanismo = df_fomento.groupby("MECANISMO")["VALOR"].sum().sort_values(ascending=False)
print("Investimento por mecanismo de fomento:")
print((por_mecanismo / 1e6).round(1).to_string())  # Em milhões
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

### Salas de cinema

| Campo | Tipo | Descrição |
|---|---|---|
| `COMPLEXO` | string | Nome do complexo cinematográfico |
| `MUNICIPIO` | string | Município |
| `UF` | string | UF |
| `SALAS` | int | Número de salas no complexo |
| `ASSENTOS` | int | Total de assentos |
| `REDE` | string | Rede exibidora |
| `TIPO_PROJECAO` | string | Digital, 35mm, IMAX, etc. |

## Cruzamentos possíveis

| Cruzamento | Fonte relacionada | Chave de ligação | Finalidade |
|---|---|---|---|
| Cinema x População | [Censo Demográfico](/docs/apis/ibge-estatisticas/censo-demografico) | Município | Calcular frequência ao cinema per capita |
| Cinema x PIB | [PIB Municipal](/docs/apis/ibge-estatisticas/pib-municipal) | Município | Correlacionar mercado cinematográfico com riqueza |
| Cinema x Fomento x Contratos | [Portal da Transparência](/docs/apis/portais-centrais/portal-transparencia) | CNPJ (distribuidora/produtora) | Rastrear investimentos públicos no audiovisual |

## Limitações conhecidas

| Limitação | Detalhes |
|---|---|
| **Sem API REST completa** | A maioria dos dados é disponibilizada como planilhas (CSV, XLSX). A API de CRT é a exceção recente. |
| **Dados de bilheteria incompletos** | Os dados cobrem apenas exibição em salas de cinema. Plataformas de streaming (Netflix, etc.) não são incluídas. |
| **Formato inconsistente** | Os relatórios do OCA variam em formato e estrutura entre anos, dificultando séries históricas automatizadas. |
| **Defasagem** | Dados anuais consolidados são publicados com atraso de 6-12 meses. Dados semanais de bilheteria são mais atualizados. |
| **Fomento complexo** | Dados de fomento envolvem múltiplos mecanismos (FSA, Lei Rouanet, Lei do Audiovisual) com regras e formatos diferentes. |
| **Reformulação recente** | O OCA foi reformulado em 2025. Alguns links e formatos de dados podem ter mudado em relação a versões anteriores. |
| **Jogos eletrônicos** | A extensão da competência para jogos eletrônicos (Lei 14.852/2024) ainda está em fase de regulamentação. |
