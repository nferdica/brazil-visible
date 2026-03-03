---
title: BNMP 3.0 — Banco Nacional de Medidas Penais e Prisões
slug: bnmp
orgao: CNJ
url_base: https://portalbnmp.cnj.jus.br/
tipo_acesso: Portal web (consulta pública) / API (PDPJ-Br)
autenticacao: Não requerida (consulta básica) / Token (API PDPJ-Br)
formato_dados: [HTML, JSON]
frequencia_atualizacao: Tempo real
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
  - PDPJ-Br
cruzamento_com:
  - poder-judiciario-cnj/datajud
  - poder-judiciario-cnj/sisbajud
  - transparencia-cgu/servidores-federais
  - justica-eleitoral-tse/candidaturas
  - receita-federal/cnpj-completa
status: documentado
---

# BNMP 3.0 — Banco Nacional de Medidas Penais e Prisões

## O que é

O **BNMP (Banco Nacional de Medidas Penais e Prisões)** é o cadastro nacional mantido pelo **Conselho Nacional de Justiça (CNJ)** que reúne todos os mandados de prisão, medidas penais e informações sobre a população carcerária do Brasil. Instituído pela **Lei nº 12.403/2011** e regulamentado pela **Resolução CNJ nº 137/2011**, o BNMP é o instrumento oficial para controle e consulta de mandados de prisão em âmbito nacional.

A versão atual é o **BNMP 3.0**, lançada em 2024, que trouxe avanços significativos em relação ao BNMP 2.0:

- **Mandados de prisão** — temporária, preventiva, definitiva (condenação), civil (alimentos)
- **Guias de recolhimento** — documentos que autorizam a execução da pena
- **Alvarás de soltura** — ordens de liberação
- **Contramandados** — revogação de mandados anteriores
- **Mandados de internação** — medidas de segurança
- **Audiências de custódia** — dados de custódia incluídos (anteriormente no SISTAC separado)
- **Dados sociodemográficos** — informações ampliadas sobre a população carcerária
- **Relatos de tortura** — documentação de alegações de tortura (novo no BNMP 3.0)

### Números do BNMP (2025)

| Indicador | Quantidade |
|---|---|
| Pessoas privadas de liberdade | 706.000+ |
| Medidas penais alternativas | 156.000 |
| Foragidos | 304.500 |
| Procurados | 1.700 |
| Total de registros | 1.252.350+ |

> **Novidade 2025:** O CNJ lançou o **Painel Estatístico do BNMP 3.0** em março de 2025, permitindo exportação de dados para análise externa.

## Como acessar

### Consulta pública (portal web)

| Item | Detalhe |
|---|---|
| **Portal BNMP** | `https://portalbnmp.cnj.jus.br/` |
| **Serviço Gov.br** | `https://www.gov.br/pt-br/servicos/consultar-mandado-de-prisao` |
| **Tipo de acesso** | Interface web — consulta por nome, número do mandado ou processo |
| **Autenticação** | Não requerida para consulta básica por nome |
| **Formatos** | HTML (visualização na tela) |

### Passos para consulta pública

1. Acesse `https://portalbnmp.cnj.jus.br/`
2. Selecione o tipo de pesquisa (por nome, número do mandado, número do processo)
3. Preencha os dados de busca
4. Visualize os resultados na tela

> **Nota:** Mandados classificados como **sigilosos ou restritos** não são exibidos na consulta pública.

### API via PDPJ-Br (acesso programático)

| Item | Detalhe |
|---|---|
| **Documentação** | `https://docs.pdpj.jus.br/servicos-negociais/bnmp/` |
| **Autenticação** | Token — obtido via POST com CPF, senha, clientId e código do órgão |
| **Formato** | JSON |
| **Acesso** | Magistrados, MP, autoridades policiais e órgãos credenciados |

### Acesso institucional ampliado

Magistrados, membros do Ministério Público e autoridades policiais possuem acesso ampliado ao BNMP via certificado digital (e-CPF/e-CNPJ), com funcionalidades de cadastro, atualização e baixa de mandados.

## Endpoints/recursos principais

### Consulta pública (portal web)

| Consulta | Descrição | Campos de busca |
|---|---|---|
| Por nome | Busca mandados por nome da pessoa | Nome completo ou parcial |
| Por número do mandado | Busca por número específico do mandado | Número do mandado |
| Por número do processo | Busca mandados vinculados a um processo | Número do processo (formato CNJ) |
| Por CPF | Busca por CPF da pessoa | CPF (acesso restrito a autenticados) |

### API PDPJ-Br

| Recurso | Descrição | Acesso |
|---|---|---|
| Consulta de mandados | Buscar mandados por diversos critérios | Token |
| Cadastro de mandados | Registrar novos mandados no sistema | Magistrados |
| Atualização de status | Atualizar situação de mandados (cumprido, revogado) | Magistrados |
| Estatísticas | Dados agregados da população carcerária | Token |
| Audiências de custódia | Registros de custódia (BNMP 3.0) | Token |

### Painel Estatístico (BNMP 3.0)

| Recurso | Descrição |
|---|---|
| Dashboard interativo | Visualização de indicadores da população carcerária |
| Exportação de dados | Download de dados para análise externa |
| Perfil sociodemográfico | Distribuição por gênero, faixa etária, raça/cor |
| Distribuição geográfica | Dados por tribunal, UF e município |

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

### Consulta automatizada via API PDPJ-Br

```python
import requests

# Autenticação na API do BNMP via PDPJ-Br
# Requer credenciamento junto ao CNJ
auth_url = "https://bnmp.cnj.jus.br/auth/token"
auth_data = {
    "username": "SEU_CPF",
    "password": "SUA_SENHA",
    "clientId": "SEU_CLIENT_ID",
    "codigoOrgao": "CODIGO_ORGAO",
}

auth_response = requests.post(auth_url, json=auth_data)
auth_response.raise_for_status()
token = auth_response.json()["access_token"]

headers = {"Authorization": f"Bearer {token}"}

# Exemplo conceitual de consulta
# (endpoints exatos dependem da documentação PDPJ-Br)
print("Autenticação bem-sucedida. Token obtido.")
print("Consulte a documentação completa em:")
print("  https://docs.pdpj.jus.br/servicos-negociais/bnmp/")
```

### Verificação manual com registro estruturado

```python
import pandas as pd

# Workflow recomendado: consulta no portal + registro estruturado
# Este exemplo demonstra como organizar os resultados de consultas
# ao BNMP em uma planilha para análises posteriores.

consultas = {
    "data_consulta": ["2025-01-15", "2025-01-15", "2025-01-16"],
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

### Dados do Painel Estatístico (BNMP 3.0)

| Campo | Tipo | Descrição |
|---|---|---|
| `tribunal` | string | Tribunal de origem |
| `uf` | string | Unidade federativa |
| `total_presos` | int | Total de pessoas privadas de liberdade |
| `total_foragidos` | int | Total de pessoas foragidas |
| `total_medidas_alternativas` | int | Total de medidas penais alternativas |
| `genero` | string | Distribuição por gênero |
| `faixa_etaria` | string | Distribuição por faixa etária |
| `raca_cor` | string | Distribuição por raça/cor |

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
| **Consulta pública restrita** | A consulta pública exibe apenas mandados não sigilosos. Mandados restritos ou sigilosos exigem acesso institucional. |
| **API via PDPJ-Br** | O acesso programático via API é restrito a magistrados, MP e órgãos credenciados. Não há API pública aberta. |
| **Busca por CPF restrita** | A busca por CPF na consulta pública é restrita a usuários autenticados com certificado digital. |
| **Sem exportação na consulta pública** | Não é possível exportar os resultados da consulta pública em formato estruturado (CSV, JSON). |
| **Homônimos** | A busca por nome pode retornar resultados de homônimos, exigindo verificação adicional para confirmação de identidade. |
| **Cobertura** | Embora obrigatório para todos os tribunais, pode haver atraso no registro de mandados por varas com menor infraestrutura de TI. |
| **Mandados antigos** | Mandados anteriores à implantação do BNMP 3.0 podem não ter sido totalmente migrados. |
| **Dados pessoais sensíveis** | Por tratar de dados criminais, o acesso é naturalmente restrito por questões de privacidade e segurança (LGPD). |
| **Incidente de segurança (jan/2026)** | O CNJ identificou alterações indevidas em dados do BNMP em janeiro de 2026, demonstrando riscos de integridade do sistema. |
