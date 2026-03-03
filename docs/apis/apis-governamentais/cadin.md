---
title: CADIN — Cadastro de Devedores do Governo Federal
slug: cadin
orgao: PGFN / Ministério da Fazenda
url_base: https://cadin.pgfn.gov.br/
tipo_acesso: API REST (Gov.br Conecta) / Portal web
autenticacao: OAuth 2.0 (Gov.br Conecta) / Gov.br (consulta cidadã)
formato_dados: [JSON]
frequencia_atualizacao: Diária
campos_chave:
  - cpf_cnpj
  - nome_devedor
  - orgao_credor
  - valor_debito
  - data_inclusao
tags:
  - CADIN
  - devedores
  - dívida
  - governo federal
  - cadastro
  - inadimplência
  - PGFN
  - Gov.br Conecta
cruzamento_com:
  - receita-federal/cnpj-completa
  - transparencia-cgu/ceis
  - transparencia-cgu/cepim
  - transparencia-cgu/cnep
  - transparencia-cgu/contratos-federais
status: documentado
---

# CADIN — Cadastro de Devedores do Governo Federal

## O que é

O **CADIN (Cadastro Informativo de Créditos não Quitados do Setor Público Federal)** é o cadastro que registra **pessoas físicas e jurídicas devedoras do governo federal**. Atualmente gerenciado pela **PGFN (Procuradoria-Geral da Fazenda Nacional)** — que assumiu a gestão do sistema em dezembro de 2023, substituindo o Banco Central —, o CADIN contém informações sobre:

- **Devedores de créditos federais** — pessoas ou empresas com débitos junto a órgãos e entidades federais
- **Inadimplentes com prestação de contas** — beneficiários de convênios ou transferências que não prestaram contas
- **Devedores de tributos** — débitos tributários inscritos em dívida ativa
- **Irregularidades com o FGTS** — incluído pela Lei 14.973/2024

A inclusão no CADIN impede que a pessoa ou empresa:
- Receba recursos federais (convênios, transferências, subsídios)
- Celebre novos convênios ou contratos com a União
- Obtenha incentivos fiscais ou benefícios financeiros
- Participe de licitações públicas federais
- Obtenha empréstimos/financiamentos de bancos federais

> **Importante:** A Lei 14.973/2024 (setembro de 2024) trouxe mudanças significativas, reduzindo o prazo de notificação de 75 para **30 dias** antes da inclusão no CADIN e expandindo o escopo para incluir devedores de estados e municípios (mediante convênio).

### Base legal

| Documento | Descrição |
|---|---|
| **Lei 10.522/2002** | Regulamentação original do CADIN |
| **Lei 14.195/2021** | Transferiu a gestão do CADIN para a PGFN |
| **Lei 14.973/2024** | Expansão de escopo, redução de prazos, inclusão de estados/municípios |
| **Lei Complementar 225/2026** | Integração subnacional ao CADIN |
| **Portaria PGFN/MF 819/2023** | Cronograma de implantação do novo sistema |

## Como acessar

### Consulta cidadã (acesso público)

| Item | Detalhe |
|---|---|
| **Portal CADIN** | `https://cadin.pgfn.gov.br/` |
| **Autenticação** | Login via Gov.br (qualquer nível) |
| **Funcionalidade** | Consulta da própria situação cadastral no CADIN |
| **Custo** | Gratuito |

Cidadãos podem consultar livremente se possuem registros no CADIN acessando o portal e autenticando-se com sua conta Gov.br.

### API institucional (Gov.br Conecta)

| Item | Detalhe |
|---|---|
| **Catálogo de APIs** | `https://www.gov.br/conecta/catalogo/` |
| **API de Consulta** | API CADIN Consulta/Contratante — verificação de CPF/CNPJ |
| **API Credora** | API CADIN Credora — inclusão, suspensão e reativação de registros |
| **Autenticação** | OAuth 2.0 via Gov.br Conecta |
| **Formato** | JSON |
| **Endpoint produção** | `https://cadin.pgfn.gov.br/cadastro-conectagov/apirest/registro/info/` |
| **Acesso** | Credenciamento junto à PGFN |

### Processo de credenciamento para API

1. Enviar e-mail para `cadin.pgdau@pgfn.gov.br` e `cda.pgfn@pgfn.gov.br`
2. Receber e assinar o documento de adesão
3. Devolver o documento assinado
4. Receber orientação técnica e chave de acesso para consumo da API

### Alternativas públicas para consulta de irregularidades

Para verificação de impedimentos de pessoas jurídicas com o governo, os seguintes cadastros são públicos e acessíveis via API REST:

- [CEIS](/docs/apis/transparencia-cgu/ceis) — Empresas inidôneas e suspensas
- [CEPIM](/docs/apis/transparencia-cgu/cepim) — Entidades privadas sem fins lucrativos impedidas
- [CNEP](/docs/apis/transparencia-cgu/cnep) — Empresas punidas

## Endpoints/recursos principais

### API CADIN Consulta/Contratante

| Recurso | Método | Descrição | Acesso |
|---|---|---|---|
| Consulta por CPF/CNPJ | GET | Verificar existência de registro no CADIN | Credenciado |
| Detalhes do registro | GET | Órgão credor, valor, data de inclusão, motivo | Credenciado |
| Consulta em lote | POST | Verificação de múltiplos CPFs/CNPJs | Credenciado |

### API CADIN Credora

| Recurso | Método | Descrição | Acesso |
|---|---|---|---|
| Incluir registro | POST | Registrar devedor no CADIN | Órgão credor |
| Suspender registro | PUT | Suspender temporariamente um registro | Órgão credor |
| Reativar registro | PUT | Reativar registro suspenso | Órgão credor |
| Excluir registro | DELETE | Excluir registro (débito quitado) | Órgão credor |

### Portal web

| Recurso | Conteúdo | Acesso |
|---|---|---|
| **Consulta cidadã** | Verificar própria situação no CADIN | Gov.br (qualquer cidadão) |
| **Portal institucional** | Gestão de registros por órgãos credores | Certificado digital |

## Exemplo de uso

### Consulta via API Gov.br Conecta (acesso institucional)

```python
import requests

# 1. Obter token OAuth via Gov.br Conecta
token_url = "https://sso.acesso.gov.br/token"
token_data = {
    "grant_type": "client_credentials",
    "client_id": "SEU_CLIENT_ID",
    "client_secret": "SEU_CLIENT_SECRET",
}

token_response = requests.post(token_url, data=token_data)
token_response.raise_for_status()
access_token = token_response.json()["access_token"]

# 2. Consultar CADIN
url = "https://cadin.pgfn.gov.br/cadastro-conectagov/apirest/registro/info/"
headers = {"Authorization": f"Bearer {access_token}"}
params = {"cnpj": "00000000000100"}

response = requests.get(url, headers=headers, params=params)
response.raise_for_status()
resultado = response.json()

if resultado.get("registros"):
    for reg in resultado["registros"]:
        print(f"Órgão credor: {reg['orgao_credor']}")
        print(f"Valor débito: R$ {reg['valor_debito']:,.2f}")
        print(f"Data inclusão: {reg['data_inclusao']}")
        print(f"Motivo: {reg['motivo_inclusao']}")
else:
    print("Nenhum registro no CADIN")
```

### Verificação alternativa via portais públicos (CEIS/CNEP)

```python
import requests

API_KEY = "SEU_TOKEN_AQUI"
BASE_URL = "https://api.portaldatransparencia.gov.br/api-de-dados"
headers = {"chave-api-dados": API_KEY, "Accept": "application/json"}


def verificar_impedimentos(cnpj: str) -> dict:
    """
    Verifica se uma empresa possui impedimentos nos cadastros
    públicos (CEIS, CNEP, CEPIM) — alternativa à consulta CADIN.

    Args:
        cnpj: CNPJ da empresa (14 dígitos)

    Returns:
        Dicionário com resultados de cada cadastro
    """
    cadastros = {
        "CEIS": f"{BASE_URL}/ceis",
        "CNEP": f"{BASE_URL}/cnep",
        "CEPIM": f"{BASE_URL}/cepim",
    }

    resultados = {}
    for nome, url in cadastros.items():
        response = requests.get(
            url,
            headers=headers,
            params={"cnpjSancionado": cnpj, "pagina": 1},
        )
        if response.status_code == 200:
            dados = response.json()
            resultados[nome] = {
                "encontrado": len(dados) > 0,
                "registros": len(dados),
            }

    return resultados


# Exemplo: verificar impedimentos de uma empresa
resultado = verificar_impedimentos("00000000000100")
for cadastro, info in resultado.items():
    status = "ENCONTRADO" if info["encontrado"] else "Limpo"
    print(f"  {cadastro}: {status} ({info['registros']} registro(s))")
```

## Campos disponíveis

### CADIN (via API — acesso institucional)

| Campo | Tipo | Descrição |
|---|---|---|
| `cpf_cnpj` | string | CPF ou CNPJ do devedor |
| `nome_devedor` | string | Nome/razão social |
| `orgao_credor` | string | Órgão federal credor |
| `codigo_orgao_credor` | string | Código SIAFI do órgão credor |
| `valor_debito` | float | Valor do débito (R$) |
| `data_inclusao` | date | Data de inclusão no CADIN |
| `motivo_inclusao` | string | Motivo da inclusão (débito, inadimplência, prestação de contas) |
| `situacao` | string | Ativo, Suspenso, Excluído |
| `data_notificacao` | date | Data da notificação prévia ao devedor |
| `tipo_devedor` | string | Pessoa física ou jurídica |

## Cruzamentos possíveis

| Cruzamento | Fonte relacionada | Chave de ligação | Finalidade |
|---|---|---|---|
| CADIN x Empresas | [CNPJ Completa](/docs/apis/receita-federal/cnpj-completa) | CNPJ | Identificar porte, atividade e situação cadastral dos devedores |
| CADIN x CEIS | [CEIS](/docs/apis/transparencia-cgu/ceis) | CNPJ | Verificar se devedor também é empresa inidônea/suspensa |
| CADIN x CEPIM | [CEPIM](/docs/apis/transparencia-cgu/cepim) | CNPJ | Verificar se entidade está impedida de receber transferências |
| CADIN x CNEP | [CNEP](/docs/apis/transparencia-cgu/cnep) | CNPJ | Verificar se empresa foi punida por atos contra administração pública |
| CADIN x Contratos | [Contratos Federais](/docs/apis/transparencia-cgu/contratos-federais) | CNPJ | Verificar se devedor possui contratos com o governo federal |

## Limitações conhecidas

| Limitação | Detalhes |
|---|---|
| **API restrita a credenciados** | A API do CADIN via Gov.br Conecta requer credenciamento formal junto à PGFN. O processo pode levar semanas. |
| **Consulta cidadã limitada** | O portal web permite que cidadãos consultem apenas a própria situação (CPF autenticado via Gov.br). Não permite consulta de terceiros. |
| **Dados sensíveis (LGPD)** | Informações de devedores não são disponibilizadas publicamente em massa. |
| **Sem dados históricos públicos** | O CADIN mostra a situação atual. Registros já excluídos (débitos quitados) não são acessíveis publicamente. |
| **Sistema novo (dez/2023)** | O sistema foi migrado da gestão do Banco Central para a PGFN em dezembro de 2023 (desenvolvimento SERPRO). Eventuais instabilidades podem ocorrer. |
| **Escopo expandido recentemente** | A Lei 14.973/2024 expandiu o escopo para estados e municípios, mas a integração subnacional ainda está em implantação. |
| **Prazo de exclusão** | Após quitação, o órgão credor tem **5 dias úteis** para solicitar a exclusão. Pode haver atraso no processamento. |
