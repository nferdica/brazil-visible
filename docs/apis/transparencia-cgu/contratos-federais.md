---
title: Contratos Federais
slug: contratos-federais
orgao: CGU
url_base: https://api.portaldatransparencia.gov.br/swagger-ui/index.html
tipo_acesso: API REST
autenticacao: API Key
formato_dados: JSON
frequencia_atualizacao: Diária
campos_chave:
  - CNPJ
  - codigo_orgao
  - numero_contrato
  - valor_contrato
tags:
  - contratos
  - licitações
  - fornecedores
  - gastos públicos
  - transparência
  - governo federal
cruzamento_com:
  - receita-federal/cnpj-completa
  - justica-eleitoral-tse/candidaturas
  - transparencia-cgu/ceis
  - transparencia-cgu/cnep
  - tesouro-nacional/siafi
status: documentado
---

# Contratos Federais

## O que é

A API de **Contratos Federais** do Portal da Transparência disponibiliza informações sobre contratos firmados por órgãos e entidades do Governo Federal. Os dados incluem valores contratados, fornecedores (com CNPJ), objeto do contrato, vigência, órgão contratante e aditivos contratuais.

Esses dados são essenciais para o controle social dos gastos públicos, permitindo identificar quem são os principais fornecedores do governo, quais órgãos mais contratam e se os valores praticados são compatíveis com o mercado.

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
| Requisições por minuto (6h-24h) | 90 |
| Requisições por minuto (0h-6h) | 300 |
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
| `/contratos` | GET | Lista contratos do Governo Federal com filtros |
| `/contratos/{id}` | GET | Detalhes de um contrato específico por ID |

### Parâmetros de consulta — `/contratos`

| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-------------|-----------|
| `dataInicial` | string | Sim* | Data inicial no formato `DD/MM/AAAA` |
| `dataFinal` | string | Sim* | Data final no formato `DD/MM/AAAA` |
| `codigoOrgao` | string | Não | Código SIAFI do órgão contratante |
| `cnpjContratado` | string | Não | CNPJ do fornecedor contratado |
| `pagina` | int | Não | Número da página (começa em 1) |

> *Ao menos um filtro de data ou órgão é necessário para limitar os resultados.

## Exemplo de uso

### Listar contratos de um órgão federal

```python
import requests
import pandas as pd

API_KEY = "SEU_TOKEN_AQUI"
BASE_URL = "https://api.portaldatransparencia.gov.br/api-de-dados"

headers = {
    "chave-api-dados": API_KEY,
    "Accept": "application/json",
}


def listar_contratos(
    data_inicial: str,
    data_final: str,
    codigo_orgao: str = None,
    pagina: int = 1,
):
    """
    Lista contratos federais em um período.

    Args:
        data_inicial: Data inicial (DD/MM/AAAA)
        data_final: Data final (DD/MM/AAAA)
        codigo_orgao: Código SIAFI do órgão (ex: '26000' para MEC)
        pagina: Número da página

    Returns:
        Lista de contratos em formato dict
    """
    url = f"{BASE_URL}/contratos"
    params = {
        "dataInicial": data_inicial,
        "dataFinal": data_final,
        "pagina": pagina,
    }
    if codigo_orgao:
        params["codigoOrgao"] = codigo_orgao

    response = requests.get(url, headers=headers, params=params)
    response.raise_for_status()
    return response.json()


# Exemplo: contratos do Ministério da Saúde (36000) em janeiro/2024
contratos = listar_contratos("01/01/2024", "31/01/2024", "36000")
df = pd.DataFrame(contratos)
print(f"Contratos encontrados: {len(df)}")
print(df[["numero", "orgaoContratante", "fornecedor", "valorInicial"]].head())
```

### Consultar detalhes de um contrato

```python
def detalhar_contrato(contrato_id: int):
    """
    Obtém detalhes completos de um contrato específico.

    Args:
        contrato_id: ID do contrato no Portal da Transparência

    Returns:
        Dicionário com detalhes do contrato
    """
    url = f"{BASE_URL}/contratos/{contrato_id}"
    response = requests.get(url, headers=headers)
    response.raise_for_status()
    return response.json()


# Exemplo: detalhar contrato pelo ID obtido na listagem
if not df.empty:
    primeiro_id = df.iloc[0]["id"]
    detalhes = detalhar_contrato(primeiro_id)
    print(f"Objeto: {detalhes.get('objeto', 'N/A')}")
    print(f"Valor inicial: R$ {detalhes.get('valorInicial', 0):,.2f}")
    print(f"Fornecedor: {detalhes.get('fornecedor', 'N/A')}")
```

### Buscar contratos por CNPJ do fornecedor

```python
def contratos_por_fornecedor(cnpj: str, data_inicial: str, data_final: str):
    """
    Busca contratos federais de um fornecedor específico.

    Args:
        cnpj: CNPJ do fornecedor (apenas números)
        data_inicial: Data inicial (DD/MM/AAAA)
        data_final: Data final (DD/MM/AAAA)

    Returns:
        Lista de contratos do fornecedor
    """
    url = f"{BASE_URL}/contratos"
    params = {
        "cnpjContratado": cnpj,
        "dataInicial": data_inicial,
        "dataFinal": data_final,
        "pagina": 1,
    }

    response = requests.get(url, headers=headers, params=params)
    response.raise_for_status()
    return response.json()


# Exemplo: buscar contratos de um fornecedor
contratos_fornecedor = contratos_por_fornecedor(
    "00000000000191", "01/01/2024", "31/12/2024"
)
print(f"Contratos do fornecedor: {len(contratos_fornecedor)}")
```

## Campos disponíveis

### Listagem (`/contratos`)

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | int | Identificador único do contrato |
| `numero` | string | Número do contrato |
| `objeto` | string | Descrição do objeto contratado |
| `orgaoContratante` | string | Nome do órgão contratante |
| `codigoOrgao` | string | Código SIAFI do órgão |
| `fornecedor` | string | Nome/razão social do fornecedor |
| `cnpjContratado` | string | CNPJ do fornecedor |
| `valorInicial` | float | Valor inicial do contrato (R$) |
| `valorFinal` | float | Valor final do contrato, incluindo aditivos (R$) |
| `dataInicio` | string | Data de início da vigência |
| `dataFim` | string | Data de término da vigência |
| `dataAssinatura` | string | Data de assinatura do contrato |
| `situacao` | string | Situação do contrato (ativo, encerrado, etc.) |
| `modalidadeCompra` | string | Modalidade de compra (pregão, concorrência, etc.) |
| `fundamentoLegal` | string | Base legal da contratação |
| `licitacaoAssociada` | string | Número da licitação vinculada |

### Detalhes (`/contratos/{id}`)

Inclui todos os campos da listagem, mais:

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `aditivos` | array | Lista de aditivos contratuais |
| `itens` | array | Itens contratados (quando disponível) |
| `unidadeGestora` | string | Unidade gestora responsável |
| `fonteRecurso` | string | Fonte de recurso orçamentário |

## Cruzamentos possíveis

| Cruzamento | Fonte relacionada | Chave de ligação | Finalidade |
|------------|-------------------|------------------|------------|
| Contratos x CNPJ | [Receita Federal — CNPJ](/docs/apis/receita-federal/cnpj-completa) | `CNPJ` | Identificar sócios, natureza jurídica e situação cadastral dos fornecedores |
| Contratos x Candidaturas | [TSE — Candidaturas](/docs/apis/justica-eleitoral-tse/candidaturas) | `CNPJ / CPF` | Verificar se sócios de fornecedores são doadores de campanha ou candidatos |
| Contratos x CEIS | [CEIS](/docs/apis/transparencia-cgu/ceis) | `CNPJ` | Verificar se fornecedores constam no cadastro de empresas inidôneas |
| Contratos x CNEP | [CNEP](/docs/apis/transparencia-cgu/cnep) | `CNPJ` | Identificar fornecedores punidos pela Lei Anticorrupção |
| Contratos x SIAFI | [Tesouro Nacional — SIAFI](/docs/apis/tesouro-nacional/siafi) | `Código SIAFI` | Detalhar a execução orçamentária vinculada ao contrato |
| Contratos x Servidores | [Servidores Federais](/docs/apis/transparencia-cgu/servidores-federais) | `Código órgão` | Cruzar órgãos contratantes com servidores responsáveis |

### Receita: verificar se fornecedores estão sancionados

```python
import requests
import pandas as pd

API_KEY = "SEU_TOKEN_AQUI"
BASE_URL = "https://api.portaldatransparencia.gov.br/api-de-dados"
headers = {"chave-api-dados": API_KEY, "Accept": "application/json"}

# 1. Obter contratos recentes
resp_contratos = requests.get(
    f"{BASE_URL}/contratos",
    headers=headers,
    params={"dataInicial": "01/01/2024", "dataFinal": "31/03/2024", "pagina": 1},
)
contratos = pd.DataFrame(resp_contratos.json())

# 2. Obter empresas sancionadas (CEIS)
resp_ceis = requests.get(f"{BASE_URL}/ceis", headers=headers, params={"pagina": 1})
sancionadas = pd.DataFrame(resp_ceis.json())

# 3. Cruzar por CNPJ
if not contratos.empty and not sancionadas.empty:
    alerta = pd.merge(
        contratos,
        sancionadas[["cnpjSancionado", "nomeSancionado", "categoriaSancao"]],
        left_on="cnpjContratado",
        right_on="cnpjSancionado",
        how="inner",
    )
    print(f"ALERTA: {len(alerta)} contratos com fornecedores sancionados!")
    if not alerta.empty:
        print(alerta[["numero", "nomeSancionado", "categoriaSancao", "valorInicial"]])
```

## Limitações conhecidas

| Limitação | Detalhes |
|-----------|----------|
| **Rate limit** | 90 requisições por minuto (6h-24h) / 300 requisições por minuto (0h-6h) por token. Exceder resulta em HTTP 429. |
| **Paginação** | Resultados paginados; é necessário iterar por todas as páginas para obter o conjunto completo. |
| **Cobertura temporal** | Dados disponíveis a partir de 2013 para a maioria dos órgãos. |
| **Aditivos** | Aditivos contratuais podem não estar imediatamente disponíveis; há defasagem na atualização. |
| **Valores** | O campo `valorInicial` pode diferir significativamente do `valorFinal` quando há muitos aditivos. Para análise de gastos reais, use `valorFinal`. |
| **Formato de data** | Datas nos parâmetros devem estar no formato `DD/MM/AAAA`, diferente do padrão ISO 8601. |
| **Contratos sigilosos** | Contratos classificados como sigilosos por razões de segurança nacional não são retornados pela API. |
| **Disponibilidade** | A API pode apresentar instabilidade em horários de pico (9h-12h BRT). Implemente retry com backoff exponencial. |
