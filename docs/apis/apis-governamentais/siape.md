---
title: SIAPE — Dados de Servidores Públicos Federais
slug: siape
orgao: Gov.br Conecta
url_base: https://conecta.gov.br/
tipo_acesso: API REST
autenticacao: OAuth
formato_dados: [JSON]
frequencia_atualizacao: Mensal
campos_chave:
  - cpf
  - matricula
  - nome
  - orgao_lotacao
  - cargo
  - remuneracao
tags:
  - SIAPE
  - servidores públicos
  - governo federal
  - folha de pagamento
  - funcionalismo público
  - Gov.br Conecta
cruzamento_com:
  - transparencia-cgu/servidores-federais
  - diarios-oficiais/dou
  - apis-governamentais/siorg
status: parcial
---

# SIAPE — Dados de Servidores Públicos Federais

## O que é

O **SIAPE (Sistema Integrado de Administração de Pessoal)** é o sistema oficial de gestão de recursos humanos do governo federal brasileiro. Ele contém dados de todos os **servidores públicos civis federais**, incluindo:

- **Dados pessoais** — nome, CPF, data de nascimento (acesso restrito)
- **Dados funcionais** — matrícula, cargo, função, órgão de lotação, UF
- **Remuneração** — vencimento básico, gratificações, descontos, remuneração líquida
- **Situação funcional** — ativo, aposentado, cedido, requisitado
- **Histórico** — progressões, remoções, afastamentos

O acesso à API do SIAPE é disponibilizado via **Gov.br Conecta**, plataforma de integração de APIs do governo federal. O acesso requer credenciamento e autenticação OAuth.

Para dados públicos de servidores (sem necessidade de autenticação), o **Portal da Transparência** da CGU é a alternativa recomendada.

## Como acessar

| Item | Detalhe |
|---|---|
| **Gov.br Conecta** | `https://conecta.gov.br/` |
| **Documentação API** | Disponível após credenciamento no Conecta |
| **Portal da Transparência** | `https://portaldatransparencia.gov.br/servidores` (dados públicos) |
| **Autenticação** | OAuth 2.0 (credenciais do Gov.br Conecta) |
| **Formato** | JSON |
| **Acesso** | Restrito a órgãos governamentais e entidades credenciadas |

### Alternativa pública

Para dados abertos de servidores federais sem necessidade de autenticação, consulte:
- [Servidores Federais (CGU)](/docs/apis/transparencia-cgu/servidores-federais)

## Endpoints/recursos principais

| Recurso | Conteúdo | Acesso |
|---|---|---|
| **Consulta de servidor** | Dados funcionais por CPF ou matrícula | Credenciado |
| **Folha de pagamento** | Remuneração detalhada (rubricas) | Credenciado |
| **Órgãos** | Lista de órgãos do SIAPE | Credenciado |
| **Cargos** | Tabela de cargos e carreiras | Credenciado |
| **Portal da Transparência** | Dados públicos de remuneração | Público |

## Exemplo de uso

### Consulta via Portal da Transparência (alternativa pública)

```python
import requests
import pandas as pd

# API do Portal da Transparência — servidores federais
url = "https://api.portaldatransparencia.gov.br/api-de-dados/servidores"
headers = {
    "chave-api-dados": "SUA_CHAVE_API"  # Solicitar em dados.gov.br
}
params = {
    "orgaoServidorExercicio": "26000",  # Código do órgão
    "pagina": 1,
}

response = requests.get(url, headers=headers, params=params)
response.raise_for_status()
dados = response.json()

for servidor in dados[:5]:
    print(f"  Nome: {servidor['nome']}")
    print(f"  Cargo: {servidor.get('cargo', 'N/A')}")
    print(f"  Órgão: {servidor.get('orgaoServidorExercicio', 'N/A')}")
    print()
```

### Análise de servidores via dados abertos da CGU

```python
import pandas as pd

# Download dos dados de servidores do Portal da Transparência
# https://portaldatransparencia.gov.br/download-de-dados/servidores
df = pd.read_csv(
    "servidores_cadastro.csv",
    sep=";",
    encoding="latin-1",
    dtype=str,
)

print(f"Total de servidores: {len(df):,}")

# Distribuição por órgão
por_orgao = df["ORGAO_LOTACAO"].value_counts().head(10)
print("\nTop 10 órgãos por número de servidores:")
print(por_orgao)
```

## Campos disponíveis

### API SIAPE (via Gov.br Conecta — acesso restrito)

| Campo | Tipo | Descrição |
|---|---|---|
| `cpf` | string | CPF do servidor (acesso restrito) |
| `matricula` | string | Matrícula SIAPE |
| `nome` | string | Nome completo |
| `orgao_lotacao` | string | Órgão de lotação |
| `uorg_lotacao` | string | Unidade organizacional |
| `cargo` | string | Cargo efetivo |
| `funcao` | string | Função/gratificação |
| `situacao` | string | Ativo, Aposentado, Cedido |
| `uf_exercicio` | string | UF de exercício |
| `data_ingresso` | date | Data de ingresso no serviço público |
| `remuneracao_basica` | float | Remuneração básica bruta (R$) |

### Portal da Transparência (acesso público)

| Campo | Tipo | Descrição |
|---|---|---|
| `nome` | string | Nome do servidor |
| `cpf_mascarado` | string | CPF parcialmente mascarado |
| `orgaoServidorExercicio` | string | Órgão de exercício |
| `cargo` | string | Descrição do cargo |
| `funcao` | string | Função ou gratificação |
| `remuneracaoBasicaBruta` | float | Remuneração bruta |
| `remuneracaoAposDeducoes` | float | Remuneração líquida |

## Cruzamentos possíveis

| Cruzamento | Fonte relacionada | Chave de ligação | Finalidade |
|---|---|---|---|
| SIAPE x Transparência | [Servidores Federais](/docs/apis/transparencia-cgu/servidores-federais) | CPF, matrícula | Complementar dados públicos com dados detalhados do SIAPE |
| SIAPE x DOU | [DOU](/docs/apis/diarios-oficiais/dou) | Nome, órgão | Vincular nomeações publicadas com cadastro funcional |
| SIAPE x SIORG | [SIORG](/docs/apis/apis-governamentais/siorg) | Código do órgão | Contextualizar servidores na estrutura organizacional |

## Limitações conhecidas

| Limitação | Detalhes |
|---|---|
| **Acesso restrito** | A API do SIAPE via Gov.br Conecta é restrita a órgãos governamentais e entidades credenciadas. Cidadãos e pesquisadores devem usar o Portal da Transparência. |
| **Credenciamento demorado** | O processo de credenciamento no Gov.br Conecta pode levar semanas. |
| **Dados sensíveis** | Informações pessoais (CPF completo, endereço) são protegidas pela LGPD e disponíveis apenas para órgãos autorizados. |
| **Apenas civis federais** | O SIAPE cobre servidores civis do Executivo federal. Militares (Forças Armadas), servidores do Legislativo e Judiciário têm sistemas próprios. |
| **Documentação restrita** | A documentação técnica da API só é acessível após credenciamento. |
