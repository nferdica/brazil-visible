---
title: BNMP — Banco Nacional de Mandados de Prisão
slug: bnmp
orgao: CNJ
url_base: https://portalbnmp.cnj.jus.br/
tipo_acesso: Interface web (consulta pública)
autenticacao: Não requerida (consulta básica)
formato_dados: [HTML, JSON (interno)]
frequencia_atualizacao: Diária (tempo real)
campos_chave:
  - numero_mandado
  - numero_processo
  - CPF
  - nome_pessoa
  - tipo_peca
tags:
  - mandados de prisão
  - poder judiciário
  - CNJ
  - BNMP
  - prisão
  - segurança pública
  - foragidos
  - justiça criminal
cruzamento_com:
  - poder-judiciario-cnj/datajud
  - poder-judiciario-cnj/sisbajud
  - transparencia-cgu/servidores-federais
  - justica-eleitoral-tse/candidaturas
  - receita-federal/cnpj-completa
status: stub
---

# BNMP — Banco Nacional de Mandados de Prisão

## O que é

O **BNMP (Banco Nacional de Mandados de Prisão)** é o cadastro nacional mantido pelo **Conselho Nacional de Justiça (CNJ)** que reúne todos os mandados de prisão expedidos pelo Poder Judiciário brasileiro. Instituído pela **Lei nº 12.403/2011** e regulamentado pela **Resolução CNJ nº 137/2011**, o BNMP é o instrumento oficial para controle e consulta de mandados de prisão em âmbito nacional.

O sistema registra:

- **Mandados de prisão** — temporária, preventiva, definitiva (condenação), civil (alimentos)
- **Guias de recolhimento** — documentos que autorizam a execução da pena
- **Alvarás de soltura** — ordens de liberação
- **Contramandados** — revogação de mandados anteriores
- **Mandados de internação** — medidas de segurança

O BNMP permite a consulta pública limitada pelo nome da pessoa, possibilitando verificar a existência de mandados de prisão em aberto contra um indivíduo. A versão atual do sistema é o **BNMP 2.0**, que substituiu o sistema anterior com melhorias na integração com os tribunais.

> **Importante:** O BNMP não disponibiliza API pública REST. O acesso é feito exclusivamente via interface web no portal do CNJ. Esta página documenta o sistema para fins de referência e possíveis integrações futuras.

## Como acessar

### Consulta pública

| Item | Detalhe |
|---|---|
| **URL** | `https://portalbnmp.cnj.jus.br/` |
| **Tipo de acesso** | Interface web |
| **Autenticação** | Não requerida para consulta básica por nome |
| **Formatos** | HTML (visualização na tela) |

### Passos para consulta

1. Acesse `https://portalbnmp.cnj.jus.br/`
2. Selecione o tipo de pesquisa (por nome, número do mandado, etc.)
3. Preencha os dados de busca
4. Resolva o CAPTCHA
5. Visualize os resultados na tela

### Acesso institucional

Magistrados, membros do Ministério Público e autoridades policiais possuem acesso ampliado ao BNMP via certificado digital (e-CPF/e-CNPJ), com funcionalidades adicionais como cadastro, atualização e baixa de mandados.

## Endpoints/recursos principais

O BNMP não possui API REST pública documentada. O acesso é feito exclusivamente via interface web. Abaixo, os recursos disponíveis na consulta pública:

### Tipos de consulta pública

| Consulta | Descrição | Campos de busca |
|---|---|---|
| Por nome | Busca mandados por nome da pessoa | Nome completo ou parcial |
| Por número do mandado | Busca por número específico do mandado | Número do mandado |
| Por número do processo | Busca mandados vinculados a um processo | Número do processo (formato CNJ) |
| Por CPF | Busca por CPF da pessoa | CPF (acesso restrito) |

### Tipos de peças registradas

| Tipo | Descrição |
|---|---|
| Mandado de prisão temporária | Prisão por prazo determinado durante investigação |
| Mandado de prisão preventiva | Prisão cautelar durante o processo |
| Mandado de prisão definitiva | Prisão por condenação transitada em julgado |
| Mandado de prisão civil | Prisão por dívida de alimentos |
| Mandado de internação | Medida de segurança (internação compulsória) |
| Guia de recolhimento | Documento para execução da pena |
| Alvará de soltura | Ordem de liberação do preso |
| Contramandado | Revogação de mandado anterior |

## Exemplo de uso

### Consulta automatizada (web scraping)

```python
import requests
from bs4 import BeautifulSoup

# ATENÇÃO: O BNMP não possui API pública oficial.
# O exemplo abaixo ilustra uma abordagem conceitual de scraping.
# O portal utiliza CAPTCHA, o que inviabiliza scraping automatizado
# em larga escala. Use apenas para fins de estudo.
#
# Para acesso programático, é recomendado solicitar ao CNJ
# acesso institucional ou utilizar os dados do DataJud.

# Exemplo conceitual (NÃO funcional devido ao CAPTCHA):
url = "https://portalbnmp.cnj.jus.br/"

session = requests.Session()

# 1. Acessar a página inicial
response = session.get(url)
print(f"Status: {response.status_code}")
print("O portal utiliza CAPTCHA, impedindo scraping automatizado.")
print("Para consultas programáticas, considere:")
print("  - Solicitar acesso institucional ao CNJ")
print("  - Usar o DataJud para dados processuais relacionados")
print("  - Consultar o portal manualmente para casos específicos")
```

### Verificação manual com registro em planilha

```python
import pandas as pd
from datetime import datetime

# Workflow recomendado: consulta manual no portal + registro estruturado
# Este exemplo demonstra como organizar os resultados de consultas
# manuais no BNMP em uma planilha para análises posteriores.

# Registro de consultas realizadas manualmente no portal
consultas = {
    "data_consulta": ["2024-01-15", "2024-01-15", "2024-01-16"],
    "nome_consultado": ["João da Silva", "Maria Santos", "Carlos Oliveira"],
    "resultado": ["mandado_encontrado", "nenhum_mandado", "mandado_encontrado"],
    "tipo_mandado": ["Prisão preventiva", None, "Prisão definitiva"],
    "numero_mandado": ["0001234-56.2023.1.00.0001", None, "0007890-12.2023.1.00.0002"],
    "tribunal_origem": ["TJSP", None, "TJRJ"],
    "observacoes": [
        "Mandado expedido em 10/2023",
        "Nenhum registro encontrado",
        "Trânsito em julgado em 08/2023",
    ],
}

df = pd.DataFrame(consultas)
df["data_consulta"] = pd.to_datetime(df["data_consulta"])

print("Registro de consultas ao BNMP:")
print(df.to_string(index=False))

# Exportar para análise posterior
# df.to_csv("consultas_bnmp.csv", index=False, encoding="utf-8")
```

### Cruzamento com dados do DataJud

```python
import requests

# Após identificar um mandado de prisão no BNMP,
# é possível buscar o processo correspondente no DataJud.

API_KEY = "SEU_TOKEN_DATAJUD"
headers = {
    "Authorization": f"APIKey {API_KEY}",
    "Content-Type": "application/json",
}


def buscar_processo_por_numero(tribunal: str, numero_processo: str) -> dict:
    """
    Busca detalhes de um processo no DataJud a partir do número
    identificado em um mandado de prisão do BNMP.

    Args:
        tribunal: Sigla do tribunal (ex: 'tjsp')
        numero_processo: Número do processo (formato CNJ)

    Returns:
        Dados do processo
    """
    url = f"https://api-publica.datajud.cnj.jus.br/api_publica_{tribunal}/_search"

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


# Exemplo: buscar processo vinculado a um mandado do BNMP
processo = buscar_processo_por_numero("tjsp", "0001234-56.2023.8.26.0100")
if processo:
    print(f"Classe: {processo.get('classe', {}).get('nome')}")
    print(f"Órgão julgador: {processo.get('orgaoJulgador', {}).get('nome')}")
```

## Campos disponíveis

### Dados exibidos na consulta pública

| Campo | Tipo | Descrição |
|---|---|---|
| `nome_pessoa` | string | Nome completo da pessoa procurada |
| `alcunha` | string | Apelido ou alcunha (quando registrado) |
| `numero_mandado` | string | Número do mandado de prisão |
| `tipo_peca` | string | Tipo da peça (mandado de prisão, guia de recolhimento, etc.) |
| `situacao` | string | Situação do mandado (em aberto, cumprido, revogado) |
| `tribunal_origem` | string | Tribunal que expediu o mandado |
| `orgao_expedidor` | string | Vara ou juízo que expediu |
| `municipio` | string | Município do órgão expedidor |
| `uf` | string | Unidade federativa |
| `data_expedicao` | date | Data de expedição do mandado |
| `numero_processo` | string | Número do processo judicial vinculado |
| `tipificacao_penal` | string | Tipificação penal (artigos e leis) |
| `recaptura` | boolean | Indica se é mandado de recaptura |
| `sintese_decisao` | string | Resumo da decisão que originou o mandado |

## Cruzamentos possíveis

| Cruzamento | Fonte relacionada | Chave de ligação | Finalidade |
|---|---|---|---|
| Mandados x Processos | [DataJud](/docs/apis/poder-judiciario-cnj/datajud) | `numero_processo` | Obter detalhes completos do processo que originou o mandado |
| Mandados x Bloqueios | [SISBAJUD](/docs/apis/poder-judiciario-cnj/sisbajud) | `numero_processo` | Verificar se há bloqueios financeiros vinculados ao mesmo processo |
| Mandados x Servidores | [CGU — Servidores Federais](/docs/apis/transparencia-cgu/servidores-federais) | `CPF` / `nome` | Verificar se pessoa com mandado é servidor público federal |
| Mandados x Candidatos | [TSE — Candidaturas](/docs/apis/justica-eleitoral-tse/candidaturas) | `CPF` / `nome` | Verificar se pessoa com mandado é candidato a cargo eletivo |
| Mandados x Empresas | [Receita Federal — CNPJ](/docs/apis/receita-federal/cnpj-completa) | `CPF` → QSA | Identificar empresas cujos sócios possuem mandados de prisão |

## Limitações conhecidas

| Limitação | Detalhes |
|---|---|
| **Sem API pública** | O BNMP não disponibiliza API REST. O acesso é exclusivamente via interface web com CAPTCHA. |
| **CAPTCHA** | Todas as consultas públicas exigem resolução de CAPTCHA, impedindo automação. |
| **Dados limitados na consulta pública** | A consulta pública exibe apenas informações básicas. Dados detalhados exigem acesso institucional. |
| **Busca por nome apenas** | A consulta pública mais acessível é por nome; busca por CPF é restrita a usuários autenticados. |
| **Sem exportação de dados** | Não é possível exportar os resultados da consulta em formato estruturado (CSV, JSON). |
| **Cobertura** | Embora obrigatório para todos os tribunais, pode haver atraso no registro de mandados por parte de varas com menor infraestrutura de TI. |
| **Mandados antigos** | Mandados anteriores à implantação do BNMP 2.0 podem não estar totalmente migrados para o sistema atual. |
| **Dados pessoais sensíveis** | Por tratar de dados criminais, o acesso é naturalmente restrito por questões de privacidade e segurança (LGPD). |
| **Homônimos** | A busca por nome pode retornar resultados de homônimos, exigindo verificação adicional para confirmação de identidade. |
