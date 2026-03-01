---
title: Tesouro Transparente
slug: tesouro-transparente
orgao: Secretaria do Tesouro Nacional (STN)
url_base: https://apidatalake.tesouro.gov.br/ords/sadipem/tt
tipo_acesso: API REST
autenticacao: Não requerida
formato_dados: JSON, CSV
frequencia_atualizacao: Mensal
campos_chave:
  - código IBGE
  - código SIAFI
  - exercício (ano)
  - UF
tags:
  - tesouro nacional
  - finanças públicas
  - dívida pública
  - tesouro direto
  - RREO
  - RGF
  - transferências
  - receitas municipais
  - despesas municipais
  - SICONFI
cruzamento_com:
  - ibge-estatisticas/agregados
  - receita-federal/cnpj-completa
  - justica-eleitoral-tse/candidaturas
  - tesouro-nacional/siafi
status: parcial
---

# Tesouro Transparente

## O que é

O **Tesouro Transparente** é a plataforma de dados abertos da **Secretaria do Tesouro Nacional (STN)**, vinculada ao Ministério da Fazenda. Disponibiliza informações sobre finanças públicas de todos os entes federativos brasileiros (União, estados e municípios), incluindo:

- **Tesouro Direto** — dados sobre títulos públicos vendidos a pessoas físicas
- **Dívida Pública Federal** — estoque, composição e perfil da dívida
- **SICONFI** — dados contábeis de estados e municípios (RREO, RGF, DCA)
- **Transferências** — repasses constitucionais e voluntários a entes subnacionais
- **Resultado Primário** — indicadores fiscais do Governo Federal

A plataforma oferece APIs REST públicas, sem necessidade de autenticação, que permitem acesso programático a todos esses conjuntos de dados.

**Site oficial:** https://www.tesourotransparente.gov.br
**APIs disponíveis:** https://apidatalake.tesouro.gov.br

## Como acessar

### Autenticação

As APIs do Tesouro Transparente **não requerem autenticação**. O acesso é totalmente público.

### URL Base

O Tesouro disponibiliza múltiplas APIs sob o domínio do data lake:

```
https://apidatalake.tesouro.gov.br/ords/sadipem/tt
```

Para o Tesouro Direto, a URL base é:

```
https://apidatalake.tesouro.gov.br/ords/sadipem/td
```

### Rate Limits

| Condição | Limite |
|----------|--------|
| Autenticação | Não requerida |
| Rate limit explícito | Não documentado oficialmente; recomenda-se no máximo 30 req/min |

## Endpoints/recursos principais

### Tesouro Direto

| Endpoint | Método | Descrição |
|----------|--------|-----------|
| `/td/precos-titulos` | GET | Preços e taxas de títulos do Tesouro Direto |
| `/td/vendas-titulos` | GET | Volume de vendas de títulos |
| `/td/resgates` | GET | Resgates de títulos |
| `/td/estoque` | GET | Estoque de títulos por tipo |
| `/td/numero-investidores` | GET | Número de investidores cadastrados |

### Finanças Municipais e Estaduais (SICONFI)

| Endpoint | Método | Descrição |
|----------|--------|-----------|
| `/tt/rreo` | GET | Relatório Resumido de Execução Orçamentária |
| `/tt/rgf` | GET | Relatório de Gestão Fiscal |
| `/tt/dca` | GET | Declaração de Contas Anuais |
| `/tt/msc` | GET | Matriz de Saldos Contábeis |

### Dívida Pública

| Endpoint | Método | Descrição |
|----------|--------|-----------|
| `/tt/dpf-estoque` | GET | Estoque da Dívida Pública Federal |
| `/tt/dpf-composicao` | GET | Composição da dívida por indexador |
| `/tt/dpf-perfil` | GET | Perfil de vencimentos |

### Transferências

| Endpoint | Método | Descrição |
|----------|--------|-----------|
| `/tt/transferencias` | GET | Transferências constitucionais a estados e municípios |
| `/tt/fpm` | GET | Fundo de Participação dos Municípios |
| `/tt/fpe` | GET | Fundo de Participação dos Estados |
| `/tt/fundeb` | GET | Valores do FUNDEB |

### Parâmetros comuns

| Parâmetro | Tipo | Descrição |
|-----------|------|-----------|
| `an_exercicio` | int | Ano do exercício fiscal |
| `co_uf` | string | Código da UF (IBGE, 2 dígitos) |
| `id_ente` | string | Código IBGE do município (7 dígitos) |
| `no_uf` | string | Nome da UF |
| `offset` | int | Offset para paginação |
| `limit` | int | Limite de registros por página |

## Exemplo de uso

### Consultar preços de títulos do Tesouro Direto

```python
import requests
import pandas as pd

BASE_TD = "https://apidatalake.tesouro.gov.br/ords/sadipem/td"


def consultar_precos_tesouro_direto():
    """
    Obtém os preços e taxas atuais dos títulos do Tesouro Direto.

    Returns:
        DataFrame com preços e taxas dos títulos
    """
    url = f"{BASE_TD}/precos-titulos"
    response = requests.get(url)
    response.raise_for_status()
    dados = response.json()

    # A resposta geralmente vem em formato {"items": [...]}
    registros = dados.get("items", dados)
    return pd.DataFrame(registros)


df_precos = consultar_precos_tesouro_direto()
print(df_precos.head())
```

### Consultar RREO de um município

```python
BASE_TT = "https://apidatalake.tesouro.gov.br/ords/sadipem/tt"


def consultar_rreo(codigo_ibge: str, exercicio: int):
    """
    Consulta o Relatório Resumido de Execução Orçamentária (RREO)
    de um ente federativo.

    Args:
        codigo_ibge: Código IBGE do município ou estado
        exercicio: Ano do exercício fiscal

    Returns:
        DataFrame com dados do RREO
    """
    url = f"{BASE_TT}/rreo"
    params = {
        "id_ente": codigo_ibge,
        "an_exercicio": exercicio,
    }

    response = requests.get(url, params=params)
    response.raise_for_status()
    dados = response.json()
    registros = dados.get("items", dados)
    return pd.DataFrame(registros)


# Exemplo: RREO de São Paulo (3550308), exercício 2023
df_rreo = consultar_rreo("3550308", 2023)
print(f"Registros: {len(df_rreo)}")
print(df_rreo.head())
```

### Consultar transferências do FPM

```python
def consultar_fpm(uf: str = None, exercicio: int = None):
    """
    Consulta valores do Fundo de Participação dos Municípios.

    Args:
        uf: Sigla da UF (opcional)
        exercicio: Ano do exercício (opcional)

    Returns:
        DataFrame com dados do FPM
    """
    url = f"{BASE_TT}/fpm"
    params = {}
    if uf:
        params["no_uf"] = uf
    if exercicio:
        params["an_exercicio"] = exercicio

    response = requests.get(url, params=params)
    response.raise_for_status()
    dados = response.json()
    registros = dados.get("items", dados)
    return pd.DataFrame(registros)


# FPM para municípios de São Paulo em 2023
df_fpm = consultar_fpm(uf="SAO PAULO", exercicio=2023)
print(f"Municípios: {len(df_fpm)}")
print(df_fpm.head())
```

## Campos disponíveis

### Tesouro Direto — Preços de títulos

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `tipo_titulo` | string | Tipo do título (LTN, NTN-B, etc.) |
| `data_vencimento` | string | Data de vencimento do título |
| `data_base` | string | Data de referência da cotação |
| `taxa_compra` | float | Taxa de rendimento na compra (% a.a.) |
| `taxa_venda` | float | Taxa de rendimento na venda (% a.a.) |
| `pu_compra` | float | Preço unitário de compra (R$) |
| `pu_venda` | float | Preço unitário de venda (R$) |

### RREO — Relatório de Execução Orçamentária

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id_ente` | string | Código IBGE do ente |
| `no_ente` | string | Nome do ente federativo |
| `an_exercicio` | int | Ano do exercício |
| `nr_bimestre` | int | Bimestre de referência |
| `no_conta` | string | Nome da conta contábil |
| `vl_previsao_inicial` | float | Valor da previsão inicial |
| `vl_previsao_atualizada` | float | Valor da previsão atualizada |
| `vl_realizado` | float | Valor realizado |

### Transferências (FPM)

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id_ente` | string | Código IBGE do município |
| `no_ente` | string | Nome do município |
| `co_uf` | string | Código da UF |
| `no_uf` | string | Nome da UF |
| `an_exercicio` | int | Ano do exercício |
| `me_referencia` | int | Mês de referência |
| `vl_quota_fpm` | float | Valor da quota do FPM |

## Cruzamentos possíveis

| Cruzamento | Fonte relacionada | Chave de ligação | Finalidade |
|------------|-------------------|------------------|------------|
| RREO × Municípios | [IBGE — Agregados](/docs/apis/ibge-estatisticas/agregados) | `Código IBGE` | Contextualizar finanças municipais com dados demográficos |
| Transferências × Transparência | [Portal da Transparência](/docs/apis/portais-centrais/portal-transparencia) | `Código SIAFI / IBGE` | Complementar dados de transferências com execução de despesas |
| SICONFI × SIAFI | [Tesouro Nacional — SIAFI](/docs/apis/tesouro-nacional/siafi) | `Código SIAFI` | Detalhar execução orçamentária federal vs. subnacional |
| FPM × Eleições | [TSE — Candidaturas](/docs/apis/justica-eleitoral-tse/candidaturas) | `Código IBGE` | Analisar finanças municipais vs. resultado eleitoral |
| Dívida Pública × Mercado | [CVM — Dados de mercado](/docs/apis/mercado-financeiro/cvm) | `Código do título` | Relacionar títulos da dívida com mercado financeiro |

## Limitações conhecidas

| Limitação | Detalhes |
|-----------|----------|
| **Cobertura temporal** | A maioria dos dados do SICONFI está disponível a partir de 2015. Dados do Tesouro Direto estão disponíveis desde 2002. |
| **Consistência dos entes** | Nem todos os municípios enviam seus relatórios (RREO, RGF, DCA) no prazo. Dados podem estar incompletos para municípios menores. |
| **Formato de resposta** | As APIs retornam dados paginados no formato `{"items": [...], "hasMore": true/false}`. É necessário iterar pelas páginas. |
| **Sem documentação Swagger** | Diferente do Portal da Transparência, a API do Tesouro não possui documentação Swagger interativa completa. |
| **Rate limiting implícito** | Embora não haja limites documentados, requisições muito frequentes podem ser bloqueadas temporariamente. |
| **Nomenclatura de parâmetros** | Os nomes dos parâmetros variam entre endpoints (ex: `id_ente` vs. `co_ibge`). Consulte cada endpoint individualmente. |
| **Dados contábeis complexos** | Os relatórios RREO, RGF e DCA seguem padrões contábeis (PCASP) que exigem conhecimento técnico para interpretação. |
