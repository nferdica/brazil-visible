---
title: Resultados Eleitorais
slug: resultados-eleitorais
orgao: TSE
url_base: https://dadosabertos.tse.jus.br/
tipo_acesso: CSV Download
autenticacao: Não requerida
formato_dados: [CSV]
frequencia_atualizacao: Por eleição
campos_chave:
  - numero_candidato
  - codigo_municipio
  - zona_eleitoral
  - secao_eleitoral
  - quantidade_votos
  - ano_eleicao
tags:
  - eleições
  - votação
  - apuração
  - resultados
  - seção eleitoral
  - votos
  - urna eletrônica
cruzamento_com:
  - justica-eleitoral-tse/candidaturas
  - justica-eleitoral-tse/boletins-urna
  - justica-eleitoral-tse/eleitorado
  - justica-eleitoral-tse/prestacao-contas
status: documentado
---

# Resultados Eleitorais

## O que é

A base de **Resultados Eleitorais** do **Tribunal Superior Eleitoral (TSE)** contém os dados de votação de todas as eleições realizadas no Brasil desde 1994, com granularidade que vai desde o total nacional até a **seção eleitoral** individual. Os dados incluem a quantidade de votos recebidos por cada candidato e legenda, além de votos brancos, nulos e abstenções.

Essa é a fonte primária para análise de desempenho eleitoral, mapeamento de redutos eleitorais e estudos de comportamento político. Quando cruzada com a base de candidaturas, permite correlacionar votação com perfil do candidato, financiamento de campanha e resultados de mandato.

**Fonte oficial:** https://dadosabertos.tse.jus.br/dataset/resultados

**Download direto (CDN):** https://cdn.tse.jus.br/estatistica/sead/odsele/votacao_candidato_munzona/

## Como acessar

| Item | Detalhe |
|---|---|
| **URL base (CKAN)** | `https://dadosabertos.tse.jus.br/dataset/resultados` |
| **URL base (CDN)** | `https://cdn.tse.jus.br/estatistica/sead/odsele/votacao_candidato_munzona/` |
| **Tipo de acesso** | Download direto de arquivos ZIP contendo CSVs |
| **Autenticação** | Não requerida |
| **Formato** | CSV (delimitado por `;`, encoding Latin-1/ISO-8859-1) |
| **Tamanho** | Varia — votação por seção eleitoral pode chegar a centenas de MB por eleição |

### Organização dos arquivos

Os dados de resultados são disponibilizados em diferentes níveis de agregação:

- **Votação por candidato por município/zona** (`votacao_candidato_munzona/`) — votos agregados por município e zona eleitoral
- **Votação por seção eleitoral** (`votacao_secao/`) — o nível mais granular disponível
- **Votação por partido por município/zona** (`votacao_partido_munzona/`) — votos agregados por legenda

Exemplos de URLs:

```
https://cdn.tse.jus.br/estatistica/sead/odsele/votacao_candidato_munzona/votacao_candidato_munzona_2022.zip
https://cdn.tse.jus.br/estatistica/sead/odsele/votacao_secao/votacao_secao_2022_BR.zip
```

## Endpoints/recursos principais

| Recurso | Conteúdo | Granularidade |
|---|---|---|
| `votacao_candidato_munzona_YYYY.zip` | Votos por candidato, município e zona | Município/zona |
| `votacao_secao_YYYY_UF.zip` | Votos por seção eleitoral (por UF) | Seção eleitoral |
| `votacao_partido_munzona_YYYY.zip` | Votos por partido, município e zona | Município/zona |

### Download direto (votação por candidato)

```
https://cdn.tse.jus.br/estatistica/sead/odsele/votacao_candidato_munzona/votacao_candidato_munzona_2022.zip
https://cdn.tse.jus.br/estatistica/sead/odsele/votacao_candidato_munzona/votacao_candidato_munzona_2020.zip
https://cdn.tse.jus.br/estatistica/sead/odsele/votacao_candidato_munzona/votacao_candidato_munzona_2018.zip
```

### Download direto (votação por seção eleitoral)

```
https://cdn.tse.jus.br/estatistica/sead/odsele/votacao_secao/votacao_secao_2022_BR.zip
https://cdn.tse.jus.br/estatistica/sead/odsele/votacao_secao/votacao_secao_2022_SP.zip
https://cdn.tse.jus.br/estatistica/sead/odsele/votacao_secao/votacao_secao_2022_RJ.zip
```

## Exemplo de uso

### Download e leitura de resultados por candidato

```python
import requests
import zipfile
import pandas as pd
from io import BytesIO
from pathlib import Path


def baixar_votacao_munzona(ano: int, destino: Path = Path("./dados_tse")) -> pd.DataFrame:
    """
    Baixa e carrega dados de votação por candidato/município/zona.

    Args:
        ano: Ano da eleição (ex: 2022, 2020, 2018)
        destino: Diretório para salvar os arquivos

    Returns:
        DataFrame com votação por candidato e município/zona
    """
    url = (
        f"https://cdn.tse.jus.br/estatistica/sead/odsele/"
        f"votacao_candidato_munzona/votacao_candidato_munzona_{ano}.zip"
    )
    print(f"Baixando votação {ano}...")

    response = requests.get(url)
    response.raise_for_status()

    destino.mkdir(parents=True, exist_ok=True)

    with zipfile.ZipFile(BytesIO(response.content)) as zf:
        arquivo_brasil = [
            f for f in zf.namelist()
            if "BRASIL" in f.upper() and f.endswith(".csv")
        ]
        if arquivo_brasil:
            zf.extract(arquivo_brasil[0], destino)
            caminho_csv = destino / arquivo_brasil[0]
        else:
            zf.extractall(destino)
            csvs = [f for f in zf.namelist() if f.endswith(".csv")]
            caminho_csv = destino / csvs[0]

    df = pd.read_csv(
        caminho_csv,
        sep=";",
        encoding="latin-1",
        dtype=str,
    )

    print(f"Registros carregados: {len(df):,}")
    return df


# Carregar resultados das eleições de 2022
df_votos = baixar_votacao_munzona(2022)
print(df_votos.head())
```

### Analisar votação de um candidato por município

```python
def votacao_por_municipio(
    df: pd.DataFrame,
    numero_candidato: str,
    cargo: str = None,
    turno: str = "1",
) -> pd.DataFrame:
    """
    Agrega a votação de um candidato por município.

    Args:
        df: DataFrame com dados de votação
        numero_candidato: Número do candidato na urna
        cargo: Código ou descrição do cargo (opcional)
        turno: Turno da eleição ('1' ou '2')

    Returns:
        DataFrame com votação por município, ordenado por votos
    """
    filtro = (
        (df["NR_CANDIDATO"] == str(numero_candidato))
        & (df["NR_TURNO"] == str(turno))
    )
    if cargo:
        filtro = filtro & (df["DS_CARGO"].str.upper() == cargo.upper())

    df_filtrado = df[filtro].copy()
    df_filtrado["QT_VOTOS_NOMINAIS"] = pd.to_numeric(
        df_filtrado["QT_VOTOS_NOMINAIS"], errors="coerce"
    )

    resultado = (
        df_filtrado.groupby(["CD_MUNICIPIO", "NM_MUNICIPIO", "SG_UF"])
        .agg(total_votos=("QT_VOTOS_NOMINAIS", "sum"))
        .reset_index()
        .sort_values("total_votos", ascending=False)
    )

    return resultado


# Exemplo: votação por município de um candidato a presidente
resultado = votacao_por_municipio(df_votos, "13", cargo="PRESIDENTE")
print(f"Municípios com votação: {len(resultado)}")
print(resultado.head(20))
```

### Mapa de calor da votação por seção eleitoral

```python
def carregar_votacao_secao(ano: int, uf: str) -> pd.DataFrame:
    """
    Carrega votação por seção eleitoral de um estado.

    Args:
        ano: Ano da eleição
        uf: Sigla da UF (ex: 'SP', 'RJ')

    Returns:
        DataFrame com votação por seção eleitoral
    """
    url = (
        f"https://cdn.tse.jus.br/estatistica/sead/odsele/"
        f"votacao_secao/votacao_secao_{ano}_{uf}.zip"
    )
    response = requests.get(url)
    response.raise_for_status()

    with zipfile.ZipFile(BytesIO(response.content)) as zf:
        csvs = [f for f in zf.namelist() if f.endswith(".csv")]
        zf.extractall(Path("./dados_tse"))

    df = pd.read_csv(
        Path("./dados_tse") / csvs[0],
        sep=";",
        encoding="latin-1",
        dtype=str,
    )
    return df


# Carregar votação por seção em São Paulo
df_secao_sp = carregar_votacao_secao(2022, "SP")
print(f"Registros por seção (SP): {len(df_secao_sp):,}")
```

## Campos disponíveis

### Votação por candidato e município/zona (`votacao_candidato_munzona`)

| Campo | Tipo | Descrição |
|---|---|---|
| `DT_GERACAO` | string | Data de geração do arquivo |
| `HH_GERACAO` | string | Hora de geração do arquivo |
| `ANO_ELEICAO` | string(4) | Ano da eleição |
| `CD_TIPO_ELEICAO` | string | Código do tipo de eleição |
| `NM_TIPO_ELEICAO` | string | Descrição do tipo (ordinária, suplementar) |
| `NR_TURNO` | string | Número do turno (1 ou 2) |
| `CD_ELEICAO` | string | Código da eleição |
| `DS_ELEICAO` | string | Descrição da eleição |
| `SG_UF` | string(2) | Sigla da UF |
| `SG_UE` | string | Sigla da unidade eleitoral |
| `NM_UE` | string | Nome da unidade eleitoral |
| `CD_MUNICIPIO` | string | Código TSE do município |
| `NM_MUNICIPIO` | string | Nome do município |
| `NR_ZONA` | string | Número da zona eleitoral |
| `CD_CARGO` | string | Código do cargo |
| `DS_CARGO` | string | Descrição do cargo |
| `SQ_CANDIDATO` | string | Sequencial do candidato |
| `NR_CANDIDATO` | string | Número do candidato na urna |
| `NM_CANDIDATO` | string | Nome completo do candidato |
| `NM_URNA_CANDIDATO` | string | Nome de urna |
| `NR_PARTIDO` | string | Número do partido |
| `SG_PARTIDO` | string | Sigla do partido |
| `NM_PARTIDO` | string | Nome do partido |
| `DS_SIT_TOT_TURNO` | string | Situação final no turno (eleito, não eleito, 2o turno) |
| `QT_VOTOS_NOMINAIS` | int | Quantidade de votos nominais recebidos |

### Votação por seção eleitoral (`votacao_secao`)

Campos adicionais:

| Campo | Tipo | Descrição |
|---|---|---|
| `NR_SECAO` | string | Número da seção eleitoral |
| `QT_APTOS` | int | Eleitores aptos na seção |
| `QT_COMPARECIMENTO` | int | Eleitores que compareceram |
| `QT_ABSTENCOES` | int | Eleitores que não compareceram |
| `QT_VOTOS_NOMINAIS` | int | Votos nominais na seção |
| `QT_VOTOS_BRANCOS` | int | Votos em branco na seção |
| `QT_VOTOS_NULOS` | int | Votos nulos na seção |
| `QT_VOTOS_LEGENDA` | int | Votos de legenda na seção |
| `QT_VOTOS_ANULADOS_APU_SEP` | int | Votos anulados em apuração separada |

## Cruzamentos possíveis

| Cruzamento | Fonte relacionada | Chave de ligação | Finalidade |
|---|---|---|---|
| Votação x Candidatos | [Candidaturas](/docs/apis/justica-eleitoral-tse/candidaturas) | `SQ_CANDIDATO` / `NR_CANDIDATO` | Enriquecer resultados com dados pessoais, partido e cargo |
| Votação x Boletins de urna | [Boletins de Urna](/docs/apis/justica-eleitoral-tse/boletins-urna) | `NR_ZONA` + `NR_SECAO` | Validar dados de apuração com os registros brutos das urnas |
| Votação x Perfil do eleitorado | [Eleitorado](/docs/apis/justica-eleitoral-tse/eleitorado) | `CD_MUNICIPIO` + `NR_ZONA` + `NR_SECAO` | Correlacionar votação com perfil demográfico dos eleitores |
| Votação x Financiamento | [Prestação de Contas](/docs/apis/justica-eleitoral-tse/prestacao-contas) | `SQ_CANDIDATO` / `CPF` | Analisar relação entre gastos de campanha e desempenho nas urnas |

### Exemplo de cruzamento: votação versus gastos de campanha

```python
import pandas as pd

# 1. Carregar resultados eleitorais
df_votos = pd.read_csv(
    "dados_tse/votacao_candidato_munzona_2022_BRASIL.csv",
    sep=";",
    encoding="latin-1",
    dtype=str,
)

# 2. Agregar votos totais por candidato
df_votos["QT_VOTOS_NOMINAIS"] = pd.to_numeric(
    df_votos["QT_VOTOS_NOMINAIS"], errors="coerce"
)
votos_totais = (
    df_votos.groupby(["SQ_CANDIDATO", "NM_CANDIDATO", "SG_PARTIDO", "DS_CARGO"])
    .agg(total_votos=("QT_VOTOS_NOMINAIS", "sum"))
    .reset_index()
)

# 3. Carregar prestação de contas (receitas totais por candidato)
df_receitas = pd.read_csv(
    "dados_tse/prestacao_contas_2022_receitas_BRASIL.csv",
    sep=";",
    encoding="latin-1",
    dtype=str,
)
df_receitas["VR_RECEITA"] = pd.to_numeric(
    df_receitas["VR_RECEITA"].str.replace(",", "."), errors="coerce"
)
receitas_totais = (
    df_receitas.groupby("SQ_CANDIDATO")
    .agg(total_receitas=("VR_RECEITA", "sum"))
    .reset_index()
)

# 4. Cruzar votos com receitas
analise = pd.merge(votos_totais, receitas_totais, on="SQ_CANDIDATO", how="inner")
analise["custo_por_voto"] = analise["total_receitas"] / analise["total_votos"]

print("Top 10 candidatos — custo por voto (deputados federais):")
dep_fed = analise[analise["DS_CARGO"] == "DEPUTADO FEDERAL"].sort_values(
    "custo_por_voto", ascending=True
)
print(dep_fed[["NM_CANDIDATO", "SG_PARTIDO", "total_votos", "total_receitas", "custo_por_voto"]].head(10))
```

## Limitações conhecidas

| Limitação | Detalhes |
|---|---|
| **Arquivos muito grandes** | A votação por seção eleitoral pode ultrapassar 1 GB por estado em eleições gerais. Requer processamento em lotes ou uso de ferramentas como Dask/PySpark. |
| **Encoding Latin-1** | Os arquivos usam encoding ISO-8859-1 (Latin-1). Especificar `encoding="latin-1"` ao ler os dados. |
| **Código de município TSE x IBGE** | O TSE usa um sistema próprio de códigos de município, diferente do código IBGE. É necessário uma tabela de correspondência para cruzamentos geográficos. |
| **Dados por seção separados por UF** | A votação por seção eleitoral é distribuída em arquivos separados por UF, exigindo download individual de cada estado. |
| **Turno e tipo de eleição** | É fundamental filtrar por turno (`NR_TURNO`) e tipo de eleição para evitar duplicidade de contagem. |
| **Eleições suplementares** | Eleições suplementares (re-eleições por cassação) aparecem como registros separados e podem causar confusão se não identificadas. |
| **Sem geolocalização das seções** | Os dados de seção eleitoral não incluem coordenadas geográficas do local de votação, apenas zona e número de seção. |
| **Mudanças de layout entre eleições** | Nomes de colunas e estrutura podem variar entre anos eleitorais. Sempre verificar o cabeçalho antes de processar. |
| **Disponibilidade do CDN** | O servidor do TSE pode apresentar lentidão em períodos eleitorais e logo após divulgação de resultados. |
