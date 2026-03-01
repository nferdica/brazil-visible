---
title: CEPIM — Cadastro de Entidades sem Fins Lucrativos Impedidas
slug: cepim
orgao: CGU
url_base: https://api.portaldatransparencia.gov.br/api-de-dados/
tipo_acesso: API REST
autenticacao: API Key
formato_dados: JSON
frequencia_atualizacao: Diária
campos_chave:
  - CNPJ
  - orgao_concedente
  - motivo_impedimento
  - convenio
tags:
  - sanções
  - entidades sem fins lucrativos
  - ONGs
  - CEPIM
  - convênios
  - transparência
  - terceiro setor
cruzamento_com:
  - receita-federal/cnpj-completa
  - transparencia-cgu/ceis
  - transparencia-cgu/cnep
  - justica-eleitoral-tse/candidaturas
  - tesouro-nacional/siafi
status: documentado
---

# CEPIM — Cadastro de Entidades sem Fins Lucrativos Impedidas

## O que é

O **CEPIM (Cadastro de Entidades Privadas Sem Fins Lucrativos Impedidas)** é um banco de dados mantido pela **Controladoria-Geral da União (CGU)** que reúne informações sobre entidades privadas sem fins lucrativos (ONGs, OSCIPs, associações, fundações, etc.) que estão impedidas de celebrar convênios, contratos de repasse ou termos de parceria com a Administração Pública Federal.

O impedimento decorre, em geral, de:

- **Inadimplência** na prestação de contas de convênios anteriores
- **Irregularidades** na execução de recursos federais
- **Omissão** no dever de prestar contas no prazo legal

O CEPIM é uma ferramenta fundamental para evitar que entidades com histórico de irregularidades continuem recebendo recursos públicos. Dado que o terceiro setor é frequentemente utilizado como canal de repasse de recursos de emendas parlamentares, esse cadastro é especialmente relevante para investigações sobre desvio de verbas.

> **Veja também:** [Portal da Transparência (visão geral)](/docs/apis/portais-centrais/portal-transparencia) para uma visão geral de todos os recursos da API.

## Como acessar

### Autenticação

O acesso à API requer um **token (chave de API)** gratuito:

1. Acesse https://portaldatransparencia.gov.br/api-de-dados/cadastrar-email
2. Informe seu e-mail e confirme o cadastro
3. Você receberá um token por e-mail
4. Inclua o token no header de cada requisição: `chave-api-dados: SEU_TOKEN`

### Rate Limits

| Condição | Limite |
|----------|--------|
| Requisições por minuto | 30 |
| Requisições sem autenticação | Bloqueadas |

### URL Base

```
https://api.portaldatransparencia.gov.br/api-de-dados
```

### Headers obrigatórios

```http
chave-api-dados: SEU_TOKEN_AQUI
Accept: application/json
```

## Endpoints/recursos principais

| Endpoint | Método | Descrição |
|----------|--------|-----------|
| `/cepim` | GET | Lista entidades sem fins lucrativos impedidas |
| `/cepim/{id}` | GET | Detalhes de um impedimento específico |

### Parâmetros de consulta — `/cepim`

| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-------------|-----------|
| `cnpjSancionado` | string | Não | CNPJ da entidade impedida |
| `nomeSancionado` | string | Não | Nome da entidade (busca parcial) |
| `codigoOrgaoSancionador` | string | Não | Código do órgão concedente |
| `pagina` | int | Não | Número da página (começa em 1) |

## Exemplo de uso

### Consultar entidades impedidas

```python
import requests
import pandas as pd

API_KEY = "SEU_TOKEN_AQUI"
BASE_URL = "https://api.portaldatransparencia.gov.br/api-de-dados"

headers = {
    "chave-api-dados": API_KEY,
    "Accept": "application/json",
}


def consultar_cepim(cnpj: str = None, nome: str = None, pagina: int = 1):
    """
    Consulta o Cadastro de Entidades sem Fins Lucrativos Impedidas.

    Args:
        cnpj: CNPJ da entidade (opcional)
        nome: Nome da entidade para busca parcial (opcional)
        pagina: Número da página

    Returns:
        Lista de impedimentos em formato dict
    """
    url = f"{BASE_URL}/cepim"
    params = {"pagina": pagina}
    if cnpj:
        params["cnpjSancionado"] = cnpj
    if nome:
        params["nomeSancionado"] = nome

    response = requests.get(url, headers=headers, params=params)
    response.raise_for_status()
    return response.json()


# Exemplo: listar entidades impedidas (página 1)
impedidas = consultar_cepim()
df = pd.DataFrame(impedidas)
print(f"Entidades impedidas retornadas: {len(df)}")
print(df[["cnpjSancionado", "nomeSancionado", "motivoImpedimento"]].head())
```

### Verificar se uma entidade está impedida

```python
def verificar_entidade(cnpj: str):
    """
    Verifica se uma entidade sem fins lucrativos está impedida.

    Args:
        cnpj: CNPJ da entidade (apenas números)

    Returns:
        True se a entidade estiver impedida, False caso contrário
    """
    resultado = consultar_cepim(cnpj=cnpj)
    if resultado:
        print(f"ALERTA: Entidade {cnpj} encontrada no CEPIM!")
        for r in resultado:
            print(f"  Nome: {r.get('nomeSancionado', 'N/A')}")
            print(f"  Motivo: {r.get('motivoImpedimento', 'N/A')}")
            print(f"  Convênio: {r.get('convenio', 'N/A')}")
            print(f"  Órgão concedente: {r.get('orgaoConcedente', 'N/A')}")
        return True
    else:
        print(f"Entidade {cnpj} NÃO consta no CEPIM.")
        return False


verificar_entidade("00000000000191")
```

### Verificação completa de integridade (CEIS + CNEP + CEPIM)

```python
import time


def verificacao_integridade_completa(cnpj: str):
    """
    Verifica uma entidade em todos os cadastros de sanções.

    Args:
        cnpj: CNPJ da entidade (apenas números)

    Returns:
        Dicionário com resultado consolidado
    """
    cadastros = {
        "ceis": f"{BASE_URL}/ceis",
        "cnep": f"{BASE_URL}/cnep",
        "cepim": f"{BASE_URL}/cepim",
    }

    resultado = {"cnpj": cnpj}
    for nome, url in cadastros.items():
        resp = requests.get(
            url, headers=headers, params={"cnpjSancionado": cnpj, "pagina": 1}
        )
        resultado[nome] = resp.json() if resp.status_code == 200 else []
        time.sleep(2)  # Respeitar rate limit

    total = sum(len(v) for k, v in resultado.items() if k != "cnpj")
    print(f"Entidade {cnpj}: {total} registro(s) nos cadastros de sanções")
    for cadastro in ["ceis", "cnep", "cepim"]:
        qtd = len(resultado[cadastro])
        if qtd > 0:
            print(f"  {cadastro.upper()}: {qtd} registro(s)")

    return resultado


verificacao_integridade_completa("00000000000191")
```

## Campos disponíveis

### Listagem (`/cepim`)

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | int | Identificador único do registro |
| `cnpjSancionado` | string | CNPJ da entidade impedida |
| `nomeSancionado` | string | Nome da entidade |
| `motivoImpedimento` | string | Motivo do impedimento (inadimplência, irregularidade, etc.) |
| `convenio` | string | Número do convênio relacionado ao impedimento |
| `orgaoConcedente` | string | Nome do órgão que concedeu o recurso |
| `codigoOrgaoConcedente` | string | Código SIAFI do órgão concedente |
| `dataReferencia` | string | Data de referência do impedimento |

### Detalhes (`/cepim/{id}`)

Inclui todos os campos da listagem, mais:

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `valorConvenio` | float | Valor do convênio relacionado (R$) |
| `valorLiberado` | float | Valor liberado para a entidade (R$) |
| `situacaoConvenio` | string | Situação do convênio (inadimplente, a comprovar, etc.) |
| `detalhamento` | string | Descrição adicional do impedimento |

## Cruzamentos possíveis

| Cruzamento | Fonte relacionada | Chave de ligação | Finalidade |
|------------|-------------------|------------------|------------|
| CEPIM x CNPJ | [Receita Federal — CNPJ](/docs/apis/receita-federal/cnpj-completa) | `CNPJ` | Identificar dirigentes e sócios de entidades impedidas |
| CEPIM x CEIS | [CEIS](/docs/apis/transparencia-cgu/ceis) | `CNPJ` | Verificar se a entidade também está declarada inidônea ou suspensa |
| CEPIM x CNEP | [CNEP](/docs/apis/transparencia-cgu/cnep) | `CNPJ` | Verificar sanções pela Lei Anticorrupção |
| CEPIM x Emendas | [Emendas Parlamentares](/docs/apis/transparencia-cgu/emendas-parlamentares) | `CNPJ / Localidade` | Verificar se entidades impedidas receberam recursos de emendas |
| CEPIM x Candidaturas | [TSE — Candidaturas](/docs/apis/justica-eleitoral-tse/candidaturas) | `CPF dirigentes` | Verificar se dirigentes de entidades impedidas são candidatos ou doadores |
| CEPIM x SIAFI | [Tesouro Nacional — SIAFI](/docs/apis/tesouro-nacional/siafi) | `Código convênio` | Verificar execução orçamentária do convênio que gerou o impedimento |

### Receita: identificar entidades impedidas que ainda recebem emendas

```python
import requests
import pandas as pd

API_KEY = "SEU_TOKEN_AQUI"
BASE_URL = "https://api.portaldatransparencia.gov.br/api-de-dados"
headers = {"chave-api-dados": API_KEY, "Accept": "application/json"}

# 1. Obter entidades impedidas
resp_cepim = requests.get(
    f"{BASE_URL}/cepim", headers=headers, params={"pagina": 1}
)
impedidas = pd.DataFrame(resp_cepim.json())

if not impedidas.empty:
    print(f"Entidades impedidas: {len(impedidas)}")

    # 2. Os CNPJs das entidades impedidas podem ser cruzados com
    #    dados de emendas parlamentares e convênios para verificar
    #    se há repasses irregulares
    cnpjs_impedidos = impedidas["cnpjSancionado"].unique()
    print(f"CNPJs únicos impedidos: {len(cnpjs_impedidos)}")

    # 3. Próximo passo: verificar na Receita Federal quem são os
    #    dirigentes dessas entidades e cruzar com dados do TSE
    print("Próximo passo: consultar QSA na Receita Federal")
```

## Limitações conhecidas

| Limitação | Detalhes |
|-----------|----------|
| **Rate limit** | 30 requisições por minuto por token. Exceder resulta em HTTP 429. |
| **Escopo federal** | O CEPIM registra apenas impedimentos relacionados a transferências federais. Impedimentos estaduais e municipais não são incluídos. |
| **Motivo genérico** | O campo `motivoImpedimento` pode ser genérico (ex: "inadimplência"), sem detalhar a natureza específica da irregularidade. |
| **Entidades extintas** | Entidades que encerraram atividades podem continuar no CEPIM se houver pendências de prestação de contas. |
| **Convênios antigos** | Impedimentos relacionados a convênios muito antigos podem não ter todas as informações detalhadas. |
| **Paginação** | Resultados paginados; para análise completa é necessário iterar todas as páginas. |
| **Disponibilidade** | A API pode apresentar instabilidade em horários de pico (9h-12h BRT). Implemente retry com backoff exponencial. |
