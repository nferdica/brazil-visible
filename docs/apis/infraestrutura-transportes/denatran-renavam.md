---
title: DENATRAN/RENAVAM — Frota de Veículos
slug: denatran-renavam
orgao: DENATRAN / SENATRAN
url_base: https://www.gov.br/transportes/pt-br/assuntos/transito/conteudo-Senatran/estatisticas-frota-de-veiculos-senatran
tipo_acesso: CSV Download
autenticacao: Não requerida
formato_dados: [CSV, XLSX]
frequencia_atualizacao: Mensal
campos_chave:
  - uf
  - municipio
  - tipo_veiculo
  - quantidade
  - combustivel
  - ano_fabricacao
tags:
  - DENATRAN
  - SENATRAN
  - RENAVAM
  - frota de veículos
  - automóveis
  - motos
  - CNH
  - trânsito
cruzamento_com:
  - ibge-estatisticas/censo-demografico
  - ibge-estatisticas/pib-municipal
  - infraestrutura-transportes/prf-acidentes
  - agencias-reguladoras/anp
status: documentado
---

# DENATRAN/RENAVAM — Frota de Veículos

## O que é

O **DENATRAN (Departamento Nacional de Trânsito)**, atualmente **SENATRAN (Secretaria Nacional de Trânsito)**, mantém o **RENAVAM (Registro Nacional de Veículos Automotores)** e publica mensalmente estatísticas sobre a frota de veículos registrada no Brasil. Os dados incluem:

- **Frota por tipo de veículo** — automóveis, motocicletas, caminhões, ônibus, etc.
- **Frota por município** — total de veículos registrados em cada um dos 5.570 municípios
- **Frota por combustível** — gasolina, etanol, flex, diesel, elétrico
- **Frota por ano de fabricação** — distribuição etária da frota
- **CNH** — quantidade de condutores habilitados por categoria e UF

Esses dados são fundamentais para planejamento de trânsito, políticas de mobilidade, análises ambientais (emissões) e mercado automotivo.

## Como acessar

| Item | Detalhe |
|---|---|
| **Portal SENATRAN** | `https://www.gov.br/transportes/pt-br/assuntos/transito/conteudo-Senatran/frota-de-veiculos` |
| **Estatísticas** | `https://www.gov.br/transportes/pt-br/assuntos/transito/conteudo-Senatran/estatisticas` |
| **Autenticação** | Não requerida |
| **Formato** | XLSX, CSV |
| **Publicação** | Mensal |

## Endpoints/recursos principais

| Recurso | Conteúdo | Periodicidade |
|---|---|---|
| **Frota por tipo e UF** | Total de veículos por tipo e UF | Mensal |
| **Frota por município** | Total de veículos por município e tipo | Mensal |
| **Frota por combustível** | Distribuição por tipo de combustível | Mensal |
| **Frota por ano de fabricação** | Distribuição por ano-modelo | Mensal |
| **CNH por UF** | Condutores habilitados por categoria e UF | Mensal |

## Exemplo de uso

### Análise da frota por município

```python
import pandas as pd

# Download da planilha de frota por município
# https://www.gov.br/transportes/pt-br/assuntos/transito/conteudo-Senatran/frota-de-veiculos
df = pd.read_excel(
    "frota_por_municipio_202412.xlsx",
    dtype=str,
)

print(f"Total de registros: {len(df):,}")
print(f"Colunas: {list(df.columns)}")

# Converter total para numérico
df["TOTAL"] = pd.to_numeric(df["TOTAL"], errors="coerce")

# Top 10 municípios por frota
top10 = df.nlargest(10, "TOTAL")[["MUNICIPIO", "UF", "TOTAL"]]
print("\nTop 10 municípios por frota de veículos:")
print(top10.to_string(index=False))
```

### Veículos per capita por UF

```python
import pandas as pd

# Frota por UF
df_frota = pd.read_excel("frota_por_uf_202412.xlsx", dtype=str)
df_frota["TOTAL"] = pd.to_numeric(df_frota["TOTAL"], errors="coerce")

# População estimada por UF (dados do IBGE)
# Exemplo simplificado
populacao_uf = {
    "SP": 46_000_000, "MG": 21_000_000, "RJ": 17_000_000,
    "BA": 15_000_000, "PR": 11_500_000, "RS": 11_400_000,
}

df_frota["POPULACAO"] = df_frota["UF"].map(populacao_uf)
df_frota["VEICULOS_PER_CAPITA"] = df_frota["TOTAL"] / df_frota["POPULACAO"]

resultado = df_frota.dropna(subset=["POPULACAO"]).sort_values(
    "VEICULOS_PER_CAPITA", ascending=False
)

print("Veículos per capita por UF:")
print(resultado[["UF", "TOTAL", "VEICULOS_PER_CAPITA"]].to_string(index=False))
```

## Campos disponíveis

### Frota por município

| Campo | Tipo | Descrição |
|---|---|---|
| `UF` | string | Sigla da UF |
| `MUNICIPIO` | string | Nome do município |
| `AUTOMOVEL` | int | Quantidade de automóveis |
| `BONDE` | int | Bondes |
| `CAMINHAO` | int | Caminhões |
| `CAMINHAO TRATOR` | int | Caminhões-trator |
| `CAMINHONETE` | int | Caminhonetes |
| `CAMIONETA` | int | Camionetas |
| `CICLOMOTOR` | int | Ciclomotores |
| `MICRO-ONIBUS` | int | Micro-ônibus |
| `MOTOCICLETA` | int | Motocicletas |
| `MOTONETA` | int | Motonetas |
| `ONIBUS` | int | Ônibus |
| `QUADRICICLO` | int | Quadriciclos |
| `REBOQUE` | int | Reboques |
| `SEMI-REBOQUE` | int | Semirreboques |
| `TRATOR ESTEIRA` | int | Tratores de esteira |
| `TRATOR RODAS` | int | Tratores de rodas |
| `TRICICLO` | int | Triciclos |
| `UTILITARIO` | int | Utilitários |
| `TOTAL` | int | Total de veículos |

## Cruzamentos possíveis

| Cruzamento | Fonte relacionada | Chave de ligação | Finalidade |
|---|---|---|---|
| Frota x População | [Censo Demográfico](/docs/apis/ibge-estatisticas/censo-demografico) | Município | Calcular taxa de motorização (veículos per capita) |
| Frota x PIB | [PIB Municipal](/docs/apis/ibge-estatisticas/pib-municipal) | Município | Correlacionar riqueza com frota de veículos |
| Frota x Acidentes | [PRF Acidentes](/docs/apis/infraestrutura-transportes/prf-acidentes) | UF | Relacionar tamanho da frota com acidentes |
| Frota x Combustível | [ANP Petróleo e Gás](/docs/apis/agencias-reguladoras/anp) | UF | Analisar demanda por combustíveis em relação à frota |

## Limitações conhecidas

| Limitação | Detalhes |
|---|---|
| **Formato XLSX** | Os dados são disponibilizados majoritariamente em formato Excel (XLSX), não CSV ou API. |
| **Sem API REST** | Não há API de consulta. É necessário baixar as planilhas manualmente do portal. |
| **Frota registrada ≠ circulante** | Os dados refletem veículos registrados, incluindo veículos que podem estar fora de circulação (sucateados, parados). |
| **Sem dados de placa/chassi** | Os dados públicos são agregados (por município/UF). Dados individuais de veículos não são disponibilizados. |
| **URLs instáveis** | Os links de download podem mudar mensalmente, dificultando automação. |
| **Sem série histórica consolidada** | Cada mês é uma planilha separada. Para construir série histórica, é necessário baixar e consolidar manualmente. |
