---
title: Servidores Federais
slug: servidores-federais
orgao: CGU
url_base: https://api.portaldatransparencia.gov.br/swagger-ui/index.html
tipo_acesso: API REST
autenticacao: API Key
formato_dados: JSON
frequencia_atualizacao: Diária
campos_chave:
  - CPF
  - codigo_orgao
  - cargo
  - remuneracao
tags:
  - servidores públicos
  - remuneração
  - cargos
  - lotação
  - transparência
  - governo federal
cruzamento_com:
  - receita-federal/cnpj-completa
  - justica-eleitoral-tse/candidaturas
  - poder-judiciario-cnj/datajud
  - transparencia-cgu/viagens-servico
  - previdencia-social/beneficios-inss
status: documentado
---

# Servidores Federais

## O que é

A API de **Servidores Federais** do Portal da Transparência disponibiliza dados sobre servidores públicos do Poder Executivo Federal, incluindo ativos, aposentados e pensionistas. Os dados abrangem remuneração detalhada (bruta e líquida), cargo ocupado, função de confiança, órgão de exercício, órgão de lotação e situação do vínculo.

Esses dados são fundamentais para o controle social, permitindo verificar a compatibilidade entre cargos e remunerações, identificar acúmulos irregulares e monitorar gastos com pessoal no governo federal.

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
| `/servidores` | GET | Lista servidores federais com filtros |
| `/servidores/{id}` | GET | Detalhes de um servidor específico |
| `/servidores/{id}/remuneracao` | GET | Detalhamento de remuneração de um servidor |
| `/servidores/por-orgao` | GET | Servidores agrupados por órgão |
| `/servidores/remuneracao` | GET | Consulta de remuneração com filtros |

### Parâmetros de consulta — `/servidores`

| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-------------|-----------|
| `codigoOrgaoExercicio` | string | Não | Código SIAFI do órgão de exercício |
| `codigoOrgaoLotacao` | string | Não | Código SIAFI do órgão de lotação |
| `situacaoVinculo` | string | Não | Situação do vínculo (ativo, aposentado, pensionista, etc.) |
| `nome` | string | Não | Nome do servidor (busca parcial) |
| `cpf` | string | Não | CPF do servidor |
| `pagina` | int | Não | Número da página (começa em 1) |

### Parâmetros de consulta — `/servidores/remuneracao`

| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-------------|-----------|
| `codigoOrgao` | string | Não | Código SIAFI do órgão |
| `mesAno` | string | Sim | Mês/Ano no formato `YYYYMM` |
| `pagina` | int | Não | Número da página (começa em 1) |

## Exemplo de uso

### Listar servidores de um órgão

```python
import requests
import pandas as pd

API_KEY = "SEU_TOKEN_AQUI"
BASE_URL = "https://api.portaldatransparencia.gov.br/api-de-dados"

headers = {
    "chave-api-dados": API_KEY,
    "Accept": "application/json",
}


def listar_servidores(codigo_orgao: str, pagina: int = 1):
    """
    Lista servidores federais de um órgão.

    Args:
        codigo_orgao: Código SIAFI do órgão (ex: '26000' para MEC)
        pagina: Número da página

    Returns:
        Lista de servidores em formato dict
    """
    url = f"{BASE_URL}/servidores"
    params = {
        "codigoOrgaoExercicio": codigo_orgao,
        "pagina": pagina,
    }

    response = requests.get(url, headers=headers, params=params)
    response.raise_for_status()
    return response.json()


# Exemplo: servidores do Ministério da Educação (26000)
servidores = listar_servidores("26000")
df = pd.DataFrame(servidores)
print(f"Servidores retornados: {len(df)}")
print(df[["nome", "cargo", "situacaoVinculo"]].head())
```

### Consultar remuneração de um servidor

```python
def consultar_remuneracao(servidor_id: int):
    """
    Obtém detalhamento de remuneração de um servidor.

    Args:
        servidor_id: ID do servidor no Portal da Transparência

    Returns:
        Dicionário com detalhes da remuneração
    """
    url = f"{BASE_URL}/servidores/{servidor_id}/remuneracao"
    response = requests.get(url, headers=headers)
    response.raise_for_status()
    return response.json()


# Exemplo: detalhar remuneração do primeiro servidor da lista
if not df.empty:
    primeiro_id = df.iloc[0]["id"]
    remuneracao = consultar_remuneracao(primeiro_id)
    print(f"Remuneração básica bruta: R$ {remuneracao.get('remuneracaoBasica', 0):,.2f}")
    print(f"Remuneração após deduções: R$ {remuneracao.get('remuneracaoAposDeducoes', 0):,.2f}")
```

### Consultar remunerações por órgão e mês

```python
def remuneracoes_por_orgao(codigo_orgao: str, mes_ano: str, pagina: int = 1):
    """
    Lista remunerações de servidores de um órgão em um mês específico.

    Args:
        codigo_orgao: Código SIAFI do órgão
        mes_ano: Mês/Ano no formato YYYYMM (ex: '202401')
        pagina: Número da página

    Returns:
        Lista de remunerações
    """
    url = f"{BASE_URL}/servidores/remuneracao"
    params = {
        "codigoOrgao": codigo_orgao,
        "mesAno": mes_ano,
        "pagina": pagina,
    }

    response = requests.get(url, headers=headers, params=params)
    response.raise_for_status()
    return response.json()


# Exemplo: remunerações do MEC em janeiro/2024
remuneracoes = remuneracoes_por_orgao("26000", "202401")
df_rem = pd.DataFrame(remuneracoes)
if not df_rem.empty:
    print(f"Média salarial bruta: R$ {df_rem['remuneracaoBasica'].mean():,.2f}")
    print(f"Maior remuneração: R$ {df_rem['remuneracaoBasica'].max():,.2f}")
```

## Campos disponíveis

### Listagem (`/servidores`)

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | int | Identificador único do servidor |
| `cpf` | string | CPF (parcialmente ocultado: `***.123.456-**`) |
| `nome` | string | Nome completo do servidor |
| `codigoOrgaoExercicio` | string | Código SIAFI do órgão de exercício |
| `nomeOrgaoExercicio` | string | Nome do órgão de exercício |
| `codigoOrgaoLotacao` | string | Código SIAFI do órgão de lotação |
| `nomeOrgaoLotacao` | string | Nome do órgão de lotação |
| `cargo` | string | Cargo efetivo ocupado |
| `funcao` | string | Função de confiança/gratificada |
| `situacaoVinculo` | string | Situação (ativo, aposentado, pensionista, etc.) |
| `tipoVinculo` | string | Tipo do vínculo (servidor, temporário, etc.) |
| `dataIngressoServPublico` | string | Data de ingresso no serviço público |

### Remuneração (`/servidores/{id}/remuneracao`)

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `remuneracaoBasica` | float | Remuneração básica bruta (R$) |
| `abateTetoConstitucional` | float | Abate teto constitucional (R$) |
| `gratificacaoNatalina` | float | 13o salário (R$) |
| `ferias` | float | Adicional de férias (R$) |
| `outrasRemuneracoes` | float | Verbas indenizatórias e eventuais (R$) |
| `irrf` | float | Imposto de renda retido na fonte (R$) |
| `pssSrpg` | float | Contribuição previdenciária (R$) |
| `demaisDeducoes` | float | Demais deduções obrigatórias (R$) |
| `remuneracaoAposDeducoes` | float | Remuneração líquida (R$) |
| `totalBruto` | float | Total de rendimentos brutos (R$) |
| `mesAno` | string | Mês/ano de referência |

## Cruzamentos possíveis

| Cruzamento | Fonte relacionada | Chave de ligação | Finalidade |
|------------|-------------------|------------------|------------|
| Servidores x Candidaturas | [TSE — Candidaturas](/docs/apis/justica-eleitoral-tse/candidaturas) | `CPF` | Verificar se servidores foram candidatos ou doadores de campanha |
| Servidores x CNPJ | [Receita Federal — CNPJ](/docs/apis/receita-federal/cnpj-completa) | `CPF` | Identificar se servidores são sócios de empresas fornecedoras do governo |
| Servidores x Processos | [CNJ — DataJud](/docs/apis/poder-judiciario-cnj/datajud) | `CPF` | Cruzar servidores com processos judiciais |
| Servidores x Viagens | [Viagens a Serviço](/docs/apis/transparencia-cgu/viagens-servico) | `CPF / ID servidor` | Verificar gastos com diárias e passagens por servidor |
| Servidores x Previdência | [Benefícios INSS](/docs/apis/previdencia-social/beneficios-inss) | `CPF / NIS` | Verificar acúmulo irregular de benefícios previdenciários |
| Servidores x Contratos | [Contratos Federais](/docs/apis/transparencia-cgu/contratos-federais) | `Código órgão` | Identificar relações entre servidores e fornecedores do mesmo órgão |

### Receita: detectar servidores que são sócios de empresas fornecedoras

```python
import requests
import pandas as pd

API_KEY = "SEU_TOKEN_AQUI"
BASE_URL = "https://api.portaldatransparencia.gov.br/api-de-dados"
headers = {"chave-api-dados": API_KEY, "Accept": "application/json"}

# 1. Obter servidores de um órgão
resp = requests.get(
    f"{BASE_URL}/servidores",
    headers=headers,
    params={"codigoOrgaoExercicio": "26000", "pagina": 1},
)
servidores = pd.DataFrame(resp.json())

# 2. Obter contratos do mesmo órgão
resp_contratos = requests.get(
    f"{BASE_URL}/contratos",
    headers=headers,
    params={"codigoOrgao": "26000", "dataInicial": "01/01/2024", "dataFinal": "31/12/2024", "pagina": 1},
)
contratos = pd.DataFrame(resp_contratos.json())

# 3. Os CNPJs dos fornecedores podem ser cruzados com dados da Receita
#    Federal para verificar se servidores do órgão constam no quadro
#    societário das empresas contratadas.
print(f"Servidores no órgão: {len(servidores)}")
print(f"Contratos do órgão: {len(contratos)}")
print("Próximo passo: cruzar CPFs dos servidores com QSA das empresas via Receita Federal")
```

## Limitações conhecidas

| Limitação | Detalhes |
|-----------|----------|
| **Rate limit** | 90 requisições por minuto (6h-24h) / 300 requisições por minuto (0h-6h) por token. Exceder resulta em HTTP 429. |
| **CPF parcialmente ocultado** | Por determinação da LGPD, CPFs são retornados com dígitos ocultados (`***.123.456-**`), limitando cruzamentos diretos. |
| **Cobertura** | Apenas servidores do Poder Executivo Federal. Não inclui servidores estaduais, municipais, do Legislativo ou do Judiciário. |
| **Dados históricos** | Remunerações históricas podem não estar disponíveis para todos os meses; a cobertura varia por órgão. |
| **Temporários e terceirizados** | Nem todos os servidores temporários ou terceirizados aparecem na base. |
| **Formato de data** | Datas nos parâmetros devem estar no formato `DD/MM/AAAA` ou `YYYYMM`, dependendo do endpoint. |
| **Teto constitucional** | O campo `abateTetoConstitucional` pode mascarar a remuneração real quando o servidor excede o teto. |
| **Disponibilidade** | A API pode apresentar instabilidade em horários de pico (9h-12h BRT). Implemente retry com backoff exponencial. |
