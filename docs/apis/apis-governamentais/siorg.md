---
title: SIORG — Estrutura Organizacional do Governo Federal
slug: siorg
orgao: Gov.br Conecta
url_base: https://siorg.gov.br/
tipo_acesso: API REST
autenticacao: Não requerida
formato_dados: [JSON]
frequencia_atualizacao: Mensal
campos_chave:
  - codigo_orgao
  - nome_orgao
  - sigla
  - orgao_superior
  - tipo_unidade
  - dirigente
tags:
  - SIORG
  - estrutura organizacional
  - organograma
  - governo federal
  - órgãos públicos
  - Gov.br Conecta
cruzamento_com:
  - apis-governamentais/siape
  - transparencia-cgu/servidores-federais
  - transparencia-cgu/contratos-federais
status: documentado
---

# SIORG — Estrutura Organizacional do Governo Federal

## O que é

O **SIORG (Sistema de Informações Organizacionais do Governo Federal)** é o cadastro oficial da estrutura organizacional do Poder Executivo Federal brasileiro. Ele contém informações sobre:

- **Órgãos e entidades** — ministérios, secretarias, autarquias, fundações, empresas públicas
- **Unidades administrativas** — departamentos, coordenações, divisões
- **Hierarquia** — relação de subordinação entre unidades (organograma)
- **Dirigentes** — titulares de cada unidade
- **Competências** — atribuições legais de cada órgão/unidade
- **Endereços** — localização física das unidades

O SIORG é a referência oficial para identificar órgãos federais e é utilizado em diversos sistemas governamentais (SIAFI, SIAPE, SIASG) como tabela de referência de órgãos.

## Como acessar

| Item | Detalhe |
|---|---|
| **Portal SIORG** | `https://siorg.gov.br/` |
| **API** | `https://estruturaorganizacional.dados.gov.br/api/` |
| **Organograma visual** | `https://siorg.gov.br/siorg-cidadao-webapp/` |
| **Autenticação** | Não requerida (API pública) |
| **Formato** | JSON |

## Endpoints/recursos principais

### API do SIORG

| Endpoint | Descrição |
|---|---|
| `/unidades` | Lista de unidades organizacionais |
| `/unidades/{id}` | Detalhes de uma unidade |
| `/unidades/{id}/filhas` | Unidades subordinadas |
| `/orgaos-siorg` | Lista de órgãos da administração federal |
| `/orgaos-entidades` | Lista de órgãos e entidades |

## Exemplo de uso

### Listar órgãos do governo federal

```python
import requests
import pandas as pd

# API do SIORG — listar órgãos
url = "https://estruturaorganizacional.dados.gov.br/api/unidades"
params = {"tipo": "1"}  # 1 = Órgão

response = requests.get(url)
response.raise_for_status()
dados = response.json()

print(f"Total de unidades: {len(dados)}")
for orgao in dados[:10]:
    print(f"  {orgao.get('codigoUnidade')}: {orgao.get('nomeUnidade')} ({orgao.get('sigla', 'N/A')})")
```

### Consultar hierarquia de um órgão

```python
import requests

# Consultar detalhes de uma unidade específica
codigo_orgao = "26000"  # Exemplo
url = f"https://estruturaorganizacional.dados.gov.br/api/unidades/{codigo_orgao}"

response = requests.get(url)
response.raise_for_status()
orgao = response.json()

print(f"Nome: {orgao.get('nomeUnidade')}")
print(f"Sigla: {orgao.get('sigla')}")
print(f"Tipo: {orgao.get('tipoUnidade')}")
print(f"Superior: {orgao.get('codigoUnidadePai')}")

# Listar unidades subordinadas
url_filhas = f"https://estruturaorganizacional.dados.gov.br/api/unidades/{codigo_orgao}/filhas"
response = requests.get(url_filhas)
filhas = response.json()

print(f"\nUnidades subordinadas: {len(filhas)}")
for f in filhas[:5]:
    print(f"  {f.get('codigoUnidade')}: {f.get('nomeUnidade')}")
```

## Campos disponíveis

### Unidades organizacionais

| Campo | Tipo | Descrição |
|---|---|---|
| `codigoUnidade` | string | Código SIORG da unidade |
| `nomeUnidade` | string | Nome completo da unidade |
| `sigla` | string | Sigla da unidade |
| `tipoUnidade` | string | Tipo (Órgão, Entidade, Unidade Administrativa) |
| `codigoUnidadePai` | string | Código da unidade superior (hierarquia) |
| `nomeUnidadePai` | string | Nome da unidade superior |
| `nomeTitular` | string | Nome do dirigente/titular |
| `cargoTitular` | string | Cargo do titular |
| `endereco` | string | Endereço da unidade |
| `municipio` | string | Município |
| `uf` | string | UF |

## Cruzamentos possíveis

| Cruzamento | Fonte relacionada | Chave de ligação | Finalidade |
|---|---|---|---|
| SIORG x SIAPE | [SIAPE](/docs/apis/apis-governamentais/siape) | Código do órgão | Vincular servidores à estrutura organizacional |
| SIORG x Servidores | [Servidores Federais](/docs/apis/transparencia-cgu/servidores-federais) | Código do órgão | Contextualizar servidores na hierarquia |
| SIORG x Contratos | [Contratos Federais](/docs/apis/transparencia-cgu/contratos-federais) | Código do órgão | Identificar órgãos contratantes na estrutura |

## Limitações conhecidas

| Limitação | Detalhes |
|---|---|
| **API pode ser lenta** | A API do SIORG pode apresentar lentidão, especialmente para consultas que retornam muitos registros. |
| **Documentação limitada** | A documentação da API é básica e pode estar desatualizada. |
| **Apenas Executivo Federal** | O SIORG cobre o Poder Executivo Federal. Legislativo, Judiciário, estados e municípios não são cobertos. |
| **Defasagem nas atualizações** | Mudanças na estrutura organizacional (criação/extinção de órgãos, nomeações) podem demorar para ser refletidas no sistema. |
| **Sem dados históricos** | O SIORG mostra a estrutura atual. Não há acesso fácil a estruturas passadas (ex: composição de um ministério em anos anteriores). |
