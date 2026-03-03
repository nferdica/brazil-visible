---
title: ANTAQ Transporte Aquaviário — Portos e Navegação
slug: antaq
orgao: ANTAQ
url_base: https://web3.antaq.gov.br/ea/sense/
tipo_acesso: CSV Download
autenticacao: Não requerida
formato_dados: [CSV, XLSX]
frequencia_atualizacao: Mensal
campos_chave:
  - porto
  - tipo_carga
  - toneladas
  - teus
  - sentido
  - bandeira
tags:
  - ANTAQ
  - transporte aquaviário
  - portos
  - navegação
  - cargas
  - contêineres
  - cabotagem
  - longo curso
cruzamento_com:
  - ibge-estatisticas/pib-municipal
  - infraestrutura-transportes/antt-concessoes
  - receita-federal/cnpj-completa
status: documentado
---

# ANTAQ Transporte Aquaviário — Portos e Navegação

## O que é

A **ANTAQ (Agência Nacional de Transportes Aquaviários)** regula e fiscaliza o transporte aquaviário e a exploração da infraestrutura portuária no Brasil. Os dados disponíveis incluem:

- **Movimentação portuária** — toneladas movimentadas por porto, tipo de carga, sentido (embarque/desembarque)
- **Contêineres** — TEUs (Twenty-foot Equivalent Units) movimentados por porto
- **Navegação de cabotagem** — transporte entre portos brasileiros
- **Navegação de longo curso** — comércio exterior marítimo
- **Navegação interior** — transporte fluvial (rios amazônicos, Tietê-Paraná, etc.)
- **Terminais portuários** — cadastro de instalações portuárias, capacidade, operadores

O principal canal de acesso aos dados é o **Painel Estatístico Aquaviário**, que permite consultas interativas e download de dados.

## Como acessar

| Item | Detalhe |
|---|---|
| **Painel Estatístico** | `https://web3.antaq.gov.br/ea/sense/` |
| **Portal ANTAQ** | `https://www.gov.br/antaq/` |
| **dados.gov.br** | `https://dados.gov.br/dados/organizacoes/visualizar/agencia-nacional-de-transportes-aquaviarios-antaq` |
| **Autenticação** | Não requerida |
| **Formato** | CSV, XLSX |

## Endpoints/recursos principais

| Recurso | Conteúdo | Periodicidade |
|---|---|---|
| **Movimentação portuária** | Toneladas por porto, tipo de carga, natureza | Mensal |
| **Contêineres** | TEUs por porto e sentido | Mensal |
| **Navegação** | Dados de embarcações, rotas, cargas | Mensal |
| **Instalações portuárias** | Cadastro de terminais e portos | Atualização contínua |
| **Hidroviário** | Transporte fluvial — passageiros e cargas | Mensal |

## Exemplo de uso

### Movimentação portuária por porto

```python
import pandas as pd

# Download dos dados de movimentação portuária do Painel ANTAQ
df = pd.read_csv(
    "movimentacao_portuaria.csv",
    sep=";",
    encoding="utf-8",
    dtype=str,
    decimal=","
)

print(f"Total de registros: {len(df):,}")

# Converter toneladas
df["TONELADAS"] = pd.to_numeric(df["TONELADAS"], errors="coerce")

# Top 10 portos por movimentação
por_porto = df.groupby("PORTO")["TONELADAS"].sum().sort_values(ascending=False)
print("\nTop 10 portos por movimentação (milhões de toneladas):")
print((por_porto.head(10) / 1e6).round(1))
```

### Evolução mensal da movimentação

```python
import pandas as pd

df = pd.read_csv(
    "movimentacao_portuaria.csv",
    sep=";",
    encoding="utf-8",
    dtype=str,
    decimal=","
)

df["TONELADAS"] = pd.to_numeric(df["TONELADAS"], errors="coerce")

# Série mensal de movimentação total
serie = df.groupby("ANO_MES")["TONELADAS"].sum()
print("Movimentação portuária mensal (milhões de toneladas):")
print((serie.tail(12) / 1e6).round(1))
```

## Campos disponíveis

### Movimentação portuária

| Campo | Tipo | Descrição |
|---|---|---|
| `ANO` | int | Ano de referência |
| `MES` | int | Mês de referência |
| `ANO_MES` | string | Período (AAAAMM) |
| `PORTO` | string | Nome do porto/terminal |
| `UF` | string | UF do porto |
| `TIPO_INSTALACAO` | string | Porto organizado, TUP (Terminal de Uso Privado), ETC |
| `NATUREZA_CARGA` | string | Granel sólido, granel líquido, carga geral, contêiner |
| `SENTIDO` | string | Embarque ou desembarque |
| `NAVEGACAO` | string | Longo curso, cabotagem, interior |
| `TONELADAS` | float | Peso da carga (toneladas) |
| `TEUS` | int | Contêineres em TEU (quando aplicável) |
| `PRINCIPAL_MERCADORIA` | string | Tipo de mercadoria |
| `PAIS_ORIGEM_DESTINO` | string | País de origem/destino (longo curso) |
| `BANDEIRA` | string | Bandeira da embarcação |

## Cruzamentos possíveis

| Cruzamento | Fonte relacionada | Chave de ligação | Finalidade |
|---|---|---|---|
| Portos x PIB | [PIB Municipal](/docs/apis/ibge-estatisticas/pib-municipal) | Município | Correlacionar movimentação portuária com economia local |
| Portos x Rodovias | [ANTT Concessões](/docs/apis/infraestrutura-transportes/antt-concessoes) | UF, região | Analisar integração modal (marítimo + rodoviário) |
| Exportadores x Empresas | [CNPJ Completa](/docs/apis/receita-federal/cnpj-completa) | CNPJ | Identificar empresas exportadoras/importadoras |

## Limitações conhecidas

| Limitação | Detalhes |
|---|---|
| **Painel interativo** | O Painel Estatístico Aquaviário é baseado em Qlik Sense, com funcionalidade limitada de exportação de dados em lote. |
| **Sem API REST** | Não há API pública de consulta. Os dados são obtidos via download do painel ou do dados.gov.br. |
| **Dados de navegação interior limitados** | A cobertura de dados de transporte fluvial é menos detalhada que a portuária marítima. |
| **Formato inconsistente** | Os arquivos exportados do painel podem ter formatos e estruturas variáveis. |
| **Defasagem** | Os dados mensais podem ser publicados com atraso de 2-3 meses. |
