---
title: Portal Brasileiro de Dados Abertos
slug: portal-dados-abertos
orgao: Governo Federal (CGU / Secretaria de Governo Digital)
url_base: https://dados.gov.br/swagger-ui/index.html
tipo_acesso: CKAN
autenticacao: Não requerida
formato_dados: JSON, CSV, XML
frequencia_atualizacao: Variável (depende do órgão publicador)
campos_chave:
  - id do conjunto
  - slug do órgão
  - título do recurso
tags:
  - dados abertos
  - governo federal
  - CKAN
  - catálogo
  - metadados
  - transparência
  - open data
cruzamento_com:
  - receita-federal/cnpj-completa
  - ibge-estatisticas/censo-demografico
  - tesouro-nacional/siafi
  - justica-eleitoral-tse/candidaturas
status: documentado
---

# Portal Brasileiro de Dados Abertos

## O que é

O **Portal Brasileiro de Dados Abertos** (dados.gov.br) é o catálogo central de dados abertos do Governo Federal brasileiro. Gerenciado pela **Controladoria-Geral da União (CGU)** em conjunto com a **Secretaria de Governo Digital (SGD)**, o portal reúne milhares de conjuntos de dados publicados por órgãos e entidades da administração pública federal, estadual e municipal.

O portal funciona como um agregador de metadados — ele não armazena os dados em si, mas cataloga e referencia os recursos (arquivos CSV, APIs, planilhas) disponibilizados pelos órgãos publicadores. O portal implementa padrões compatíveis com o CKAN (Comprehensive Knowledge Archive Network) e oferece uma API para consulta programática ao catálogo.

**Site oficial:** https://dados.gov.br

## Como acessar

### Autenticação

A API pública do Portal de Dados Abertos **não requer autenticação** para consultas ao catálogo. Qualquer pessoa pode consultar os metadados dos conjuntos de dados disponíveis.

### URL Base

A partir da reformulação do portal (2021+), a API mudou de endereço. A URL atual é:

```
https://dados.gov.br/dados/api/publico
```

:::note
A API CKAN legada (`https://dados.gov.br/api/3/action/`) pode ainda funcionar para algumas consultas, mas a API atual (listada acima) é a recomendada.
:::

### Rate Limits

| Condição | Limite |
|----------|--------|
| Autenticação | Não requerida |
| Rate limit explícito | Não documentado oficialmente; recomenda-se no máximo 60 req/min |

## Endpoints/recursos principais

### API atual (dados.gov.br)

| Endpoint | Método | Descrição |
|----------|--------|-----------|
| `/conjuntos-dados` | GET | Lista conjuntos de dados com filtros |
| `/conjuntos-dados/{id}` | GET | Detalhes de um conjunto de dados |
| `/conjuntos-dados/{id}/recursos` | GET | Lista recursos (arquivos/APIs) de um conjunto |
| `/organizacoes` | GET | Lista organizações (órgãos) publicadores |
| `/organizacoes/{id}` | GET | Detalhes de uma organização |
| `/grupos` | GET | Lista grupos temáticos |

### Parâmetros de consulta comuns

| Parâmetro | Tipo | Descrição |
|-----------|------|-----------|
| `pagina` | int | Número da página |
| `tamanhoPagina` | int | Quantidade de resultados por página |
| `titulo` | string | Filtrar por título do conjunto |
| `organizacaoId` | string | Filtrar por organização publicadora |
| `grupoId` | string | Filtrar por grupo temático |
| `formatoRecurso` | string | Filtrar por formato (CSV, JSON, XML, etc.) |

## Exemplo de uso

### Buscar conjuntos de dados por tema

```python
import requests
import pandas as pd

BASE_URL = "https://dados.gov.br/dados/api/publico"


def listar_conjuntos(titulo: str = None, pagina: int = 1, tamanho: int = 20):
    """
    Lista conjuntos de dados do Portal de Dados Abertos.

    Args:
        titulo: Termo de busca no título (opcional)
        pagina: Número da página
        tamanho: Quantidade de resultados por página

    Returns:
        Lista de conjuntos de dados
    """
    url = f"{BASE_URL}/conjuntos-dados"
    params = {
        "pagina": pagina,
        "tamanhoPagina": tamanho,
    }
    if titulo:
        params["titulo"] = titulo

    response = requests.get(url, params=params)
    response.raise_for_status()
    return response.json()


# Buscar conjuntos relacionados a "saúde"
resultado = listar_conjuntos(titulo="saúde")
conjuntos = resultado.get("registros", resultado)

if isinstance(conjuntos, list):
    for c in conjuntos[:5]:
        print(f"- {c.get('titulo', 'N/A')}")
        print(f"  Org: {c.get('organizacao', {}).get('nome', 'N/A')}")
        print()
```

### Obter recursos de um conjunto de dados

```python
def obter_recursos(conjunto_id: str):
    """
    Obtém os recursos (arquivos, APIs) vinculados a um conjunto de dados.

    Args:
        conjunto_id: ID do conjunto de dados

    Returns:
        Lista de recursos disponíveis
    """
    url = f"{BASE_URL}/conjuntos-dados/{conjunto_id}/recursos"
    response = requests.get(url)
    response.raise_for_status()
    return response.json()


# Exemplo: obter recursos de um conjunto específico
# (substitua pelo ID real obtido na busca anterior)
recursos = obter_recursos("exemplo-id-do-conjunto")
for r in recursos:
    print(f"Título: {r.get('titulo', 'N/A')}")
    print(f"Formato: {r.get('formato', 'N/A')}")
    print(f"URL: {r.get('link', 'N/A')}")
    print()
```

### Download direto de um recurso CSV

```python
def baixar_recurso_csv(url_recurso: str) -> pd.DataFrame:
    """
    Faz download de um recurso CSV e retorna como DataFrame.

    Args:
        url_recurso: URL direta do arquivo CSV

    Returns:
        DataFrame com os dados
    """
    df = pd.read_csv(url_recurso, sep=";", encoding="latin-1")
    return df


# Exemplo de uso (substitua pela URL real do recurso)
# df = baixar_recurso_csv("https://dados.gov.br/.../arquivo.csv")
# print(df.head())
```

## Campos disponíveis

### Conjunto de dados (metadados)

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | string | Identificador único do conjunto |
| `titulo` | string | Título do conjunto de dados |
| `descricao` | string | Descrição detalhada |
| `organizacao.nome` | string | Nome do órgão publicador |
| `organizacao.sigla` | string | Sigla do órgão |
| `temas` | list | Lista de temas/categorias |
| `tags` | list | Palavras-chave |
| `frequenciaAtualizacao` | string | Frequência de atualização declarada |
| `dataCriacao` | string | Data de criação no portal |
| `dataUltimaAtualizacao` | string | Data da última atualização |

### Recurso (arquivo/link)

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | string | Identificador do recurso |
| `titulo` | string | Título do recurso |
| `descricao` | string | Descrição do recurso |
| `formato` | string | Formato do arquivo (CSV, JSON, XML, etc.) |
| `link` | string | URL para download/acesso |
| `tamanho` | int | Tamanho do arquivo em bytes |

## Cruzamentos possíveis

O Portal de Dados Abertos é essencialmente um **catálogo de metadados**. Os cruzamentos mais relevantes são feitos com os dados acessados por meio dos recursos catalogados:

| Cruzamento | Fonte relacionada | Chave de ligação | Finalidade |
|------------|-------------------|------------------|------------|
| Conjuntos de dados × CNPJ | [Receita Federal — CNPJ](/docs/apis/receita-federal/cnpj-completa) | `CNPJ` | Identificar dados sobre empresas em conjuntos abertos |
| Conjuntos de dados × IBGE | [IBGE — Censo Demográfico](/docs/apis/ibge-estatisticas/censo-demografico) | `Código IBGE` | Contextualizar dados com informações geográficas |
| Conjuntos de dados × Transparência | [Portal da Transparência](/docs/apis/portais-centrais/portal-transparencia) | Variável | Complementar dados de gastos e servidores |
| Conjuntos de dados × TSE | [TSE — Candidaturas](/docs/apis/justica-eleitoral-tse/candidaturas) | `CPF` | Cruzar dados eleitorais com bases abertas |

## Limitações conhecidas

| Limitação | Detalhes |
|-----------|----------|
| **Catálogo, não repositório** | O portal é um agregador de metadados. Os dados em si estão nos servidores dos órgãos publicadores, que podem ficar indisponíveis. |
| **Qualidade variável** | A qualidade, formato e completude dos dados dependem de cada órgão publicador. Não há padronização estrita. |
| **Links quebrados** | Alguns recursos possuem URLs desatualizadas ou indisponíveis, especialmente de órgãos que reformularam seus sites. |
| **API em evolução** | A API do portal foi reformulada em 2021 e pode sofrer alterações. A documentação oficial nem sempre está atualizada. |
| **Sem API de dados** | O portal não oferece API para consultar o conteúdo dos dados — apenas metadados do catálogo. O acesso aos dados requer download do recurso. |
| **Encoding** | Muitos arquivos CSV usam encoding `latin-1` (ISO-8859-1) e separador `;`, o que pode exigir tratamento especial ao importar. |
| **Paginação** | A paginação pode não funcionar consistentemente em todas as rotas da API. |
