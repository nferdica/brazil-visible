---
title: Censo Demográfico — Dados Populacionais por Município
slug: censo-demografico
orgao: IBGE
url_base: https://servicodados.ibge.gov.br/api/v3/agregados
tipo_acesso: API REST
autenticacao: Não requerida
formato_dados: [JSON, CSV]
frequencia_atualizacao: Decenal
campos_chave:
  - codigo_municipio
  - populacao
  - domicilios
  - renda_media
  - escolaridade
  - idade
  - sexo
  - cor_raca
tags:
  - IBGE
  - censo
  - população
  - demografia
  - domicílios
  - renda
  - escolaridade
  - município
  - microdados
cruzamento_com:
  - ibge-estatisticas/pib-municipal
  - ibge-estatisticas/pnad-continua
  - educacao/censo-escolar
  - saude-datasus/tabnet
  - trabalho-emprego/rais
status: documentado
---

# Censo Demográfico — Dados Populacionais por Município

## O que é

O **Censo Demográfico** do **IBGE (Instituto Brasileiro de Geografia e Estatística)** é a mais ampla pesquisa estatística do Brasil, realizada a cada 10 anos, que conta toda a população do país e coleta informações sobre:

- **População** — contagem total, distribuição por sexo, idade, cor/raça, nacionalidade
- **Domicílios** — tipo, condição de ocupação, infraestrutura (água, esgoto, energia, internet)
- **Educação** — escolaridade, alfabetização, frequência escolar
- **Renda** — rendimento domiciliar, rendimento per capita, fontes de renda
- **Trabalho** — ocupação, posição na ocupação, setor de atividade
- **Migração** — lugar de nascimento, migração recente
- **Pessoas com deficiência** — tipo e grau de dificuldade

O Censo 2022 (realizado em agosto de 2022) é o mais recente, com resultados sendo divulgados progressivamente pelo IBGE. Os dados estão disponíveis tanto via **API SIDRA/Agregados** quanto via download de microdados.

## Como acessar

| Item | Detalhe |
|---|---|
| **API Agregados (SIDRA)** | `https://servicodados.ibge.gov.br/api/v3/agregados` |
| **API SIDRA clássica** | `https://apisidra.ibge.gov.br/` |
| **Portal do Censo 2022** | `https://censo2022.ibge.gov.br/` |
| **Microdados** | `https://www.ibge.gov.br/estatisticas/sociais/populacao/22827-censo-demografico-2022.html` |
| **Autenticação** | Não requerida |
| **Rate limit** | Não documentado; recomenda-se 1-2 req/segundo |
| **Formatos** | JSON (API), CSV (download) |
| **CORS** | Habilitado |

### Estrutura da API Agregados

```
https://servicodados.ibge.gov.br/api/v3/agregados/{pesquisa}/periodos/{periodo}/variaveis/{variavel}?localidades=N6[all]
```

Parâmetros:
- `N1` = Brasil, `N2` = Grandes Regiões, `N3` = UFs, `N6` = Municípios
- `periodos` = ano(s) de referência
- `variaveis` = código da variável
- `classificacao` = filtros por categoria

## Endpoints/recursos principais

### Principais tabelas do Censo 2022 na API Agregados

| Tabela/Agregado | Código | Conteúdo |
|---|---|---|
| População residente | 4714 | População por sexo e idade |
| Domicílios | 9605 | Domicílios por tipo e condição de ocupação |
| Alfabetização | 9543 | Taxa de alfabetização por idade e sexo |
| Rendimento | 9947 | Renda domiciliar e per capita (divulgado em 2024) |
| Cor/raça | 9606 | População por cor ou raça |
| Pessoas com deficiência | 9948 | Tipo e grau de dificuldade (divulgado em 2024) |

### API de Localidades

| Endpoint | Descrição |
|---|---|
| `/api/v1/localidades/estados` | Lista de UFs |
| `/api/v1/localidades/estados/{uf}/municipios` | Municípios de uma UF |
| `/api/v1/localidades/municipios/{id}` | Dados de um município |

## Exemplo de uso

### População por município via API

```python
import requests
import pandas as pd

# População residente por município (Censo 2022)
# Tabela 4714 — População residente
url = (
    "https://servicodados.ibge.gov.br/api/v3/agregados/4714"
    "/periodos/2022/variaveis/93"
    "?localidades=N6[all]"
)

response = requests.get(url)
response.raise_for_status()
dados = response.json()

# Extrair dados
registros = []
for resultado in dados[0]["resultados"]:
    for local_id, valor in resultado["series"][0]["serie"].items():
        pass  # Estrutura aninhada — veja abaixo

# Alternativa mais prática: usar a API SIDRA
url_sidra = (
    "https://apisidra.ibge.gov.br/values/t/4714/n6/all/v/93/p/2022"
)

response = requests.get(url_sidra)
response.raise_for_status()
dados = response.json()

# Converter para DataFrame
df = pd.DataFrame(dados[1:], columns=[d for d in dados[0].values()])
print(f"Total de municípios: {len(df):,}")
print(df[["Município", "Valor"]].head(10))
```

### Consulta via sidrapy (biblioteca Python)

```python
import sidrapy

# População por sexo e idade — todos os municípios
dados = sidrapy.get_table(
    table_code="4714",
    territorial_level="6",  # Município
    ibge_territorial_code="all",
    variable="93",  # População residente
    period="2022",
)

print(f"Total de registros: {len(dados):,}")
print(dados[["D1N", "V"]].head(10))  # D1N=Nome do município, V=Valor
```

### Top 10 municípios mais populosos

```python
import sidrapy
import pandas as pd

dados = sidrapy.get_table(
    table_code="4714",
    territorial_level="6",
    ibge_territorial_code="all",
    variable="93",
    period="2022",
)

# Limpar e ordenar
dados["V"] = pd.to_numeric(dados["V"], errors="coerce")
top10 = dados.nlargest(10, "V")[["D1N", "V"]]
top10.columns = ["Município", "População"]

print("Top 10 municípios mais populosos (Censo 2022):")
print(top10.to_string(index=False))
```

## Campos disponíveis

### Variáveis principais do Censo 2022 (API Agregados)

| Variável | Código | Descrição |
|---|---|---|
| População residente | 93 | Total de pessoas residentes |
| Homens | 93 (classif. sexo=1) | População masculina |
| Mulheres | 93 (classif. sexo=2) | População feminina |
| Domicílios particulares | 137 | Total de domicílios |
| Pessoas alfabetizadas | 1648 | População alfabetizada (15+ anos) |

### Níveis territoriais

| Nível | Código | Descrição |
|---|---|---|
| Brasil | N1 | Total nacional |
| Grande Região | N2 | Norte, Nordeste, Sudeste, Sul, Centro-Oeste |
| UF | N3 | Unidades da Federação |
| Mesorregião | N4 | Mesorregiões geográficas |
| Microrregião | N5 | Microrregiões geográficas |
| Município | N6 | 5.570 municípios |
| Distrito | N7 | Distritos |
| Subdistrito | N8 | Subdistritos |
| Setor censitário | N9 | Menor unidade territorial |

### Microdados (download)

| Campo | Tipo | Descrição |
|---|---|---|
| `V0001` | int | UF |
| `V0002` | int | Município |
| `V0010` | float | Peso amostral |
| `V0601` | int | Sexo (1=M, 2=F) |
| `V6033` | int | Idade em anos |
| `V0606` | int | Cor/raça |
| `V6529` | float | Rendimento domiciliar per capita |
| `V0628` | int | Grau de instrução |

## Cruzamentos possíveis

| Cruzamento | Fonte relacionada | Chave de ligação | Finalidade |
|---|---|---|---|
| População x PIB | [PIB Municipal](/docs/apis/ibge-estatisticas/pib-municipal) | `codigo_municipio` | Calcular PIB per capita por município |
| População x Emprego | [RAIS](/docs/apis/trabalho-emprego/rais) | `codigo_municipio` | Calcular taxa de formalização do trabalho |
| População x Educação | [Censo Escolar](/docs/apis/educacao/censo-escolar) | `codigo_municipio` | Comparar população em idade escolar com matrículas |
| População x Saúde | [TabNet](/docs/apis/saude-datasus/tabnet) | `codigo_municipio` | Calcular indicadores de saúde (mortalidade, natalidade per capita) |
| Renda x PNAD | [PNAD Contínua](/docs/apis/ibge-estatisticas/pnad-continua) | UF | Comparar dados censitários com pesquisa amostral trimestral |

## Limitações conhecidas

| Limitação | Detalhes |
|---|---|
| **Decenal** | O Censo é realizado a cada 10 anos. Dados intercensitários dependem de estimativas e da PNAD. |
| **Divulgação progressiva** | Os resultados do Censo 2022 estão sendo divulgados por temas ao longo de 2023-2025. Nem todas as variáveis estão disponíveis na API ainda. |
| **Microdados pesados** | Os microdados do Censo são extremamente volumosos (dezenas de GB). Processamento exige infraestrutura robusta. |
| **Dados amostrais** | Variáveis detalhadas (renda, migração, trabalho) são coletadas por amostragem, não universo. Estimativas municipais de municípios pequenos têm maior margem de erro. |
| **API pode ser lenta** | Consultas a nível municipal para todo o Brasil podem demorar vários segundos. |
| **Código de município** | O IBGE usa código de 7 dígitos. Algumas fontes usam 6 dígitos (sem dígito verificador). É necessário harmonizar. |
| **Setores censitários** | Dados por setor censitário (nível mais detalhado) são disponibilizados com maior atraso e em formatos diferentes. |
