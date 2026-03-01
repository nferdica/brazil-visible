---
title: Base dos Dados
slug: base-dos-dados
orgao: Base dos Dados (Iniciativa Privada / ONG)
url_base: https://basedosdados.org/api/3/action
tipo_acesso: API REST
autenticacao: API Key
formato_dados: JSON, CSV
frequencia_atualizacao: Variável (depende do conjunto)
campos_chave:
  - dataset_id
  - table_id
  - id_municipio
  - ano
  - sigla_uf
  - CNPJ
  - CPF
tags:
  - dados abertos
  - BigQuery
  - data lake
  - dados tratados
  - cruzamento de bases
  - Python
  - SQL
  - iniciativa privada
cruzamento_com:
  - ibge-estatisticas/agregados
  - receita-federal/cnpj-completa
  - justica-eleitoral-tse/candidaturas
  - saude-datasus/cnes
  - tesouro-nacional/siafi
status: parcial
---

# Base dos Dados

## O que é

A **Base dos Dados** é uma organização sem fins lucrativos (ONG) que mantém o maior repositório de dados públicos brasileiros já tratados, limpos e padronizados. O projeto tem como objetivo reduzir o custo de acesso a dados públicos, oferecendo:

- **Data lake público** no Google BigQuery com centenas de tabelas tratadas
- **Padronização de variáveis** — nomes de colunas, formatos de data, códigos IBGE, etc. seguem um dicionário unificado
- **Pacote Python (`basedosdados`)** para acesso simplificado
- **Pacote R (`basedosdados`)** com as mesmas funcionalidades
- **Catálogo online** com busca por tema, órgão e palavra-chave
- **API CKAN** para consultar metadados do catálogo

Entre os dados disponíveis estão: RAIS, CAGED, Censo Escolar, SINASC, SIM, CNPJ, Candidaturas TSE, PIB Municipal, Transferências do Tesouro, entre centenas de outras bases.

**Site oficial:** https://basedosdados.org
**Documentação técnica:** https://basedosdados.github.io/mais/
**Repositório GitHub:** https://github.com/basedosdados/mais

## Como acessar

### Métodos de acesso

A Base dos Dados oferece três formas principais de acesso:

1. **Google BigQuery** (recomendado) — consultas SQL diretamente no data lake público
2. **Pacote Python/R** — abstração sobre o BigQuery com interface simplificada
3. **API CKAN** — consulta de metadados do catálogo (não acessa os dados em si)
4. **Download direto** — via site basedosdados.org para algumas tabelas

### Autenticação

| Método | Autenticação |
|--------|-------------|
| BigQuery | Conta Google + projeto no Google Cloud (gratuito até 1 TB/mês de consultas) |
| Pacote Python/R | Mesma autenticação BigQuery (OAuth via navegador) |
| API CKAN (catálogo) | Não requerida |
| Download no site | Não requerida |

### Configuração do BigQuery

```bash
# 1. Instalar o pacote Python
pip install basedosdados

# 2. Na primeira execução, será solicitada autenticação Google
# e criação de um projeto no Google Cloud
```

### URL Base (API CKAN)

```
https://basedosdados.org/api/3/action
```

## Endpoints/recursos principais

### API CKAN (metadados do catálogo)

| Endpoint | Método | Descrição |
|----------|--------|-----------|
| `/package_list` | GET | Lista todos os conjuntos de dados |
| `/package_show?id={id}` | GET | Detalhes de um conjunto de dados |
| `/package_search?q={termo}` | GET | Busca conjuntos por palavra-chave |
| `/organization_list` | GET | Lista organizações publicadoras |
| `/tag_list` | GET | Lista todas as tags |

### Principais datasets no BigQuery

| Dataset | Tabela | Descrição |
|---------|--------|-----------|
| `br_me_rais` | `microdados_vinculos` | RAIS — vínculos empregatícios formais |
| `br_me_caged` | `microdados_movimentacoes` | CAGED — movimentações de emprego formal |
| `br_tse_eleicoes` | `candidatos` | Candidatos em eleições |
| `br_tse_eleicoes` | `resultados_candidato_municipio` | Resultados eleitorais por município |
| `br_rf_cnpj` | `estabelecimentos` | Cadastro de estabelecimentos CNPJ |
| `br_rf_cnpj` | `socios` | Quadro societário de empresas |
| `br_ibge_censo_demografico` | `microdados_pessoa` | Microdados do Censo IBGE |
| `br_ibge_pib` | `municipio` | PIB Municipal |
| `br_ms_sinasc` | `microdados` | Nascidos vivos (SINASC) |
| `br_ms_sim` | `microdados` | Mortalidade (SIM) |
| `br_inep_censo_escolar` | `escola` | Censo Escolar — escolas |
| `br_stn_finbra` | `municipio` | Finanças municipais (FINBRA) |
| `br_bd_diretorios_brasil` | `municipio` | Diretório de municípios (chave de ligação) |

## Exemplo de uso

### Consulta via pacote Python (BigQuery)

```python
import basedosdados as bd

# Consultar PIB per capita dos municípios de SP em 2020
query = """
SELECT
    m.nome AS municipio,
    p.pib / p.populacao AS pib_per_capita,
    p.pib,
    p.populacao
FROM `basedosdados.br_ibge_pib.municipio` AS p
JOIN `basedosdados.br_bd_diretorios_brasil.municipio` AS m
    ON p.id_municipio = m.id_municipio
WHERE p.ano = 2020
    AND m.sigla_uf = 'SP'
ORDER BY pib_per_capita DESC
LIMIT 20
"""

df = bd.read_sql(query, billing_project_id="seu-projeto-google-cloud")
print(df.head(20))
```

### Cruzar CNPJ com eleições

```python
import basedosdados as bd

# Verificar se sócios de empresas foram candidatos em 2022
query = """
SELECT
    s.cnpj,
    s.nome_socio,
    s.cpf_cnpj_socio,
    c.nome_urna,
    c.sigla_partido,
    c.descricao_cargo,
    c.resultado
FROM `basedosdados.br_rf_cnpj.socios` AS s
JOIN `basedosdados.br_tse_eleicoes.candidatos` AS c
    ON s.cpf_cnpj_socio = c.cpf
WHERE c.ano = 2022
    AND c.sigla_uf = 'SP'
LIMIT 100
"""

df = bd.read_sql(query, billing_project_id="seu-projeto-google-cloud")
print(f"Sócios-candidatos encontrados: {len(df)}")
print(df.head())
```

### Consultar metadados via API CKAN

```python
import requests

BASE_CKAN = "https://basedosdados.org/api/3/action"


def buscar_datasets(termo: str):
    """
    Busca conjuntos de dados no catálogo da Base dos Dados.

    Args:
        termo: Palavra-chave para busca

    Returns:
        Lista de conjuntos encontrados
    """
    url = f"{BASE_CKAN}/package_search"
    params = {"q": termo, "rows": 10}
    response = requests.get(url, params=params)
    response.raise_for_status()
    resultado = response.json()
    return resultado.get("result", {}).get("results", [])


# Buscar datasets sobre educação
datasets = buscar_datasets("educação")
for ds in datasets[:5]:
    print(f"- {ds.get('title', 'N/A')}")
    print(f"  Org: {ds.get('organization', {}).get('title', 'N/A')}")
    print()
```

### Listar tabelas de um dataset

```python
def listar_tabelas(dataset_id: str):
    """
    Lista as tabelas disponíveis em um dataset.

    Args:
        dataset_id: Identificador do dataset (slug)

    Returns:
        Detalhes do dataset com lista de recursos/tabelas
    """
    url = f"{BASE_CKAN}/package_show"
    params = {"id": dataset_id}
    response = requests.get(url, params=params)
    response.raise_for_status()
    resultado = response.json()
    return resultado.get("result", {})


# Exemplo
detalhes = listar_tabelas("br-ibge-pib")
print(f"Título: {detalhes.get('title')}")
for r in detalhes.get("resources", []):
    print(f"  - {r.get('name', 'N/A')} ({r.get('format', 'N/A')})")
```

## Campos disponíveis

### Padrão de nomenclatura (diretório BD)

A Base dos Dados utiliza um padrão de nomenclatura unificado para todas as tabelas:

| Campo padronizado | Tipo | Descrição |
|-------------------|------|-----------|
| `id_municipio` | string | Código IBGE de 7 dígitos do município |
| `sigla_uf` | string | Sigla da UF (SP, RJ, MG, etc.) |
| `ano` | int | Ano de referência |
| `mes` | int | Mês de referência |
| `id_municipio_6` | string | Código IBGE de 6 dígitos (sem dígito verificador) |
| `nome` | string | Nome do município |
| `cpf` | string | CPF (sem pontuação) |
| `cnpj` | string | CNPJ (sem pontuação) |

### Diretório de municípios (`br_bd_diretorios_brasil.municipio`)

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id_municipio` | string | Código IBGE 7 dígitos |
| `id_municipio_6` | string | Código IBGE 6 dígitos |
| `id_municipio_tse` | string | Código TSE do município |
| `id_municipio_rf` | string | Código Receita Federal |
| `id_municipio_bcb` | string | Código Banco Central |
| `nome` | string | Nome do município |
| `sigla_uf` | string | Sigla da UF |
| `id_uf` | string | Código IBGE da UF |
| `nome_regiao` | string | Nome da região |
| `id_mesorregiao` | string | Código da mesorregião |
| `id_microrregiao` | string | Código da microrregião |
| `id_regiao_metropolitana` | string | Código da região metropolitana |

### Metadados CKAN

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | string | Identificador único do dataset |
| `name` | string | Slug do dataset |
| `title` | string | Título do dataset |
| `notes` | string | Descrição |
| `organization.title` | string | Nome da organização |
| `resources` | list | Lista de recursos (tabelas) |
| `tags` | list | Tags/categorias |

## Cruzamentos possíveis

A Base dos Dados é especialmente projetada para cruzamentos, pois padroniza chaves de ligação entre bases:

| Cruzamento | Fonte relacionada | Chave de ligação | Finalidade |
|------------|-------------------|------------------|------------|
| CNPJ × Eleições | [TSE — Candidaturas](/docs/apis/justica-eleitoral-tse/candidaturas) | `CPF` via tabela de sócios | Identificar empresários-candidatos |
| RAIS × CNPJ | [Receita Federal — CNPJ](/docs/apis/receita-federal/cnpj-completa) | `CNPJ` | Cruzar vínculos com dados da empresa |
| Censo Escolar × Municípios | [IBGE — Agregados](/docs/apis/ibge-estatisticas/agregados) | `id_municipio` | Contextualizar dados educacionais |
| SINASC × Saúde | [DATASUS — CNES](/docs/apis/saude-datasus/cnes) | `Código CNES` | Relacionar nascimentos com estabelecimentos de saúde |
| FINBRA × SIAFI | [Tesouro Nacional — SIAFI](/docs/apis/tesouro-nacional/siafi) | `id_municipio` | Comparar finanças municipais com execução federal |
| Diretórios × Qualquer base | Todas | `id_municipio`, `sigla_uf` | Tabela de ligação universal entre códigos |

### Receita para cruzamento: PIB Municipal × Resultado Eleitoral

```python
import basedosdados as bd

query = """
SELECT
    m.nome AS municipio,
    m.sigla_uf,
    p.pib / p.populacao AS pib_per_capita,
    e.nome_urna AS prefeito_eleito,
    e.sigla_partido
FROM `basedosdados.br_ibge_pib.municipio` AS p
JOIN `basedosdados.br_bd_diretorios_brasil.municipio` AS m
    ON p.id_municipio = m.id_municipio
JOIN `basedosdados.br_tse_eleicoes.resultados_candidato_municipio` AS e
    ON m.id_municipio_tse = e.id_municipio_tse
WHERE p.ano = 2020
    AND e.ano = 2020
    AND e.descricao_cargo = 'PREFEITO'
    AND e.resultado = 'eleito'
ORDER BY pib_per_capita DESC
LIMIT 50
"""

df = bd.read_sql(query, billing_project_id="seu-projeto-google-cloud")
print(df.head(20))
```

## Limitações conhecidas

| Limitação | Detalhes |
|-----------|----------|
| **Requer conta Google Cloud** | O acesso ao BigQuery exige criar um projeto no Google Cloud. O free tier permite até 1 TB de consultas por mês gratuitamente. |
| **Custo potencial** | Consultas que excedam 1 TB/mês no BigQuery geram cobrança. Queries em tabelas muito grandes (RAIS, CNPJ) podem consumir volume significativo. |
| **Defasagem nos dados** | A Base dos Dados depende da publicação oficial pelos órgãos e do trabalho voluntário de tratamento. Pode haver atraso de semanas a meses em relação à fonte original. |
| **Cobertura parcial** | Nem todas as bases públicas brasileiras estão disponíveis. O catálogo está em constante expansão, mas pode não incluir dados muito recentes ou de nicho. |
| **API CKAN limitada** | A API CKAN permite consultar apenas metadados do catálogo, não os dados em si. Para acessar dados, é necessário usar BigQuery ou download. |
| **Dependência do BigQuery** | A principal forma de acesso é via BigQuery (Google). Não há alternativa open-source equivalente para consultas SQL sobre todo o data lake. |
| **Tabelas em desenvolvimento** | Algumas tabelas estão em status "em desenvolvimento" e podem conter dados incompletos ou com erros. Verificar o status no catálogo. |
| **Dicionário de variáveis** | Embora a padronização seja um diferencial, o dicionário completo de variáveis nem sempre está disponível para todas as tabelas. |
