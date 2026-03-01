---
title: SICONFI (Finanças de Estados e Municípios)
slug: siconfi
orgao: Tesouro Nacional
url_base: https://apidatalake.tesouro.gov.br/ords/siconfi/tt/
tipo_acesso: API REST
autenticacao: Não requerida
formato_dados: JSON, CSV
frequencia_atualizacao: Bimestral
campos_chave:
  - codigo_ibge
  - codigo_uf
  - exercicio
  - bimestre
  - quadrimestre
  - conta_contabil
tags:
  - finanças públicas
  - receitas
  - despesas
  - dívida
  - estados
  - municípios
  - RREO
  - RGF
  - DCA
  - FINBRA
  - SICONFI
cruzamento_com:
  - tesouro-nacional/siafi
  - tesouro-nacional/siop
  - portais-centrais/tesouro-transparente
status: documentado
---

# SICONFI — Sistema de Informações Contábeis e Fiscais do Setor Público Brasileiro

## O que é

O **SICONFI** é o sistema da Secretaria do Tesouro Nacional (STN) responsável por receber, validar e consolidar as informações contábeis e fiscais de **estados, Distrito Federal e municípios** brasileiros. Ele centraliza os relatórios exigidos pela Lei de Responsabilidade Fiscal (LRF) e pela Lei nº 4.320/1964, incluindo:

- **RREO** (Relatório Resumido da Execução Orçamentária) — publicado bimestralmente, apresenta receitas e despesas do ente
- **RGF** (Relatório de Gestão Fiscal) — publicado quadrimestralmente, apresenta limites de gastos com pessoal, dívida e garantias
- **DCA** (Declaração de Contas Anuais) — balanços contábeis anuais dos entes federativos
- **FINBRA** (Finanças do Brasil) — base consolidada de receitas e despesas municipais
- **MSC** (Matriz de Saldos Contábeis) — dados contábeis no padrão PCASP

O SICONFI possui uma **API REST pública** sem necessidade de autenticação, permitindo consultas programáticas a todos esses conjuntos de dados para mais de 5.500 municípios e 27 unidades federativas.

**Site oficial:** https://siconfi.tesouro.gov.br

## Como acessar

### Autenticação

A API do SICONFI **não requer autenticação**. O acesso é totalmente público e gratuito.

### URL Base

```
https://apidatalake.tesouro.gov.br/ords/siconfi/tt/
```

### Rate Limits

| Condição | Limite |
|----------|--------|
| Autenticação | Não requerida |
| Rate limit explícito | Não documentado oficialmente; recomenda-se no máximo 30 req/min |

### Formatos

As respostas são retornadas em JSON por padrão, com estrutura `{"items": [...], "hasMore": true/false}`. Alguns endpoints também aceitam o parâmetro `formato=csv`.

## Endpoints/recursos principais

| Endpoint | Método | Descrição |
|----------|--------|-----------|
| `/rreo` | GET | Relatório Resumido da Execução Orçamentária |
| `/rgf` | GET | Relatório de Gestão Fiscal |
| `/dca` | GET | Declaração de Contas Anuais (balanços anuais) |
| `/finbra` | GET | Finanças do Brasil — receitas e despesas consolidadas |
| `/msc` | GET | Matriz de Saldos Contábeis |
| `/entes` | GET | Lista de entes federativos cadastrados no SICONFI |
| `/anexos-rreo` | GET | Anexos específicos do RREO |
| `/anexos-rgf` | GET | Anexos específicos do RGF |

### Parâmetros comuns

| Parâmetro | Tipo | Descrição |
|-----------|------|-----------|
| `an_exercicio` | int | Ano do exercício fiscal (ex: `2024`) |
| `id_ente` | string | Código IBGE do município ou estado (7 dígitos para municípios, 2 para UFs) |
| `co_tipo_demonstrativo` | string | Tipo do demonstrativo: `RREO`, `RGF`, `DCA` |
| `nr_periodo` | int | Número do bimestre (1-6 para RREO) ou quadrimestre (1-3 para RGF) |
| `no_anexo` | string | Nome do anexo do relatório |
| `co_esfera` | string | Esfera de governo: `E` (estadual), `M` (municipal), `D` (distrital) |
| `co_poder` | string | Poder: `E` (Executivo), `L` (Legislativo), `J` (Judiciário) |
| `offset` | int | Offset para paginação |
| `limit` | int | Limite de registros por página |

### Anexos do RREO

| Anexo | Descrição |
|-------|-----------|
| `RREO-Anexo 01` | Balanço Orçamentário |
| `RREO-Anexo 02` | Demonstrativo da Execução das Despesas por Função/Subfunção |
| `RREO-Anexo 03` | Demonstrativo da Receita Corrente Líquida |
| `RREO-Anexo 06` | Demonstrativo dos Resultados Primário e Nominal |
| `RREO-Anexo 07` | Demonstrativo dos Restos a Pagar por Poder e Órgão |

### Anexos do RGF

| Anexo | Descrição |
|-------|-----------|
| `RGF-Anexo 01` | Demonstrativo da Despesa com Pessoal |
| `RGF-Anexo 02` | Demonstrativo da Dívida Consolidada Líquida |
| `RGF-Anexo 03` | Demonstrativo das Garantias e Contragarantias de Valores |
| `RGF-Anexo 04` | Demonstrativo das Operações de Crédito |

## Exemplo de uso

### Consultar RREO de um município

```python
import requests
import pandas as pd

BASE_URL = "https://apidatalake.tesouro.gov.br/ords/siconfi/tt"


def consultar_rreo(codigo_ibge: str, exercicio: int, bimestre: int = None):
    """
    Consulta o Relatório Resumido da Execução Orçamentária (RREO)
    de um ente federativo.

    Args:
        codigo_ibge: Código IBGE do município ou estado
        exercicio: Ano do exercício fiscal
        bimestre: Número do bimestre (1 a 6, opcional)

    Returns:
        DataFrame com dados do RREO
    """
    url = f"{BASE_URL}/rreo"
    params = {
        "id_ente": codigo_ibge,
        "an_exercicio": exercicio,
        "limit": 5000,
    }
    if bimestre:
        params["nr_periodo"] = bimestre

    registros = []
    offset = 0

    while True:
        params["offset"] = offset
        response = requests.get(url, params=params)
        response.raise_for_status()
        dados = response.json()

        items = dados.get("items", [])
        registros.extend(items)

        if not dados.get("hasMore", False):
            break
        offset += len(items)

    return pd.DataFrame(registros)


# Exemplo: RREO de São Paulo (3550308), exercício 2024, 6º bimestre
df_rreo = consultar_rreo("3550308", 2024, 6)
print(f"Registros: {len(df_rreo)}")
if not df_rreo.empty:
    print(df_rreo[["no_conta", "vl_previsao_inicial", "vl_realizado"]].head(10))
```

### Consultar RGF — Despesa com Pessoal

```python
def consultar_rgf(codigo_ibge: str, exercicio: int, quadrimestre: int = None):
    """
    Consulta o Relatório de Gestão Fiscal (RGF) de um ente federativo.

    Args:
        codigo_ibge: Código IBGE do ente
        exercicio: Ano do exercício fiscal
        quadrimestre: Número do quadrimestre (1 a 3, opcional)

    Returns:
        DataFrame com dados do RGF
    """
    url = f"{BASE_URL}/rgf"
    params = {
        "id_ente": codigo_ibge,
        "an_exercicio": exercicio,
        "limit": 5000,
    }
    if quadrimestre:
        params["nr_periodo"] = quadrimestre

    response = requests.get(url, params=params)
    response.raise_for_status()
    dados = response.json()
    registros = dados.get("items", dados)
    return pd.DataFrame(registros)


# Exemplo: RGF do Estado de Minas Gerais (31), exercício 2024
df_rgf = consultar_rgf("31", 2024, 3)
print(f"Registros RGF: {len(df_rgf)}")
if not df_rgf.empty:
    print(df_rgf.head())
```

### Consultar lista de entes cadastrados

```python
def listar_entes(esfera: str = None, uf: str = None):
    """
    Lista os entes federativos cadastrados no SICONFI.

    Args:
        esfera: Esfera de governo ('E' = Estadual, 'M' = Municipal, 'D' = Distrital)
        uf: Código da UF (2 dígitos IBGE)

    Returns:
        DataFrame com entes cadastrados
    """
    url = f"{BASE_URL}/entes"
    params = {"limit": 5000}
    if esfera:
        params["co_esfera"] = esfera
    if uf:
        params["co_uf"] = uf

    registros = []
    offset = 0

    while True:
        params["offset"] = offset
        response = requests.get(url, params=params)
        response.raise_for_status()
        dados = response.json()

        items = dados.get("items", [])
        registros.extend(items)

        if not dados.get("hasMore", False):
            break
        offset += len(items)

    return pd.DataFrame(registros)


# Exemplo: municípios de São Paulo cadastrados no SICONFI
entes_sp = listar_entes(esfera="M", uf="35")
print(f"Municípios de SP cadastrados: {len(entes_sp)}")
if not entes_sp.empty:
    print(entes_sp[["id_ente", "no_ente", "co_uf"]].head(10))
```

### Consultar DCA (Balanço Anual)

```python
def consultar_dca(codigo_ibge: str, exercicio: int):
    """
    Consulta a Declaração de Contas Anuais (DCA) de um ente federativo.

    Args:
        codigo_ibge: Código IBGE do ente
        exercicio: Ano do exercício

    Returns:
        DataFrame com dados do balanço anual
    """
    url = f"{BASE_URL}/dca"
    params = {
        "id_ente": codigo_ibge,
        "an_exercicio": exercicio,
        "limit": 5000,
    }

    registros = []
    offset = 0

    while True:
        params["offset"] = offset
        response = requests.get(url, params=params)
        response.raise_for_status()
        dados = response.json()

        items = dados.get("items", [])
        registros.extend(items)

        if not dados.get("hasMore", False):
            break
        offset += len(items)

    return pd.DataFrame(registros)


# Exemplo: DCA do Estado do Rio de Janeiro (33), exercício 2023
df_dca = consultar_dca("33", 2023)
print(f"Registros DCA: {len(df_dca)}")
if not df_dca.empty:
    print(df_dca.head())
```

## Campos disponíveis

### RREO — Relatório Resumido da Execução Orçamentária

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id_ente` | string | Código IBGE do ente |
| `no_ente` | string | Nome do ente federativo |
| `co_uf` | string | Código da UF (2 dígitos) |
| `an_exercicio` | int | Ano do exercício fiscal |
| `nr_periodo` | int | Bimestre de referência (1 a 6) |
| `no_anexo` | string | Nome do anexo do RREO |
| `no_conta` | string | Nome da conta contábil |
| `co_conta` | string | Código da conta contábil |
| `vl_previsao_inicial` | float | Valor previsto na LOA (R$) |
| `vl_previsao_atualizada` | float | Valor previsto atualizado (R$) |
| `vl_realizado` | float | Valor efetivamente realizado (R$) |

### RGF — Relatório de Gestão Fiscal

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id_ente` | string | Código IBGE do ente |
| `no_ente` | string | Nome do ente federativo |
| `an_exercicio` | int | Ano do exercício |
| `nr_periodo` | int | Quadrimestre de referência (1 a 3) |
| `no_anexo` | string | Nome do anexo do RGF |
| `co_poder` | string | Poder (`E`, `L`, `J`) |
| `no_conta` | string | Nome da conta/rubrica |
| `vl_periodo` | float | Valor no período (R$) |
| `vl_limite_maximo` | float | Limite máximo definido pela LRF (R$) |
| `vl_limite_prudencial` | float | Limite prudencial (95% do máximo, R$) |

### DCA — Declaração de Contas Anuais

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id_ente` | string | Código IBGE do ente |
| `no_ente` | string | Nome do ente |
| `an_exercicio` | int | Ano do exercício |
| `no_conta` | string | Nome da conta contábil |
| `co_conta_pcasp` | string | Código PCASP da conta |
| `vl_saldo_inicial` | float | Saldo inicial do exercício (R$) |
| `vl_saldo_final` | float | Saldo final do exercício (R$) |

### Entes

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id_ente` | string | Código IBGE do ente |
| `no_ente` | string | Nome do ente |
| `co_uf` | string | Código da UF |
| `no_uf` | string | Nome da UF |
| `co_esfera` | string | Esfera: `E` (Estadual), `M` (Municipal), `D` (Distrital) |
| `populacao` | int | População estimada |
| `dt_ano_populacao` | int | Ano de referência da população |

## Cruzamentos possíveis

| Cruzamento | Fonte relacionada | Chave de ligação | Finalidade |
|------------|-------------------|------------------|------------|
| SICONFI x SIAFI | [SIAFI](/docs/apis/tesouro-nacional/siafi) | `Código SIAFI / exercício` | Comparar finanças subnacionais com execução orçamentária federal |
| SICONFI x SIOP | [SIOP](/docs/apis/tesouro-nacional/siop) | `Exercício` | Contextualizar finanças locais com o orçamento federal aprovado |
| SICONFI x Tesouro Transparente | [Tesouro Transparente](/docs/apis/portais-centrais/tesouro-transparente) | `Código IBGE / exercício` | Complementar com dados de transferências (FPM, FPE, FUNDEB) |
| SICONFI x IBGE | IBGE — Agregados | `Código IBGE` | Contextualizar finanças municipais com dados demográficos (PIB per capita, população) |
| SICONFI x TSE | TSE — Candidaturas | `Código IBGE do município` | Analisar saúde fiscal de municípios em contexto eleitoral |
| SICONFI x CNPJ | [Receita Federal — CNPJ](/docs/apis/receita-federal/cnpj-completa) | `Código IBGE / UF` | Cruzar arrecadação municipal com atividade empresarial local |

### Receita: comparar despesa com pessoal entre estados

```python
import requests
import pandas as pd

BASE_URL = "https://apidatalake.tesouro.gov.br/ords/siconfi/tt"

# Lista de estados (códigos IBGE de 2 dígitos)
estados = {
    "11": "Rondônia", "12": "Acre", "13": "Amazonas", "14": "Roraima",
    "15": "Pará", "16": "Amapá", "17": "Tocantins", "21": "Maranhão",
    "22": "Piauí", "23": "Ceará", "24": "Rio Grande do Norte", "25": "Paraíba",
    "26": "Pernambuco", "27": "Alagoas", "28": "Sergipe", "29": "Bahia",
    "31": "Minas Gerais", "32": "Espírito Santo", "33": "Rio de Janeiro",
    "35": "São Paulo", "41": "Paraná", "42": "Santa Catarina",
    "43": "Rio Grande do Sul", "50": "Mato Grosso do Sul", "51": "Mato Grosso",
    "52": "Goiás", "53": "Distrito Federal",
}


def comparar_pessoal_estados(exercicio: int, quadrimestre: int = 3):
    """
    Compara despesa com pessoal entre estados brasileiros usando o RGF.

    Args:
        exercicio: Ano do exercício
        quadrimestre: Quadrimestre de referência (1 a 3)

    Returns:
        DataFrame com despesa com pessoal por estado
    """
    resultados = []
    for co_uf, nome_uf in estados.items():
        url = f"{BASE_URL}/rgf"
        params = {
            "id_ente": co_uf,
            "an_exercicio": exercicio,
            "nr_periodo": quadrimestre,
            "no_anexo": "RGF-Anexo 01",
            "co_poder": "E",
            "limit": 100,
        }

        response = requests.get(url, params=params)
        if response.status_code == 200:
            dados = response.json()
            items = dados.get("items", [])
            for item in items:
                item["nome_uf"] = nome_uf
            resultados.extend(items)

    return pd.DataFrame(resultados)


# Exemplo: comparar despesa com pessoal dos estados em 2024
df_pessoal = comparar_pessoal_estados(2024)
if not df_pessoal.empty:
    print("Despesa com pessoal por estado (Poder Executivo):")
    print(df_pessoal[["nome_uf", "no_conta", "vl_periodo"]].head(15))
```

## Limitações conhecidas

| Limitação | Detalhes |
|-----------|----------|
| **Aderência dos municípios** | Nem todos os municípios enviam seus relatórios no prazo legal. Municípios menores frequentemente apresentam dados incompletos ou ausentes. |
| **Cobertura temporal** | A API cobre dados a partir de 2015 para a maioria dos relatórios. Dados anteriores podem estar disponíveis apenas via download de arquivos no site do SICONFI. |
| **Padronização contábil** | A implantação do PCASP (Plano de Contas Aplicado ao Setor Público) foi gradual; dados anteriores a 2015 podem seguir planos de contas diferentes. |
| **Complexidade dos anexos** | Cada relatório (RREO, RGF) possui múltiplos anexos com estruturas de dados distintas. É necessário conhecer a estrutura para filtrar corretamente. |
| **Paginação obrigatória** | Resultados são paginados com `hasMore`; consultas amplas (ex: todos os municípios de um estado) exigem múltiplas requisições. |
| **Sem documentação Swagger** | A API não possui documentação Swagger/OpenAPI interativa. Os parâmetros disponíveis precisam ser descobertos por tentativa ou pela documentação textual. |
| **Periodicidade variável** | RREO é bimestral, RGF é quadrimestral, DCA é anual. A consolidação entre diferentes periodicidades exige cuidado. |
| **Qualidade dos dados** | Os dados são autodeclarados pelos entes. Erros de preenchimento e inconsistências são possíveis, especialmente em municípios de menor porte. |
