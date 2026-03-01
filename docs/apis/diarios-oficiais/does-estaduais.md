---
title: DOEs Estaduais — Diários Oficiais dos Estados
slug: does-estaduais
orgao: Governos Estaduais
url_base: https://queridodiario.ok.org.br/
tipo_acesso: Web Interface
autenticacao: Não requerida
formato_dados: [PDF, TXT, HTML]
frequencia_atualizacao: Diária
campos_chave:
  - estado
  - data_publicacao
  - tipo_ato
  - orgao
  - conteudo
tags:
  - diário oficial
  - DOE
  - estados
  - legislação estadual
  - atos oficiais
  - Querido Diário
  - transparência
cruzamento_com:
  - diarios-oficiais/dou
  - transparencia-cgu/contratos-federais
  - ibge-estatisticas/censo-demografico
status: stub
---

# DOEs Estaduais — Diários Oficiais dos Estados

## O que é

Os **DOEs (Diários Oficiais dos Estados)** são os veículos oficiais de publicação dos atos dos governos estaduais brasileiros. Cada estado possui seu próprio diário oficial, publicando:

- **Legislação** — leis, decretos, resoluções, portarias estaduais
- **Atos de pessoal** — nomeações, exonerações, aposentadorias de servidores estaduais
- **Licitações e contratos** — editais, resultados de licitações, contratos
- **Poder Judiciário** — decisões, despachos, intimações dos tribunais de justiça
- **Órgãos estaduais** — atos de secretarias, autarquias e fundações estaduais

O acesso aos DOEs é fragmentado, com cada estado mantendo seu próprio portal. O projeto **Querido Diário**, da Open Knowledge Brasil, é a principal iniciativa de consolidação e disponibilização estruturada dos diários oficiais em um único ponto de acesso.

## Como acessar

| Item | Detalhe |
|---|---|
| **Querido Diário** | `https://queridodiario.ok.org.br/` |
| **Querido Diário API** | `https://queridodiario.ok.org.br/api/gazettes` |
| **Autenticação** | Não requerida |
| **Formato** | PDF (originais), TXT (extraído pelo Querido Diário) |

### Portais estaduais (exemplos)

| Estado | Portal do DOE |
|---|---|
| SP | `https://www.imprensaoficial.com.br/` |
| RJ | `https://www.ioerj.com.br/` |
| MG | `https://www.iof.mg.gov.br/` |
| BA | `https://dool.egba.ba.gov.br/` |
| RS | `https://www.diariooficial.rs.gov.br/` |
| PR | `https://www.legislacao.pr.gov.br/` |

## Endpoints/recursos principais

### Querido Diário API

| Endpoint | Descrição |
|---|---|
| `GET /api/gazettes` | Busca em diários oficiais |
| `?territory_id={id}` | Filtrar por código IBGE do município/estado |
| `&since={data}&until={data}` | Filtrar por período |
| `&querystring={termo}` | Busca textual no conteúdo |
| `&offset={n}&size={n}` | Paginação |

### Cobertura do Querido Diário

O Querido Diário cobre diários oficiais de centenas de municípios e alguns estados, com expansão contínua.

## Exemplo de uso

### Buscar publicações estaduais via Querido Diário

```python
import requests

# Buscar publicações de São Paulo capital
url = "https://queridodiario.ok.org.br/api/gazettes"
params = {
    "territory_id": "3550308",  # São Paulo - SP
    "since": "2025-01-01",
    "until": "2025-01-31",
    "querystring": "concurso público",
    "size": 10,
}

response = requests.get(url, params=params)
response.raise_for_status()
dados = response.json()

print(f"Total de resultados: {dados['total_gazettes']}")
for gazette in dados["gazettes"]:
    print(f"  Data: {gazette['date']}")
    print(f"  Edição: {gazette.get('edition', 'N/A')}")
    print(f"  TXT: {gazette.get('txt_url', 'N/A')}")
    print()
```

### Monitorar palavras-chave em diários estaduais

```python
import requests
import pandas as pd

# Monitorar menções a um termo em vários municípios
municipios = {
    "São Paulo": "3550308",
    "Rio de Janeiro": "3304557",
    "Belo Horizonte": "3106200",
    "Salvador": "2927408",
    "Curitiba": "4106902",
}

resultados = []
for nome, codigo in municipios.items():
    url = "https://queridodiario.ok.org.br/api/gazettes"
    params = {
        "territory_id": codigo,
        "since": "2025-01-01",
        "until": "2025-01-31",
        "querystring": "emergência",
    }

    response = requests.get(url, params=params)
    if response.status_code == 200:
        total = response.json()["total_gazettes"]
        resultados.append({"municipio": nome, "mencoes": total})

df = pd.DataFrame(resultados)
print("Menções a 'emergência' nos DOEs (jan/2025):")
print(df.to_string(index=False))
```

## Campos disponíveis

### Querido Diário API

| Campo | Tipo | Descrição |
|---|---|---|
| `territory_id` | string | Código IBGE do território |
| `territory_name` | string | Nome do município/estado |
| `date` | date | Data de publicação |
| `edition` | string | Número da edição |
| `is_extra_edition` | boolean | Edição extra |
| `txt_url` | string | URL do conteúdo em TXT |
| `url` | string | URL original (PDF/HTML) |

## Cruzamentos possíveis

| Cruzamento | Fonte relacionada | Chave de ligação | Finalidade |
|---|---|---|---|
| DOE x DOU | [DOU](/docs/apis/diarios-oficiais/dou) | Órgão, tema | Comparar atos federais e estaduais sobre mesmo tema |
| DOE x Contratos | [Contratos Federais](/docs/apis/transparencia-cgu/contratos-federais) | Órgão, valor | Cruzar licitações publicadas em DOEs com contratos federais |
| DOE x População | [Censo Demográfico](/docs/apis/ibge-estatisticas/censo-demografico) | Município | Contextualizar publicações oficiais com dados demográficos |

## Limitações conhecidas

| Limitação | Detalhes |
|---|---|
| **Fragmentação** | Cada estado e município tem seu próprio portal, sem padronização. |
| **Formato PDF** | A maioria dos DOEs é publicada em PDF, exigindo OCR/extração de texto para análise. |
| **Cobertura parcial do Querido Diário** | O projeto Querido Diário não cobre todos os municípios e estados. A cobertura está em expansão. |
| **Sem padronização de atos** | Cada estado classifica seus atos de forma diferente, dificultando comparações. |
| **Portais estaduais instáveis** | Muitos portais de diários oficiais estaduais apresentam instabilidade e funcionalidades limitadas de busca. |
| **Sem API oficial** | A maioria dos estados não oferece API oficial. O Querido Diário é a principal alternativa programática. |
