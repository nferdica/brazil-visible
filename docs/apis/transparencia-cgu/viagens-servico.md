---
title: Viagens a Serviço
slug: viagens-servico
orgao: CGU
url_base: https://api.portaldatransparencia.gov.br/api-de-dados/
tipo_acesso: API REST
autenticacao: API Key
formato_dados: JSON
frequencia_atualizacao: Diária
campos_chave:
  - CPF
  - codigo_orgao
  - valor_diarias
  - valor_passagens
  - destino
tags:
  - viagens
  - diárias
  - passagens
  - servidores
  - transparência
  - gastos públicos
  - governo federal
cruzamento_com:
  - transparencia-cgu/servidores-federais
  - receita-federal/cnpj-completa
  - justica-eleitoral-tse/candidaturas
  - transparencia-cgu/contratos-federais
  - tesouro-nacional/siafi
status: documentado
---

# Viagens a Serviço

## O que é

A API de **Viagens a Serviço** do Portal da Transparência disponibiliza dados sobre viagens realizadas por servidores públicos federais a serviço do governo. Os dados incluem destino, motivo, valores de diárias e passagens, órgão do servidor e período da viagem.

Esses dados permitem monitorar os gastos com deslocamento de servidores, identificar padrões de viagem atípicos, verificar a justificativa das viagens e comparar custos entre órgãos. São especialmente úteis para identificar gastos excessivos, viagens sem justificativa clara ou padrões de deslocamento que possam indicar uso indevido de recursos públicos.

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
| `/viagens` | GET | Lista viagens a serviço de servidores federais |
| `/viagens/{id}` | GET | Detalhes de uma viagem específica |
| `/viagens/por-orgao` | GET | Viagens agrupadas por órgão |

### Parâmetros de consulta — `/viagens`

| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-------------|-----------|
| `dataIdaDe` | string | Não | Data de ida a partir de (`DD/MM/AAAA`) |
| `dataIdaAte` | string | Não | Data de ida até (`DD/MM/AAAA`) |
| `dataRetornoDe` | string | Não | Data de retorno a partir de (`DD/MM/AAAA`) |
| `dataRetornoAte` | string | Não | Data de retorno até (`DD/MM/AAAA`) |
| `codigoOrgao` | string | Não | Código SIAFI do órgão |
| `cpfServidor` | string | Não | CPF do servidor |
| `pagina` | int | Não | Número da página (começa em 1) |

## Exemplo de uso

### Listar viagens de um órgão

```python
import requests
import pandas as pd

API_KEY = "SEU_TOKEN_AQUI"
BASE_URL = "https://api.portaldatransparencia.gov.br/api-de-dados"

headers = {
    "chave-api-dados": API_KEY,
    "Accept": "application/json",
}


def listar_viagens(
    data_ida_de: str,
    data_ida_ate: str,
    codigo_orgao: str = None,
    pagina: int = 1,
):
    """
    Lista viagens a serviço em um período.

    Args:
        data_ida_de: Data de ida a partir de (DD/MM/AAAA)
        data_ida_ate: Data de ida até (DD/MM/AAAA)
        codigo_orgao: Código SIAFI do órgão (opcional)
        pagina: Número da página

    Returns:
        Lista de viagens em formato dict
    """
    url = f"{BASE_URL}/viagens"
    params = {
        "dataIdaDe": data_ida_de,
        "dataIdaAte": data_ida_ate,
        "pagina": pagina,
    }
    if codigo_orgao:
        params["codigoOrgao"] = codigo_orgao

    response = requests.get(url, headers=headers, params=params)
    response.raise_for_status()
    return response.json()


# Exemplo: viagens do Ministério da Economia em janeiro/2024
viagens = listar_viagens("01/01/2024", "31/01/2024", "25000")
df = pd.DataFrame(viagens)
print(f"Viagens retornadas: {len(df)}")
print(df[["nomeServidor", "destino", "valorDiarias", "valorPassagens"]].head())
```

### Consultar detalhes de uma viagem

```python
def detalhar_viagem(viagem_id: int):
    """
    Obtém detalhes completos de uma viagem.

    Args:
        viagem_id: ID da viagem no Portal da Transparência

    Returns:
        Dicionário com detalhes da viagem
    """
    url = f"{BASE_URL}/viagens/{viagem_id}"
    response = requests.get(url, headers=headers)
    response.raise_for_status()
    return response.json()


# Exemplo: detalhar viagem
if not df.empty:
    primeiro_id = df.iloc[0]["id"]
    detalhes = detalhar_viagem(primeiro_id)
    print(f"Servidor: {detalhes.get('nomeServidor', 'N/A')}")
    print(f"Destino: {detalhes.get('destino', 'N/A')}")
    print(f"Motivo: {detalhes.get('motivo', 'N/A')}")
    print(f"Diárias: R$ {detalhes.get('valorDiarias', 0):,.2f}")
    print(f"Passagens: R$ {detalhes.get('valorPassagens', 0):,.2f}")
```

### Análise de gastos com viagens por órgão

```python
import time


def coletar_viagens_periodo(data_ida_de: str, data_ida_ate: str, max_paginas: int = 10):
    """
    Coleta viagens de múltiplas páginas.

    Args:
        data_ida_de: Data de ida a partir de (DD/MM/AAAA)
        data_ida_ate: Data de ida até (DD/MM/AAAA)
        max_paginas: Número máximo de páginas

    Returns:
        DataFrame com as viagens coletadas
    """
    todas = []
    for pagina in range(1, max_paginas + 1):
        dados = listar_viagens(data_ida_de, data_ida_ate, pagina=pagina)
        if not dados:
            break
        todas.extend(dados)
        time.sleep(2)  # Respeitar rate limit

    return pd.DataFrame(todas)


df_viagens = coletar_viagens_periodo("01/01/2024", "31/03/2024", max_paginas=5)
if not df_viagens.empty:
    # Total de gastos
    total_diarias = df_viagens["valorDiarias"].sum()
    total_passagens = df_viagens["valorPassagens"].sum()
    print(f"Total de diárias: R$ {total_diarias:,.2f}")
    print(f"Total de passagens: R$ {total_passagens:,.2f}")
    print(f"Total geral: R$ {total_diarias + total_passagens:,.2f}")

    # Ranking por órgão
    gastos_por_orgao = (
        df_viagens.groupby("nomeOrgao")
        .agg({"valorDiarias": "sum", "valorPassagens": "sum"})
        .assign(total=lambda x: x["valorDiarias"] + x["valorPassagens"])
        .sort_values("total", ascending=False)
    )
    print("\nTop 10 órgãos por gasto com viagens:")
    print(gastos_por_orgao.head(10))
```

## Campos disponíveis

### Listagem (`/viagens`)

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | int | Identificador único da viagem |
| `cpfServidor` | string | CPF do servidor (parcialmente ocultado) |
| `nomeServidor` | string | Nome do servidor |
| `cargoServidor` | string | Cargo do servidor |
| `nomeOrgao` | string | Nome do órgão do servidor |
| `codigoOrgao` | string | Código SIAFI do órgão |
| `destino` | string | Cidade/país de destino |
| `origemViagem` | string | Cidade de origem da viagem |
| `dataIda` | string | Data de ida |
| `dataRetorno` | string | Data de retorno |
| `motivo` | string | Motivo/justificativa da viagem |
| `valorDiarias` | float | Valor total das diárias (R$) |
| `valorPassagens` | float | Valor total das passagens (R$) |
| `valorOutrosGastos` | float | Outros gastos de deslocamento (R$) |
| `situacao` | string | Situação da viagem (realizada, cancelada, etc.) |

### Detalhes (`/viagens/{id}`)

Inclui todos os campos da listagem, mais:

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `trechos` | array | Lista de trechos da viagem (origem, destino, data, cia aérea) |
| `quantidadeDiarias` | float | Número de diárias concedidas |
| `valorUnitarioDiaria` | float | Valor unitário da diária (R$) |
| `meioTransporte` | string | Meio de transporte (aéreo, terrestre, etc.) |
| `justificativaUrgencia` | string | Justificativa para viagens urgentes |

## Cruzamentos possíveis

| Cruzamento | Fonte relacionada | Chave de ligação | Finalidade |
|------------|-------------------|------------------|------------|
| Viagens x Servidores | [Servidores Federais](/docs/apis/transparencia-cgu/servidores-federais) | `CPF / Código órgão` | Correlacionar viagens com cargo, remuneração e lotação do servidor |
| Viagens x Candidaturas | [TSE — Candidaturas](/docs/apis/justica-eleitoral-tse/candidaturas) | `CPF` | Verificar se servidores que viajam frequentemente têm vínculos políticos |
| Viagens x CNPJ | [Receita Federal — CNPJ](/docs/apis/receita-federal/cnpj-completa) | `CPF` | Verificar se servidores com muitas viagens possuem empresas |
| Viagens x Contratos | [Contratos Federais](/docs/apis/transparencia-cgu/contratos-federais) | `Código órgão` | Correlacionar viagens com contratos do mesmo órgão |
| Viagens x SIAFI | [Tesouro Nacional — SIAFI](/docs/apis/tesouro-nacional/siafi) | `Código SIAFI` | Detalhar a execução orçamentária dos gastos com viagens |
| Viagens x CEAF | [CEAF](/docs/apis/transparencia-cgu/ceaf) | `CPF` | Verificar se servidores expulsos tinham padrões atípicos de viagem |

### Receita: identificar servidores com gastos atípicos de viagem

```python
import requests
import pandas as pd
import time

API_KEY = "SEU_TOKEN_AQUI"
BASE_URL = "https://api.portaldatransparencia.gov.br/api-de-dados"
headers = {"chave-api-dados": API_KEY, "Accept": "application/json"}

# Coletar viagens de um trimestre
todas_viagens = []
for pagina in range(1, 11):
    resp = requests.get(
        f"{BASE_URL}/viagens",
        headers=headers,
        params={"dataIdaDe": "01/01/2024", "dataIdaAte": "31/03/2024", "pagina": pagina},
    )
    dados = resp.json()
    if not dados:
        break
    todas_viagens.extend(dados)
    time.sleep(2)

df = pd.DataFrame(todas_viagens)
if not df.empty:
    df["gastoTotal"] = df["valorDiarias"] + df["valorPassagens"]

    # Identificar outliers (gastos acima de 2 desvios-padrão da média)
    media = df["gastoTotal"].mean()
    desvio = df["gastoTotal"].std()
    limiar = media + 2 * desvio

    atipicos = df[df["gastoTotal"] > limiar]
    print(f"Viagens com gastos atípicos (> R$ {limiar:,.2f}): {len(atipicos)}")
    if not atipicos.empty:
        print(
            atipicos[["nomeServidor", "destino", "gastoTotal", "motivo"]]
            .sort_values("gastoTotal", ascending=False)
            .head(10)
        )

    # Servidores que mais viajam
    freq = df["nomeServidor"].value_counts().head(10)
    print("\nServidores com mais viagens no período:")
    print(freq)
```

## Limitações conhecidas

| Limitação | Detalhes |
|-----------|----------|
| **Rate limit** | 30 requisições por minuto por token. Exceder resulta em HTTP 429. |
| **CPF parcialmente ocultado** | CPFs são exibidos com dígitos ocultados (`***.123.456-**`), limitando cruzamentos diretos por CPF. |
| **Cobertura** | Apenas viagens do Poder Executivo Federal. Não inclui Legislativo, Judiciário ou entes subnacionais. |
| **Viagens internacionais** | Viagens internacionais podem ter campos de destino em formatos variados, dificultando a padronização. |
| **Companhias aéreas** | O nome da companhia aérea nem sempre está disponível nos trechos. |
| **Viagens canceladas** | Viagens canceladas podem aparecer nos resultados; filtre pelo campo `situacao` para obter apenas viagens realizadas. |
| **Paginação** | Resultados paginados; para análise completa é necessário iterar todas as páginas. |
| **Formato de data** | Datas nos parâmetros devem estar no formato `DD/MM/AAAA`, diferente do padrão ISO 8601. |
| **Disponibilidade** | A API pode apresentar instabilidade em horários de pico (9h-12h BRT). Implemente retry com backoff exponencial. |
