---
title: SGS/API BCB - Câmbio
slug: sgs-cambio
orgao: BCB
url_base: https://api.bcb.gov.br/dados/serie/bcdata.sgs.{SERIE}/dados?formato=json
tipo_acesso: API REST
autenticacao: Não requerida
formato_dados: [JSON, CSV, XML]
frequencia_atualizacao: Diária
campos_chave: [data, valor, cotacao_compra, cotacao_venda, moeda]
tags: [câmbio, PTAX, dólar, euro, moedas, cotação, taxa de conversão]
cruzamento_com:
  - sgs-juros
  - sgs-indices
  - sgs-reservas-internacionais
  - tesouro-nacional/siafi
status: documentado
---

# SGS/API BCB - Câmbio

## O que é

O **Sistema Gerenciador de Séries Temporais (SGS)** do Banco Central do Brasil disponibiliza séries históricas de taxas de câmbio, incluindo a taxa PTAX (referência oficial para operações de câmbio no Brasil), cotações de moedas estrangeiras e taxas de conversão. A PTAX é calculada diariamente pelo BCB com base nas operações do mercado interbancário e serve como referência para contratos, derivativos e operações de comércio exterior.

Além do SGS, o BCB oferece o serviço **OLINDA** com endpoints mais estruturados para consultas de câmbio, incluindo cotações de múltiplas moedas e boletins diários.

## Como acessar

| Item | Detalhe |
|---|---|
| **URL base (SGS)** | `https://api.bcb.gov.br/dados/serie/bcdata.sgs.{SERIE}/dados?formato=json` |
| **URL base (OLINDA)** | `https://olinda.bcb.gov.br/olinda/servico/PTAX/versao/v1/odata/` |
| **Autenticação** | Não requerida |
| **Rate limit** | Não documentado oficialmente; recomenda-se no máximo 5 requisições/segundo |
| **Formatos** | JSON, CSV, XML |
| **CORS** | Habilitado |

### Parâmetros de consulta (SGS)

- `formato`: `json`, `csv` ou `xml`
- `dataInicial`: formato `dd/MM/yyyy`
- `dataFinal`: formato `dd/MM/yyyy`

### Parâmetros de consulta (OLINDA)

- `$filter`: filtro OData (ex: `DataCotacao eq '01-15-2025'`)
- `$format`: `json` ou `csv`
- `$top`: número máximo de registros
- `$orderby`: campo de ordenação

## Endpoints/recursos principais

### Séries SGS

| Série | Código | Descrição | Periodicidade |
|---|---|---|---|
| PTAX - Dólar (venda) | 1 | Taxa de câmbio - Livre - Dólar americano (venda) | Diária |
| PTAX - Dólar (compra) | 10813 | Taxa de câmbio - Livre - Dólar americano (compra) | Diária |
| PTAX - Euro (venda) | 21619 | Taxa de câmbio - Livre - Euro (venda) | Diária |
| PTAX - Euro (compra) | 21620 | Taxa de câmbio - Livre - Euro (compra) | Diária |
| Índice da taxa de câmbio real efetiva (IPCA) | 11752 | Índice da taxa de câmbio real efetiva | Mensal |

### Endpoints OLINDA (PTAX)

| Endpoint | Descrição |
|---|---|
| `CotacaoDolarDia(dataCotacao=@dataCotacao)` | Cotação do dólar para uma data específica |
| `CotacaoDolarPeriodo(dataInicial=@di,dataFinalCotacao=@df)` | Cotações do dólar em um período |
| `CotacaoMoedaDia(moeda=@moeda,dataCotacao=@dataCotacao)` | Cotação de moeda específica para uma data |
| `CotacaoMoedaPeriodo(moeda=@moeda,dataInicial=@di,dataFinalCotacao=@df)` | Cotação de moeda em um período |
| `Moedas` | Lista de moedas disponíveis |

## Exemplo de uso

### Consultar PTAX diária via SGS

```python
import requests
import pandas as pd

# PTAX Dólar (venda) - Série 1
url = "https://api.bcb.gov.br/dados/serie/bcdata.sgs.1/dados?formato=json"
params = {
    "dataInicial": "01/01/2025",
    "dataFinal": "31/01/2025"
}

response = requests.get(url, params=params)
response.raise_for_status()
dados = response.json()

df = pd.DataFrame(dados)
df["data"] = pd.to_datetime(df["data"], format="%d/%m/%Y")
df["valor"] = df["valor"].astype(float)

print(df.tail())
# Saída:
#          data   valor
# 18 2025-01-27  5.9221
# 19 2025-01-28  5.8693
# 20 2025-01-29  5.8614
# 21 2025-01-30  5.8350
# 22 2025-01-31  5.8363
```

### Consultar cotação via OLINDA

```python
import requests

# Cotação do dólar em uma data específica
url = (
    "https://olinda.bcb.gov.br/olinda/servico/PTAX/versao/v1/odata/"
    "CotacaoDolarDia(dataCotacao=@dataCotacao)"
)
params = {
    "@dataCotacao": "'01-15-2025'",
    "$format": "json"
}

response = requests.get(url, params=params)
response.raise_for_status()
dados = response.json()["value"]

for cotacao in dados:
    print(f"Compra: {cotacao['cotacaoCompra']}, Venda: {cotacao['cotacaoVenda']}")
    print(f"Tipo: {cotacao['tipoBoletim']}")
```

### Listar moedas disponíveis

```python
import requests

url = (
    "https://olinda.bcb.gov.br/olinda/servico/PTAX/versao/v1/odata/Moedas"
)
params = {"$format": "json"}

response = requests.get(url, params=params)
response.raise_for_status()
moedas = response.json()["value"]

for m in moedas[:5]:
    print(f"{m['simbolo']} - {m['nomeFormatado']} (Tipo: {m['tipoMoeda']})")
```

## Campos disponíveis

### SGS (Séries de câmbio)

| Campo | Tipo | Descrição |
|---|---|---|
| `data` | string | Data da cotação (formato `dd/MM/yyyy`) |
| `valor` | string | Valor da taxa de câmbio |

### OLINDA (CotacaoDolarDia)

| Campo | Tipo | Descrição |
|---|---|---|
| `cotacaoCompra` | float | Taxa de compra |
| `cotacaoVenda` | float | Taxa de venda |
| `dataHoraCotacao` | datetime | Data e hora da cotação |
| `tipoBoletim` | string | Tipo do boletim (Abertura, Intermediário, Fechamento) |

### OLINDA (Moedas)

| Campo | Tipo | Descrição |
|---|---|---|
| `simbolo` | string | Código da moeda (ex: USD, EUR) |
| `nomeFormatado` | string | Nome da moeda por extenso |
| `tipoMoeda` | string | Tipo A (cotação em real) ou Tipo B (cotação em dólar) |

## Cruzamentos possíveis

- **[SGS/API BCB - Juros](sgs-juros)** — correlacionar taxa de câmbio com variações da Selic para análise de política monetária
- **[SGS/API BCB - Índices](sgs-indices)** — comparar câmbio com IBC-Br e IPCA para avaliar impacto na inflação e atividade econômica
- **[SGS/API BCB - Reservas Internacionais](sgs-reservas-internacionais)** — analisar movimentação das reservas em relação à variação cambial
- **Tesouro Nacional (SIAFI)** — avaliar impacto cambial nas despesas com dívida externa
- **Comércio Exterior** — calcular valores em reais de importações/exportações usando PTAX oficial

## Limitações conhecidas

- **Rate limit não documentado**: o BCB não publica limites oficiais, mas requisições excessivas podem resultar em bloqueio temporário (HTTP 429)
- **Dados retroativos**: séries mais antigas podem ter lacunas (especialmente antes de 1999, quando o regime cambial era diferente)
- **Horário de atualização**: a PTAX de fechamento é divulgada por volta das 13h (horário de Brasília); consultas antes desse horário retornam apenas boletins parciais
- **Formato de data**: o SGS usa formato brasileiro (`dd/MM/yyyy`), enquanto o OLINDA usa formato americano (`MM-dd-yyyy`)
- **Moedas tipo B**: moedas com cotação em dólar (tipo B) precisam de conversão adicional para reais
- **Sem WebSocket/streaming**: não há endpoint para cotações em tempo real; é necessário fazer polling
