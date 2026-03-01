---
title: Filiados a Partidos
slug: filiados-partidos
orgao: TSE
url_base: https://dadosabertos.tse.jus.br/
tipo_acesso: CSV Download
autenticacao: Não requerida
formato_dados: [CSV]
frequencia_atualizacao: Anual
campos_chave:
  - nome_filiado
  - sigla_partido
  - data_filiacao
  - situacao_registro
  - municipio
  - zona_eleitoral
  - secao_eleitoral
tags:
  - eleições
  - filiação partidária
  - partidos políticos
  - filiados
  - militância
  - base partidária
cruzamento_com:
  - justica-eleitoral-tse/candidaturas
  - justica-eleitoral-tse/eleitorado
  - transparencia-cgu/servidores-federais
status: documentado
---

# Filiados a Partidos

## O que é

A base de **Filiados a Partidos** do **Tribunal Superior Eleitoral (TSE)** contém os registros de todos os cidadãos brasileiros filiados a partidos políticos. Os dados incluem nome do filiado, partido, data de filiação, situação do registro (regular, cancelado, desfiliado), município, zona e seção eleitoral.

Essa base é atualizada periodicamente e constitui um retrato da **estrutura organizacional** dos partidos políticos no Brasil. Permite análises sobre a distribuição geográfica da base partidária, taxas de filiação e desfiliação, migração entre partidos e a penetração dos partidos em diferentes regiões.

**Importante:** Por questões de privacidade, a base de filiados **não contém CPF**. A identificação se dá pelo nome completo e dados de localização (município, zona, seção), o que limita cruzamentos diretos mas ainda permite análises agregadas significativas.

**Fonte oficial:** https://dadosabertos.tse.jus.br/dataset/filiados

**Download direto (CDN):** https://cdn.tse.jus.br/estatistica/sead/odsele/filiacao_partidaria/

## Como acessar

| Item | Detalhe |
|---|---|
| **URL base (CKAN)** | `https://dadosabertos.tse.jus.br/dataset/filiados` |
| **URL base (CDN)** | `https://cdn.tse.jus.br/estatistica/sead/odsele/filiacao_partidaria/` |
| **Tipo de acesso** | Download direto de arquivos ZIP contendo CSVs |
| **Autenticação** | Não requerida |
| **Formato** | CSV (delimitado por `;`, encoding Latin-1/ISO-8859-1) |
| **Tamanho** | Varia por partido — entre 1 MB e 100 MB compactado |

### Organização dos arquivos

Os dados são organizados por partido político:

- `filiados_pp_SG_PARTIDO.zip` — filiados de um partido específico (todas as UFs)

Exemplos:

- `filiados_pp_PT.zip` — filiados do PT
- `filiados_pp_PL.zip` — filiados do PL
- `filiados_pp_MDB.zip` — filiados do MDB

Cada ZIP contém CSVs separados por UF.

## Endpoints/recursos principais

| Recurso | Conteúdo | Observação |
|---|---|---|
| `filiados_pp_SG.zip` | Base de filiados por partido | Um arquivo ZIP por partido |
| `filiados_pp_SG_UF.csv` | Base de filiados por partido e UF | Dentro do ZIP |

### Download direto

```
https://cdn.tse.jus.br/estatistica/sead/odsele/filiacao_partidaria/filiados_pp_PT.zip
https://cdn.tse.jus.br/estatistica/sead/odsele/filiacao_partidaria/filiados_pp_PL.zip
https://cdn.tse.jus.br/estatistica/sead/odsele/filiacao_partidaria/filiados_pp_MDB.zip
https://cdn.tse.jus.br/estatistica/sead/odsele/filiacao_partidaria/filiados_pp_PSDB.zip
https://cdn.tse.jus.br/estatistica/sead/odsele/filiacao_partidaria/filiados_pp_PP.zip
```

## Exemplo de uso

### Download e leitura de filiados de um partido

```python
import requests
import zipfile
import pandas as pd
from io import BytesIO
from pathlib import Path


def baixar_filiados(partido: str, destino: Path = Path("./dados_tse")) -> pd.DataFrame:
    """
    Baixa e carrega dados de filiados de um partido.

    Args:
        partido: Sigla do partido (ex: 'PT', 'PL', 'MDB')
        destino: Diretório para salvar os arquivos

    Returns:
        DataFrame com todos os filiados do partido
    """
    url = (
        f"https://cdn.tse.jus.br/estatistica/sead/odsele/"
        f"filiacao_partidaria/filiados_pp_{partido.upper()}.zip"
    )
    print(f"Baixando filiados do {partido.upper()}...")

    response = requests.get(url)
    response.raise_for_status()

    destino.mkdir(parents=True, exist_ok=True)

    with zipfile.ZipFile(BytesIO(response.content)) as zf:
        zf.extractall(destino)
        csvs = [f for f in zf.namelist() if f.endswith(".csv")]

    # Carregar e concatenar todos os CSVs (um por UF)
    dfs = []
    for csv_file in csvs:
        df = pd.read_csv(
            destino / csv_file,
            sep=";",
            encoding="latin-1",
            dtype=str,
        )
        dfs.append(df)

    df_completo = pd.concat(dfs, ignore_index=True)
    print(f"Filiados do {partido.upper()}: {len(df_completo):,}")
    return df_completo


# Baixar filiados do PT
df_pt = baixar_filiados("PT")
print(df_pt.head())
```

### Análise da distribuição geográfica de filiados

```python
def distribuicao_por_uf(df: pd.DataFrame) -> pd.DataFrame:
    """
    Analisa a distribuição de filiados por UF.

    Args:
        df: DataFrame com dados de filiados

    Returns:
        DataFrame com contagem por UF, ordenada decrescente
    """
    # Filtrar apenas filiados com registro regular
    ativos = df[df["SITUACAO_REGISTRO"].str.upper() == "REGULAR"]

    por_uf = (
        ativos.groupby("UF")
        .size()
        .reset_index(name="total_filiados")
        .sort_values("total_filiados", ascending=False)
    )

    por_uf["percentual"] = (
        por_uf["total_filiados"] / por_uf["total_filiados"].sum() * 100
    ).round(2)

    return por_uf


distribuicao = distribuicao_por_uf(df_pt)
print("Distribuição de filiados do PT por UF:")
print(distribuicao.head(10))
```

### Comparar tamanho da base de filiados entre partidos

```python
def comparar_partidos(
    partidos: list[str],
    apenas_regulares: bool = True,
) -> pd.DataFrame:
    """
    Compara a quantidade de filiados entre partidos.

    Args:
        partidos: Lista de siglas de partidos
        apenas_regulares: Se True, conta apenas filiados com registro regular

    Returns:
        DataFrame comparativo
    """
    resultados = []

    for sigla in partidos:
        try:
            df = baixar_filiados(sigla)
            if apenas_regulares:
                df = df[df["SITUACAO_REGISTRO"].str.upper() == "REGULAR"]

            resultados.append({
                "partido": sigla,
                "total_filiados": len(df),
                "ufs_com_filiados": df["UF"].nunique(),
                "municipios_com_filiados": df["NOME_MUNICIPIO"].nunique(),
            })
        except Exception as e:
            print(f"Erro ao processar {sigla}: {e}")

    return pd.DataFrame(resultados).sort_values("total_filiados", ascending=False)


# Comparar os 5 maiores partidos
resultado = comparar_partidos(["PT", "PL", "MDB", "PP", "UNIÃO"])
print(resultado)
```

### Análise de tendência de filiação ao longo do tempo

```python
def tendencia_filiacao(df: pd.DataFrame) -> pd.DataFrame:
    """
    Analisa a evolução das filiações ao longo dos anos.

    Args:
        df: DataFrame com dados de filiados

    Returns:
        DataFrame com contagem de novas filiações por ano
    """
    df["DATA_FILIACAO"] = pd.to_datetime(
        df["DATA_FILIACAO"], format="%d/%m/%Y", errors="coerce"
    )
    df["ANO_FILIACAO"] = df["DATA_FILIACAO"].dt.year

    por_ano = (
        df.groupby("ANO_FILIACAO")
        .size()
        .reset_index(name="novas_filiacoes")
        .sort_values("ANO_FILIACAO")
    )

    return por_ano[por_ano["ANO_FILIACAO"] >= 2000]


tendencia = tendencia_filiacao(df_pt)
print("Novas filiações ao PT por ano:")
print(tendencia)
```

## Campos disponíveis

| Campo | Tipo | Descrição |
|---|---|---|
| `DT_GERACAO` | string | Data de geração do arquivo |
| `HH_GERACAO` | string | Hora de geração |
| `NOME_FILIADO` | string | Nome completo do filiado |
| `SIGLA_PARTIDO` | string | Sigla do partido |
| `UF` | string(2) | Sigla da UF |
| `CODIGO_MUNICIPIO` | string | Código TSE do município |
| `NOME_MUNICIPIO` | string | Nome do município |
| `ZONA_ELEITORAL` | string | Número da zona eleitoral |
| `SECAO_ELEITORAL` | string | Número da seção eleitoral |
| `DATA_FILIACAO` | string | Data da filiação (DD/MM/AAAA) |
| `SITUACAO_REGISTRO` | string | Situação do registro (REGULAR, CANCELADO, DESFILIADO, SUB JUDICE) |
| `TIPO_REGISTRO` | string | Tipo do registro |
| `DATA_PROCESSAMENTO` | string | Data do processamento |
| `DATA_DESFILIACAO` | string | Data da desfiliação (quando aplicável) |
| `DATA_CANCELAMENTO` | string | Data do cancelamento (quando aplicável) |
| `DATA_REGULARIZACAO` | string | Data da regularização (quando aplicável) |
| `MOTIVO_CANCELAMENTO` | string | Motivo do cancelamento |

## Cruzamentos possíveis

| Cruzamento | Fonte relacionada | Chave de ligação | Finalidade |
|---|---|---|---|
| Filiados x Candidatos | [Candidaturas](/docs/apis/justica-eleitoral-tse/candidaturas) | `NOME_FILIADO` ↔ `NM_CANDIDATO` + `SG_PARTIDO` + `SG_UF` | Verificar filiação de candidatos e histórico partidário |
| Filiados x Eleitorado | [Eleitorado](/docs/apis/justica-eleitoral-tse/eleitorado) | `CODIGO_MUNICIPIO` + `ZONA_ELEITORAL` | Calcular taxa de filiação por zona/município em relação ao eleitorado |
| Filiados x Servidores | [Servidores Federais](/docs/apis/transparencia-cgu/servidores-federais) | `NOME_FILIADO` (aproximação) | Identificar servidores filiados a partidos (análise de afinidade política) |

### Exemplo de cruzamento: taxa de filiação por município

```python
import pandas as pd

# 1. Carregar filiados de um partido
df_filiados = pd.read_csv(
    "dados_tse/filiados_pp_PT_SP.csv",
    sep=";",
    encoding="latin-1",
    dtype=str,
)

# Contar filiados regulares por município
filiados_ativos = df_filiados[df_filiados["SITUACAO_REGISTRO"] == "REGULAR"]
filiados_por_mun = (
    filiados_ativos.groupby(["CODIGO_MUNICIPIO", "NOME_MUNICIPIO"])
    .size()
    .reset_index(name="total_filiados")
)

# 2. Carregar eleitorado por município (previamente baixado)
df_eleitorado = pd.read_csv(
    "dados_tse/perfil_eleitorado_2024_SP.csv",
    sep=";",
    encoding="latin-1",
    dtype=str,
)

# Agregar eleitorado por município
df_eleitorado["QT_ELEITORES_PERFIL"] = pd.to_numeric(
    df_eleitorado["QT_ELEITORES_PERFIL"], errors="coerce"
)
eleitores_por_mun = (
    df_eleitorado.groupby("CD_MUNICIPIO")
    .agg(total_eleitores=("QT_ELEITORES_PERFIL", "sum"))
    .reset_index()
)

# 3. Calcular taxa de filiação
taxa = pd.merge(
    filiados_por_mun,
    eleitores_por_mun,
    left_on="CODIGO_MUNICIPIO",
    right_on="CD_MUNICIPIO",
    how="inner",
)
taxa["taxa_filiacao_pct"] = (
    taxa["total_filiados"] / taxa["total_eleitores"] * 100
).round(2)

print("Municípios com maior taxa de filiação ao PT (SP):")
print(
    taxa.sort_values("taxa_filiacao_pct", ascending=False)
    [["NOME_MUNICIPIO", "total_filiados", "total_eleitores", "taxa_filiacao_pct"]]
    .head(15)
)
```

## Limitações conhecidas

| Limitação | Detalhes |
|---|---|
| **Sem CPF disponível** | A base de filiados não contém o CPF dos filiados, o que limita cruzamentos diretos com outras bases governamentais. A identificação se dá apenas pelo nome completo. |
| **Encoding Latin-1** | Os arquivos usam encoding ISO-8859-1 (Latin-1). Especificar `encoding="latin-1"` ao ler os dados. |
| **Homônimos** | Sem CPF, é impossível distinguir homônimos (pessoas com o mesmo nome). Cruzamentos por nome devem ser feitos com cautela, usando campos adicionais (UF, município) para desambiguação. |
| **Arquivos separados por partido** | Cada partido tem seu próprio arquivo ZIP. Para análises que envolvam todos os partidos, é necessário baixar e processar dezenas de arquivos. |
| **Registros cancelados e desfiliados** | A base inclui registros de todas as situações. Filtrar por `SITUACAO_REGISTRO = "REGULAR"` para considerar apenas filiados ativos. |
| **Migração partidária** | Um mesmo cidadão pode aparecer em bases de múltiplos partidos (como desfiliado em um e regular em outro). |
| **Atraso na atualização** | A comunicação de filiação e desfiliação pelos partidos à Justiça Eleitoral pode ter atraso de semanas ou meses. |
| **Código de município TSE x IBGE** | O TSE usa códigos próprios de município, diferentes do IBGE. Necessária tabela de correspondência para cruzamentos geográficos. |
| **Volume de dados** | Partidos grandes como MDB, PT e PL podem ter milhões de filiados, resultando em arquivos grandes. |
| **Dados de localização** | A zona e seção eleitoral do filiado referem-se ao seu domicílio eleitoral, que pode não corresponder ao endereço residencial atual. |
