---
title: Emendas Parlamentares
slug: emendas-parlamentares
orgao: CGU
url_base: https://api.portaldatransparencia.gov.br/api-de-dados/
tipo_acesso: API REST
autenticacao: API Key
formato_dados: JSON
frequencia_atualizacao: Diária
campos_chave:
  - codigo_emenda
  - autor
  - valor_empenhado
  - valor_pago
  - codigo_orgao
tags:
  - emendas parlamentares
  - orçamento
  - deputados
  - senadores
  - transferências
  - transparência
  - governo federal
cruzamento_com:
  - justica-eleitoral-tse/candidaturas
  - justica-eleitoral-tse/prestacao-contas
  - receita-federal/cnpj-completa
  - transparencia-cgu/contratos-federais
  - tesouro-nacional/siafi
status: documentado
---

# Emendas Parlamentares

## O que é

A API de **Emendas Parlamentares** do Portal da Transparência disponibiliza dados sobre emendas ao orçamento federal propostas por parlamentares (deputados e senadores). Os dados incluem autor da emenda, valor destinado, localidade beneficiada, órgão executor, valores empenhados, liquidados e pagos.

As emendas parlamentares representam um dos principais mecanismos de transferência de recursos federais e são uma fonte essencial para rastrear o fluxo de dinheiro público. Ao cruzar dados de emendas com doações de campanha (TSE) e dados societários de empresas beneficiadas (Receita Federal), é possível mapear redes de influência política e identificar potenciais conflitos de interesse.

> **Veja também:** [Portal da Transparência (visão geral)](/docs/apis/portais-centrais/portal-transparencia) para uma visão geral de todos os recursos da API.

## Como acessar

### Autenticação

O acesso à API requer um **token (chave de API)** gratuito:

1. Acesse https://portaldatransparencia.gov.br/api-de-dados/cadastrar-email
2. Informe seu e-mail e confirme o cadastro
3. Você receberá um token por e-mail
4. Inclua o token no header de cada requisição: `chave-api-dados: SEU_TOKEN`

### Rate Limits

| Condição | Limite |
|----------|--------|
| Requisições por minuto | 30 |
| Requisições sem autenticação | Bloqueadas |

### URL Base

```
https://api.portaldatransparencia.gov.br/api-de-dados
```

### Headers obrigatórios

```http
chave-api-dados: SEU_TOKEN_AQUI
Accept: application/json
```

## Endpoints/recursos principais

| Endpoint | Método | Descrição |
|----------|--------|-----------|
| `/emendas` | GET | Lista emendas parlamentares com filtros |
| `/emendas/{codigo}` | GET | Detalhes de uma emenda específica pelo código |

### Parâmetros de consulta — `/emendas`

| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-------------|-----------|
| `ano` | int | Sim | Ano do orçamento (ex: 2024) |
| `codigoAutor` | string | Não | Código do parlamentar autor |
| `nomeAutor` | string | Não | Nome do autor (busca parcial) |
| `codigoFuncao` | string | Não | Código da função orçamentária |
| `codigoSubfuncao` | string | Não | Código da subfunção orçamentária |
| `codigoUF` | string | Não | Código da UF beneficiada |
| `codigoMunicipio` | string | Não | Código IBGE do município beneficiado |
| `pagina` | int | Não | Número da página (começa em 1) |

## Exemplo de uso

### Listar emendas parlamentares de um ano

```python
import requests
import pandas as pd

API_KEY = "SEU_TOKEN_AQUI"
BASE_URL = "https://api.portaldatransparencia.gov.br/api-de-dados"

headers = {
    "chave-api-dados": API_KEY,
    "Accept": "application/json",
}


def listar_emendas(ano: int, nome_autor: str = None, pagina: int = 1):
    """
    Lista emendas parlamentares de um ano.

    Args:
        ano: Ano do orçamento (ex: 2024)
        nome_autor: Nome do parlamentar autor (opcional, busca parcial)
        pagina: Número da página

    Returns:
        Lista de emendas em formato dict
    """
    url = f"{BASE_URL}/emendas"
    params = {
        "ano": ano,
        "pagina": pagina,
    }
    if nome_autor:
        params["nomeAutor"] = nome_autor

    response = requests.get(url, headers=headers, params=params)
    response.raise_for_status()
    return response.json()


# Exemplo: emendas do ano de 2024
emendas = listar_emendas(2024)
df = pd.DataFrame(emendas)
print(f"Emendas retornadas: {len(df)}")
print(df[["codigoEmenda", "nomeAutor", "valorEmpenhado", "localidadeDoGasto"]].head())
```

### Consultar detalhes de uma emenda

```python
def detalhar_emenda(codigo: str):
    """
    Obtém detalhes completos de uma emenda parlamentar.

    Args:
        codigo: Código da emenda

    Returns:
        Dicionário com detalhes da emenda
    """
    url = f"{BASE_URL}/emendas/{codigo}"
    response = requests.get(url, headers=headers)
    response.raise_for_status()
    return response.json()


# Exemplo: detalhar emenda específica
if not df.empty:
    codigo = df.iloc[0]["codigoEmenda"]
    detalhes = detalhar_emenda(codigo)
    print(f"Autor: {detalhes.get('nomeAutor', 'N/A')}")
    print(f"Valor empenhado: R$ {detalhes.get('valorEmpenhado', 0):,.2f}")
    print(f"Valor pago: R$ {detalhes.get('valorPago', 0):,.2f}")
    print(f"Localidade: {detalhes.get('localidadeDoGasto', 'N/A')}")
```

### Agrupar emendas por autor e calcular totais

```python
def todas_emendas_do_ano(ano: int, max_paginas: int = 10):
    """
    Coleta emendas de múltiplas páginas para um ano.

    Args:
        ano: Ano do orçamento
        max_paginas: Número máximo de páginas a consultar

    Returns:
        DataFrame com todas as emendas coletadas
    """
    import time

    todas = []
    for pagina in range(1, max_paginas + 1):
        dados = listar_emendas(ano, pagina=pagina)
        if not dados:
            break
        todas.extend(dados)
        time.sleep(2)  # Respeitar rate limit de 30 req/min

    return pd.DataFrame(todas)


# Coletar e analisar
df_todas = todas_emendas_do_ano(2024, max_paginas=5)
if not df_todas.empty:
    # Ranking de autores por valor empenhado
    ranking = (
        df_todas.groupby("nomeAutor")["valorEmpenhado"]
        .sum()
        .sort_values(ascending=False)
    )
    print("Top 10 parlamentares por valor empenhado:")
    print(ranking.head(10))
```

## Campos disponíveis

### Listagem (`/emendas`)

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `codigoEmenda` | string | Código identificador da emenda |
| `ano` | int | Ano do orçamento |
| `tipoEmenda` | string | Tipo da emenda (individual, bancada, comissão, relator) |
| `nomeAutor` | string | Nome do parlamentar autor |
| `codigoAutor` | string | Código do autor |
| `localidadeDoGasto` | string | Localidade beneficiada (município/UF) |
| `codigoFuncao` | string | Código da função orçamentária |
| `nomeFuncao` | string | Nome da função orçamentária (ex: Saúde, Educação) |
| `codigoSubfuncao` | string | Código da subfunção |
| `nomeSubfuncao` | string | Nome da subfunção |
| `valorEmpenhado` | float | Valor empenhado (R$) |
| `valorLiquidado` | float | Valor liquidado (R$) |
| `valorPago` | float | Valor efetivamente pago (R$) |
| `valorRestoInscrito` | float | Valor inscrito em restos a pagar (R$) |
| `valorRestoCancelado` | float | Valor de restos a pagar cancelados (R$) |
| `valorRestoPago` | float | Valor de restos a pagar efetivamente pagos (R$) |

### Detalhes (`/emendas/{codigo}`)

Inclui todos os campos da listagem, mais:

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `orgaoExecutor` | string | Órgão responsável pela execução |
| `programaGovernamental` | string | Programa governamental vinculado |
| `acao` | string | Ação orçamentária |
| `planoOrcamentario` | string | Plano orçamentário |

## Cruzamentos possíveis

| Cruzamento | Fonte relacionada | Chave de ligação | Finalidade |
|------------|-------------------|------------------|------------|
| Emendas x Candidaturas | [TSE — Candidaturas](/docs/apis/justica-eleitoral-tse/candidaturas) | `Nome autor / CPF` | Identificar mandatos e partidos dos autores de emendas |
| Emendas x Doações | [TSE — Prestação de Contas](/docs/apis/justica-eleitoral-tse/prestacao-contas) | `Nome autor / CNPJ` | Verificar se beneficiários de emendas são doadores do parlamentar |
| Emendas x CNPJ | [Receita Federal — CNPJ](/docs/apis/receita-federal/cnpj-completa) | `CNPJ` | Analisar empresas beneficiadas por emendas (sócios, natureza jurídica) |
| Emendas x Contratos | [Contratos Federais](/docs/apis/transparencia-cgu/contratos-federais) | `Código órgão` | Rastrear contratos gerados a partir de recursos de emendas |
| Emendas x SIAFI | [Tesouro Nacional — SIAFI](/docs/apis/tesouro-nacional/siafi) | `Código ação / programa` | Detalhar a execução orçamentária da emenda |
| Emendas x Municípios | [IBGE — Municípios](/docs/apis/ibge-estatisticas/agregados) | `Código IBGE` | Contextualizar com dados socioeconômicos do município beneficiado |

### Receita: rastrear emendas de um parlamentar e seus doadores

```python
import requests
import pandas as pd

API_KEY = "SEU_TOKEN_AQUI"
BASE_URL = "https://api.portaldatransparencia.gov.br/api-de-dados"
headers = {"chave-api-dados": API_KEY, "Accept": "application/json"}

# 1. Obter emendas de um parlamentar específico
resp = requests.get(
    f"{BASE_URL}/emendas",
    headers=headers,
    params={"ano": 2024, "nomeAutor": "NOME DO PARLAMENTAR", "pagina": 1},
)
emendas = pd.DataFrame(resp.json())

if not emendas.empty:
    print(f"Total de emendas: {len(emendas)}")
    print(f"Valor total empenhado: R$ {emendas['valorEmpenhado'].sum():,.2f}")
    print(f"Valor total pago: R$ {emendas['valorPago'].sum():,.2f}")

    # 2. Identificar localidades beneficiadas
    por_local = emendas.groupby("localidadeDoGasto")["valorPago"].sum()
    print("\nLocalidades beneficiadas:")
    print(por_local.sort_values(ascending=False).head())

    # 3. Próximo passo: cruzar com dados do TSE para verificar se
    #    empresas/entidades beneficiadas são doadores do parlamentar
    print("\nPróximo passo: cruzar com prestação de contas do TSE")
```

## Limitações conhecidas

| Limitação | Detalhes |
|-----------|----------|
| **Rate limit** | 30 requisições por minuto por token. Exceder resulta em HTTP 429. |
| **Emendas de relator** | Emendas do relator-geral (RP9, "orçamento secreto") historicamente tinham menos transparência. A partir de 2023, há maior detalhamento, mas dados anteriores podem ser incompletos. |
| **Identificação do beneficiário final** | A API informa a localidade do gasto, mas nem sempre identifica o beneficiário final (empresa ou entidade) que recebeu o recurso. |
| **Execução financeira** | Os valores empenhados podem diferir significativamente dos valores pagos. Restos a pagar podem se acumular por anos. |
| **Paginação** | Resultados paginados; para análises completas é necessário iterar todas as páginas. |
| **Cobertura temporal** | Dados mais completos a partir de 2015. Anos anteriores podem ter informações incompletas. |
| **Emendas impositivas** | A distinção entre emendas impositivas e não impositivas nem sempre é clara nos dados retornados. |
| **Disponibilidade** | A API pode apresentar instabilidade em horários de pico (9h-12h BRT). Implemente retry com backoff exponencial. |
