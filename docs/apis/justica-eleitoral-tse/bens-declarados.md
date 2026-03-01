---
title: Bens Declarados
slug: bens-declarados
orgao: TSE
url_base: https://dadosabertos.tse.jus.br/
tipo_acesso: CSV Download
autenticacao: Não requerida
formato_dados: [CSV]
frequencia_atualizacao: Por eleição
campos_chave:
  - CPF_candidato
  - sequencial_candidato
  - tipo_bem
  - valor_bem
  - descricao_bem
tags:
  - eleições
  - patrimônio
  - bens
  - candidatos
  - declaração de bens
  - evolução patrimonial
cruzamento_com:
  - justica-eleitoral-tse/candidaturas
  - justica-eleitoral-tse/prestacao-contas
  - receita-federal/qsa
  - receita-federal/cnpj-completa
  - transparencia-cgu/servidores-federais
status: documentado
---

# Bens Declarados

## O que é

A base de **Bens Declarados** do **Tribunal Superior Eleitoral (TSE)** contém o patrimônio declarado por todos os candidatos no momento do registro de suas candidaturas. Os dados incluem tipo de bem (imóvel, veículo, aplicação financeira, participação societária, etc.), descrição e valor declarado.

A declaração de bens é obrigatória para todos os candidatos e constitui um instrumento fundamental de transparência. Comparando as declarações de um mesmo político ao longo de eleições sucessivas, é possível identificar **variações patrimoniais atípicas** que podem indicar enriquecimento ilícito.

O cruzamento com a base de candidaturas (para identificar o candidato) e com bases da Receita Federal (QSA, CNPJ) permite verificar se os bens declarados são compatíveis com as participações societárias e a renda do candidato.

**Fonte oficial:** https://dadosabertos.tse.jus.br/dataset/candidatos (os bens são um subconjunto dos dados de candidaturas)

**Download direto (CDN):** https://cdn.tse.jus.br/estatistica/sead/odsele/bem_candidato/

## Como acessar

| Item | Detalhe |
|---|---|
| **URL base (CKAN)** | `https://dadosabertos.tse.jus.br/dataset/candidatos` |
| **URL base (CDN)** | `https://cdn.tse.jus.br/estatistica/sead/odsele/bem_candidato/` |
| **Tipo de acesso** | Download direto de arquivos ZIP contendo CSVs |
| **Autenticação** | Não requerida |
| **Formato** | CSV (delimitado por `;`, encoding Latin-1/ISO-8859-1) |
| **Tamanho** | Varia — entre 5 MB e 30 MB compactado por eleição |

### Organização dos arquivos

Os dados são organizados por ano de eleição:

- `bem_candidato_2022.zip` — bens declarados nas eleições gerais de 2022
- `bem_candidato_2020.zip` — bens declarados nas eleições municipais de 2020
- `bem_candidato_2018.zip` — bens declarados nas eleições gerais de 2018
- E assim sucessivamente

Cada ZIP contém CSVs separados por UF e um arquivo consolidado nacional (`bem_candidato_YYYY_BRASIL.csv`).

## Endpoints/recursos principais

| Recurso | Conteúdo | Cobertura |
|---|---|---|
| `bem_candidato_YYYY.zip` | Bens declarados por todos os candidatos do ano | 2006 a 2024 |
| `bem_candidato_YYYY_UF.csv` | Bens declarados por candidatos de um estado | Por UF |
| `bem_candidato_YYYY_BRASIL.csv` | Consolidado nacional | Todo o Brasil |

### Download direto

```
https://cdn.tse.jus.br/estatistica/sead/odsele/bem_candidato/bem_candidato_2022.zip
https://cdn.tse.jus.br/estatistica/sead/odsele/bem_candidato/bem_candidato_2020.zip
https://cdn.tse.jus.br/estatistica/sead/odsele/bem_candidato/bem_candidato_2018.zip
```

## Exemplo de uso

### Download e leitura de bens declarados

```python
import requests
import zipfile
import pandas as pd
from io import BytesIO
from pathlib import Path


def baixar_bens(ano: int, destino: Path = Path("./dados_tse")) -> pd.DataFrame:
    """
    Baixa e carrega dados de bens declarados por candidatos.

    Args:
        ano: Ano da eleição (ex: 2022, 2020, 2018)
        destino: Diretório para salvar os arquivos

    Returns:
        DataFrame com bens declarados de todos os candidatos do ano
    """
    url = (
        f"https://cdn.tse.jus.br/estatistica/sead/odsele/"
        f"bem_candidato/bem_candidato_{ano}.zip"
    )
    print(f"Baixando bens declarados {ano}...")

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

    print(f"Registros de bens carregados: {len(df):,}")
    return df


# Baixar bens declarados nas eleições de 2022
df_bens = baixar_bens(2022)
print(df_bens.head())
```

### Patrimônio total por candidato

```python
def patrimonio_por_candidato(
    df: pd.DataFrame,
    cargo: str = None,
    top_n: int = 20,
) -> pd.DataFrame:
    """
    Calcula o patrimônio total declarado por candidato.

    Args:
        df: DataFrame com bens declarados
        cargo: Filtrar por cargo (opcional)
        top_n: Quantidade de candidatos a retornar

    Returns:
        DataFrame com patrimônio total, ordenado decrescente
    """
    df["VR_BEM_CANDIDATO"] = pd.to_numeric(
        df["VR_BEM_CANDIDATO"].str.replace(",", "."), errors="coerce"
    )

    resultado = df.copy()
    if cargo:
        # Juntar com base de candidaturas para filtrar por cargo
        resultado = resultado[resultado.get("DS_CARGO", pd.Series()).str.upper() == cargo.upper()]

    patrimonio = (
        resultado.groupby(["SQ_CANDIDATO", "NM_CANDIDATO"])
        .agg(
            patrimonio_total=("VR_BEM_CANDIDATO", "sum"),
            qtd_bens=("VR_BEM_CANDIDATO", "count"),
        )
        .reset_index()
        .sort_values("patrimonio_total", ascending=False)
    )

    return patrimonio.head(top_n)


top_patrimonio = patrimonio_por_candidato(df_bens)
print("Top 20 candidatos por patrimônio declarado — 2022:")
for _, row in top_patrimonio.iterrows():
    print(f"  {row['NM_CANDIDATO']}: R$ {row['patrimonio_total']:,.2f} ({int(row['qtd_bens'])} bens)")
```

### Evolução patrimonial entre eleições

```python
def evolucao_patrimonial(
    nome_candidato: str,
    anos: list[int] = [2014, 2018, 2022],
) -> pd.DataFrame:
    """
    Acompanha a evolução patrimonial de um candidato ao longo de eleições.

    Args:
        nome_candidato: Nome do candidato (busca parcial, case-insensitive)
        anos: Lista de anos eleitorais para comparação

    Returns:
        DataFrame com patrimônio total por ano
    """
    evolucao = []

    for ano in anos:
        df = baixar_bens(ano)
        df["VR_BEM_CANDIDATO"] = pd.to_numeric(
            df["VR_BEM_CANDIDATO"].str.replace(",", "."), errors="coerce"
        )

        filtro = df["NM_CANDIDATO"].str.upper().str.contains(
            nome_candidato.upper(), na=False
        )
        bens_candidato = df[filtro]

        if not bens_candidato.empty:
            patrimonio = bens_candidato["VR_BEM_CANDIDATO"].sum()
            qtd_bens = len(bens_candidato)
            evolucao.append({
                "ano": ano,
                "nome": bens_candidato.iloc[0]["NM_CANDIDATO"],
                "patrimonio_total": patrimonio,
                "qtd_bens": qtd_bens,
            })

    df_evolucao = pd.DataFrame(evolucao)
    if len(df_evolucao) > 1:
        df_evolucao["variacao_pct"] = df_evolucao["patrimonio_total"].pct_change() * 100
    return df_evolucao


# Exemplo: evolução patrimonial de um candidato
resultado = evolucao_patrimonial("NOME DO CANDIDATO", [2014, 2018, 2022])
print(resultado)
```

## Campos disponíveis

| Campo | Tipo | Descrição |
|---|---|---|
| `DT_GERACAO` | string | Data de geração do arquivo |
| `HH_GERACAO` | string | Hora de geração do arquivo |
| `ANO_ELEICAO` | string(4) | Ano da eleição |
| `CD_TIPO_ELEICAO` | string | Código do tipo de eleição |
| `NM_TIPO_ELEICAO` | string | Descrição do tipo de eleição |
| `CD_ELEICAO` | string | Código da eleição |
| `DS_ELEICAO` | string | Descrição da eleição |
| `SG_UF` | string(2) | Sigla da UF |
| `SG_UE` | string | Sigla da unidade eleitoral |
| `NM_UE` | string | Nome da unidade eleitoral |
| `SQ_CANDIDATO` | string | Sequencial do candidato (chave para cruzamento) |
| `NR_ORDEM_CANDIDATO` | string | Número de ordem do bem |
| `CD_TIPO_BEM_CANDIDATO` | string | Código do tipo de bem |
| `DS_TIPO_BEM_CANDIDATO` | string | Descrição do tipo (imóvel, veículo, aplicação financeira, etc.) |
| `DS_BEM_CANDIDATO` | string | Descrição detalhada do bem |
| `VR_BEM_CANDIDATO` | string | Valor declarado do bem (formato decimal com vírgula) |
| `DT_ULTIMA_ATUALIZACAO` | string | Data da última atualização do registro |
| `NM_CANDIDATO` | string | Nome completo do candidato |
| `NR_CPF_CANDIDATO` | string(11) | CPF do candidato |

### Tipos de bens mais comuns

| Código | Tipo de bem |
|---|---|
| `01` | Apartamento |
| `02` | Casa |
| `03` | Terreno |
| `11` | Veículo automotor terrestre |
| `21` | Aplicação de renda fixa |
| `22` | Depósito bancário |
| `31` | Quotas ou quinhões de capital |
| `32` | Ações |
| `41` | Créditos e poupança |
| `51` | Jóias, quadros e objetos de arte |
| `61` | Participação societária |
| `99` | Outros bens |

## Cruzamentos possíveis

| Cruzamento | Fonte relacionada | Chave de ligação | Finalidade |
|---|---|---|---|
| Bens x Candidaturas | [Candidaturas](/docs/apis/justica-eleitoral-tse/candidaturas) | `SQ_CANDIDATO` | Enriquecer bens com dados do candidato (cargo, partido, UF) |
| Bens x Prestação de contas | [Prestação de Contas](/docs/apis/justica-eleitoral-tse/prestacao-contas) | `SQ_CANDIDATO` / `NR_CPF_CANDIDATO` | Comparar patrimônio com receitas/despesas de campanha |
| Bens x Sócios de empresas | [QSA — Quadro Societário](/docs/apis/receita-federal/qsa) | `NR_CPF_CANDIDATO` → `cpf_cnpj_socio` | Verificar se participações societárias declaradas condizem com o QSA |
| Bens x Empresas | [CNPJ Completa](/docs/apis/receita-federal/cnpj-completa) | Via QSA → `cnpj_basico` | Obter dados das empresas declaradas como bens |
| Bens x Remuneração servidores | [Servidores Federais](/docs/apis/transparencia-cgu/servidores-federais) | `NR_CPF_CANDIDATO` → `CPF` | Verificar compatibilidade entre patrimônio e remuneração como servidor |

### Exemplo de cruzamento: verificar participações societárias declaradas vs. QSA

```python
import pandas as pd

# 1. Carregar bens declarados
df_bens = pd.read_csv(
    "dados_tse/bem_candidato_2022_BRASIL.csv",
    sep=";",
    encoding="latin-1",
    dtype=str,
)

# 2. Filtrar bens do tipo "participação societária" ou "quotas de capital"
participacoes = df_bens[
    df_bens["DS_TIPO_BEM_CANDIDATO"].str.upper().str.contains(
        "QUOTA|AÇÃO|AÇÕES|PARTICIPAÇÃO|SOCIETÁRI", na=False
    )
].copy()

# 3. Carregar QSA da Receita Federal
df_qsa = pd.read_csv(
    "dados_rfb/Socios0.csv",
    sep=";",
    header=None,
    names=[
        "cnpj_basico", "identificador_socio", "nome_socio",
        "cpf_cnpj_socio", "qualificacao_socio", "data_entrada",
        "pais", "representante_legal", "nome_representante",
        "qualificacao_representante", "faixa_etaria",
    ],
    dtype=str,
    encoding="latin-1",
)

# 4. Buscar CPFs de candidatos que declararam participações
cpfs_com_participacao = participacoes["NR_CPF_CANDIDATO"].dropna().unique()

# 5. Cruzar com QSA para verificar se constam como sócios
socios_candidatos = df_qsa[
    df_qsa["cpf_cnpj_socio"].isin(cpfs_com_participacao)
]

# 6. Identificar candidatos que NÃO declararam todas as participações
cpfs_no_qsa = socios_candidatos["cpf_cnpj_socio"].unique()
cpfs_nao_declararam = set(cpfs_no_qsa) - set(cpfs_com_participacao)

print(f"Candidatos com participação declarada: {len(cpfs_com_participacao)}")
print(f"Candidatos encontrados no QSA: {len(cpfs_no_qsa)}")
print(f"Possíveis omissões (no QSA mas sem declaração): {len(cpfs_nao_declararam)}")
```

## Limitações conhecidas

| Limitação | Detalhes |
|---|---|
| **Encoding Latin-1** | Os arquivos usam encoding ISO-8859-1 (Latin-1). Especificar `encoding="latin-1"` ao ler os dados. |
| **Valores auto-declarados** | Os valores dos bens são declarados pelo próprio candidato e podem estar subavaliados ou superavaliados. Não há verificação independente pelo TSE. |
| **Sem padronização de descrições** | O campo `DS_BEM_CANDIDATO` é texto livre. O mesmo tipo de bem pode ter descrições muito diferentes entre candidatos. |
| **Valores como texto** | Campos monetários usam vírgula como separador decimal. Requer conversão: `str.replace(",", ".")` seguido de `pd.to_numeric()`. |
| **Dados disponíveis a partir de 2006** | Declarações de bens em formato digital só estão disponíveis a partir de 2006. Eleições anteriores não possuem esses dados no portal. |
| **Participações societárias genéricas** | Candidatos frequentemente declaram "quotas de capital" sem especificar o CNPJ da empresa, dificultando cruzamentos automáticos com a Receita Federal. |
| **Bens em nome de terceiros** | Bens registrados em nome de cônjuges, parentes ou interpostas pessoas (laranjas) não aparecem na declaração do candidato. |
| **Variação do layout** | A estrutura dos campos pode mudar entre eleições. Verificar o cabeçalho antes de processar. |
| **Sem série temporal automática** | Para acompanhar evolução patrimonial, é necessário baixar e cruzar manualmente dados de múltiplas eleições. |
| **Omissões permitidas** | Candidatos que marcam `ST_DECLARAR_BENS = "N"` na base de candidaturas podem não ter registros na base de bens. |
