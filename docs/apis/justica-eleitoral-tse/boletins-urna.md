---
title: Boletins de Urna
slug: boletins-urna
orgao: TSE
url_base: https://dadosabertos.tse.jus.br/
tipo_acesso: CSV Download
autenticacao: Não requerida
formato_dados: [CSV]
frequencia_atualizacao: Por eleição
campos_chave:
  - numero_urna
  - zona_eleitoral
  - secao_eleitoral
  - codigo_municipio
  - hash_arquivo
  - quantidade_votos
tags:
  - eleições
  - boletim de urna
  - urna eletrônica
  - auditoria
  - apuração
  - transparência eleitoral
  - dados brutos
cruzamento_com:
  - justica-eleitoral-tse/resultados-eleitorais
  - justica-eleitoral-tse/candidaturas
  - justica-eleitoral-tse/eleitorado
status: documentado
---

# Boletins de Urna

## O que é

Os **Boletins de Urna (BU)** são os registros brutos emitidos por cada uma das urnas eletrônicas ao final da votação. Cada boletim contém a totalização dos votos recebidos naquela seção eleitoral específica, incluindo votos por candidato, votos de legenda, votos brancos, votos nulos, número de eleitores aptos, comparecimento e abstenções.

O TSE disponibiliza os dados dos boletins de urna como dados abertos, permitindo que qualquer cidadão, pesquisador ou organização possa auditar independentemente os resultados oficiais. A soma dos votos de todos os boletins de urna de uma zona, município, estado ou do país inteiro deve corresponder exatamente aos resultados divulgados oficialmente.

Os dados dos BUs são a fonte mais granular de dados eleitorais disponível e constituem a **base para auditoria independente** do processo eleitoral brasileiro.

**Fonte oficial:** https://dadosabertos.tse.jus.br/dataset/resultados

**Download direto (CDN):** https://cdn.tse.jus.br/estatistica/sead/odsele/boletim_urna/

## Como acessar

| Item | Detalhe |
|---|---|
| **URL base (CKAN)** | `https://dadosabertos.tse.jus.br/dataset/resultados` |
| **URL base (CDN)** | `https://cdn.tse.jus.br/estatistica/sead/odsele/boletim_urna/` |
| **Tipo de acesso** | Download direto de arquivos ZIP contendo CSVs |
| **Autenticação** | Não requerida |
| **Formato** | CSV (delimitado por `;`, encoding Latin-1/ISO-8859-1) |
| **Tamanho** | Muito grande — pode ultrapassar vários GB por eleição (dividido por UF) |

### Organização dos arquivos

Os dados são organizados por ano de eleição e UF:

- `bu_imgbu_logjez_rdv_vscmr_YYYY_UF.zip` — boletins de urna de uma UF em um ano eleitoral
- `boletim_urna_YYYY_UF.zip` — formato alternativo dependendo do ano

Exemplos:

```
bu_imgbu_logjez_rdv_vscmr_2022_1t_SP.zip  (1o turno - SP)
bu_imgbu_logjez_rdv_vscmr_2022_2t_SP.zip  (2o turno - SP)
```

Os ZIPs contêm múltiplos tipos de arquivos:

- **BU** — Boletim de Urna (dados tabulados)
- **IMGBU** — Imagem do boletim de urna (PDF)
- **LOGJEZ** — Log da urna eletrônica
- **RDV** — Registro Digital do Voto
- **VSCMR** — Correspondência entre seção e urna

## Endpoints/recursos principais

| Recurso | Conteúdo | Granularidade |
|---|---|---|
| `boletim_urna_YYYY_turno_UF.zip` | Boletins de urna por UF e turno | Por seção eleitoral/urna |
| `bu_imgbu_logjez_rdv_vscmr_YYYY_Xt_UF.zip` | Pacote completo com BU, imagens, logs e RDV | Por seção eleitoral/urna |

### Download direto

```
https://cdn.tse.jus.br/estatistica/sead/odsele/boletim_urna/bu_imgbu_logjez_rdv_vscmr_2022_1t_SP.zip
https://cdn.tse.jus.br/estatistica/sead/odsele/boletim_urna/bu_imgbu_logjez_rdv_vscmr_2022_1t_RJ.zip
https://cdn.tse.jus.br/estatistica/sead/odsele/boletim_urna/bu_imgbu_logjez_rdv_vscmr_2022_1t_MG.zip
```

## Exemplo de uso

### Download e leitura de boletins de urna

```python
import requests
import zipfile
import pandas as pd
from io import BytesIO
from pathlib import Path


def baixar_boletins_urna(
    ano: int,
    turno: int,
    uf: str,
    destino: Path = Path("./dados_tse"),
) -> Path:
    """
    Baixa os boletins de urna de um estado em um turno.

    ATENÇÃO: Os arquivos são muito grandes (vários GB).
    Certifique-se de ter espaço em disco suficiente.

    Args:
        ano: Ano da eleição
        turno: Turno (1 ou 2)
        uf: Sigla da UF
        destino: Diretório para salvar os arquivos

    Returns:
        Path do diretório com os arquivos extraídos
    """
    url = (
        f"https://cdn.tse.jus.br/estatistica/sead/odsele/boletim_urna/"
        f"bu_imgbu_logjez_rdv_vscmr_{ano}_{turno}t_{uf.upper()}.zip"
    )
    print(f"Baixando boletins de urna {ano} - {turno}o turno - {uf.upper()}...")
    print("ATENÇÃO: Download pode demorar vários minutos.")

    destino_uf = destino / f"bu_{ano}_{turno}t_{uf.upper()}"
    destino_uf.mkdir(parents=True, exist_ok=True)

    # Download em streaming para não estourar memória
    response = requests.get(url, stream=True)
    response.raise_for_status()

    arquivo_zip = destino_uf / "bu.zip"
    with open(arquivo_zip, "wb") as f:
        for chunk in response.iter_content(chunk_size=8192):
            f.write(chunk)

    print("Download concluído. Extraindo...")
    with zipfile.ZipFile(arquivo_zip) as zf:
        # Extrair apenas os CSVs de boletins (ignorar imagens e logs para economia)
        bu_files = [f for f in zf.namelist() if f.endswith(".csv")]
        for bf in bu_files:
            zf.extract(bf, destino_uf)

    print(f"Arquivos extraídos em: {destino_uf}")
    return destino_uf


# Baixar boletins do 1o turno de SP em 2022
diretorio = baixar_boletins_urna(2022, 1, "SP")
```

### Carregar e analisar dados do boletim de urna

```python
def carregar_boletins_csv(
    diretorio: Path,
    cargo: str = None,
) -> pd.DataFrame:
    """
    Carrega CSVs de boletins de urna de um diretório.

    Args:
        diretorio: Diretório contendo os CSVs extraídos
        cargo: Filtrar por cargo (opcional)

    Returns:
        DataFrame com dados dos boletins
    """
    csvs = list(diretorio.glob("**/*.csv"))
    if not csvs:
        raise FileNotFoundError(f"Nenhum CSV encontrado em {diretorio}")

    dfs = []
    for csv_file in csvs:
        try:
            df = pd.read_csv(
                csv_file,
                sep=";",
                encoding="latin-1",
                dtype=str,
            )
            dfs.append(df)
        except Exception as e:
            print(f"Erro ao ler {csv_file}: {e}")

    df_completo = pd.concat(dfs, ignore_index=True)

    if cargo:
        df_completo = df_completo[
            df_completo["DS_CARGO_PERGUNTA"].str.upper() == cargo.upper()
        ]

    return df_completo


# Carregar boletins e analisar
df_bu = carregar_boletins_csv(Path("./dados_tse/bu_2022_1t_SP"))
print(f"Registros nos boletins: {len(df_bu):,}")
```

### Auditoria: comparar boletins de urna com resultados oficiais

```python
def auditar_resultados(
    df_bu: pd.DataFrame,
    df_resultados: pd.DataFrame,
    cargo: str,
    municipio: str = None,
) -> pd.DataFrame:
    """
    Compara a soma dos boletins de urna com os resultados oficiais.

    Args:
        df_bu: DataFrame com dados dos boletins de urna
        df_resultados: DataFrame com resultados oficiais
        cargo: Cargo a auditar
        municipio: Código do município (opcional)

    Returns:
        DataFrame com comparativo
    """
    # Agregar votos dos boletins
    df_bu["QT_VOTOS"] = pd.to_numeric(df_bu["QT_VOTOS"], errors="coerce")
    bu_agregado = (
        df_bu.groupby(["NR_VOTAVEL"])
        .agg(votos_bu=("QT_VOTOS", "sum"))
        .reset_index()
    )

    # Agregar votos dos resultados oficiais
    df_resultados["QT_VOTOS_NOMINAIS"] = pd.to_numeric(
        df_resultados["QT_VOTOS_NOMINAIS"], errors="coerce"
    )
    res_agregado = (
        df_resultados.groupby(["NR_CANDIDATO"])
        .agg(votos_oficiais=("QT_VOTOS_NOMINAIS", "sum"))
        .reset_index()
    )

    # Comparar
    comparativo = pd.merge(
        bu_agregado,
        res_agregado,
        left_on="NR_VOTAVEL",
        right_on="NR_CANDIDATO",
        how="outer",
    )
    comparativo["diferenca"] = (
        comparativo["votos_bu"].fillna(0) - comparativo["votos_oficiais"].fillna(0)
    )

    divergencias = comparativo[comparativo["diferenca"] != 0]
    if divergencias.empty:
        print("AUDITORIA OK: Nenhuma divergência encontrada.")
    else:
        print(f"ALERTA: {len(divergencias)} divergências encontradas!")

    return comparativo
```

## Campos disponíveis

### Boletim de Urna (CSV)

| Campo | Tipo | Descrição |
|---|---|---|
| `DT_GERACAO` | string | Data de geração do arquivo |
| `HH_GERACAO` | string | Hora de geração |
| `ANO_ELEICAO` | string(4) | Ano da eleição |
| `CD_TIPO_ELEICAO` | string | Código do tipo de eleição |
| `NM_TIPO_ELEICAO` | string | Descrição do tipo de eleição |
| `NR_TURNO` | string | Número do turno (1 ou 2) |
| `CD_ELEICAO` | string | Código da eleição |
| `DS_ELEICAO` | string | Descrição da eleição |
| `SG_UF` | string(2) | Sigla da UF |
| `SG_UE` | string | Sigla da unidade eleitoral |
| `NM_UE` | string | Nome da unidade eleitoral |
| `CD_MUNICIPIO` | string | Código TSE do município |
| `NM_MUNICIPIO` | string | Nome do município |
| `NR_ZONA` | string | Número da zona eleitoral |
| `NR_SECAO` | string | Número da seção eleitoral |
| `NR_LOCAL_VOTACAO` | string | Número do local de votação |
| `CD_CARGO_PERGUNTA` | string | Código do cargo |
| `DS_CARGO_PERGUNTA` | string | Descrição do cargo |
| `NR_PARTIDO` | string | Número do partido |
| `SG_PARTIDO` | string | Sigla do partido |
| `NR_VOTAVEL` | string | Número do candidato/legenda votado |
| `NM_VOTAVEL` | string | Nome do candidato votado |
| `QT_VOTOS` | int | Quantidade de votos |
| `NR_URNA_EFETIVADA` | string | Número da urna utilizada |
| `CD_HASH_URNA` | string | Hash do arquivo da urna |
| `DT_BU_RECEBIDO` | string | Data de recebimento do BU |
| `QT_APTOS` | int | Eleitores aptos na seção |
| `QT_COMPARECIMENTO` | int | Eleitores que compareceram |
| `QT_ABSTENCOES` | int | Eleitores que não compareceram |
| `QT_VOTOS_NOMINAIS` | int | Total de votos nominais |
| `QT_VOTOS_BRANCOS` | int | Total de votos em branco |
| `QT_VOTOS_NULOS` | int | Total de votos nulos |
| `QT_VOTOS_LEGENDA` | int | Total de votos de legenda |
| `QT_VOTOS_ANULADOS_APU_SEP` | int | Votos anulados em apuração separada |

## Cruzamentos possíveis

| Cruzamento | Fonte relacionada | Chave de ligação | Finalidade |
|---|---|---|---|
| BU x Resultados oficiais | [Resultados Eleitorais](/docs/apis/justica-eleitoral-tse/resultados-eleitorais) | `NR_ZONA` + `NR_SECAO` + `NR_VOTAVEL` | Auditar resultados comparando soma dos BUs com dados oficiais |
| BU x Candidaturas | [Candidaturas](/docs/apis/justica-eleitoral-tse/candidaturas) | `NR_VOTAVEL` → `NR_CANDIDATO` | Identificar candidatos a partir do número na urna |
| BU x Perfil do eleitorado | [Eleitorado](/docs/apis/justica-eleitoral-tse/eleitorado) | `CD_MUNICIPIO` + `NR_ZONA` + `NR_SECAO` | Correlacionar votação com perfil demográfico por seção |

### Exemplo de cruzamento: auditoria de totalização

```python
import pandas as pd

# 1. Carregar boletins de urna de uma zona específica
df_bu = pd.read_csv(
    "dados_tse/bu_2022_1t_SP/boletim_urna_SP.csv",
    sep=";",
    encoding="latin-1",
    dtype=str,
)

# 2. Carregar resultados oficiais
df_resultados = pd.read_csv(
    "dados_tse/votacao_secao_2022_SP.csv",
    sep=";",
    encoding="latin-1",
    dtype=str,
)

# 3. Filtrar por cargo (ex: Presidente) e turno
df_bu_pres = df_bu[
    (df_bu["DS_CARGO_PERGUNTA"].str.upper() == "PRESIDENTE")
    & (df_bu["NR_TURNO"] == "1")
]
df_res_pres = df_resultados[
    (df_resultados["DS_CARGO"].str.upper() == "PRESIDENTE")
    & (df_resultados["NR_TURNO"] == "1")
]

# 4. Somar votos dos BUs por candidato
df_bu_pres["QT_VOTOS"] = pd.to_numeric(df_bu_pres["QT_VOTOS"], errors="coerce")
soma_bu = df_bu_pres.groupby("NR_VOTAVEL")["QT_VOTOS"].sum().reset_index()
soma_bu.columns = ["nr_candidato", "votos_bu"]

# 5. Somar votos dos resultados oficiais por candidato
df_res_pres["QT_VOTOS_NOMINAIS"] = pd.to_numeric(
    df_res_pres["QT_VOTOS_NOMINAIS"], errors="coerce"
)
soma_oficial = (
    df_res_pres.groupby("NR_CANDIDATO")["QT_VOTOS_NOMINAIS"].sum().reset_index()
)
soma_oficial.columns = ["nr_candidato", "votos_oficiais"]

# 6. Comparar
comparativo = pd.merge(soma_bu, soma_oficial, on="nr_candidato", how="outer")
comparativo["diferenca"] = comparativo["votos_bu"] - comparativo["votos_oficiais"]

print("Auditoria — Presidente 1o turno — SP:")
print(comparativo)
print(f"\nDivergências: {(comparativo['diferenca'] != 0).sum()}")
```

## Limitações conhecidas

| Limitação | Detalhes |
|---|---|
| **Arquivos extremamente grandes** | O conjunto completo de BUs de uma eleição pode ultrapassar 100 GB. Arquivos por UF ainda podem ter vários GB. Requer planejamento de armazenamento e processamento. |
| **Encoding Latin-1** | Os arquivos usam encoding ISO-8859-1 (Latin-1). Especificar `encoding="latin-1"` ao ler os dados. |
| **Estrutura variável entre eleições** | O formato e o conteúdo dos pacotes de BU mudaram significativamente entre eleições. A partir de 2020, o pacote inclui RDV e logs. |
| **Processamento intensivo** | Devido ao volume, é recomendável usar ferramentas como Dask, PySpark ou processar por UF/zona para não estourar a memória. |
| **Dados binários do RDV** | O Registro Digital do Voto é um arquivo binário proprietário que exige bibliotecas específicas do TSE para leitura. Os CSVs do BU são mais acessíveis. |
| **Download lento** | O CDN do TSE pode apresentar velocidade limitada para downloads grandes. Downloads concorrentes podem ser bloqueados. |
| **Hashes e assinaturas digitais** | Os boletins possuem hashes de verificação, mas a validação criptográfica completa requer ferramentas e chaves específicas fornecidas pelo TSE. |
| **Seções agregadas** | Em seções com poucos eleitores, o TSE pode agregar seções para proteger o sigilo do voto, dificultando comparações individuais. |
| **Código de município TSE x IBGE** | O TSE usa códigos próprios de município. Necessária tabela de correspondência para cruzamentos geográficos. |
| **Sem API de consulta** | Não existe API REST para consultar boletins individuais. É necessário baixar os arquivos completos por UF. |
