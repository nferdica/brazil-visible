---
title: CNEP — Cadastro Nacional de Empresas Punidas
slug: cnep
orgao: CGU
url_base: https://api.portaldatransparencia.gov.br/swagger-ui/index.html
tipo_acesso: API REST
autenticacao: API Key
formato_dados: JSON
frequencia_atualizacao: Diária
campos_chave:
  - CNPJ
  - orgao_sancionador
  - data_inicio_sancao
  - data_fim_sancao
  - valor_multa
tags:
  - sanções
  - Lei Anticorrupção
  - empresas punidas
  - CNEP
  - transparência
  - anticorrupção
cruzamento_com:
  - receita-federal/cnpj-completa
  - transparencia-cgu/ceis
  - transparencia-cgu/contratos-federais
  - justica-eleitoral-tse/candidaturas
  - transparencia-cgu/cepim
status: documentado
---

# CNEP — Cadastro Nacional de Empresas Punidas

## O que é

O **CNEP (Cadastro Nacional de Empresas Punidas)** é um banco de dados mantido pela **Controladoria-Geral da União (CGU)** que reúne informações sobre empresas punidas com base na **Lei Anticorrupção (Lei 12.846/2013)**. A Lei Anticorrupção responsabiliza administrativa e civilmente pessoas jurídicas pela prática de atos contra a administração pública, nacional ou estrangeira.

As sanções registradas no CNEP incluem:

- **Multa** de 0,1% a 20% do faturamento bruto da empresa
- **Publicação extraordinária** da decisão condenatória
- **Acordos de leniência** celebrados com a CGU

O CNEP é complementar ao CEIS: enquanto o CEIS registra impedimentos de licitar e contratar, o CNEP registra punições específicas da Lei Anticorrupção, que podem incluir multas milionárias e obrigações de compliance. Juntos, esses cadastros formam a principal ferramenta de verificação de integridade de fornecedores do governo.

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
| Requisições por minuto (6h-24h) | 90 |
| Requisições por minuto (0h-6h) | 300 |
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
| `/cnep` | GET | Lista empresas punidas pela Lei Anticorrupção |
| `/cnep/{id}` | GET | Detalhes de uma punição específica |

### Parâmetros de consulta — `/cnep`

| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-------------|-----------|
| `cnpjSancionado` | string | Não | CNPJ da empresa sancionada |
| `nomeSancionado` | string | Não | Nome/razão social (busca parcial) |
| `codigoOrgaoSancionador` | string | Não | Código do órgão que aplicou a sanção |
| `dataInicialSancao` | string | Não | Data inicial da sanção (`DD/MM/AAAA`) |
| `dataFinalSancao` | string | Não | Data final da sanção (`DD/MM/AAAA`) |
| `pagina` | int | Não | Número da página (começa em 1) |

## Exemplo de uso

### Consultar empresas punidas pela Lei Anticorrupção

```python
import requests
import pandas as pd

API_KEY = "SEU_TOKEN_AQUI"
BASE_URL = "https://api.portaldatransparencia.gov.br/api-de-dados"

headers = {
    "chave-api-dados": API_KEY,
    "Accept": "application/json",
}


def consultar_cnep(cnpj: str = None, nome: str = None, pagina: int = 1):
    """
    Consulta o Cadastro Nacional de Empresas Punidas.

    Args:
        cnpj: CNPJ da empresa (opcional)
        nome: Nome/razão social para busca parcial (opcional)
        pagina: Número da página

    Returns:
        Lista de punições em formato dict
    """
    url = f"{BASE_URL}/cnep"
    params = {"pagina": pagina}
    if cnpj:
        params["cnpjSancionado"] = cnpj
    if nome:
        params["nomeSancionado"] = nome

    response = requests.get(url, headers=headers, params=params)
    response.raise_for_status()
    return response.json()


# Exemplo: listar empresas punidas (página 1)
punicoes = consultar_cnep()
df = pd.DataFrame(punicoes)
print(f"Punições retornadas: {len(df)}")
print(df[["cnpjSancionado", "nomeSancionado", "tipoSancao", "valorMulta"]].head())
```

### Verificar se uma empresa está no CNEP

```python
def verificar_cnep(cnpj: str):
    """
    Verifica se uma empresa consta no CNEP.

    Args:
        cnpj: CNPJ da empresa (apenas números)

    Returns:
        True se a empresa tiver punição, False caso contrário
    """
    resultado = consultar_cnep(cnpj=cnpj)
    if resultado:
        print(f"ALERTA: Empresa {cnpj} consta no CNEP!")
        for p in resultado:
            print(f"  Tipo de sanção: {p.get('tipoSancao', 'N/A')}")
            print(f"  Valor da multa: R$ {p.get('valorMulta', 0):,.2f}")
            print(f"  Início: {p.get('dataInicioSancao', 'N/A')}")
            print(f"  Fim: {p.get('dataFimSancao', 'N/A')}")
            print(f"  Órgão sancionador: {p.get('orgaoSancionador', 'N/A')}")
        return True
    else:
        print(f"Empresa {cnpj} NÃO consta no CNEP.")
        return False


verificar_cnep("00000000000191")
```

### Consulta completa de integridade (CEIS + CNEP)

```python
import time


def verificacao_integridade(cnpj: str):
    """
    Realiza verificação completa de integridade de uma empresa
    consultando CEIS e CNEP.

    Args:
        cnpj: CNPJ da empresa (apenas números)

    Returns:
        Dicionário com resultado da verificação
    """
    resultado = {"cnpj": cnpj, "ceis": [], "cnep": []}

    # Consultar CEIS
    resp_ceis = requests.get(
        f"{BASE_URL}/ceis",
        headers=headers,
        params={"cnpjSancionado": cnpj, "pagina": 1},
    )
    if resp_ceis.status_code == 200:
        resultado["ceis"] = resp_ceis.json()

    time.sleep(2)  # Respeitar rate limit

    # Consultar CNEP
    resp_cnep = requests.get(
        f"{BASE_URL}/cnep",
        headers=headers,
        params={"cnpjSancionado": cnpj, "pagina": 1},
    )
    if resp_cnep.status_code == 200:
        resultado["cnep"] = resp_cnep.json()

    # Relatório
    total_sancoes = len(resultado["ceis"]) + len(resultado["cnep"])
    if total_sancoes > 0:
        print(f"ALERTA: Empresa {cnpj} tem {total_sancoes} sanção(ões):")
        print(f"  CEIS: {len(resultado['ceis'])} registro(s)")
        print(f"  CNEP: {len(resultado['cnep'])} registro(s)")
    else:
        print(f"Empresa {cnpj}: nenhuma sanção encontrada em CEIS/CNEP.")

    return resultado


verificacao_integridade("00000000000191")
```

## Campos disponíveis

### Listagem (`/cnep`)

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | int | Identificador único da punição |
| `cnpjSancionado` | string | CNPJ da empresa punida |
| `nomeSancionado` | string | Razão social da empresa |
| `tipoSancao` | string | Tipo de sanção aplicada (multa, publicação, etc.) |
| `valorMulta` | float | Valor da multa aplicada (R$) |
| `dataInicioSancao` | string | Data de início da sanção |
| `dataFimSancao` | string | Data de término da sanção |
| `orgaoSancionador` | string | Órgão que aplicou a sanção |
| `ufOrgaoSancionador` | string | UF do órgão sancionador |
| `fundamentacaoLegal` | string | Base legal (Lei 12.846/2013) |
| `fonteInformacao` | string | Origem da informação |
| `dataPublicacao` | string | Data de publicação da decisão |

### Detalhes (`/cnep/{id}`)

Inclui todos os campos da listagem, mais:

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `processo` | string | Número do processo administrativo |
| `detalhamento` | string | Descrição adicional da punição |
| `acordoLeniencia` | boolean | Indica se houve acordo de leniência |
| `descricaoAcordoLeniencia` | string | Detalhes do acordo de leniência (quando aplicável) |

## Cruzamentos possíveis

| Cruzamento | Fonte relacionada | Chave de ligação | Finalidade |
|------------|-------------------|------------------|------------|
| CNEP x CNPJ | [Receita Federal — CNPJ](/docs/apis/receita-federal/cnpj-completa) | `CNPJ` | Identificar sócios e quadro societário de empresas punidas |
| CNEP x CEIS | [CEIS](/docs/apis/transparencia-cgu/ceis) | `CNPJ` | Verificar se empresa também tem sanções de inidoneidade/suspensão |
| CNEP x Contratos | [Contratos Federais](/docs/apis/transparencia-cgu/contratos-federais) | `CNPJ` | Detectar contratos vigentes com empresas punidas |
| CNEP x Doações | [TSE — Prestação de Contas](/docs/apis/justica-eleitoral-tse/prestacao-contas) | `CNPJ` | Verificar se empresa punida doou para campanhas eleitorais |
| CNEP x CEPIM | [CEPIM](/docs/apis/transparencia-cgu/cepim) | `CNPJ` | Verificar se entidade também está impedida de receber transferências |
| CNEP x Licitações | Portal da Transparência | `CNPJ` | Verificar participação em licitações |

### Receita: ranking de maiores multas

```python
import requests
import pandas as pd
import time

API_KEY = "SEU_TOKEN_AQUI"
BASE_URL = "https://api.portaldatransparencia.gov.br/api-de-dados"
headers = {"chave-api-dados": API_KEY, "Accept": "application/json"}

# Coletar múltiplas páginas do CNEP
todas_punicoes = []
for pagina in range(1, 6):
    resp = requests.get(
        f"{BASE_URL}/cnep",
        headers=headers,
        params={"pagina": pagina},
    )
    dados = resp.json()
    if not dados:
        break
    todas_punicoes.extend(dados)
    time.sleep(2)  # Respeitar rate limit

df = pd.DataFrame(todas_punicoes)
if not df.empty and "valorMulta" in df.columns:
    df["valorMulta"] = pd.to_numeric(df["valorMulta"], errors="coerce")
    ranking = df.nlargest(10, "valorMulta")[
        ["nomeSancionado", "cnpjSancionado", "valorMulta", "orgaoSancionador"]
    ]
    print("Top 10 maiores multas (Lei Anticorrupção):")
    print(ranking.to_string(index=False))
```

## Limitações conhecidas

| Limitação | Detalhes |
|-----------|----------|
| **Rate limit** | 90 requisições por minuto (6h-24h) / 300 requisições por minuto (0h-6h) por token. Exceder resulta em HTTP 429. |
| **Volume de dados** | O CNEP é um cadastro menor que o CEIS, pois a Lei Anticorrupção é relativamente recente (2013). |
| **Acordos de leniência** | Detalhes completos de acordos de leniência nem sempre estão disponíveis na API; informações sigilosas podem ser omitidas. |
| **Valor da multa** | Nem todas as sanções possuem o campo `valorMulta` preenchido. |
| **Cobertura subnacional** | Assim como o CEIS, a adesão de estados e municípios é voluntária. |
| **Empresas coligadas** | O CNEP registra a empresa diretamente punida; empresas coligadas ou do mesmo grupo econômico não são automaticamente listadas. |
| **Paginação** | Resultados paginados; para análise completa é necessário iterar todas as páginas. |
| **Disponibilidade** | A API pode apresentar instabilidade em horários de pico (9h-12h BRT). Implemente retry com backoff exponencial. |
