---
title: B3 Negociações — Dados de Negociação em Bolsa
slug: b3-negociacoes
orgao: B3
url_base: https://www.b3.com.br/pt_br/market-data-e-indices/servicos-de-dados/market-data/
tipo_acesso: CSV Download
autenticacao: Não requerida
formato_dados: [CSV, TXT]
frequencia_atualizacao: Diária
campos_chave:
  - codigo_negociacao
  - data_pregao
  - preco_abertura
  - preco_fechamento
  - volume_negociado
  - quantidade_negocios
tags:
  - B3
  - bolsa de valores
  - ações
  - negociações
  - pregão
  - cotações
  - market data
  - derivativos
  - fundos imobiliários
cruzamento_com:
  - cvm-dfp-itr
  - cvm-administradores
  - cvm-fatos-relevantes
  - banco-central/sgs-cambio
status: documentado
---

# B3 Negociações — Dados de Negociação em Bolsa

## O que é

A **B3 (Brasil, Bolsa, Balcão)** é a bolsa de valores oficial do Brasil, resultante da fusão da BM&FBOVESPA com a Cetip. A B3 disponibiliza dados históricos de negociação que incluem:

- **Ações** — cotações diárias, volume, quantidade de negócios
- **Fundos Imobiliários (FIIs)** — cotações e proventos
- **ETFs** — fundos de índice negociados em bolsa
- **BDRs** — Brazilian Depositary Receipts (ações estrangeiras)
- **Derivativos** — opções, futuros, swaps
- **Renda fixa** — debêntures, CRI, CRA negociados em bolsa

Os dados históricos estão disponíveis gratuitamente no site da B3 para download. Para dados em tempo real ou via API, são necessários contratos comerciais com a B3 ou seus redistribuidores.

## Como acessar

| Item | Detalhe |
|---|---|
| **Séries históricas** | `https://www.b3.com.br/pt_br/market-data-e-indices/servicos-de-dados/market-data/historico/mercado-a-vista/series-historicas/` |
| **Cotações diárias** | `https://www.b3.com.br/pt_br/market-data-e-indices/servicos-de-dados/market-data/cotacoes/` |
| **Dados abertos B3** | `https://dados.b3.com.br/` |
| **Autenticação** | Não requerida (dados históricos). API em tempo real requer contrato. |
| **Formato** | TXT posicional (séries históricas), CSV, JSON (dados abertos) |

### Fontes alternativas (gratuitas)

| Fonte | URL | Formato |
|---|---|---|
| Yahoo Finance | `https://query1.finance.yahoo.com/v7/finance/download/{TICKER}.SA` | CSV |
| CVM (Fundos) | `https://dados.cvm.gov.br/dataset/fi-doc-inf_diario` | CSV |
| Status Invest | `https://statusinvest.com.br/` | Web |

## Endpoints/recursos principais

### Séries históricas (arquivo anual/mensal)

| Arquivo | Conteúdo | Formato |
|---|---|---|
| `COTAHIST_AAAA.ZIP` | Cotações diárias de todo o ano | TXT posicional |
| `COTAHIST_MAAMM.ZIP` | Cotações diárias do mês | TXT posicional |
| `COTAHIST_DDDMMAAAA.ZIP` | Cotações de um dia específico | TXT posicional |

### Portal dados.b3.com.br

| Recurso | Descrição |
|---|---|
| Índices | Composição e cotação de índices (Ibovespa, IBrX, etc.) |
| Instrumentos | Lista de instrumentos negociados |
| Eventos corporativos | Dividendos, JCP, bonificações |

## Exemplo de uso

### Leitura do arquivo COTAHIST (séries históricas)

```python
import pandas as pd

# Layout posicional do COTAHIST
# Documentação: https://www.b3.com.br/data/files/33/67/B9/50/D84057102C784E47AC094EA8/SeriesHistoricas_Layout.pdf

colunas = {
    "tipo_registro": (0, 2),
    "data_pregao": (2, 10),
    "cod_bdi": (10, 12),
    "cod_negociacao": (12, 24),
    "tipo_mercado": (24, 27),
    "nome_empresa": (27, 39),
    "moeda": (52, 56),
    "preco_abertura": (56, 69),
    "preco_maximo": (69, 82),
    "preco_minimo": (82, 95),
    "preco_medio": (95, 108),
    "preco_fechamento": (108, 121),
    "volume_total": (170, 188),
    "qtd_negocios": (147, 152),
}

# Ler arquivo posicional
registros = []
with open("COTAHIST_A2024.TXT", "r", encoding="latin-1") as f:
    for linha in f:
        if linha[:2] == "01":  # Registros de cotação (ignora header/trailer)
            registro = {}
            for campo, (inicio, fim) in colunas.items():
                registro[campo] = linha[inicio:fim].strip()
            registros.append(registro)

df = pd.DataFrame(registros)

# Converter tipos
df["data_pregao"] = pd.to_datetime(df["data_pregao"], format="%Y%m%d")
for col in ["preco_abertura", "preco_maximo", "preco_minimo", "preco_medio", "preco_fechamento"]:
    df[col] = pd.to_numeric(df[col]) / 100  # Valores em centavos

df["volume_total"] = pd.to_numeric(df["volume_total"]) / 100

print(f"Total de registros: {len(df):,}")
print(df[df["cod_negociacao"] == "PETR4"].tail())
```

### Consulta via Yahoo Finance (alternativa)

```python
import pandas as pd
import requests
from io import StringIO

# Download de cotações via Yahoo Finance
ticker = "PETR4.SA"
url = f"https://query1.finance.yahoo.com/v7/finance/download/{ticker}"
params = {
    "period1": "1704067200",  # 01/01/2024
    "period2": "1735689600",  # 31/12/2024
    "interval": "1d",
    "events": "history",
}

headers = {"User-Agent": "Mozilla/5.0"}
response = requests.get(url, params=params, headers=headers)
df = pd.read_csv(StringIO(response.text))

print(f"Cotações {ticker}:")
print(df.tail())
```

## Campos disponíveis

### COTAHIST (séries históricas)

| Campo | Posição | Tipo | Descrição |
|---|---|---|---|
| Tipo de registro | 1-2 | int | 00=Header, 01=Cotação, 99=Trailer |
| Data do pregão | 3-10 | date | Data (AAAAMMDD) |
| Código BDI | 11-12 | int | Código de negociação (02=Lote padrão) |
| Código de negociação | 13-24 | string | Ticker do ativo (ex: PETR4, VALE3) |
| Tipo de mercado | 25-27 | int | 010=Vista, 012=Exercício opções, 070=Opções |
| Nome da empresa | 28-39 | string | Nome resumido |
| Preço de abertura | 57-69 | float | Preço de abertura (÷100) |
| Preço máximo | 70-82 | float | Preço máximo do dia (÷100) |
| Preço mínimo | 83-95 | float | Preço mínimo do dia (÷100) |
| Preço médio | 96-108 | float | Preço médio (÷100) |
| Preço de fechamento | 109-121 | float | Último preço (÷100) |
| Volume total | 171-188 | float | Volume financeiro total (÷100) |
| Quantidade de negócios | 148-152 | int | Número de negócios realizados |

## Cruzamentos possíveis

| Cruzamento | Fonte relacionada | Chave de ligação | Finalidade |
|---|---|---|---|
| Cotações x Fundamentos | [CVM DFP/ITR](/docs/apis/mercado-financeiro/cvm-dfp-itr) | Ticker ↔ CNPJ | Calcular múltiplos (P/L, P/VP, EV/EBITDA) |
| Cotações x Eventos | [CVM Fatos Relevantes](/docs/apis/mercado-financeiro/cvm-fatos-relevantes) | CNPJ / data | Estudar impacto de eventos no preço (event study) |
| Cotações x Câmbio | [SGS/API BCB — Câmbio](/docs/apis/banco-central/sgs-cambio) | data | Correlacionar variação cambial com bolsa |
| Cotações x Gestão | [CVM Administradores](/docs/apis/mercado-financeiro/cvm-administradores) | CNPJ | Analisar impacto de mudanças de gestão no preço |

## Limitações conhecidas

| Limitação | Detalhes |
|---|---|
| **Formato posicional** | O arquivo COTAHIST usa formato posicional (largura fixa), não CSV. É necessário parser customizado. |
| **Valores em centavos** | Todos os preços e volumes estão multiplicados por 100. É necessário dividir por 100 para obter valores reais. |
| **Sem API REST gratuita** | A B3 não oferece API REST gratuita para dados em tempo real. Dados históricos são disponibilizados apenas via download de arquivos. |
| **Dados em tempo real pagos** | Cotações em tempo real requerem contrato com a B3 ou redistribuidores (Bloomberg, Refinitiv, etc.). |
| **Encoding Latin-1** | Arquivos usam encoding Latin-1. |
| **Arquivos grandes** | O COTAHIST anual pode ter milhões de registros (todos os ativos, todos os dias). |
| **Sem ajuste por proventos** | Os preços no COTAHIST não são ajustados por dividendos, JCP, desdobramentos. É necessário ajustar manualmente ou usar fontes alternativas. |
| **Ticker pode mudar** | Empresas podem alterar o código de negociação. A chave estável é o CNPJ (disponível no cadastro da CVM). |
