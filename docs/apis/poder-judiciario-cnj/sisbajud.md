---
title: SISBAJUD — Sistema de Bloqueio Judicial
slug: sisbajud
orgao: CNJ
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
cruzamento_com:
  - poder-judiciario-cnj/datajud
  - poder-judiciario-cnj/bnmp
  - banco-central/ifdata
  - receita-federal/cnpj-completa
  - receita-federal/qsa
  - transparencia-cgu/ceis
status: stub
---

# SISBAJUD — Sistema de Bloqueio Judicial

## O que é

O **SISBAJUD (Sistema de Busca de Ativos do Poder Judiciário)** é o sistema eletrônico mantido pelo **Conselho Nacional de Justiça (CNJ)** em parceria com o **Banco Central do Brasil (BCB)** que permite a magistrados realizar, de forma eletrônica e instantânea, o bloqueio, desbloqueio e consulta de ativos financeiros de pessoas físicas e jurídicas em todas as instituições financeiras do país.

O SISBAJUD é o sucessor do **BacenJud** (desativado em 2020) e representa uma evolução significativa em termos de funcionalidades, incluindo:

- **Bloqueio de valores** — congelamento de saldos em contas bancárias, poupanças, investimentos
- **Teimosinha** — funcionalidade que mantém a ordem de bloqueio ativa por até 30 dias, capturando automaticamente valores que ingressem nas contas
- **Consulta de ativos** — levantamento de saldos e extratos em todas as instituições financeiras
- **Desbloqueio** — liberação total ou parcial de valores bloqueados
- **Requisição de informações** — solicitação de dados financeiros para instrução processual

O sistema é essencial para a efetividade das decisões judiciais em processos de execução, permitindo a constrição patrimonial de devedores de forma célere e abrangente.

> **Importante:** O SISBAJUD é um sistema de uso **exclusivo do Poder Judiciário**. Não existe acesso público ou API pública. Esta página documenta o sistema para fins de referência, compreensão do ecossistema de dados judiciais e possíveis cruzamentos com dados públicos.

## Como acessar

### Acesso restrito (Poder Judiciário)

| Item | Detalhe |
|---|---|
| **URL** | `https://sisbajud.cnj.jus.br/` |
| **Tipo de acesso** | Sistema restrito — uso exclusivo de magistrados e servidores autorizados |
| **Autenticação** | Certificado digital (e-CPF/e-CNPJ padrão ICP-Brasil) |
| **Quem pode acessar** | Magistrados, servidores do judiciário designados por portaria |

### Acesso público — não disponível

O SISBAJUD **não possui** interface pública, API REST ou dados abertos. As informações sobre o sistema são obtidas a partir de:

- Documentação institucional do CNJ
- Relatórios do Justiça em Números (estatísticas agregadas)
- Decisões judiciais públicas que mencionam bloqueios via SISBAJUD
- Notícias e publicações do CNJ

### Para advogados e partes processuais

Advogados e partes podem verificar a existência de bloqueios judiciais em suas contas por meio de:

1. Consulta ao extrato bancário junto à instituição financeira
2. Petição nos autos do processo judicial
3. Consulta processual nos portais dos tribunais

## Endpoints/recursos principais

O SISBAJUD é um sistema interno e não disponibiliza endpoints públicos. A documentação abaixo descreve os recursos disponíveis para usuários autorizados (magistrados), com base em informações institucionais do CNJ:

### Funcionalidades do sistema

| Funcionalidade | Descrição | Acesso |
|---|---|---|
| Bloqueio de valores | Ordem de congelamento de ativos financeiros | Magistrados |
| Teimosinha | Bloqueio recorrente por até 30 dias | Magistrados |
| Desbloqueio | Liberação total ou parcial de valores | Magistrados |
| Transferência | Transferência de valores bloqueados para conta judicial | Magistrados |
| Consulta de saldos | Levantamento de saldos em todas as instituições | Magistrados |
| Consulta de extratos | Solicitação de extratos bancários | Magistrados |
| Requisição de informações | Pedido de dados cadastrais bancários | Magistrados |

### Instituições financeiras participantes

O SISBAJUD está integrado com todas as instituições financeiras autorizadas pelo Banco Central, incluindo:

- Bancos comerciais e múltiplos
- Bancos de investimento
- Cooperativas de crédito
- Corretoras e distribuidoras de valores
- Instituições de pagamento
- Fintechs reguladas pelo BCB

## Exemplo de uso

### Análise de dados públicos sobre bloqueios judiciais

```python
import pandas as pd

# O SISBAJUD não possui API pública. No entanto, é possível analisar
# dados agregados sobre bloqueios judiciais a partir de:
# 1. Relatório Justiça em Números (CNJ)
# 2. Decisões judiciais públicas
# 3. Relatórios institucionais do CNJ

# Exemplo: dados agregados hipotéticos do Justiça em Números
dados_sisbajud = {
    "ano": [2020, 2021, 2022, 2023],
    "ordens_bloqueio": [30_000_000, 35_000_000, 38_000_000, 42_000_000],
    "valor_bloqueado_bi": [120, 145, 160, 180],
    "ordens_desbloqueio": [15_000_000, 18_000_000, 20_000_000, 22_000_000],
    "ordens_teimosinha": [None, 5_000_000, 8_000_000, 12_000_000],
}

df = pd.DataFrame(dados_sisbajud)
df["taxa_efetividade"] = (
    (df["ordens_bloqueio"] - df["ordens_desbloqueio"])
    / df["ordens_bloqueio"]
    * 100
)

print("Estatísticas agregadas do SISBAJUD:")
print(df.to_string(index=False))
```

### Verificar bloqueios via consulta processual no DataJud

```python
import requests

# Embora o SISBAJUD não tenha API pública, é possível identificar
# processos com bloqueios judiciais consultando as movimentações
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
        tribunal: Sigla do tribunal
        tamanho: Número de resultados

    Returns:
        Lista de processos com movimentações de bloqueio
    """
    url = f"https://api-publica.datajud.cnj.jus.br/api_publica_{tribunal}/_search"

    # Buscar processos que contenham movimentações de penhora/bloqueio
    # Código 60 = Penhora (conforme Tabelas Processuais Unificadas)
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
import pandas as pd

# Identificar empresas que podem ter sido alvo de bloqueios
# cruzando CNPJ com processos de execução no DataJud.

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
        tribunal: Sigla do tribunal
        cnpj: CNPJ da empresa

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
                    {
                        "terms": {
                            "classe.codigo": [156, 159, 164],
                        }
                    },
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

Os campos abaixo são documentados com base em informações institucionais do CNJ e não estão acessíveis via API pública:

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
| `status` | string | Status da ordem (cumprida, parcialmente cumprida, não cumprida, cancelada) |
| `magistrado` | string | Nome do magistrado que emitiu a ordem |
| `vara_origem` | string | Vara de origem da ordem |
| `teimosinha` | boolean | Indica se a funcionalidade Teimosinha está ativa |
| `prazo_teimosinha` | int | Prazo da Teimosinha em dias (máximo 30) |
| `motivo_desbloqueio` | string | Motivo do desbloqueio (quando aplicável) |

### Dados agregados disponíveis publicamente (via Justiça em Números)

| Campo | Tipo | Descrição |
|---|---|---|
| `ano` | int | Ano de referência |
| `tribunal` | string | Tribunal de origem |
| `total_ordens` | int | Total de ordens emitidas no período |
| `valor_total_bloqueado` | decimal | Valor total bloqueado no período (R$) |
| `total_ordens_teimosinha` | int | Total de ordens com Teimosinha |

## Cruzamentos possíveis

| Cruzamento | Fonte relacionada | Chave de ligação | Finalidade |
|---|---|---|---|
| Bloqueios x Processos | [DataJud](/docs/apis/poder-judiciario-cnj/datajud) | `numero_processo` | Obter detalhes do processo que originou o bloqueio |
| Bloqueios x Mandados | [BNMP](/docs/apis/poder-judiciario-cnj/bnmp) | `numero_processo` | Verificar se o mesmo processo tem mandados de prisão associados |
| Bloqueios x Instituições financeiras | [IFData](/docs/apis/banco-central/ifdata) | `instituicao_financeira` | Identificar o perfil da instituição financeira onde valores foram bloqueados |
| Bloqueios x Empresas | [Receita Federal — CNPJ](/docs/apis/receita-federal/cnpj-completa) | `CNPJ` | Obter dados cadastrais das empresas que sofreram bloqueio |
| Bloqueios x Sócios | [Receita Federal — QSA](/docs/apis/receita-federal/qsa) | `CNPJ` → sócios | Identificar sócios de empresas com bloqueios judiciais |
| Bloqueios x Sanções | [CGU — CEIS](/docs/apis/transparencia-cgu/ceis) | `CNPJ` | Verificar se empresas com bloqueios também constam em cadastros de sanções |

## Limitações conhecidas

| Limitação | Detalhes |
|---|---|
| **Sem acesso público** | O SISBAJUD é de uso exclusivo do Poder Judiciário. Não há API pública, interface de consulta cidadã ou dados abertos. |
| **Sem dados individualizados públicos** | Dados sobre bloqueios específicos são sigilosos e acessíveis apenas nos autos do processo judicial. |
| **Dados agregados limitados** | As únicas estatísticas públicas sobre o SISBAJUD são as publicadas no Justiça em Números e em relatórios institucionais do CNJ. |
| **Substituiu o BacenJud** | O BacenJud foi desativado em 2020. Dados históricos do sistema anterior podem não ter sido totalmente migrados. |
| **Dependência do sistema bancário** | A efetividade dos bloqueios depende da resposta das instituições financeiras. Contas em instituições não integradas podem não ser alcançadas. |
| **Impenhorabilidades** | Valores impenhoráveis (salários, aposentadorias até certo limite, FGTS) devem ser excluídos manualmente, podendo gerar bloqueios indevidos que são posteriormente revertidos. |
| **Teimosinha — limitações** | A funcionalidade Teimosinha tem prazo máximo de 30 dias e é limitada a valores específicos, podendo não capturar a totalidade do débito. |
| **Sem histórico público** | Não é possível consultar publicamente o histórico de bloqueios e desbloqueios de uma pessoa ou empresa. |
