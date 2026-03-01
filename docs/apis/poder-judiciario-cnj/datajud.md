---
title: DataJud — Base Nacional de Processos Judiciais
slug: datajud
orgao: CNJ
url_base: https://datajud-wiki.cnj.jus.br/
tipo_acesso: API REST
autenticacao: API Key (cadastro no portal do CNJ)
formato_dados: [JSON]
frequencia_atualizacao: Diária
campos_chave:
  - numero_processo
  - CPF
  - CNPJ
  - classe_processual
  - orgao_julgador
  - movimentacao
tags:
  - processos judiciais
  - poder judiciário
  - CNJ
  - DataJud
  - movimentações
  - partes
  - decisões
  - MNI
  - justiça
cruzamento_com:
  - receita-federal/cnpj-completa
  - receita-federal/qsa
  - transparencia-cgu/servidores-federais
  - transparencia-cgu/ceis
  - justica-eleitoral-tse/candidaturas
  - poder-judiciario-cnj/bnmp
  - poder-judiciario-cnj/sisbajud
status: documentado
---

# DataJud — Base Nacional de Processos Judiciais

## O que é

O **DataJud** é a base nacional de dados do Poder Judiciário brasileiro, mantida pelo **Conselho Nacional de Justiça (CNJ)**. Trata-se do maior repositório unificado de dados processuais do país, consolidando informações de processos judiciais de todos os ramos da Justiça: Estadual, Federal, Trabalhista, Eleitoral e Militar.

O sistema reúne dados de movimentações processuais, partes envolvidas (autores, réus, advogados), decisões, classes e assuntos processuais, seguindo o **Modelo Nacional de Interoperabilidade (MNI)** — padrão definido pelo CNJ para uniformizar a troca de informações entre os tribunais brasileiros.

A API do DataJud permite consultar:

- **Movimentações processuais** — andamento cronológico de cada processo
- **Partes e advogados** — autores, réus, terceiros interessados e representantes legais
- **Decisões e sentenças** — dispositivos decisórios com classificação padronizada
- **Classes e assuntos processuais** — tipologia do processo conforme Tabelas Processuais Unificadas (TPU)
- **Dados do órgão julgador** — vara, comarca, tribunal

O DataJud é regulamentado pela **Resolução CNJ nº 331/2020** e suas atualizações, que determinam a remessa obrigatória de dados por todos os tribunais do país.

> **Importante:** O DataJud disponibiliza dados estruturados de processos judiciais, mas nem todas as informações são públicas. Processos em segredo de justiça têm acesso restrito.

## Como acessar

### Autenticação

O acesso à API requer cadastro e obtenção de chave de API:

1. Acesse a documentação em `https://datajud-wiki.cnj.jus.br/`
2. Realize o cadastro conforme as instruções do portal
3. Obtenha sua chave de acesso (API Key)
4. Inclua a chave no header de cada requisição: `Authorization: APIKey SEU_TOKEN`

### Informações de acesso

| Item | Detalhe |
|---|---|
| **Documentação** | `https://datajud-wiki.cnj.jus.br/` |
| **Tipo de acesso** | API REST (Elasticsearch) |
| **Autenticação** | API Key (obtida via cadastro) |
| **Rate limit** | Definido por perfil de acesso |
| **Formato de resposta** | JSON |

### Headers obrigatórios

```http
Authorization: APIKey SEU_TOKEN_AQUI
Content-Type: application/json
```

### Estrutura da API

A API do DataJud é baseada em **Elasticsearch**, permitindo consultas complexas com filtros, agregações e ordenações. As requisições são feitas via método `POST` com corpo JSON contendo a query Elasticsearch.

## Endpoints/recursos principais

| Endpoint | Método | Descrição |
|---|---|---|
| `/api_publica_tjsp/_search` | POST | Buscar processos do Tribunal de Justiça de São Paulo |
| `/api_publica_tjrj/_search` | POST | Buscar processos do Tribunal de Justiça do Rio de Janeiro |
| `/api_publica_trf1/_search` | POST | Buscar processos do TRF da 1ª Região |
| `/api_publica_trt2/_search` | POST | Buscar processos do TRT da 2ª Região (SP) |
| `/api_publica_{sigla_tribunal}/_search` | POST | Buscar processos de qualquer tribunal (substituir pela sigla) |

### Siglas dos tribunais

Cada tribunal possui um índice próprio na API. Exemplos:

| Sigla | Tribunal |
|---|---|
| `tjsp` | Tribunal de Justiça de São Paulo |
| `tjrj` | Tribunal de Justiça do Rio de Janeiro |
| `tjmg` | Tribunal de Justiça de Minas Gerais |
| `trf1` | TRF da 1ª Região |
| `trf3` | TRF da 3ª Região |
| `trt2` | TRT da 2ª Região |
| `trt15` | TRT da 15ª Região |
| `stf` | Supremo Tribunal Federal |
| `stj` | Superior Tribunal de Justiça |
| `tst` | Tribunal Superior do Trabalho |

### Parâmetros de consulta (Elasticsearch Query DSL)

A API aceita queries no formato Elasticsearch. Os principais campos filtráveis são:

| Campo | Tipo | Descrição |
|---|---|---|
| `numeroProcesso` | string | Número unificado do processo (formato CNJ: NNNNNNN-DD.AAAA.J.TR.OOOO) |
| `classe.codigo` | int | Código da classe processual (conforme TPU) |
| `classe.nome` | string | Nome da classe processual |
| `assuntos.codigo` | int | Código do assunto (conforme TPU) |
| `orgaoJulgador.codigoMunicipioIBGE` | int | Código IBGE do município da vara |
| `dataAjuizamento` | date | Data de ajuizamento do processo |
| `movimentos.dataHora` | datetime | Data e hora de uma movimentação |
| `movimentos.codigo` | int | Código da movimentação (conforme TPU) |

## Exemplo de uso

### Consultar processos por número

```python
import requests

API_KEY = "SEU_TOKEN_AQUI"
BASE_URL = "https://api-publica.datajud.cnj.jus.br"

headers = {
    "Authorization": f"APIKey {API_KEY}",
    "Content-Type": "application/json",
}


def buscar_processo(tribunal: str, numero_processo: str) -> dict:
    """
    Busca um processo pelo número unificado (CNJ).

    Args:
        tribunal: Sigla do tribunal (ex: 'tjsp', 'trf1')
        numero_processo: Número do processo (formato CNJ)

    Returns:
        Dados do processo em formato dict
    """
    url = f"{BASE_URL}/api_publica_{tribunal}/_search"

    query = {
        "query": {
            "match": {
                "numeroProcesso": numero_processo,
            }
        }
    }

    response = requests.post(url, headers=headers, json=query)
    response.raise_for_status()
    resultado = response.json()

    hits = resultado.get("hits", {}).get("hits", [])
    if hits:
        return hits[0]["_source"]
    return {}


# Exemplo: buscar processo no TJSP
processo = buscar_processo("tjsp", "1234567-89.2023.8.26.0100")
if processo:
    print(f"Classe: {processo.get('classe', {}).get('nome', 'N/A')}")
    print(f"Ajuizamento: {processo.get('dataAjuizamento', 'N/A')}")
    print(f"Órgão julgador: {processo.get('orgaoJulgador', {}).get('nome', 'N/A')}")
```

### Buscar processos por classe processual e período

```python
def buscar_por_classe_e_periodo(
    tribunal: str,
    codigo_classe: int,
    data_inicio: str,
    data_fim: str,
    tamanho: int = 10,
) -> list:
    """
    Busca processos por classe processual e período de ajuizamento.

    Args:
        tribunal: Sigla do tribunal
        codigo_classe: Código da classe processual (TPU)
        data_inicio: Data inicial (formato YYYY-MM-DD)
        data_fim: Data final (formato YYYY-MM-DD)
        tamanho: Número máximo de resultados

    Returns:
        Lista de processos
    """
    url = f"{BASE_URL}/api_publica_{tribunal}/_search"

    query = {
        "size": tamanho,
        "query": {
            "bool": {
                "must": [
                    {"match": {"classe.codigo": codigo_classe}},
                    {
                        "range": {
                            "dataAjuizamento": {
                                "gte": data_inicio,
                                "lte": data_fim,
                            }
                        }
                    },
                ]
            }
        },
        "sort": [{"dataAjuizamento": {"order": "desc"}}],
    }

    response = requests.post(url, headers=headers, json=query)
    response.raise_for_status()
    resultado = response.json()

    return [hit["_source"] for hit in resultado.get("hits", {}).get("hits", [])]


# Exemplo: buscar ações civis públicas (classe 65) no TRF1 em 2023
processos = buscar_por_classe_e_periodo(
    tribunal="trf1",
    codigo_classe=65,
    data_inicio="2023-01-01",
    data_fim="2023-12-31",
    tamanho=5,
)

for p in processos:
    print(f"Processo: {p['numeroProcesso']}")
    print(f"  Classe: {p['classe']['nome']}")
    print(f"  Ajuizamento: {p['dataAjuizamento']}")
    print(f"  Órgão: {p['orgaoJulgador']['nome']}")
    print()
```

### Listar movimentações de um processo

```python
def listar_movimentacoes(tribunal: str, numero_processo: str) -> list:
    """
    Lista as movimentações de um processo.

    Args:
        tribunal: Sigla do tribunal
        numero_processo: Número do processo (formato CNJ)

    Returns:
        Lista de movimentações ordenadas por data
    """
    processo = buscar_processo(tribunal, numero_processo)
    if not processo:
        print("Processo não encontrado.")
        return []

    movimentos = processo.get("movimentos", [])
    # Ordenar por data (mais recente primeiro)
    movimentos.sort(key=lambda m: m.get("dataHora", ""), reverse=True)
    return movimentos


# Exemplo
movimentos = listar_movimentacoes("tjsp", "1234567-89.2023.8.26.0100")
for mov in movimentos[:10]:
    print(f"{mov.get('dataHora', 'N/A')} — {mov.get('nome', 'N/A')}")
```

## Campos disponíveis

### Estrutura principal do processo

| Campo | Tipo | Descrição |
|---|---|---|
| `numeroProcesso` | string | Número unificado do processo (formato CNJ) |
| `classe.codigo` | int | Código da classe processual (TPU) |
| `classe.nome` | string | Nome da classe processual |
| `sistema.codigo` | int | Código do sistema processual |
| `sistema.nome` | string | Nome do sistema processual |
| `formato.codigo` | int | Código do formato (físico ou eletrônico) |
| `formato.nome` | string | Nome do formato |
| `tribunal` | string | Sigla do tribunal |
| `dataAjuizamento` | date | Data de ajuizamento |
| `grau` | string | Grau de jurisdição (G1, G2, JE, TR) |
| `nivelSigilo` | int | Nível de sigilo do processo |

### Órgão julgador

| Campo | Tipo | Descrição |
|---|---|---|
| `orgaoJulgador.codigo` | int | Código do órgão julgador |
| `orgaoJulgador.nome` | string | Nome da vara/turma/câmara |
| `orgaoJulgador.codigoMunicipioIBGE` | int | Código IBGE do município |
| `orgaoJulgador.municipio` | string | Nome do município |

### Assuntos

| Campo | Tipo | Descrição |
|---|---|---|
| `assuntos[].codigo` | int | Código do assunto (TPU) |
| `assuntos[].nome` | string | Descrição do assunto |
| `assuntos[].principal` | boolean | Se é o assunto principal |

### Movimentações

| Campo | Tipo | Descrição |
|---|---|---|
| `movimentos[].codigo` | int | Código da movimentação (TPU) |
| `movimentos[].nome` | string | Nome da movimentação |
| `movimentos[].dataHora` | datetime | Data e hora da movimentação |
| `movimentos[].complemento` | string | Complemento textual |

## Cruzamentos possíveis

| Cruzamento | Fonte relacionada | Chave de ligação | Finalidade |
|---|---|---|---|
| Processos x Empresas | [Receita Federal — CNPJ](/docs/apis/receita-federal/cnpj-completa) | `CNPJ` (partes do processo) | Identificar empresas envolvidas em litígios e sua situação cadastral |
| Processos x Sócios | [Receita Federal — QSA](/docs/apis/receita-federal/qsa) | `CNPJ` → sócios | Mapear sócios de empresas litigantes |
| Processos x Servidores | [CGU — Servidores Federais](/docs/apis/transparencia-cgu/servidores-federais) | `CPF` (partes) | Identificar servidores públicos envolvidos em ações judiciais |
| Processos x Sanções | [CGU — CEIS](/docs/apis/transparencia-cgu/ceis) | `CNPJ` / `CPF` | Correlacionar processos judiciais com sanções administrativas |
| Processos x Candidatos | [TSE — Candidaturas](/docs/apis/justica-eleitoral-tse/candidaturas) | `CPF` | Verificar processos judiciais de candidatos a cargos eletivos |
| Processos x Mandados | [BNMP](/docs/apis/poder-judiciario-cnj/bnmp) | `numero_processo` | Verificar mandados de prisão vinculados a processos |
| Processos x Bloqueios | [SISBAJUD](/docs/apis/poder-judiciario-cnj/sisbajud) | `numero_processo` | Relacionar bloqueios judiciais de contas com processos |

### Exemplo de cruzamento: processos judiciais de empresas sancionadas

```python
import requests
import pandas as pd

# 1. Obter empresas sancionadas no CEIS
API_KEY_CGU = "SEU_TOKEN_CGU"
resp_ceis = requests.get(
    "https://api.portaldatransparencia.gov.br/api-de-dados/ceis",
    headers={"chave-api-dados": API_KEY_CGU, "Accept": "application/json"},
    params={"pagina": 1},
)
sancionadas = resp_ceis.json()

# 2. Para cada empresa sancionada, buscar processos no DataJud
API_KEY_DATAJUD = "SEU_TOKEN_DATAJUD"
headers_dj = {
    "Authorization": f"APIKey {API_KEY_DATAJUD}",
    "Content-Type": "application/json",
}

resultados = []
for empresa in sancionadas[:5]:  # Limitar para exemplo
    cnpj = empresa.get("cnpjSancionado", "")
    if not cnpj:
        continue

    # Buscar no TJSP (exemplo — adaptar para outros tribunais)
    query = {
        "size": 5,
        "query": {
            "match": {"numeroProcesso": cnpj}
        }
    }
    resp = requests.post(
        "https://api-publica.datajud.cnj.jus.br/api_publica_tjsp/_search",
        headers=headers_dj,
        json=query,
    )
    if resp.status_code == 200:
        hits = resp.json().get("hits", {}).get("hits", [])
        for hit in hits:
            proc = hit["_source"]
            resultados.append({
                "cnpj_sancionado": cnpj,
                "nome_sancionado": empresa.get("nomeSancionado"),
                "numero_processo": proc.get("numeroProcesso"),
                "classe": proc.get("classe", {}).get("nome"),
                "ajuizamento": proc.get("dataAjuizamento"),
            })

df = pd.DataFrame(resultados)
print(f"Processos encontrados para empresas sancionadas: {len(df)}")
if not df.empty:
    print(df.head())
```

## Limitações conhecidas

| Limitação | Detalhes |
|---|---|
| **Cobertura variável por tribunal** | Nem todos os tribunais enviam dados com a mesma qualidade e tempestividade. Alguns podem ter atraso na remessa de dados ao DataJud. |
| **Processos em segredo de justiça** | Processos sigilosos não estão disponíveis na API pública. Apenas metadados mínimos podem aparecer. |
| **Dados de partes limitados** | Informações pessoais das partes (CPF, nome completo) podem estar parcialmente ocultadas por questões de proteção de dados (LGPD). |
| **Formato Elasticsearch** | A API usa Elasticsearch Query DSL, o que exige familiaridade com essa sintaxe para consultas avançadas. |
| **Rate limit por perfil** | O volume de consultas permitido depende do perfil de acesso concedido pelo CNJ. Perfis de pesquisa acadêmica podem ter limites diferentes de perfis institucionais. |
| **Padronização em andamento** | Apesar do MNI, ainda há inconsistências na codificação de classes, assuntos e movimentações entre tribunais diferentes. |
| **Sem dados financeiros** | O DataJud não inclui valores de causa ou condenações de forma padronizada em todos os tribunais. |
| **Disponibilidade** | A API pode apresentar instabilidade em períodos de alta demanda. Implementar retry com backoff exponencial. |
| **Documentação em evolução** | A documentação da API no wiki do DataJud é atualizada periodicamente; verificar sempre a versão mais recente. |
