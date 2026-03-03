---
title: SISBAJUD — Sistema de Busca de Ativos do Poder Judiciário
slug: sisbajud
orgao: CNJ / Banco Central
url_base: https://sisbajud.cnj.jus.br/
tipo_acesso: Sistema restrito (uso exclusivo do Poder Judiciário)
autenticacao: Certificado digital (magistrados e servidores autorizados)
formato_dados: [JSON (interno)]
frequencia_atualizacao: Tempo real
campos_chave:
  - numero_processo
  - CPF
  - CNPJ
  - valor_bloqueio
  - instituicao_financeira
tags:
  - bloqueio judicial
  - contas bancárias
  - poder judiciário
  - CNJ
  - SISBAJUD
  - penhora online
  - execução
  - BacenJud
  - Teimosinha
  - PDPJ-Br
cruzamento_com:
  - poder-judiciario-cnj/datajud
  - poder-judiciario-cnj/bnmp
  - banco-central/ifdata
  - receita-federal/cnpj-completa
  - receita-federal/qsa
  - transparencia-cgu/ceis
status: documentado
---

# SISBAJUD — Sistema de Busca de Ativos do Poder Judiciário

## O que é

O **SISBAJUD (Sistema de Busca de Ativos do Poder Judiciário)** é o sistema eletrônico mantido pelo **Conselho Nacional de Justiça (CNJ)** em parceria com o **Banco Central do Brasil (BCB)** que permite a magistrados realizar, de forma eletrônica e instantânea, o bloqueio, desbloqueio e consulta de ativos financeiros de pessoas físicas e jurídicas em todas as instituições financeiras do país.

O SISBAJUD é o sucessor do **BacenJud** (desativado em 2020) e representa uma evolução significativa em termos de funcionalidades:

- **Bloqueio de valores** — congelamento de saldos em contas bancárias, poupanças, investimentos
- **Teimosinha** — funcionalidade que mantém a ordem de bloqueio ativa por até 30 dias, capturando automaticamente valores que ingressem nas contas (incluindo bancos digitais desde 2022)
- **Consulta de ativos** — levantamento de saldos e extratos em todas as instituições financeiras
- **Desbloqueio** — liberação total ou parcial de valores bloqueados
- **Transferência** — transferência de valores bloqueados para conta judicial
- **Requisição de informações** — solicitação de dados financeiros para instrução processual

### Números do SISBAJUD (outubro/2025)

| Indicador | Valor |
|---|---|
| Total de ordens de bloqueio | 122+ milhões |
| Valor total bloqueado | R$ 115,5 trilhões |
| Valor transferido para contas judiciais | R$ 325+ bilhões |
| Taxa de conversão | 20% das ordens convertidas em depósitos judiciais |
| Justiça Estadual | ~50% das ordens (61+ milhões) |
| Justiça do Trabalho | ~46% das ordens (56+ milhões) |

> **Importante:** O SISBAJUD é um sistema de uso **exclusivo do Poder Judiciário**. Não existe acesso público ou API pública. Esta página documenta o sistema para fins de referência, compreensão do ecossistema de dados judiciais e possíveis cruzamentos com dados públicos.

## Como acessar

### Acesso restrito (Poder Judiciário)

| Item | Detalhe |
|---|---|
| **URL** | `https://sisbajud.cnj.jus.br/` |
| **Documentação PDPJ-Br** | `https://docs.pdpj.jus.br/servicos-negociais/sisbajud/` |
| **Tipo de acesso** | Restrito — uso exclusivo de magistrados e servidores autorizados |
| **Autenticação** | Certificado digital (e-CPF/e-CNPJ padrão ICP-Brasil) |
| **Regulamentação** | Portaria CNJ nº 03/2024 + Resolução BCB nº 584/2024 |

### Acesso público — não disponível

O SISBAJUD **não possui** interface pública, API REST ou dados abertos. Informações públicas são obtidas a partir de:

- **Painel de Monitoramento** — dashboard do CNJ com dados agregados (lançado em 2025)
- **Justiça em Números** — relatório anual do CNJ com estatísticas
- **Decisões judiciais** — menções a bloqueios em processos públicos
- **Relatórios institucionais** — publicações periódicas do CNJ

### Para advogados e partes processuais

1. Consulta ao extrato bancário junto à instituição financeira
2. Petição nos autos do processo judicial
3. Consulta processual nos portais dos tribunais

## Endpoints/recursos principais

### Funcionalidades do sistema (uso interno)

| Funcionalidade | Descrição | Acesso |
|---|---|---|
| Bloqueio de valores | Congelamento de ativos financeiros em todas as instituições | Magistrados |
| Teimosinha | Bloqueio recorrente por até 30 dias (inclui bancos digitais) | Magistrados |
| Desbloqueio | Liberação total ou parcial de valores | Magistrados |
| Transferência | Transferência de valores bloqueados para conta judicial | Magistrados |
| Consulta de saldos | Levantamento de saldos em todas as instituições | Magistrados |
| Consulta de extratos | Solicitação de extratos bancários | Magistrados |
| Requisição de informações | Pedido de dados cadastrais bancários | Magistrados |

### Painel de Monitoramento (público — 2025)

| Recurso | Descrição |
|---|---|
| Ranking de instituições | Taxa de resposta das instituições (maior/menor percentual) |
| Classes processuais | Consulta de ordens por classe processual |
| Bloqueios e transferências | Visualização detalhada de volumes |
| Análise temporal | Evolução histórica de ordens e valores |

### Instituições financeiras integradas

O SISBAJUD está integrado com **todas** as instituições autorizadas pelo Banco Central:

- Bancos comerciais e múltiplos
- Bancos de investimento
- Caixas Econômicas
- Cooperativas de crédito
- Corretoras e distribuidoras de valores
- Instituições de pagamento
- **Bancos digitais e fintechs** (integrados desde 2022)

## Exemplo de uso

### Análise de dados públicos sobre bloqueios judiciais

```python
import pandas as pd

# O SISBAJUD não possui API pública. No entanto, é possível analisar
# dados agregados a partir do Painel de Monitoramento do CNJ e
# do relatório Justiça em Números.

# Dados agregados extraídos de fontes públicas do CNJ
dados_sisbajud = {
    "ano": [2020, 2021, 2022, 2023, 2024, 2025],
    "ordens_bloqueio_mi": [30, 35, 38, 42, 48, 55],
    "valor_bloqueado_tri": [60, 80, 100, 115, 130, 150],
    "valor_transferido_bi": [180, 220, 260, 290, 310, 325],
    "ordens_teimosinha_mi": [0, 5, 8, 12, 16, 20],
}

df = pd.DataFrame(dados_sisbajud)

# Taxa de crescimento anual
df["crescimento_ordens_pct"] = df["ordens_bloqueio_mi"].pct_change() * 100

print("Evolução do SISBAJUD (dados agregados):")
print(df.to_string(index=False))
print(f"\nCrescimento médio anual: {df['crescimento_ordens_pct'].mean():.1f}%")
```

### Verificar bloqueios via consulta processual no DataJud

```python
import requests

# Embora o SISBAJUD não tenha API pública, é possível identificar
# processos com bloqueios judiciais consultando movimentações
# processuais no DataJud que mencionam bloqueio/penhora.

API_KEY = "SEU_TOKEN_DATAJUD"
headers = {
    "Authorization": f"APIKey {API_KEY}",
    "Content-Type": "application/json",
}


def buscar_processos_com_bloqueio(tribunal: str, tamanho: int = 10) -> list:
    """
    Busca processos com movimentações de bloqueio/penhora
    no DataJud (proxy para identificar uso do SISBAJUD).

    Args:
        tribunal: Sigla do tribunal (ex: 'tjsp')
        tamanho: Número de resultados

    Returns:
        Lista de processos com movimentações de bloqueio
    """
    url = f"https://api-publica.datajud.cnj.jus.br/api_publica_{tribunal}/_search"

    query = {
        "size": tamanho,
        "query": {
            "nested": {
                "path": "movimentos",
                "query": {
                    "match": {
                        "movimentos.nome": "penhora",
                    }
                },
            }
        },
        "sort": [{"dataAjuizamento": {"order": "desc"}}],
    }

    response = requests.post(url, headers=headers, json=query)
    response.raise_for_status()
    resultado = response.json()

    return [hit["_source"] for hit in resultado.get("hits", {}).get("hits", [])]


# Exemplo: buscar processos com penhora no TJSP
processos = buscar_processos_com_bloqueio("tjsp", tamanho=5)
for p in processos:
    print(f"Processo: {p['numeroProcesso']}")
    print(f"  Classe: {p['classe']['nome']}")
    movimentos_penhora = [
        m for m in p.get("movimentos", [])
        if "penhora" in m.get("nome", "").lower()
    ]
    for m in movimentos_penhora:
        print(f"  Penhora em: {m.get('dataHora', 'N/A')}")
    print()
```

### Cruzar empresas com processos de execução

```python
import requests

API_KEY_DATAJUD = "SEU_TOKEN_DATAJUD"
headers_dj = {
    "Authorization": f"APIKey {API_KEY_DATAJUD}",
    "Content-Type": "application/json",
}


def verificar_execucoes_empresa(tribunal: str, cnpj: str) -> list:
    """
    Verifica se uma empresa possui processos de execução
    (que podem envolver bloqueios via SISBAJUD).

    Args:
        tribunal: Sigla do tribunal (ex: 'tjsp')
        cnpj: CNPJ da empresa (14 dígitos)

    Returns:
        Lista de processos de execução encontrados
    """
    url = f"https://api-publica.datajud.cnj.jus.br/api_publica_{tribunal}/_search"

    # Classes de execução comuns:
    # 156 = Execução Fiscal
    # 159 = Execução de Título Extrajudicial
    # 164 = Cumprimento de Sentença
    query = {
        "size": 10,
        "query": {
            "bool": {
                "must": [
                    {"match": {"numeroProcesso": cnpj}},
                    {"terms": {"classe.codigo": [156, 159, 164]}},
                ]
            }
        },
    }

    response = requests.post(url, headers=headers_dj, json=query)
    response.raise_for_status()
    resultado = response.json()

    return [hit["_source"] for hit in resultado.get("hits", {}).get("hits", [])]


# Exemplo
processos = verificar_execucoes_empresa("tjsp", "00000000000191")
print(f"Processos de execução encontrados: {len(processos)}")
```

## Campos disponíveis

### Dados do sistema (uso interno — não disponível publicamente)

| Campo | Tipo | Descrição |
|---|---|---|
| `numero_processo` | string | Número do processo judicial (formato CNJ) |
| `tipo_ordem` | string | Tipo da ordem (bloqueio, desbloqueio, transferência, consulta) |
| `cpf_cnpj_executado` | string | CPF ou CNPJ do executado |
| `nome_executado` | string | Nome ou razão social do executado |
| `valor_solicitado` | decimal | Valor solicitado para bloqueio (R$) |
| `valor_bloqueado` | decimal | Valor efetivamente bloqueado (R$) |
| `instituicao_financeira` | string | Nome da instituição financeira |
| `codigo_ispb` | string | Código ISPB da instituição financeira |
| `tipo_conta` | string | Tipo da conta (corrente, poupança, investimento) |
| `data_ordem` | datetime | Data e hora da emissão da ordem |
| `data_cumprimento` | datetime | Data e hora do cumprimento pela instituição |
| `status` | string | Status (cumprida, parcialmente cumprida, não cumprida, cancelada) |
| `magistrado` | string | Nome do magistrado que emitiu a ordem |
| `vara_origem` | string | Vara de origem da ordem |
| `teimosinha` | boolean | Indica se a funcionalidade Teimosinha está ativa |
| `prazo_teimosinha` | int | Prazo da Teimosinha em dias (máximo 30) |
| `motivo_desbloqueio` | string | Motivo do desbloqueio (quando aplicável) |

### Dados agregados (Painel de Monitoramento / Justiça em Números)

| Campo | Tipo | Descrição |
|---|---|---|
| `ano` | int | Ano de referência |
| `tribunal` | string | Tribunal de origem |
| `total_ordens` | int | Total de ordens emitidas no período |
| `valor_total_bloqueado` | decimal | Valor total bloqueado no período (R$) |
| `total_ordens_teimosinha` | int | Total de ordens com Teimosinha |
| `taxa_resposta_instituicao` | float | Percentual de respostas das instituições financeiras |
| `classe_processual` | string | Classe processual da ordem |

## Cruzamentos possíveis

| Cruzamento | Fonte relacionada | Chave de ligação | Finalidade |
|---|---|---|---|
| Bloqueios x Processos | [DataJud](/docs/apis/poder-judiciario-cnj/datajud) | `numero_processo` | Obter detalhes do processo que originou o bloqueio |
| Bloqueios x Mandados | [BNMP](/docs/apis/poder-judiciario-cnj/bnmp) | `numero_processo` | Verificar se o mesmo processo tem mandados de prisão associados |
| Bloqueios x Instituições | [IFData](/docs/apis/banco-central/ifdata) | `codigo_ispb` | Identificar perfil da instituição financeira |
| Bloqueios x Empresas | [CNPJ Completa](/docs/apis/receita-federal/cnpj-completa) | `CNPJ` | Obter dados cadastrais das empresas com bloqueio |
| Bloqueios x Sócios | [QSA](/docs/apis/receita-federal/qsa) | `CNPJ` → sócios | Identificar sócios de empresas com bloqueios |
| Bloqueios x Sanções | [CEIS](/docs/apis/transparencia-cgu/ceis) | `CNPJ` | Verificar se empresas com bloqueios constam em cadastros de sanções |

## Limitações conhecidas

| Limitação | Detalhes |
|---|---|
| **Sem acesso público** | O SISBAJUD é de uso exclusivo do Poder Judiciário. Não há API pública, interface cidadã ou dados abertos. |
| **Dados individualizados sigilosos** | Dados sobre bloqueios específicos são acessíveis apenas nos autos do processo judicial. |
| **Dados agregados limitados** | As estatísticas públicas vêm do Painel de Monitoramento (2025) e do Justiça em Números. |
| **Substituiu o BacenJud** | O BacenJud foi desativado em 2020. Dados históricos do sistema anterior podem não ter sido migrados. |
| **Bloqueios indevidos** | Valores impenhoráveis (salários, aposentadorias até certo limite, FGTS) podem ser bloqueados indevidamente, exigindo desbloqueio manual via petição. |
| **Teimosinha — limite de 30 dias** | A funcionalidade tem prazo máximo de 30 dias, podendo não capturar a totalidade do débito. |
| **Sem histórico público** | Não é possível consultar publicamente o histórico de bloqueios de uma pessoa ou empresa. |
| **Dependência do sistema bancário** | A efetividade depende da resposta das instituições financeiras. A taxa de resposta varia entre instituições (visível no Painel de Monitoramento). |
