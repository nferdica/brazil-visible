---
title: CADIN — Cadastro de Devedores do Governo Federal
slug: cadin
orgao: Gov.br Conecta
url_base: https://conecta.gov.br/
tipo_acesso: API REST
autenticacao: OAuth
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
  - Gov.br Conecta
cruzamento_com:
  - receita-federal/cnpj-completa
  - transparencia-cgu/ceis
  - transparencia-cgu/cepim
status: stub
---

# CADIN — Cadastro de Devedores do Governo Federal

## O que é

O **CADIN (Cadastro Informativo de Créditos não Quitados do Setor Público Federal)** é o cadastro que registra **pessoas físicas e jurídicas devedoras do governo federal**. Gerenciado pelo **Ministério da Fazenda**, o CADIN contém informações sobre:

- **Devedores de créditos federais** — pessoas ou empresas com débitos junto a órgãos e entidades federais
- **Inadimplentes com prestação de contas** — beneficiários de convênios ou transferências que não prestaram contas
- **Devedores de tributos** — débitos tributários inscritos em dívida ativa

A inclusão no CADIN impede que a pessoa ou empresa:
- Receba recursos federais (convênios, transferências)
- Celebre novos convênios ou contratos com a União
- Obtenha incentivos fiscais

O acesso à API do CADIN é feito via **Gov.br Conecta**, restrito a órgãos governamentais e entidades credenciadas.

## Como acessar

| Item | Detalhe |
|---|---|
| **Gov.br Conecta** | `https://conecta.gov.br/` |
| **Portal do CADIN** | `https://www3.tesouro.fazenda.gov.br/cadin/` |
| **Autenticação** | OAuth 2.0 (Gov.br Conecta) |
| **Formato** | JSON |
| **Acesso** | Restrito a órgãos governamentais credenciados |

### Alternativa pública

Para verificação de irregularidades de pessoas jurídicas com o governo federal, os seguintes cadastros são públicos:
- [CEIS](/docs/apis/transparencia-cgu/ceis) — Empresas inidôneas e suspensas
- [CEPIM](/docs/apis/transparencia-cgu/cepim) — Entidades privadas sem fins lucrativos impedidas
- [CNEP](/docs/apis/transparencia-cgu/cnep) — Empresas punidas

## Endpoints/recursos principais

| Recurso | Conteúdo | Acesso |
|---|---|---|
| **Consulta por CPF/CNPJ** | Verificar se há registro no CADIN | Credenciado |
| **Detalhes do registro** | Órgão credor, valor, data de inclusão | Credenciado |
| **Portal CADIN (web)** | Consulta individual | Órgãos governamentais |

## Exemplo de uso

### Consulta via Gov.br Conecta (acesso restrito)

```python
import requests

# Exemplo conceitual — requer credenciais do Gov.br Conecta
# 1. Obter token OAuth
token_url = "https://sso.acesso.gov.br/token"
token_data = {
    "grant_type": "client_credentials",
    "client_id": "SEU_CLIENT_ID",
    "client_secret": "SEU_CLIENT_SECRET",
}

token_response = requests.post(token_url, data=token_data)
access_token = token_response.json()["access_token"]

# 2. Consultar CADIN
url = "https://api.conecta.gov.br/cadin/v1/consulta"
headers = {"Authorization": f"Bearer {access_token}"}
params = {"cnpj": "00000000000100"}

response = requests.get(url, headers=headers, params=params)
resultado = response.json()

if resultado.get("registros"):
    for reg in resultado["registros"]:
        print(f"Órgão credor: {reg['orgao_credor']}")
        print(f"Data inclusão: {reg['data_inclusao']}")
else:
    print("Nenhum registro no CADIN")
```

### Verificação de impedimentos via portais públicos

```python
import requests

# Alternativa pública: consultar CEIS e CNEP via Portal da Transparência
url_ceis = "https://api.portaldatransparencia.gov.br/api-de-dados/ceis"
headers = {"chave-api-dados": "SUA_CHAVE_API"}
params = {"cnpjSancionado": "00000000000100"}

response = requests.get(url_ceis, headers=headers, params=params)
dados = response.json()

if dados:
    print(f"Empresa encontrada no CEIS: {len(dados)} registro(s)")
    for reg in dados:
        print(f"  Sanção: {reg.get('tipoSancao')}")
        print(f"  Órgão: {reg.get('orgaoSancionador')}")
else:
    print("Não encontrada no CEIS")
```

## Campos disponíveis

### CADIN (via API — acesso restrito)

| Campo | Tipo | Descrição |
|---|---|---|
| `cpf_cnpj` | string | CPF ou CNPJ do devedor |
| `nome_devedor` | string | Nome/razão social |
| `orgao_credor` | string | Órgão federal credor |
| `valor_debito` | float | Valor do débito (R$) |
| `data_inclusao` | date | Data de inclusão no CADIN |
| `motivo_inclusao` | string | Motivo da inclusão |
| `situacao` | string | Ativo, Suspenso, Excluído |

## Cruzamentos possíveis

| Cruzamento | Fonte relacionada | Chave de ligação | Finalidade |
|---|---|---|---|
| CADIN x Empresas | [CNPJ Completa](/docs/apis/receita-federal/cnpj-completa) | CNPJ | Identificar porte e atividade dos devedores |
| CADIN x CEIS | [CEIS](/docs/apis/transparencia-cgu/ceis) | CNPJ | Verificar se devedor também é empresa inidônea |
| CADIN x CEPIM | [CEPIM](/docs/apis/transparencia-cgu/cepim) | CNPJ | Verificar se entidade está impedida de receber transferências |

## Limitações conhecidas

| Limitação | Detalhes |
|---|---|
| **Acesso restrito** | A API do CADIN via Gov.br Conecta é restrita a órgãos governamentais. Não há acesso público via API. |
| **Consulta individual** | O portal web do CADIN permite apenas consultas individuais (por CPF/CNPJ), não listagens em lote. |
| **Dados sensíveis** | Os dados são protegidos pela LGPD. Informações de devedores não são disponibilizadas publicamente em massa. |
| **Sem dados históricos** | O CADIN mostra a situação atual. Não há acesso a registros já excluídos (débitos quitados). |
| **Credenciamento necessário** | O processo de credenciamento no Gov.br Conecta pode ser demorado e restrito a órgãos governamentais. |
