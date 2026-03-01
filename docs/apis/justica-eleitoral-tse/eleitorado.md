---
title: Eleitorado
slug: eleitorado
orgao: TSE
url_base: https://dadosabertos.tse.jus.br/
tipo_acesso: CSV Download
autenticacao: Não requerida
formato_dados: [CSV]
frequencia_atualizacao: Anual
campos_chave:
  - codigo_municipio
  - zona_eleitoral
  - secao_eleitoral
  - faixa_etaria
  - genero
  - grau_instrucao
  - quantidade_eleitores
tags:
  - eleições
  - eleitorado
  - perfil demográfico
  - eleitores
  - seção eleitoral
  - faixa etária
  - escolaridade
cruzamento_com:
  - justica-eleitoral-tse/resultados-eleitorais
  - justica-eleitoral-tse/boletins-urna
  - justica-eleitoral-tse/filiados-partidos
  - justica-eleitoral-tse/candidaturas
status: documentado
---

# Eleitorado

## O que é

A base de **Eleitorado** do **Tribunal Superior Eleitoral (TSE)** contém o perfil demográfico dos eleitores brasileiros, com granularidade que vai do nível nacional até a **seção eleitoral** individual. Os dados incluem quantidade de eleitores por faixa etária, gênero, grau de instrução, estado civil e deficiência, agregados por município, zona e seção eleitoral.

Essa base é fundamental para compreender a composição do eleitorado brasileiro e possibilita análises sociológicas e políticas avançadas. Quando cruzada com os resultados eleitorais por seção, permite correlacionar o perfil demográfico dos eleitores com os padrões de votação — uma das análises mais poderosas em ciência política.

**Fonte oficial:** https://dadosabertos.tse.jus.br/dataset/eleitorado

**Download direto (CDN):** https://cdn.tse.jus.br/estatistica/sead/odsele/perfil_eleitorado/

## Como acessar

| Item | Detalhe |
|---|---|
| **URL base (CKAN)** | `https://dadosabertos.tse.jus.br/dataset/eleitorado` |
| **URL base (CDN)** | `https://cdn.tse.jus.br/estatistica/sead/odsele/perfil_eleitorado/` |
| **Tipo de acesso** | Download direto de arquivos ZIP contendo CSVs |
| **Autenticação** | Não requerida |
| **Formato** | CSV (delimitado por `;`, encoding Latin-1/ISO-8859-1) |
| **Tamanho** | Varia — perfil por seção pode chegar a centenas de MB |

### Organização dos arquivos

Os dados são disponibilizados em diferentes níveis de agregação:

- **Perfil do eleitorado por local de votação/seção:** `perfil_eleitorado_secao_YYYY_UF.zip`
- **Perfil do eleitorado consolidado:** `perfil_eleitorado_YYYY.zip`
- **Eleitorado por município/zona:** `eleitorado_YYYY.zip`

## Endpoints/recursos principais

| Recurso | Conteúdo | Granularidade |
|---|---|---|
| `perfil_eleitorado_YYYY.zip` | Perfil demográfico consolidado | Município/zona |
| `perfil_eleitorado_secao_YYYY_UF.zip` | Perfil por seção eleitoral (por UF) | Seção eleitoral |
| `eleitorado_YYYY.zip` | Quantitativo de eleitores | Município/zona |

### Download direto

```
https://cdn.tse.jus.br/estatistica/sead/odsele/perfil_eleitorado/perfil_eleitorado_2024.zip
https://cdn.tse.jus.br/estatistica/sead/odsele/perfil_eleitorado/perfil_eleitorado_secao_2024_SP.zip
https://cdn.tse.jus.br/estatistica/sead/odsele/perfil_eleitorado/perfil_eleitorado_secao_2024_RJ.zip
https://cdn.tse.jus.br/estatistica/sead/odsele/perfil_eleitorado/perfil_eleitorado_2022.zip
```

## Exemplo de uso

### Download e leitura do perfil do eleitorado

```python
import requests
import zipfile
import pandas as pd
from io import BytesIO
from pathlib import Path


def baixar_perfil_eleitorado(
    ano: int,
    destino: Path = Path("./dados_tse"),
) -> pd.DataFrame:
    """
    Baixa e carrega dados do perfil do eleitorado (consolidado nacional).

    Args:
        ano: Ano de referência (ex: 2024, 2022)
        destino: Diretório para salvar os arquivos

    Returns:
        DataFrame com perfil do eleitorado
    """
    url = (
        f"https://cdn.tse.jus.br/estatistica/sead/odsele/"
        f"perfil_eleitorado/perfil_eleitorado_{ano}.zip"
    )
    print(f"Baixando perfil do eleitorado {ano}...")

    response = requests.get(url)
    response.raise_for_status()

    destino.mkdir(parents=True, exist_ok=True)

    with zipfile.ZipFile(BytesIO(response.content)) as zf:
        zf.extractall(destino)
        csvs = [f for f in zf.namelist() if f.endswith(".csv")]

    # Carregar o consolidado (ou concatenar múltiplos CSVs)
    arquivo_brasil = [f for f in csvs if "BRASIL" in f.upper()]
    if arquivo_brasil:
        caminho = destino / arquivo_brasil[0]
    else:
        caminho = destino / csvs[0]

    df = pd.read_csv(
        caminho,
        sep=";",
        encoding="latin-1",
        dtype=str,
    )

    print(f"Registros carregados: {len(df):,}")
    return df


# Baixar perfil do eleitorado de 2024
df_eleitorado = baixar_perfil_eleitorado(2024)
print(df_eleitorado.head())
```

### Análise demográfica do eleitorado por UF

```python
def analise_demografica_uf(df: pd.DataFrame) -> pd.DataFrame:
    """
    Analisa a distribuição demográfica do eleitorado por UF.

    Args:
        df: DataFrame com perfil do eleitorado

    Returns:
        DataFrame com totais por UF e gênero
    """
    df["QT_ELEITORES_PERFIL"] = pd.to_numeric(
        df["QT_ELEITORES_PERFIL"], errors="coerce"
    )

    por_uf_genero = (
        df.groupby(["SG_UF", "DS_GENERO"])
        .agg(total_eleitores=("QT_ELEITORES_PERFIL", "sum"))
        .reset_index()
    )

    # Calcular total por UF
    total_uf = (
        por_uf_genero.groupby("SG_UF")["total_eleitores"].sum().reset_index()
    )
    total_uf.columns = ["SG_UF", "total_uf"]

    resultado = por_uf_genero.merge(total_uf, on="SG_UF")
    resultado["percentual"] = (
        resultado["total_eleitores"] / resultado["total_uf"] * 100
    ).round(2)

    return resultado.sort_values(["SG_UF", "DS_GENERO"])


demografico = analise_demografica_uf(df_eleitorado)
print("Distribuição do eleitorado por UF e gênero:")
print(demografico.head(20))
```

### Perfil por faixa etária e escolaridade

```python
def perfil_faixa_etaria(df: pd.DataFrame, uf: str = None) -> pd.DataFrame:
    """
    Analisa a distribuição do eleitorado por faixa etária.

    Args:
        df: DataFrame com perfil do eleitorado
        uf: Filtrar por UF (opcional)

    Returns:
        DataFrame com eleitores por faixa etária
    """
    df["QT_ELEITORES_PERFIL"] = pd.to_numeric(
        df["QT_ELEITORES_PERFIL"], errors="coerce"
    )

    resultado = df.copy()
    if uf:
        resultado = resultado[resultado["SG_UF"] == uf.upper()]

    por_faixa = (
        resultado.groupby("DS_FAIXA_ETARIA")
        .agg(total_eleitores=("QT_ELEITORES_PERFIL", "sum"))
        .reset_index()
        .sort_values("total_eleitores", ascending=False)
    )

    total = por_faixa["total_eleitores"].sum()
    por_faixa["percentual"] = (por_faixa["total_eleitores"] / total * 100).round(2)

    return por_faixa


def perfil_escolaridade(df: pd.DataFrame, uf: str = None) -> pd.DataFrame:
    """
    Analisa a distribuição do eleitorado por grau de instrução.

    Args:
        df: DataFrame com perfil do eleitorado
        uf: Filtrar por UF (opcional)

    Returns:
        DataFrame com eleitores por grau de instrução
    """
    df["QT_ELEITORES_PERFIL"] = pd.to_numeric(
        df["QT_ELEITORES_PERFIL"], errors="coerce"
    )

    resultado = df.copy()
    if uf:
        resultado = resultado[resultado["SG_UF"] == uf.upper()]

    por_instrucao = (
        resultado.groupby("DS_GRAU_ESCOLARIDADE")
        .agg(total_eleitores=("QT_ELEITORES_PERFIL", "sum"))
        .reset_index()
        .sort_values("total_eleitores", ascending=False)
    )

    total = por_instrucao["total_eleitores"].sum()
    por_instrucao["percentual"] = (
        por_instrucao["total_eleitores"] / total * 100
    ).round(2)

    return por_instrucao


# Análise de São Paulo
print("Faixa etária — SP:")
print(perfil_faixa_etaria(df_eleitorado, "SP"))

print("\nEscolaridade — SP:")
print(perfil_escolaridade(df_eleitorado, "SP"))
```

### Carregar perfil por seção eleitoral (para cruzamento com votação)

```python
def baixar_perfil_secao(
    ano: int,
    uf: str,
    destino: Path = Path("./dados_tse"),
) -> pd.DataFrame:
    """
    Baixa e carrega perfil do eleitorado por seção eleitoral.

    Args:
        ano: Ano de referência
        uf: Sigla da UF
        destino: Diretório para salvar

    Returns:
        DataFrame com perfil por seção
    """
    url = (
        f"https://cdn.tse.jus.br/estatistica/sead/odsele/"
        f"perfil_eleitorado/perfil_eleitorado_secao_{ano}_{uf.upper()}.zip"
    )
    print(f"Baixando perfil por seção — {ano} — {uf.upper()}...")

    response = requests.get(url)
    response.raise_for_status()

    destino.mkdir(parents=True, exist_ok=True)

    with zipfile.ZipFile(BytesIO(response.content)) as zf:
        zf.extractall(destino)
        csvs = [f for f in zf.namelist() if f.endswith(".csv")]

    df = pd.read_csv(
        destino / csvs[0],
        sep=";",
        encoding="latin-1",
        dtype=str,
    )

    print(f"Registros por seção carregados: {len(df):,}")
    return df


# Perfil por seção em São Paulo
df_secao_sp = baixar_perfil_secao(2024, "SP")
print(df_secao_sp.head())
```

## Campos disponíveis

### Perfil do eleitorado

| Campo | Tipo | Descrição |
|---|---|---|
| `DT_GERACAO` | string | Data de geração do arquivo |
| `HH_GERACAO` | string | Hora de geração |
| `ANO_ELEICAO` | string(4) | Ano de referência |
| `SG_UF` | string(2) | Sigla da UF |
| `CD_MUNICIPIO` | string | Código TSE do município |
| `NM_MUNICIPIO` | string | Nome do município |
| `NR_ZONA` | string | Número da zona eleitoral |
| `NR_SECAO` | string | Número da seção eleitoral (apenas no perfil por seção) |
| `CD_GENERO` | string | Código do gênero |
| `DS_GENERO` | string | Descrição (Masculino, Feminino, Não informado) |
| `CD_ESTADO_CIVIL` | string | Código do estado civil |
| `DS_ESTADO_CIVIL` | string | Descrição (Solteiro, Casado, Divorciado, etc.) |
| `CD_FAIXA_ETARIA` | string | Código da faixa etária |
| `DS_FAIXA_ETARIA` | string | Descrição (16 anos, 17 anos, 18 a 20, 21 a 24, etc.) |
| `CD_GRAU_ESCOLARIDADE` | string | Código do grau de escolaridade |
| `DS_GRAU_ESCOLARIDADE` | string | Descrição (Analfabeto, Lê e escreve, Ensino fundamental incompleto, etc.) |
| `QT_ELEITORES_PERFIL` | int | Quantidade de eleitores com esse perfil |
| `QT_ELEITORES_BIOMETRIA` | int | Quantidade de eleitores com biometria cadastrada |
| `QT_ELEITORES_DEFICIENCIA` | int | Quantidade de eleitores com deficiência |
| `QT_ELEITORES_INC_NM_SOCIAL` | int | Quantidade de eleitores com inclusão de nome social |

### Faixas etárias disponíveis

| Código | Faixa |
|---|---|
| `1600` | 16 anos |
| `1700` | 17 anos |
| `1820` | 18 a 20 anos |
| `2124` | 21 a 24 anos |
| `2529` | 25 a 29 anos |
| `3034` | 30 a 34 anos |
| `3539` | 35 a 39 anos |
| `4044` | 40 a 44 anos |
| `4549` | 45 a 49 anos |
| `5054` | 50 a 54 anos |
| `5559` | 55 a 59 anos |
| `6064` | 60 a 64 anos |
| `6569` | 65 a 69 anos |
| `7074` | 70 a 74 anos |
| `7579` | 75 a 79 anos |
| `7900` | Superior a 79 anos |
| `9999` | Inválido |

## Cruzamentos possíveis

| Cruzamento | Fonte relacionada | Chave de ligação | Finalidade |
|---|---|---|---|
| Eleitorado x Votação | [Resultados Eleitorais](/docs/apis/justica-eleitoral-tse/resultados-eleitorais) | `CD_MUNICIPIO` + `NR_ZONA` + `NR_SECAO` | Correlacionar perfil demográfico com padrões de votação |
| Eleitorado x Boletins de urna | [Boletins de Urna](/docs/apis/justica-eleitoral-tse/boletins-urna) | `CD_MUNICIPIO` + `NR_ZONA` + `NR_SECAO` | Análise granular de votação versus perfil por seção |
| Eleitorado x Filiados | [Filiados a Partidos](/docs/apis/justica-eleitoral-tse/filiados-partidos) | `CD_MUNICIPIO` + `NR_ZONA` | Calcular taxa de filiação em relação ao eleitorado |
| Eleitorado x Candidatos | [Candidaturas](/docs/apis/justica-eleitoral-tse/candidaturas) | `CD_MUNICIPIO` / `SG_UF` | Comparar perfil do eleitorado com perfil dos candidatos |

### Exemplo de cruzamento: perfil demográfico versus votação

```python
import pandas as pd

# 1. Carregar perfil do eleitorado por seção (SP)
df_perfil = pd.read_csv(
    "dados_tse/perfil_eleitorado_secao_2022_SP.csv",
    sep=";",
    encoding="latin-1",
    dtype=str,
)

# 2. Agregar perfil: calcular % de jovens (16-24) por seção
df_perfil["QT_ELEITORES_PERFIL"] = pd.to_numeric(
    df_perfil["QT_ELEITORES_PERFIL"], errors="coerce"
)

# Total por seção
total_secao = (
    df_perfil.groupby(["CD_MUNICIPIO", "NR_ZONA", "NR_SECAO"])
    .agg(total=("QT_ELEITORES_PERFIL", "sum"))
    .reset_index()
)

# Jovens (16-24) por seção
jovens = df_perfil[
    df_perfil["DS_FAIXA_ETARIA"].isin(["16 anos", "17 anos", "18 a 20 anos", "21 a 24 anos"])
]
jovens_secao = (
    jovens.groupby(["CD_MUNICIPIO", "NR_ZONA", "NR_SECAO"])
    .agg(total_jovens=("QT_ELEITORES_PERFIL", "sum"))
    .reset_index()
)

perfil_secao = pd.merge(total_secao, jovens_secao, on=["CD_MUNICIPIO", "NR_ZONA", "NR_SECAO"])
perfil_secao["pct_jovens"] = (perfil_secao["total_jovens"] / perfil_secao["total"] * 100).round(2)

# 3. Carregar votação por seção (SP)
df_votos = pd.read_csv(
    "dados_tse/votacao_secao_2022_SP.csv",
    sep=";",
    encoding="latin-1",
    dtype=str,
)
df_votos["QT_VOTOS_NOMINAIS"] = pd.to_numeric(
    df_votos["QT_VOTOS_NOMINAIS"], errors="coerce"
)

# Filtrar votação para presidente, 1o turno
votos_pres = df_votos[
    (df_votos["DS_CARGO"] == "PRESIDENTE") & (df_votos["NR_TURNO"] == "1")
]

# Calcular % de votos por candidato por seção
votos_secao = votos_pres.pivot_table(
    index=["CD_MUNICIPIO", "NR_ZONA", "NR_SECAO"],
    columns="NR_CANDIDATO",
    values="QT_VOTOS_NOMINAIS",
    aggfunc="sum",
    fill_value=0,
)
total_votos_secao = votos_secao.sum(axis=1)

for col in votos_secao.columns:
    votos_secao[f"pct_{col}"] = (votos_secao[col] / total_votos_secao * 100).round(2)

votos_secao = votos_secao.reset_index()

# 4. Cruzar perfil com votação
analise = pd.merge(
    perfil_secao,
    votos_secao,
    on=["CD_MUNICIPIO", "NR_ZONA", "NR_SECAO"],
    how="inner",
)

# 5. Correlação entre % de jovens e votação
print("Correlação entre % jovens e % votos por candidato:")
for col in [c for c in analise.columns if c.startswith("pct_") and c != "pct_jovens"]:
    corr = analise["pct_jovens"].corr(analise[col])
    print(f"  Candidato {col.replace('pct_', '')}: {corr:.4f}")
```

## Limitações conhecidas

| Limitação | Detalhes |
|---|---|
| **Encoding Latin-1** | Os arquivos usam encoding ISO-8859-1 (Latin-1). Especificar `encoding="latin-1"` ao ler os dados. |
| **Dados agregados, não individuais** | A base contém perfis agregados (contagem de eleitores por combinação de características), não dados individuais. Não é possível identificar eleitores específicos. |
| **Perfil por seção é grande** | O perfil por seção eleitoral gera arquivos grandes, especialmente para estados como SP e MG. Processar por UF ou zona. |
| **Código de município TSE x IBGE** | O TSE usa códigos próprios. Necessária tabela de correspondência para cruzamentos com dados do IBGE. |
| **Faixas etárias fixas** | As faixas etárias são pré-definidas pelo TSE e não podem ser customizadas. Análises mais granulares por idade não são possíveis. |
| **Dados de deficiência limitados** | O campo de deficiência é um quantitativo total, sem detalhamento por tipo de deficiência. |
| **Nome social** | O campo de nome social foi adicionado recentemente e pode não estar disponível em anos anteriores. |
| **Eleitores no exterior** | Eleitores registrados no exterior (seções consulares) aparecem com códigos de zona/seção específicos que precisam de tratamento especial. |
| **Biometria incompleta** | O campo de biometria reflete o status no momento da geração do arquivo e pode mudar ao longo do ano. |
| **Variação do layout** | A estrutura dos campos pode mudar entre anos. Sempre verificar o cabeçalho do CSV antes de processar. |
