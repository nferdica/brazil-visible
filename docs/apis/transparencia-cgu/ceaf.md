---
title: CEAF — Cadastro de Expulsões da Administração Federal
slug: ceaf
orgao: CGU
url_base: https://api.portaldatransparencia.gov.br/api-de-dados/
tipo_acesso: API REST
autenticacao: API Key
formato_dados: JSON
frequencia_atualizacao: Diária
campos_chave:
  - CPF
  - cargo
  - orgao_lotacao
  - tipo_punicao
  - data_punicao
tags:
  - sanções
  - servidores expulsos
  - CEAF
  - PAD
  - transparência
  - anticorrupção
  - administração federal
cruzamento_com:
  - transparencia-cgu/servidores-federais
  - receita-federal/cnpj-completa
  - justica-eleitoral-tse/candidaturas
  - poder-judiciario-cnj/processos
  - transparencia-cgu/ceis
status: documentado
---

# CEAF — Cadastro de Expulsões da Administração Federal

## O que é

O **CEAF (Cadastro de Expulsões da Administração Federal)** é um banco de dados mantido pela **Controladoria-Geral da União (CGU)** que consolida informações sobre servidores públicos federais punidos com **demissão**, **cassação de aposentadoria** ou **destituição de cargo em comissão**, em decorrência de processos administrativos disciplinares (PAD).

As expulsões registradas no CEAF são consequência de infrações graves, tais como:

- **Improbidade administrativa**
- **Corrupção** (recebimento de vantagens indevidas)
- **Abandono de cargo**
- **Aplicação irregular de dinheiro público**
- **Ato de lesão aos cofres públicos**
- **Acumulação ilegal de cargos**
- **Valimento de cargo para lograr proveito pessoal**

O CEAF é complementar ao cadastro de servidores ativos e é essencial para verificar o histórico disciplinar de agentes públicos.

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
| `/ceaf` | GET | Lista servidores expulsos da Administração Federal |
| `/ceaf/{id}` | GET | Detalhes de uma expulsão específica |

### Parâmetros de consulta — `/ceaf`

| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-------------|-----------|
| `cpfSancionado` | string | Não | CPF do servidor expulso |
| `nomeSancionado` | string | Não | Nome do servidor (busca parcial) |
| `tipoPunicao` | string | Não | Tipo de punição (demissão, cassação, destituição) |
| `codigoOrgaoLotacao` | string | Não | Código SIAFI do órgão de lotação |
| `pagina` | int | Não | Número da página (começa em 1) |

## Exemplo de uso

### Consultar servidores expulsos

```python
import requests
import pandas as pd

API_KEY = "SEU_TOKEN_AQUI"
BASE_URL = "https://api.portaldatransparencia.gov.br/api-de-dados"

headers = {
    "chave-api-dados": API_KEY,
    "Accept": "application/json",
}


def consultar_ceaf(
    nome: str = None,
    tipo_punicao: str = None,
    codigo_orgao: str = None,
    pagina: int = 1,
):
    """
    Consulta o Cadastro de Expulsões da Administração Federal.

    Args:
        nome: Nome do servidor (busca parcial, opcional)
        tipo_punicao: Tipo de punição (opcional)
        codigo_orgao: Código SIAFI do órgão (opcional)
        pagina: Número da página

    Returns:
        Lista de expulsões em formato dict
    """
    url = f"{BASE_URL}/ceaf"
    params = {"pagina": pagina}
    if nome:
        params["nomeSancionado"] = nome
    if tipo_punicao:
        params["tipoPunicao"] = tipo_punicao
    if codigo_orgao:
        params["codigoOrgaoLotacao"] = codigo_orgao

    response = requests.get(url, headers=headers, params=params)
    response.raise_for_status()
    return response.json()


# Exemplo: listar servidores expulsos (página 1)
expulsos = consultar_ceaf()
df = pd.DataFrame(expulsos)
print(f"Expulsões retornadas: {len(df)}")
print(df[["nomeSancionado", "cargo", "tipoPunicao", "fundamentacao"]].head())
```

### Consultar expulsões por órgão

```python
def expulsos_por_orgao(codigo_orgao: str, pagina: int = 1):
    """
    Lista servidores expulsos de um órgão específico.

    Args:
        codigo_orgao: Código SIAFI do órgão
        pagina: Número da página

    Returns:
        Lista de expulsões do órgão
    """
    return consultar_ceaf(codigo_orgao=codigo_orgao, pagina=pagina)


# Exemplo: expulsões do INSS (33000)
expulsos_inss = expulsos_por_orgao("33000")
df_inss = pd.DataFrame(expulsos_inss)
if not df_inss.empty:
    print(f"Servidores expulsos do órgão: {len(df_inss)}")
    # Distribuição por tipo de punição
    print("\nDistribuição por tipo de punição:")
    print(df_inss["tipoPunicao"].value_counts())
```

### Análise de fundamentações mais frequentes

```python
import time


def coletar_expulsoes(max_paginas: int = 10):
    """
    Coleta expulsões de múltiplas páginas.

    Args:
        max_paginas: Número máximo de páginas a consultar

    Returns:
        DataFrame com as expulsões coletadas
    """
    todas = []
    for pagina in range(1, max_paginas + 1):
        dados = consultar_ceaf(pagina=pagina)
        if not dados:
            break
        todas.extend(dados)
        time.sleep(2)  # Respeitar rate limit

    return pd.DataFrame(todas)


df_todas = coletar_expulsoes(max_paginas=5)
if not df_todas.empty:
    print("Fundamentações mais frequentes para expulsão:")
    print(df_todas["fundamentacao"].value_counts().head(10))
    print(f"\nTotal de registros coletados: {len(df_todas)}")
```

## Campos disponíveis

### Listagem (`/ceaf`)

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | int | Identificador único do registro |
| `cpfSancionado` | string | CPF do servidor (parcialmente ocultado) |
| `nomeSancionado` | string | Nome do servidor expulso |
| `tipoPunicao` | string | Tipo de punição (demissão, cassação de aposentadoria, destituição) |
| `cargo` | string | Cargo ocupado pelo servidor |
| `orgaoLotacao` | string | Órgão de lotação do servidor |
| `codigoOrgaoLotacao` | string | Código SIAFI do órgão |
| `ufOrgaoLotacao` | string | UF do órgão de lotação |
| `fundamentacao` | string | Fundamentação legal/conduta que motivou a expulsão |
| `dataPublicacao` | string | Data de publicação no Diário Oficial da União |
| `numeroPAD` | string | Número do Processo Administrativo Disciplinar |

### Detalhes (`/ceaf/{id}`)

Inclui todos os campos da listagem, mais:

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `detalhamento` | string | Descrição detalhada da infração |
| `portaria` | string | Número da portaria de expulsão |
| `dataTransitoJulgado` | string | Data do trânsito em julgado |
| `reintegrado` | boolean | Indica se o servidor foi posteriormente reintegrado |

## Cruzamentos possíveis

| Cruzamento | Fonte relacionada | Chave de ligação | Finalidade |
|------------|-------------------|------------------|------------|
| CEAF x Servidores | [Servidores Federais](/docs/apis/transparencia-cgu/servidores-federais) | `CPF` | Verificar histórico funcional do servidor antes da expulsão |
| CEAF x CNPJ | [Receita Federal — CNPJ](/docs/apis/receita-federal/cnpj-completa) | `CPF` | Verificar se servidores expulsos são sócios de empresas fornecedoras do governo |
| CEAF x Candidaturas | [TSE — Candidaturas](/docs/apis/justica-eleitoral-tse/candidaturas) | `CPF` | Verificar se servidores expulsos se candidataram a cargos eletivos |
| CEAF x Processos | [CNJ — Processos](/docs/apis/poder-judiciario-cnj/processos) | `CPF` | Verificar processos judiciais relacionados à expulsão |
| CEAF x CEIS | [CEIS](/docs/apis/transparencia-cgu/ceis) | `CPF` | Verificar se o servidor expulso também está registrado como pessoa sancionada no CEIS |
| CEAF x Órgãos | Portal da Transparência | `Código órgão` | Analisar padrões de expulsões por órgão |

### Receita: identificar órgãos com mais expulsões por corrupção

```python
import requests
import pandas as pd
import time

API_KEY = "SEU_TOKEN_AQUI"
BASE_URL = "https://api.portaldatransparencia.gov.br/api-de-dados"
headers = {"chave-api-dados": API_KEY, "Accept": "application/json"}

# Coletar expulsões de múltiplas páginas
todas = []
for pagina in range(1, 11):
    resp = requests.get(
        f"{BASE_URL}/ceaf", headers=headers, params={"pagina": pagina}
    )
    dados = resp.json()
    if not dados:
        break
    todas.extend(dados)
    time.sleep(2)

df = pd.DataFrame(todas)
if not df.empty:
    # Filtrar por fundamentações relacionadas a corrupção
    termos_corrupcao = ["corrupção", "vantagem", "improbidade", "lesão aos cofres"]
    mascara = df["fundamentacao"].str.lower().str.contains(
        "|".join(termos_corrupcao), na=False
    )
    df_corrupcao = df[mascara]

    print(f"Expulsões por corrupção/improbidade: {len(df_corrupcao)} de {len(df)}")
    print("\nÓrgãos com mais expulsões por corrupção:")
    print(df_corrupcao["orgaoLotacao"].value_counts().head(10))
```

## Limitações conhecidas

| Limitação | Detalhes |
|-----------|----------|
| **Rate limit** | 30 requisições por minuto por token. Exceder resulta em HTTP 429. |
| **CPF parcialmente ocultado** | CPFs são exibidos com dígitos ocultados (`***.123.456-**`), dificultando cruzamentos diretos. |
| **Escopo federal** | Apenas expulsões da Administração Pública Federal. Servidores estaduais e municipais não estão incluídos. |
| **Reintegrações** | Servidores reintegrados por decisão judicial podem continuar aparecendo no cadastro. Verifique o campo `reintegrado`. |
| **Fundamentação genérica** | Algumas expulsões possuem fundamentação genérica, sem detalhar a conduta específica. |
| **Dados históricos** | O cadastro inclui registros desde 2003, mas expulsões anteriores podem não estar completamente digitalizadas. |
| **Paginação** | Resultados paginados; para análise completa é necessário iterar todas as páginas. |
| **Disponibilidade** | A API pode apresentar instabilidade em horários de pico (9h-12h BRT). Implemente retry com backoff exponencial. |
