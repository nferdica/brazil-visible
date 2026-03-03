---
title: Portal da Transparência
slug: portal-transparencia
orgao: Controladoria-Geral da União (CGU)
url_base: https://api.portaldatransparencia.gov.br/swagger-ui/index.html
tipo_acesso: API REST
autenticacao: API Key
formato_dados: JSON, CSV
frequencia_atualizacao: Diária
campos_chave:
  - CPF
  - CNPJ
  - NIS
  - código SIAFI do órgão
  - código de município (IBGE)
tags:
  - transparência
  - gastos públicos
  - servidores
  - licitações
  - contratos
  - bolsa família
  - convênios
  - viagens
  - cartões de pagamento
  - sanções
  - despesas
  - receitas
cruzamento_com:
  - receita-federal/cnpj-completa
  - justica-eleitoral-tse/candidaturas
  - tesouro-nacional/siafi
  - previdencia-social/beneficios-inss
  - poder-judiciario-cnj/datajud
status: documentado
---

# Portal da Transparência

## O que é

O **Portal da Transparência** é a principal ferramenta de controle social do Governo Federal brasileiro, mantido pela **Controladoria-Geral da União (CGU)**. Disponibiliza dados detalhados sobre a execução orçamentária e financeira do Governo Federal, incluindo despesas, receitas, transferências, servidores públicos, licitações, contratos, convênios, viagens a serviço, cartões de pagamento, sanções e programas sociais como o Bolsa Família/Auxílio Brasil.

A API de Dados do Portal da Transparência oferece acesso programático a esses conjuntos de dados por meio de uma API REST bem documentada, com resposta em JSON e disponibilidade de download em CSV.

**Site oficial:** https://portaldatransparencia.gov.br
**Documentação da API:** https://api.portaldatransparencia.gov.br/swagger-ui/index.html
**Portal do desenvolvedor:** https://portaldatransparencia.gov.br/api-de-dados

## Como acessar

### Autenticação

O acesso à API requer um **token (chave de API)** gratuito, obtido mediante cadastro no portal:

1. Acesse https://portaldatransparencia.gov.br/api-de-dados/cadastrar-email
2. Informe seu e-mail e confirme o cadastro
3. Você receberá um token por e-mail
4. Inclua o token no header de cada requisição: `chave-api-dados: SEU_TOKEN`

### Rate Limits

| Condição | Limite |
|----------|--------|
| Requisições por minuto | 30 |
| Requisições sem autenticação | Bloqueadas |
| Paginação máxima | 15.000 registros por página (parâmetro `pagina`) |

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

### Despesas e Execução Orçamentária

| Endpoint | Método | Descrição |
|----------|--------|-----------|
| `/despesas/recursos-recebidos` | GET | Recursos recebidos por órgão |
| `/despesas/por-orgao` | GET | Despesas agrupadas por órgão |
| `/despesas/documentos` | GET | Documentos de despesa (empenhos, liquidações, pagamentos) |
| `/despesas/documentos-por-favorecido` | GET | Despesas por favorecido (CPF/CNPJ) |

### Receitas

| Endpoint | Método | Descrição |
|----------|--------|-----------|
| `/receitas` | GET | Receitas do Governo Federal |
| `/receitas/por-orgao` | GET | Receitas agrupadas por órgão |

### Servidores Públicos

| Endpoint | Método | Descrição |
|----------|--------|-----------|
| `/servidores` | GET | Lista de servidores federais (ativos, aposentados, pensionistas) |
| `/servidores/remuneracao` | GET | Detalhamento de remuneração por servidor |
| `/servidores/{id}` | GET | Detalhes de um servidor específico |
| `/servidores/por-orgao` | GET | Servidores agrupados por órgão |

### Licitações e Contratos

| Endpoint | Método | Descrição |
|----------|--------|-----------|
| `/licitacoes` | GET | Licitações do Governo Federal |
| `/licitacoes/{id}` | GET | Detalhes de uma licitação |
| `/contratos` | GET | Contratos firmados |
| `/contratos/{id}` | GET | Detalhes de um contrato |

### Convênios e Transferências

| Endpoint | Método | Descrição |
|----------|--------|-----------|
| `/convenios` | GET | Convênios firmados entre entes |
| `/convenios/{id}` | GET | Detalhes de um convênio |
| `/transferencias/por-municipio` | GET | Transferências por município |

### Programas Sociais (Bolsa Família / Auxílio Brasil)

| Endpoint | Método | Descrição |
|----------|--------|-----------|
| `/bolsa-familia-por-municipio` | GET | Pagamentos do Bolsa Família por município |
| `/bolsa-familia-disponivel-por-cpf-ou-nis` | GET | Consulta por CPF ou NIS |
| `/auxilio-emergencial-por-municipio` | GET | Auxílio Emergencial por município |
| `/bpc-por-municipio` | GET | Benefício de Prestação Continuada (BPC) por município |
| `/novo-bolsa-familia-por-municipio` | GET | Novo Bolsa Família (Auxílio Brasil) por município |
| `/seguro-defeso-por-municipio` | GET | Seguro Defeso por município |

### Viagens a Serviço

| Endpoint | Método | Descrição |
|----------|--------|-----------|
| `/viagens` | GET | Viagens a serviço de servidores |
| `/viagens/por-orgao` | GET | Viagens agrupadas por órgão |

### Cartões de Pagamento

| Endpoint | Método | Descrição |
|----------|--------|-----------|
| `/cartoes` | GET | Gastos com cartões de pagamento do governo |

### Sanções e Penalidades

| Endpoint | Método | Descrição |
|----------|--------|-----------|
| `/ceis` | GET | Cadastro de Empresas Inidôneas e Suspensas |
| `/cnep` | GET | Cadastro Nacional de Empresas Punidas |
| `/cepim` | GET | Cadastro de Entidades Privadas Sem Fins Lucrativos Impedidas |
| `/ceaf` | GET | Cadastro de Expulsões da Administração Federal |
| `/acordos-leniencia` | GET | Acordos de Leniência |

### Parâmetros comuns

| Parâmetro | Tipo | Descrição |
|-----------|------|-----------|
| `pagina` | int | Número da página (começa em 1) |
| `dataInicio` | string | Data inicial no formato `DD/MM/AAAA` |
| `dataFim` | string | Data final no formato `DD/MM/AAAA` |
| `codigoOrgao` | string | Código SIAFI do órgão |
| `codigoMunicipio` | string | Código IBGE do município |
| `cpfCnpj` | string | CPF ou CNPJ do favorecido |
| `mesAno` | string | Mês/Ano no formato `YYYYMM` |

## Exemplo de uso

### Consultar despesas por órgão

```python
import requests
import pandas as pd

API_KEY = "SEU_TOKEN_AQUI"
BASE_URL = "https://api.portaldatransparencia.gov.br/api-de-dados"

headers = {
    "chave-api-dados": API_KEY,
    "Accept": "application/json",
}


def consultar_despesas_por_orgao(codigo_orgao: str, mes_ano: str, pagina: int = 1):
    """
    Consulta despesas de um órgão federal em determinado mês/ano.

    Args:
        codigo_orgao: Código SIAFI do órgão (ex: '26000' para MEC)
        mes_ano: Mês/Ano no formato YYYYMM (ex: '202401')
        pagina: Número da página para paginação

    Returns:
        Lista de registros de despesa em formato dict
    """
    url = f"{BASE_URL}/despesas/por-orgao"
    params = {
        "codigoOrgao": codigo_orgao,
        "mesAno": mes_ano,
        "pagina": pagina,
    }

    response = requests.get(url, headers=headers, params=params)
    response.raise_for_status()
    return response.json()


# Exemplo: Consultar despesas do Ministério da Educação (26000) em janeiro/2024
dados = consultar_despesas_por_orgao("26000", "202401")
df = pd.DataFrame(dados)
print(df.head())
```

### Consultar servidores por órgão

```python
def consultar_servidores(codigo_orgao: str, pagina: int = 1):
    """
    Lista servidores federais vinculados a um órgão.

    Args:
        codigo_orgao: Código SIAFI do órgão
        pagina: Número da página

    Returns:
        Lista de servidores
    """
    url = f"{BASE_URL}/servidores/por-orgao"
    params = {
        "codigoOrgao": codigo_orgao,
        "pagina": pagina,
    }

    response = requests.get(url, headers=headers, params=params)
    response.raise_for_status()
    return response.json()


servidores = consultar_servidores("26000")
for s in servidores[:5]:
    print(f"{s.get('nome', 'N/A')} - {s.get('cargo', 'N/A')}")
```

### Consultar empresas sancionadas (CEIS)

```python
def consultar_ceis(cnpj: str = None, pagina: int = 1):
    """
    Consulta o Cadastro de Empresas Inidôneas e Suspensas.

    Args:
        cnpj: CNPJ da empresa (opcional)
        pagina: Número da página

    Returns:
        Lista de sanções
    """
    url = f"{BASE_URL}/ceis"
    params = {"pagina": pagina}
    if cnpj:
        params["cnpjSancionado"] = cnpj

    response = requests.get(url, headers=headers, params=params)
    response.raise_for_status()
    return response.json()


# Consultar todas as empresas sancionadas (página 1)
sancoes = consultar_ceis()
df_sancoes = pd.DataFrame(sancoes)
print(f"Total de sanções na página: {len(df_sancoes)}")
print(df_sancoes[["cnpjSancionado", "nomeSancionado", "dataInicioSancao"]].head())
```

### Consultar Bolsa Família por município

```python
def consultar_bolsa_familia_municipio(codigo_ibge: str, mes_ano: str, pagina: int = 1):
    """
    Consulta pagamentos do Bolsa Família por município.

    Args:
        codigo_ibge: Código IBGE do município (ex: '3550308' para São Paulo)
        mes_ano: Mês/Ano no formato YYYYMM
        pagina: Número da página

    Returns:
        Dados de pagamentos do programa
    """
    url = f"{BASE_URL}/novo-bolsa-familia-por-municipio"
    params = {
        "codigoIbge": codigo_ibge,
        "mesAno": mes_ano,
        "pagina": pagina,
    }

    response = requests.get(url, headers=headers, params=params)
    response.raise_for_status()
    return response.json()


# Bolsa Família em São Paulo, janeiro/2024
bf = consultar_bolsa_familia_municipio("3550308", "202401")
print(f"Registros retornados: {len(bf)}")
```

## Campos disponíveis

### Despesas (documentos)

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | int | Identificador único do documento |
| `dataEmissao` | string | Data de emissão (DD/MM/AAAA) |
| `codigoOrgao` | string | Código SIAFI do órgão |
| `nomeOrgao` | string | Nome do órgão |
| `codigoUnidadeGestora` | string | Código da unidade gestora |
| `nomeUnidadeGestora` | string | Nome da unidade gestora |
| `codigoFavorecido` | string | CPF/CNPJ do favorecido |
| `nomeFavorecido` | string | Nome do favorecido |
| `valor` | float | Valor do documento |
| `codigoElementoDespesa` | string | Elemento de despesa |
| `fase` | string | Fase (Empenho, Liquidação, Pagamento) |

### Servidores

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | int | Identificador único |
| `cpf` | string | CPF (parcialmente ocultado) |
| `nome` | string | Nome completo do servidor |
| `codigoOrgaoExercicio` | string | Código do órgão de exercício |
| `nomeOrgaoExercicio` | string | Nome do órgão de exercício |
| `codigoOrgaoLotacao` | string | Código do órgão de lotação |
| `cargo` | string | Cargo ocupado |
| `funcao` | string | Função exercida |
| `situacaoVinculo` | string | Situação do vínculo (ativo, aposentado, etc.) |
| `remuneracaoBasica` | float | Remuneração básica bruta |
| `remuneracaoAposDeducoes` | float | Remuneração líquida |

### CEIS (Empresas Sancionadas)

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | int | Identificador único |
| `cnpjSancionado` | string | CNPJ da empresa sancionada |
| `nomeSancionado` | string | Razão social |
| `categoriaSancao` | string | Tipo de sanção |
| `dataInicioSancao` | string | Data de início da sanção |
| `dataFimSancao` | string | Data de fim da sanção |
| `orgaoSancionador` | string | Órgão que aplicou a sanção |
| `fundamentacaoLegal` | string | Base legal da sanção |

### Bolsa Família por município

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | int | Identificador único |
| `dataReferencia` | string | Mês/Ano de referência |
| `municipio.codigoIBGE` | string | Código IBGE do município |
| `municipio.nomeIBGE` | string | Nome do município |
| `municipio.uf.sigla` | string | Sigla da UF |
| `tipo` | string | Tipo de benefício |
| `quantidadeBeneficiados` | int | Número de beneficiados |
| `valor` | float | Valor total pago |

### Licitações

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | int | Identificador único |
| `dataAbertura` | string | Data de abertura |
| `dataResultado` | string | Data do resultado |
| `codigoOrgao` | string | Código SIAFI do órgão |
| `nomeOrgao` | string | Nome do órgão |
| `modalidadeCompra` | string | Modalidade (Pregão, Concorrência, etc.) |
| `situacao` | string | Situação da licitação |
| `objeto` | string | Descrição do objeto |
| `valorEstimado` | float | Valor estimado |

## Cruzamentos possíveis

O Portal da Transparência é uma das fontes mais ricas para cruzamento de dados públicos:

| Cruzamento | Fonte relacionada | Chave de ligação | Finalidade |
|------------|-------------------|------------------|------------|
| Despesas × CNPJ | [Receita Federal — CNPJ](/docs/apis/receita-federal/cnpj-completa) | `CNPJ` | Identificar sócios e natureza jurídica de favorecidos |
| Servidores × Candidaturas | [TSE — Candidaturas](/docs/apis/justica-eleitoral-tse/candidaturas) | `CPF` | Verificar se servidores foram candidatos |
| Servidores × Processos | [CNJ — DataJud](/docs/apis/poder-judiciario-cnj/datajud) | `CPF` | Cruzar servidores com processos judiciais |
| Sanções (CEIS) × CNPJ | [Receita Federal — CNPJ](/docs/apis/receita-federal/cnpj-completa) | `CNPJ` | Verificar quadro societário de empresas sancionadas |
| Transferências × Municípios | [IBGE — Censo Demográfico](/docs/apis/ibge-estatisticas/censo-demografico) | `Código IBGE` | Contextualizar transferências com dados demográficos |
| Despesas × SIAFI | [Tesouro Nacional — SIAFI](/docs/apis/tesouro-nacional/siafi) | `Código SIAFI` | Detalhar execução orçamentária |
| Bolsa Família × Previdência | [Benefícios INSS](/docs/apis/previdencia-social/beneficios-inss) | `CPF / NIS` | Verificar acúmulo de benefícios |

### Receita para cruzamento: Empresas sancionadas vs. licitações ativas

```python
import requests
import pandas as pd

API_KEY = "SEU_TOKEN_AQUI"
BASE_URL = "https://api.portaldatransparencia.gov.br/api-de-dados"
headers = {"chave-api-dados": API_KEY, "Accept": "application/json"}

# 1. Obter lista de empresas sancionadas (CEIS)
resp_ceis = requests.get(f"{BASE_URL}/ceis", headers=headers, params={"pagina": 1})
empresas_sancionadas = pd.DataFrame(resp_ceis.json())

# 2. Obter licitações recentes
resp_licit = requests.get(
    f"{BASE_URL}/licitacoes",
    headers=headers,
    params={"dataInicio": "01/01/2024", "dataFim": "31/01/2024", "pagina": 1},
)
licitacoes = pd.DataFrame(resp_licit.json())

# 3. Cruzar por CNPJ para identificar empresas sancionadas em licitações
if not empresas_sancionadas.empty and not licitacoes.empty:
    cruzamento = pd.merge(
        licitacoes,
        empresas_sancionadas[["cnpjSancionado", "nomeSancionado", "categoriaSancao"]],
        left_on="cnpjFornecedor",
        right_on="cnpjSancionado",
        how="inner",
    )
    print(f"Empresas sancionadas encontradas em licitações: {len(cruzamento)}")
    print(cruzamento[["nomeSancionado", "categoriaSancao", "objeto"]].head())
```

## Limitações conhecidas

| Limitação | Detalhes |
|-----------|----------|
| **Rate limit** | 30 requisições por minuto por token. Exceder esse limite resulta em HTTP 429. |
| **Paginação** | Resultados paginados; não há endpoint para obter a contagem total de registros em todas as consultas. |
| **Cobertura temporal** | Dados disponíveis a partir de 2013 para a maioria dos endpoints. Alguns conjuntos possuem dados a partir de 2004. |
| **CPF parcialmente ocultado** | Por determinação legal (LGPD), CPFs de servidores são retornados com dígitos parcialmente ocultados (`***.123.456-**`). |
| **Dados de municípios** | Alguns endpoints filtram apenas por código IBGE de 7 dígitos; outros aceitam 6 dígitos. Verificar a documentação Swagger de cada endpoint. |
| **Atualização** | Embora a frequência seja diária, alguns conjuntos (como convênios) podem ter atraso de até 7 dias. |
| **Tamanho da resposta** | Respostas muito grandes podem resultar em timeout. Recomenda-se sempre usar filtros de data e órgão. |
| **Disponibilidade** | A API pode apresentar instabilidade em horários de pico (9h-12h BRT). Implemente retry com backoff exponencial. |
| **Formato de data** | O formato de data nos parâmetros é `DD/MM/AAAA`, diferente do padrão ISO 8601. |
| **Sem suporte a bulk download** | Para downloads massivos, recomenda-se usar os arquivos CSV disponíveis em https://portaldatransparencia.gov.br/download-de-dados. |
