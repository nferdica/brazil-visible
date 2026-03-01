---
title: SIAFI (Execução Orçamentária da União)
slug: siafi
orgao: Tesouro Nacional
url_base: https://apidatalake.tesouro.gov.br/ords/sadipem/tt
tipo_acesso: API REST
autenticacao: Não requerida
formato_dados: JSON, CSV
frequencia_atualizacao: Mensal
campos_chave:
  - codigo_orgao
  - codigo_uo
  - funcao
  - subfuncao
  - programa
  - acao
  - exercicio
tags:
  - orçamento
  - execução orçamentária
  - despesas federais
  - receitas federais
  - empenho
  - liquidação
  - pagamento
  - SIAFI
  - governo federal
cruzamento_com:
  - tesouro-nacional/siconfi
  - tesouro-nacional/siop
  - transparencia-cgu/contratos-federais
  - transparencia-cgu/servidores-federais
  - portais-centrais/tesouro-transparente
status: documentado
---

# SIAFI — Sistema Integrado de Administração Financeira da União

## O que é

O **SIAFI** (Sistema Integrado de Administração Financeira do Governo Federal) é o principal sistema de gestão das finanças do Governo Federal brasileiro, operado pela **Secretaria do Tesouro Nacional (STN)**. Ele registra, em tempo real, toda a execução orçamentária, financeira e patrimonial da União, incluindo:

- **Empenhos** — compromissos de despesa assumidos pelo governo
- **Liquidações** — confirmação de que bens foram entregues ou serviços prestados
- **Pagamentos** — efetiva saída de recursos do Tesouro
- **Receitas arrecadadas** — tributos e outras receitas da União
- **Restos a pagar** — despesas empenhadas e não pagas no exercício

O SIAFI em si é um sistema interno do governo, sem API pública direta. Porém, os dados de execução orçamentária registrados no SIAFI são disponibilizados ao público por meio de duas plataformas:

1. **Tesouro Transparente** — API REST do Tesouro Nacional (`apidatalake.tesouro.gov.br`)
2. **Portal da Transparência** — API REST da CGU (`api.portaldatransparencia.gov.br`)

> **Veja também:** [Tesouro Transparente](/docs/apis/portais-centrais/tesouro-transparente) para a visão geral da plataforma de dados abertos do Tesouro.

## Como acessar

### Via Tesouro Transparente (recomendado)

| Item | Detalhe |
|------|---------|
| **URL base** | `https://apidatalake.tesouro.gov.br/ords/sadipem/tt` |
| **Autenticação** | Não requerida |
| **Rate limit** | Não documentado oficialmente; recomenda-se no máximo 30 req/min |
| **Formatos** | JSON (padrão), CSV |
| **Paginação** | Parâmetros `offset` e `limit`; resposta inclui `hasMore` |

### Via Portal da Transparência

| Item | Detalhe |
|------|---------|
| **URL base** | `https://api.portaldatransparencia.gov.br/api-de-dados` |
| **Autenticação** | API Key gratuita (header `chave-api-dados`) |
| **Rate limit** | 30 requisições/minuto |
| **Formatos** | JSON |
| **Cadastro** | https://portaldatransparencia.gov.br/api-de-dados/cadastrar-email |

### Download em lote (bulk)

O Tesouro Nacional também disponibiliza arquivos CSV consolidados para download:

- **Tesouro Transparente — Dados abertos:** https://www.tesourotransparente.gov.br/temas/execucao-orcamentaria
- **Portal da Transparência — Downloads:** https://portaldatransparencia.gov.br/download-de-dados

## Endpoints/recursos principais

### Tesouro Transparente — Execução Orçamentária

| Endpoint | Método | Descrição |
|----------|--------|-----------|
| `/tt/execucao-despesa` | GET | Execução de despesas da União por órgão, função e programa |
| `/tt/execucao-receita` | GET | Receitas arrecadadas pela União |
| `/tt/restos-a-pagar` | GET | Restos a pagar (processados e não processados) |
| `/tt/resultado-primario` | GET | Resultado primário do Governo Central |
| `/tt/transferencias` | GET | Transferências constitucionais e voluntárias a estados e municípios |

### Portal da Transparência — Despesas

| Endpoint | Método | Descrição |
|----------|--------|-----------|
| `/despesas/recursos-recebidos` | GET | Recursos recebidos por órgão |
| `/despesas/por-programa` | GET | Despesas por programa de governo |
| `/despesas/por-funcao` | GET | Despesas por função orçamentária |

### Parâmetros comuns (Tesouro Transparente)

| Parâmetro | Tipo | Descrição |
|-----------|------|-----------|
| `an_exercicio` | int | Ano do exercício fiscal (ex: `2024`) |
| `co_orgao` | string | Código SIAFI do órgão (ex: `26000` para MEC) |
| `no_funcao` | string | Nome da função orçamentária (ex: `Educação`) |
| `no_subfuncao` | string | Nome da subfunção |
| `offset` | int | Offset para paginação |
| `limit` | int | Limite de registros por página (padrão: 25, máx: 5000) |

## Exemplo de uso

### Consultar execução de despesas por órgão

```python
import requests
import pandas as pd

BASE_URL = "https://apidatalake.tesouro.gov.br/ords/sadipem/tt"


def consultar_execucao_despesa(exercicio: int, codigo_orgao: str = None):
    """
    Consulta a execução orçamentária de despesas da União.

    Args:
        exercicio: Ano do exercício fiscal
        codigo_orgao: Código SIAFI do órgão (opcional)

    Returns:
        DataFrame com dados da execução de despesas
    """
    url = f"{BASE_URL}/execucao-despesa"
    params = {
        "an_exercicio": exercicio,
        "limit": 5000,
    }
    if codigo_orgao:
        params["co_orgao"] = codigo_orgao

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


# Exemplo: execução de despesas do Ministério da Saúde (36000) em 2024
df = consultar_execucao_despesa(2024, "36000")
print(f"Registros: {len(df)}")
if not df.empty:
    print(df[["no_funcao", "no_subfuncao", "vl_empenhado", "vl_liquidado", "vl_pago"]].head(10))
```

### Consultar receitas da União

```python
def consultar_receita(exercicio: int):
    """
    Consulta as receitas arrecadadas pela União.

    Args:
        exercicio: Ano do exercício fiscal

    Returns:
        DataFrame com dados de receitas
    """
    url = f"{BASE_URL}/execucao-receita"
    params = {
        "an_exercicio": exercicio,
        "limit": 5000,
    }

    response = requests.get(url, params=params)
    response.raise_for_status()
    dados = response.json()
    registros = dados.get("items", dados)
    return pd.DataFrame(registros)


# Exemplo: receitas da União em 2024
df_receita = consultar_receita(2024)
print(f"Registros de receita: {len(df_receita)}")
if not df_receita.empty:
    print(df_receita.head())
```

### Analisar evolução do resultado primário

```python
def consultar_resultado_primario(exercicio_inicio: int, exercicio_fim: int):
    """
    Consulta o resultado primário do Governo Central ao longo de vários exercícios.

    Args:
        exercicio_inicio: Ano inicial
        exercicio_fim: Ano final

    Returns:
        DataFrame consolidado com resultados primários
    """
    todos = []
    for ano in range(exercicio_inicio, exercicio_fim + 1):
        url = f"{BASE_URL}/resultado-primario"
        params = {"an_exercicio": ano, "limit": 5000}

        response = requests.get(url, params=params)
        if response.status_code == 200:
            dados = response.json()
            items = dados.get("items", [])
            for item in items:
                item["exercicio"] = ano
            todos.extend(items)

    return pd.DataFrame(todos)


# Exemplo: resultado primário de 2019 a 2024
df_primario = consultar_resultado_primario(2019, 2024)
if not df_primario.empty:
    print(df_primario.groupby("exercicio").sum(numeric_only=True).head())
```

## Campos disponíveis

### Execução de despesas

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `an_exercicio` | int | Ano do exercício fiscal |
| `co_orgao` | string | Código SIAFI do órgão |
| `no_orgao` | string | Nome do órgão |
| `co_uo` | string | Código da Unidade Orçamentária |
| `no_uo` | string | Nome da Unidade Orçamentária |
| `no_funcao` | string | Função orçamentária (ex: Saúde, Educação) |
| `no_subfuncao` | string | Subfunção orçamentária |
| `no_programa` | string | Nome do programa de governo |
| `no_acao` | string | Nome da ação orçamentária |
| `vl_dotacao_inicial` | float | Dotação inicial aprovada na LOA (R$) |
| `vl_dotacao_atualizada` | float | Dotação atualizada com créditos adicionais (R$) |
| `vl_empenhado` | float | Valor empenhado (R$) |
| `vl_liquidado` | float | Valor liquidado (R$) |
| `vl_pago` | float | Valor efetivamente pago (R$) |
| `vl_restos_pagar` | float | Valor inscrito em restos a pagar (R$) |

### Receitas

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `an_exercicio` | int | Ano do exercício fiscal |
| `no_categoria_economica` | string | Categoria econômica (Receitas Correntes, Receitas de Capital) |
| `no_origem` | string | Origem da receita (Tributária, Patrimonial, etc.) |
| `vl_previsao_inicial` | float | Valor previsto na LOA (R$) |
| `vl_previsao_atualizada` | float | Valor previsto atualizado (R$) |
| `vl_arrecadado` | float | Valor efetivamente arrecadado (R$) |

### Classificação orçamentária

| Conceito | Descrição |
|----------|-----------|
| **Função** | Maior nível de agregação das despesas (ex: Saúde, Educação, Defesa) |
| **Subfunção** | Desdobramento da função (ex: Atenção Básica, Ensino Superior) |
| **Programa** | Instrumento do PPA que organiza a ação governamental |
| **Ação** | Operação que resulta em bens/serviços para a sociedade |
| **Órgão** | Unidade administrativa responsável pela despesa |
| **UO** | Unidade Orçamentária — segmento do órgão com dotação própria |

## Cruzamentos possíveis

| Cruzamento | Fonte relacionada | Chave de ligação | Finalidade |
|------------|-------------------|------------------|------------|
| SIAFI x SICONFI | [SICONFI](/docs/apis/tesouro-nacional/siconfi) | `Código IBGE / exercício` | Comparar execução orçamentária federal com finanças de estados e municípios |
| SIAFI x SIOP | [SIOP](/docs/apis/tesouro-nacional/siop) | `Código órgão / ação / programa` | Comparar orçamento aprovado (SIOP) com execução real (SIAFI) |
| SIAFI x Contratos | [Contratos Federais](/docs/apis/transparencia-cgu/contratos-federais) | `Código SIAFI do órgão` | Vincular execução orçamentária aos contratos firmados |
| SIAFI x Servidores | [Servidores Federais](/docs/apis/transparencia-cgu/servidores-federais) | `Código órgão` | Relacionar despesas de pessoal com folha de pagamento |
| SIAFI x Emendas | [Emendas Parlamentares](/docs/apis/transparencia-cgu/emendas-parlamentares) | `Código ação / programa` | Rastrear execução de emendas parlamentares no orçamento |
| SIAFI x Tesouro Transparente | [Tesouro Transparente](/docs/apis/portais-centrais/tesouro-transparente) | `Código SIAFI / exercício` | Complementar com dados de transferências e dívida pública |

### Receita: comparar orçamento aprovado com execução real

```python
import requests
import pandas as pd

BASE_URL = "https://apidatalake.tesouro.gov.br/ords/sadipem/tt"


def comparar_dotacao_execucao(exercicio: int):
    """
    Compara a dotação orçamentária inicial com os valores efetivamente executados
    por função orçamentária.

    Args:
        exercicio: Ano do exercício fiscal

    Returns:
        DataFrame com dotação vs. execução por função
    """
    url = f"{BASE_URL}/execucao-despesa"
    params = {"an_exercicio": exercicio, "limit": 5000}

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

    df = pd.DataFrame(registros)
    if df.empty:
        return df

    # Agrupar por função orçamentária
    resumo = (
        df.groupby("no_funcao")
        .agg(
            dotacao_inicial=("vl_dotacao_inicial", "sum"),
            empenhado=("vl_empenhado", "sum"),
            pago=("vl_pago", "sum"),
        )
        .reset_index()
    )
    resumo["taxa_execucao_%"] = (resumo["pago"] / resumo["dotacao_inicial"] * 100).round(2)
    return resumo.sort_values("dotacao_inicial", ascending=False)


# Exemplo: comparação dotação x execução em 2024
resumo = comparar_dotacao_execucao(2024)
if not resumo.empty:
    print("Execução orçamentária por função (R$):")
    print(resumo.head(10).to_string(index=False))
```

## Limitações conhecidas

| Limitação | Detalhes |
|-----------|----------|
| **Sem API pública direta** | O SIAFI não possui API pública própria. Os dados são acessados indiretamente via Tesouro Transparente e Portal da Transparência. |
| **Defasagem de dados** | Dados mensais são publicados com aproximadamente 30 a 60 dias de atraso em relação à data de referência. |
| **Granularidade variável** | Nem todos os endpoints expõem dados no nível mais detalhado (nota de empenho individual). Para esse nível, usar o Portal da Transparência. |
| **Paginação obrigatória** | Resultados são paginados; conjuntos grandes exigem múltiplas requisições iterando sobre `offset`. |
| **Classificação orçamentária complexa** | A estrutura funcional-programática (função, subfunção, programa, ação, plano orçamentário) exige conhecimento técnico de orçamento público. |
| **Mudanças de estrutura** | Alterações na classificação orçamentária entre exercícios (ex: fusão/criação de ministérios) dificultam séries temporais. |
| **Restos a pagar** | Despesas empenhadas em um exercício podem ser pagas em exercícios seguintes como "restos a pagar", o que pode causar dupla contagem se não tratado corretamente. |
| **Sem documentação Swagger** | As APIs do Tesouro Transparente não possuem documentação interativa Swagger/OpenAPI completa. |
