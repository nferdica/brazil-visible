---
title: CEIS — Cadastro de Empresas Inidôneas e Suspensas
slug: ceis
orgao: CGU
url_base: https://api.portaldatransparencia.gov.br/swagger-ui/index.html
tipo_acesso: API REST
autenticacao: API Key
formato_dados: JSON
frequencia_atualizacao: Diária
campos_chave:
  - CNPJ
  - CPF
  - orgao_sancionador
  - data_inicio_sancao
  - data_fim_sancao
tags:
  - sanções
  - empresas inidôneas
  - empresas suspensas
  - CEIS
  - licitações
  - transparência
  - anticorrupção
cruzamento_com:
  - receita-federal/cnpj-completa
  - transparencia-cgu/contratos-federais
  - transparencia-cgu/cnep
  - transparencia-cgu/cepim
  - justica-eleitoral-tse/candidaturas
status: documentado
---

# CEIS — Cadastro de Empresas Inidôneas e Suspensas

## O que é

O **CEIS (Cadastro Nacional de Empresas Inidôneas e Suspensas)** é um banco de dados mantido pela **Controladoria-Geral da União (CGU)** que consolida a relação de empresas e pessoas físicas que sofreram sanções que as tornam impedidas de participar de licitações ou celebrar contratos com a Administração Pública.

O CEIS reúne informações de todos os entes federativos (federal, estadual e municipal) e é uma das ferramentas mais importantes para prevenir a contratação de empresas com histórico de irregularidades. As sanções incluem:

- **Declaração de inidoneidade** (Lei 8.666/93, art. 87, IV — largamente substituida pela Lei 14.133/2021, Nova Lei de Licitacoes)
- **Suspensão temporária** de participação em licitações (Lei 8.666/93, art. 87, III — largamente substituida pela Lei 14.133/2021)
- **Impedimento** de licitar e contratar (Lei 10.520/02, art. 7 — largamente substituida pela Lei 14.133/2021)

O CEIS, junto com o CNEP, CEPIM e CEAF, forma o conjunto de **cadastros de sanções** do Portal da Transparência, essencial para detectar empresas e pessoas envolvidas em corrupção.

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
| `/ceis` | GET | Lista empresas e pessoas sancionadas |
| `/ceis/{id}` | GET | Detalhes de uma sanção específica |

### Parâmetros de consulta — `/ceis`

| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-------------|-----------|
| `cnpjSancionado` | string | Não | CNPJ da empresa sancionada |
| `cpfSancionado` | string | Não | CPF da pessoa física sancionada |
| `nomeSancionado` | string | Não | Nome/razão social (busca parcial) |
| `codigoOrgaoSancionador` | string | Não | Código do órgão que aplicou a sanção |
| `dataInicialSancao` | string | Não | Data inicial da sanção (`DD/MM/AAAA`) |
| `dataFinalSancao` | string | Não | Data final da sanção (`DD/MM/AAAA`) |
| `pagina` | int | Não | Número da página (começa em 1) |

## Exemplo de uso

### Consultar empresas sancionadas

```python
import requests
import pandas as pd

API_KEY = "SEU_TOKEN_AQUI"
BASE_URL = "https://api.portaldatransparencia.gov.br/api-de-dados"

headers = {
    "chave-api-dados": API_KEY,
    "Accept": "application/json",
}


def consultar_ceis(
    cnpj: str = None,
    nome: str = None,
    pagina: int = 1,
):
    """
    Consulta o Cadastro de Empresas Inidôneas e Suspensas.

    Args:
        cnpj: CNPJ da empresa (opcional)
        nome: Nome/razão social para busca parcial (opcional)
        pagina: Número da página

    Returns:
        Lista de sanções em formato dict
    """
    url = f"{BASE_URL}/ceis"
    params = {"pagina": pagina}
    if cnpj:
        params["cnpjSancionado"] = cnpj
    if nome:
        params["nomeSancionado"] = nome

    response = requests.get(url, headers=headers, params=params)
    response.raise_for_status()
    return response.json()


# Exemplo: listar todas as sanções (página 1)
sancoes = consultar_ceis()
df = pd.DataFrame(sancoes)
print(f"Sanções retornadas: {len(df)}")
print(df[["cnpjSancionado", "nomeSancionado", "categoriaSancao", "dataInicioSancao"]].head())
```

### Verificar se uma empresa específica está sancionada

```python
def verificar_empresa(cnpj: str):
    """
    Verifica se uma empresa consta no CEIS.

    Args:
        cnpj: CNPJ da empresa (apenas números)

    Returns:
        True se a empresa estiver sancionada, False caso contrário
    """
    resultado = consultar_ceis(cnpj=cnpj)
    if resultado:
        print(f"ALERTA: Empresa {cnpj} encontrada no CEIS!")
        for s in resultado:
            print(f"  Sanção: {s.get('categoriaSancao', 'N/A')}")
            print(f"  Início: {s.get('dataInicioSancao', 'N/A')}")
            print(f"  Fim: {s.get('dataFimSancao', 'N/A')}")
            print(f"  Órgão sancionador: {s.get('orgaoSancionador', 'N/A')}")
        return True
    else:
        print(f"Empresa {cnpj} NÃO consta no CEIS.")
        return False


# Verificar uma empresa
verificar_empresa("00000000000191")
```

### Verificar múltiplos CNPJs em lote

```python
import time


def verificar_lote_cnpjs(cnpjs: list):
    """
    Verifica uma lista de CNPJs contra o CEIS.

    Args:
        cnpjs: Lista de CNPJs para verificar

    Returns:
        DataFrame com resultados
    """
    resultados = []
    for cnpj in cnpjs:
        sancoes = consultar_ceis(cnpj=cnpj)
        if sancoes:
            for s in sancoes:
                resultados.append({
                    "cnpj": cnpj,
                    "nome": s.get("nomeSancionado"),
                    "categoria": s.get("categoriaSancao"),
                    "inicio": s.get("dataInicioSancao"),
                    "fim": s.get("dataFimSancao"),
                    "orgao": s.get("orgaoSancionador"),
                })
        time.sleep(2)  # Respeitar rate limit de 30 req/min

    return pd.DataFrame(resultados)


# Exemplo: verificar uma lista de fornecedores
fornecedores = ["00000000000191", "33000167000101", "00360305000104"]
df_sancoes = verificar_lote_cnpjs(fornecedores)
print(f"Fornecedores sancionados encontrados: {len(df_sancoes)}")
```

## Campos disponíveis

### Listagem (`/ceis`)

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | int | Identificador único da sanção |
| `cnpjSancionado` | string | CNPJ da empresa sancionada |
| `cpfSancionado` | string | CPF da pessoa física sancionada (quando aplicável) |
| `nomeSancionado` | string | Nome ou razão social do sancionado |
| `categoriaSancao` | string | Tipo de sanção (inidoneidade, suspensão, impedimento) |
| `dataInicioSancao` | string | Data de início da sanção |
| `dataFimSancao` | string | Data de fim da sanção (pode ser nulo se indeterminado) |
| `orgaoSancionador` | string | Órgão que aplicou a sanção |
| `ufOrgaoSancionador` | string | UF do órgão sancionador |
| `fundamentacaoLegal` | string | Base legal da sanção |
| `fonteInformacao` | string | Origem da informação (federal, estadual, municipal) |
| `dataPublicacao` | string | Data de publicação no DOU ou equivalente |

### Detalhes (`/ceis/{id}`)

Inclui todos os campos da listagem, mais:

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `processo` | string | Número do processo administrativo |
| `detalhamento` | string | Descrição adicional da sanção |
| `abrangenciaDecisao` | string | Abrangência (federal, estadual, municipal) |

## Cruzamentos possíveis

| Cruzamento | Fonte relacionada | Chave de ligação | Finalidade |
|------------|-------------------|------------------|------------|
| CEIS x CNPJ | [Receita Federal — CNPJ](/docs/apis/receita-federal/cnpj-completa) | `CNPJ` | Identificar sócios e quadro societário de empresas sancionadas |
| CEIS x Contratos | [Contratos Federais](/docs/apis/transparencia-cgu/contratos-federais) | `CNPJ` | Detectar contratos vigentes com empresas sancionadas |
| CEIS x CNEP | [CNEP](/docs/apis/transparencia-cgu/cnep) | `CNPJ` | Verificar se empresa tem sanções em ambos os cadastros |
| CEIS x CEPIM | [CEPIM](/docs/apis/transparencia-cgu/cepim) | `CNPJ` | Identificar entidades sem fins lucrativos também impedidas |
| CEIS x Candidaturas | [TSE — Candidaturas](/docs/apis/justica-eleitoral-tse/candidaturas) | `CNPJ / CPF` | Verificar se sócios de empresas sancionadas são doadores de campanha |
| CEIS x Licitações | Portal da Transparência | `CNPJ` | Identificar participação irregular em processos licitatórios |

### Receita: cruzar CEIS com contratos vigentes

```python
import requests
import pandas as pd

API_KEY = "SEU_TOKEN_AQUI"
BASE_URL = "https://api.portaldatransparencia.gov.br/api-de-dados"
headers = {"chave-api-dados": API_KEY, "Accept": "application/json"}

# 1. Obter empresas sancionadas
resp_ceis = requests.get(
    f"{BASE_URL}/ceis", headers=headers, params={"pagina": 1}
)
sancionadas = pd.DataFrame(resp_ceis.json())

# 2. Obter contratos recentes
resp_contratos = requests.get(
    f"{BASE_URL}/contratos",
    headers=headers,
    params={"dataInicial": "01/01/2024", "dataFinal": "31/03/2024", "pagina": 1},
)
contratos = pd.DataFrame(resp_contratos.json())

# 3. Cruzar: fornecedores de contratos que estão no CEIS
if not sancionadas.empty and not contratos.empty:
    cruzamento = pd.merge(
        contratos,
        sancionadas[["cnpjSancionado", "nomeSancionado", "categoriaSancao"]],
        left_on="cnpjContratado",
        right_on="cnpjSancionado",
        how="inner",
    )
    if not cruzamento.empty:
        print(f"ALERTA: {len(cruzamento)} contratos com empresas sancionadas!")
        print(cruzamento[["numero", "nomeSancionado", "categoriaSancao", "valorInicial"]])
    else:
        print("Nenhum contrato com empresa sancionada encontrado nesta amostra.")
```

## Limitações conhecidas

| Limitação | Detalhes |
|-----------|----------|
| **Rate limit** | 90 requisições por minuto (6h-24h) / 300 requisições por minuto (0h-6h) por token. Exceder resulta em HTTP 429. |
| **Sanções vigentes vs. históricas** | A API retorna tanto sanções vigentes quanto expiradas. Filtre por `dataFimSancao` para obter apenas as ativas. |
| **Cobertura subnacional** | Embora o CEIS consolide sanções de todos os entes, a adesão de estados e municípios é voluntária; nem todos informam suas sanções regularmente. |
| **CNPJs baixados** | Empresas sancionadas podem ter CNPJ baixado na Receita Federal, dificultando a consulta do quadro societário atual. |
| **Paginação** | Resultados paginados; para verificação completa é necessário iterar todas as páginas. |
| **Pessoa física** | Sanções a pessoas físicas utilizam CPF parcialmente ocultado, limitando o cruzamento direto. |
| **Atualização** | Embora a frequência seja diária, sanções aplicadas por entes subnacionais podem ter defasagem maior. |
| **Disponibilidade** | A API pode apresentar instabilidade em horários de pico (9h-12h BRT). Implemente retry com backoff exponencial. |
