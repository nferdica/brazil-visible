---
title: DOEs Estaduais — Diários Oficiais dos Estados
slug: does-estaduais
orgao: Governos Estaduais / Open Knowledge Brasil
url_base: https://queridodiario.ok.org.br/
tipo_acesso: API REST (Querido Diário) / Web portals
autenticacao: Não requerida
formato_dados: [JSON, PDF, TXT, HTML]
frequencia_atualizacao: Diária
campos_chave:
  - territory_id
  - date
  - querystring
  - txt_url
  - edition
tags:
  - diário oficial
  - DOE
  - estados
  - legislação estadual
  - atos oficiais
  - Querido Diário
  - transparência
  - Open Knowledge Brasil
cruzamento_com:
  - diarios-oficiais/dou
  - transparencia-cgu/contratos-federais
  - ibge-estatisticas/censo-demografico
status: documentado
---

# DOEs Estaduais — Diários Oficiais dos Estados

## O que é

Os **DOEs (Diários Oficiais dos Estados)** são os veículos oficiais de publicação dos atos dos governos estaduais brasileiros. Cada estado possui seu próprio diário oficial, publicando:

- **Legislação** — leis, decretos, resoluções, portarias estaduais
- **Atos de pessoal** — nomeações, exonerações, aposentadorias de servidores estaduais
- **Licitações e contratos** — editais, resultados de licitações, contratos
- **Poder Judiciário** — decisões, despachos, intimações dos tribunais de justiça
- **Órgãos estaduais** — atos de secretarias, autarquias e fundações estaduais

O acesso aos DOEs é fragmentado, com cada estado mantendo seu próprio portal. O projeto **Querido Diário**, da **Open Knowledge Brasil**, é a principal iniciativa de consolidação e disponibilização estruturada de diários oficiais, com foco em **diários municipais** (370+ municípios cobertos). A cobertura de diários estaduais é complementar.

> **Importante:** O Querido Diário foca primariamente em diários **municipais**. A cobertura de diários estaduais é limitada e depende dos portais próprios de cada estado.

## Como acessar

### Querido Diário (API principal)

| Item | Detalhe |
|---|---|
| **Portal** | `https://queridodiario.ok.org.br/` |
| **API base** | `https://api.queridodiario.ok.org.br/` |
| **Documentação interativa** | `https://api.queridodiario.ok.org.br/docs` |
| **Documentação completa** | `https://docs.queridodiario.ok.org.br/` |
| **Autenticação** | Não requerida |
| **Formato** | JSON |
| **Rate limit** | Não enforçado oficialmente; recomenda-se ~60 requisições/minuto |
| **Cobertura** | 370+ municípios (expansão contínua) |

### Portais estaduais oficiais

| Estado | Portal | Observações |
|---|---|---|
| SP | `https://doe.sp.gov.br/` | Sem API pública documentada |
| SP (municipal) | `https://apilib.prefeitura.sp.gov.br/` | API OpenAPI 3.0 para DOC municipal |
| RJ | `https://portal.ioerj.com.br/` | Web portal, sem API pública |
| MG | `https://www.iof.mg.gov.br/` | Web portal |
| BA | `https://dool.egba.ba.gov.br/` | Web portal |
| RS | `https://www.diariooficial.rs.gov.br/` | DOE-e digital desde 2017, publicação seg-sex 10h |
| PR | `https://www.legislacao.pr.gov.br/` | Web portal |

### DOU (Diário Oficial da União)

Para o diário federal, consulte [DOU](/docs/apis/diarios-oficiais/dou).

### Ferramentas alternativas

| Ferramenta | URL | Descrição |
|---|---|---|
| **JusBrasil Diários** | `https://www.jusbrasil.com.br/diarios/` | Agregador com busca em diários oficiais |
| **Escavador** | `https://www.escavador.com/` | Busca e monitoramento de diários |
| **Ro-DOU** | `https://gestaogovbr.github.io/Ro-dou/` | Ferramenta de clipping do DOU |
| **Base dos Dados** | `https://basedosdados.org/` | Dados estruturados do DOE-SP |

## Endpoints/recursos principais

### Querido Diário API

| Endpoint | Método | Descrição |
|---|---|---|
| `/gazettes` | GET | Busca em diários oficiais municipais |
| `/cities` | GET | Lista municípios cobertos pelo projeto |
| `/cities/{territory_id}` | GET | Detalhes de um município específico |

### Parâmetros de consulta — `/gazettes`

| Parâmetro | Tipo | Descrição |
|---|---|---|
| `territory_ids` | string | Código(s) IBGE do município (ex: `3550308` para São Paulo) |
| `querystring` | string | Busca textual no conteúdo dos diários |
| `excerpt_size` | int | Tamanho dos trechos de texto retornados |
| `number_of_excerpts` | int | Quantidade de trechos por resultado |
| `since` | date | Data inicial (formato `YYYY-MM-DD`) |
| `until` | date | Data final (formato `YYYY-MM-DD`) |
| `offset` | int | Deslocamento para paginação |
| `size` | int | Número de resultados por página |

## Exemplo de uso

### Buscar publicações municipais via Querido Diário

```python
import requests

# API atualizada do Querido Diário
BASE_URL = "https://api.queridodiario.ok.org.br"

# Buscar publicações de São Paulo capital
params = {
    "territory_ids": "3550308",
    "since": "2025-01-01",
    "until": "2025-01-31",
    "querystring": "concurso público",
    "excerpt_size": 500,
    "number_of_excerpts": 3,
    "size": 10,
}

response = requests.get(f"{BASE_URL}/gazettes", params=params)
response.raise_for_status()
dados = response.json()

print(f"Total de resultados: {dados['total_gazettes']}")
for gazette in dados["gazettes"]:
    print(f"  Data: {gazette['date']}")
    print(f"  Edição: {gazette.get('edition', 'N/A')}")
    print(f"  Extra: {'Sim' if gazette.get('is_extra_edition') else 'Não'}")
    if gazette.get("txt_url"):
        print(f"  TXT: {gazette['txt_url']}")
    print()
```

### Listar municípios cobertos pelo Querido Diário

```python
import requests

BASE_URL = "https://api.queridodiario.ok.org.br"

response = requests.get(f"{BASE_URL}/cities")
response.raise_for_status()
cidades = response.json()["cities"]

print(f"Municípios cobertos: {len(cidades)}")
# Filtrar por estado
sp = [c for c in cidades if c.get("state_code") == "SP"]
print(f"Municípios de SP cobertos: {len(sp)}")
for cidade in sp[:5]:
    print(f"  {cidade['territory_name']} ({cidade['territory_id']})")
```

### Monitorar palavras-chave em múltiplos municípios

```python
import requests
import pandas as pd

BASE_URL = "https://api.queridodiario.ok.org.br"

municipios = {
    "São Paulo": "3550308",
    "Rio de Janeiro": "3304557",
    "Belo Horizonte": "3106200",
    "Salvador": "2927408",
    "Curitiba": "4106902",
}

resultados = []
for nome, codigo in municipios.items():
    params = {
        "territory_ids": codigo,
        "since": "2025-01-01",
        "until": "2025-01-31",
        "querystring": "emergência",
    }

    response = requests.get(f"{BASE_URL}/gazettes", params=params)
    if response.status_code == 200:
        total = response.json()["total_gazettes"]
        resultados.append({"municipio": nome, "mencoes": total})

df = pd.DataFrame(resultados)
print("Menções a 'emergência' nos diários oficiais (jan/2025):")
print(df.to_string(index=False))
```

### Usando o wrapper Python oficial

```python
# Instalar: pip install querido-diario-api-wrapper
from querido_diario import QueridoDiario

qd = QueridoDiario()

# Buscar diários
resultados = qd.search_gazettes(
    territory_id="3550308",
    since="2025-01-01",
    until="2025-01-31",
    querystring="licitação",
)

for gazette in resultados:
    print(f"Data: {gazette.date} | Edição: {gazette.edition}")
```

## Campos disponíveis

### Querido Diário API — Resposta `/gazettes`

| Campo | Tipo | Descrição |
|---|---|---|
| `territory_id` | string | Código IBGE do território |
| `territory_name` | string | Nome do município |
| `state_code` | string | UF do município |
| `date` | date | Data de publicação |
| `edition` | string | Número da edição |
| `is_extra_edition` | boolean | Indica se é edição extra |
| `txt_url` | string | URL do conteúdo extraído em TXT |
| `url` | string | URL original do documento (PDF/HTML) |
| `excerpts` | array | Trechos de texto que correspondem à busca |
| `highlight_texts` | array | Trechos com destaque dos termos buscados |

### Querido Diário API — Resposta `/cities`

| Campo | Tipo | Descrição |
|---|---|---|
| `territory_id` | string | Código IBGE do município |
| `territory_name` | string | Nome do município |
| `state_code` | string | Sigla do estado |
| `level` | string | Nível administrativo (municipal) |

## Cruzamentos possíveis

| Cruzamento | Fonte relacionada | Chave de ligação | Finalidade |
|---|---|---|---|
| DOE x DOU | [DOU](/docs/apis/diarios-oficiais/dou) | Órgão, tema, data | Comparar atos federais e municipais/estaduais sobre mesmo tema |
| DOE x Contratos | [Contratos Federais](/docs/apis/transparencia-cgu/contratos-federais) | Órgão, CNPJ, valor | Cruzar licitações publicadas em diários com contratos federais |
| DOE x População | [Censo Demográfico](/docs/apis/ibge-estatisticas/censo-demografico) | `territory_id` (código IBGE) | Contextualizar publicações oficiais com dados demográficos |
| DOE x Empresas | [CNPJ Completa](/docs/apis/receita-federal/cnpj-completa) | CNPJ (extraído do texto) | Identificar empresas mencionadas em licitações e contratos publicados |

## Limitações conhecidas

| Limitação | Detalhes |
|---|---|
| **Foco municipal** | O Querido Diário cobre primariamente diários **municipais** (370+ de 5.570 municípios, ~6,6%). A cobertura de diários estaduais é limitada. |
| **Fragmentação** | Cada estado e município tem seu próprio portal, sem padronização de formato ou estrutura. |
| **Formato PDF** | A maioria dos diários originais é publicada em PDF, exigindo OCR/extração de texto para análise programática. |
| **Sem API oficial dos estados** | A maioria dos estados não oferece API oficial para seus diários. O Querido Diário é a principal alternativa programática. |
| **Qualidade da extração** | A extração de texto de PDFs pelo Querido Diário pode conter erros de OCR, especialmente em edições mais antigas ou de menor qualidade. |
| **Sem padronização de atos** | Cada estado/município classifica seus atos de forma diferente, dificultando comparações automáticas. |
| **Portais estaduais instáveis** | Muitos portais de diários oficiais estaduais apresentam instabilidade e funcionalidades limitadas de busca. |
| **Sem dados estruturados** | Os diários oficiais são texto livre. Não há campos estruturados padronizados (valores, CNPJs, datas) — a extração de informações específicas requer processamento de linguagem natural. |
