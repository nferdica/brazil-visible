---
title: Candidaturas
slug: candidaturas
orgao: TSE
url_base: https://dadosabertos.tse.jus.br/
tipo_acesso: CSV Download
autenticacao: Não requerida
formato_dados: [CSV]
frequencia_atualizacao: Por eleição
campos_chave:
  - CPF
  - numero_candidato
  - nome_candidato
  - sigla_partido
  - cargo
  - ano_eleicao
tags:
  - eleições
  - candidatos
  - partidos
  - cargos eletivos
  - CPF
  - dados eleitorais
  - políticos
cruzamento_com:
  - receita-federal/qsa
  - receita-federal/cnpj-completa
  - transparencia-cgu/servidores-federais
  - transparencia-cgu/contratos-federais
  - transparencia-cgu/emendas-parlamentares
  - justica-eleitoral-tse/prestacao-contas
  - justica-eleitoral-tse/bens-declarados
  - justica-eleitoral-tse/resultados-eleitorais
status: documentado
---

# Candidaturas

## O que é

A base de **Candidaturas** do **Tribunal Superior Eleitoral (TSE)** contém os registros de todos os candidatos que disputaram eleições no Brasil desde 1994. Os dados incluem informações pessoais (nome, CPF, data de nascimento, sexo, grau de instrução, estado civil), filiação partidária (partido, coligação, número do candidato) e o cargo disputado (presidente, governador, senador, deputado, prefeito, vereador, etc.).

Este é um dos conjuntos de dados mais importantes para o ecossistema de transparência brasileiro. O **CPF do candidato** é o campo-ponte (*bridge field*) que permite cruzar informações eleitorais com bases da Receita Federal (participações societárias), CGU (contratos públicos, servidores) e outras fontes governamentais. Esse cruzamento é essencial para investigar conflitos de interesse, enriquecimento ilícito e relações entre poder político e econômico.

**Fonte oficial:** https://dadosabertos.tse.jus.br/dataset/candidatos

**Download direto (CDN):** https://cdn.tse.jus.br/estatistica/sead/odsele/consulta_cand/

## Como acessar

| Item | Detalhe |
|---|---|
| **URL base (CKAN)** | `https://dadosabertos.tse.jus.br/dataset/candidatos` |
| **URL base (CDN)** | `https://cdn.tse.jus.br/estatistica/sead/odsele/consulta_cand/` |
| **Tipo de acesso** | Download direto de arquivos ZIP contendo CSVs |
| **Autenticação** | Não requerida |
| **Formato** | CSV (delimitado por `;`, encoding Latin-1/ISO-8859-1) |
| **Tamanho** | Varia por ano — entre 5 MB e 50 MB compactado por eleição |

### Organização dos arquivos

Os dados são organizados por ano de eleição e tipo:

- `consulta_cand_2022.zip` — candidatos das eleições gerais de 2022
- `consulta_cand_2020.zip` — candidatos das eleições municipais de 2020
- `consulta_cand_2018.zip` — candidatos das eleições gerais de 2018
- E assim sucessivamente até 1994

Cada ZIP contém CSVs separados por UF (estado) e um arquivo consolidado (`consulta_cand_YYYY_BRASIL.csv`).

## Endpoints/recursos principais

Como se trata de download de arquivos (e não de uma API REST), os "recursos" são os próprios arquivos disponíveis:

| Recurso | Conteúdo | Cobertura |
|---|---|---|
| `consulta_cand_YYYY.zip` | Dados de candidatos por ano de eleição | 1994 a 2024 |
| `consulta_cand_YYYY_UF.csv` | Dados de candidatos de um estado específico | Por UF |
| `consulta_cand_YYYY_BRASIL.csv` | Consolidado nacional de candidatos | Todo o Brasil |

### Download direto

```
https://cdn.tse.jus.br/estatistica/sead/odsele/consulta_cand/consulta_cand_2022.zip
https://cdn.tse.jus.br/estatistica/sead/odsele/consulta_cand/consulta_cand_2020.zip
https://cdn.tse.jus.br/estatistica/sead/odsele/consulta_cand/consulta_cand_2018.zip
```

## Exemplo de uso

### Download e leitura dos dados de candidatos

```python
import requests
import zipfile
import pandas as pd
from io import BytesIO
from pathlib import Path


def baixar_candidatos(ano: int, destino: Path = Path("./dados_tse")) -> pd.DataFrame:
    """
    Baixa e carrega dados de candidatos de um ano eleitoral.

    Args:
        ano: Ano da eleição (ex: 2022, 2020, 2018)
        destino: Diretório para salvar os arquivos

    Returns:
        DataFrame com todos os candidatos do ano
    """
    url = f"https://cdn.tse.jus.br/estatistica/sead/odsele/consulta_cand/consulta_cand_{ano}.zip"
    print(f"Baixando candidatos de {ano}...")

    response = requests.get(url)
    response.raise_for_status()

    destino.mkdir(parents=True, exist_ok=True)

    with zipfile.ZipFile(BytesIO(response.content)) as zf:
        # Extrair o arquivo consolidado nacional
        arquivo_brasil = [
            f for f in zf.namelist()
            if f.endswith(f"_BRASIL.csv") or f.endswith(f"BRASIL.csv")
        ]
        if arquivo_brasil:
            zf.extract(arquivo_brasil[0], destino)
            caminho_csv = destino / arquivo_brasil[0]
        else:
            # Extrair todos os arquivos
            zf.extractall(destino)
            csvs = [f for f in zf.namelist() if f.endswith(".csv")]
            caminho_csv = destino / csvs[0]

    df = pd.read_csv(
        caminho_csv,
        sep=";",
        encoding="latin-1",
        dtype=str,
    )

    print(f"Candidatos carregados: {len(df):,}")
    return df


# Baixar candidatos das eleições gerais de 2022
df_cand = baixar_candidatos(2022)
print(df_cand.head())
```

### Filtrar candidatos por cargo e partido

```python
def filtrar_candidatos(
    df: pd.DataFrame,
    cargo: str = None,
    partido: str = None,
    uf: str = None,
) -> pd.DataFrame:
    """
    Filtra candidatos por cargo, partido e/ou UF.

    Args:
        df: DataFrame com dados de candidatos
        cargo: Descrição do cargo (ex: 'DEPUTADO FEDERAL')
        partido: Sigla do partido (ex: 'PT', 'PL')
        uf: Sigla da UF (ex: 'SP', 'RJ')

    Returns:
        DataFrame filtrado
    """
    resultado = df.copy()

    if cargo:
        resultado = resultado[resultado["DS_CARGO"].str.upper() == cargo.upper()]
    if partido:
        resultado = resultado[resultado["SG_PARTIDO"].str.upper() == partido.upper()]
    if uf:
        resultado = resultado[resultado["SG_UF"].str.upper() == uf.upper()]

    return resultado


# Exemplo: deputados federais do PT em São Paulo
deputados_pt_sp = filtrar_candidatos(df_cand, cargo="DEPUTADO FEDERAL", partido="PT", uf="SP")
print(f"Deputados federais PT-SP: {len(deputados_pt_sp)}")
print(deputados_pt_sp[["NM_CANDIDATO", "NR_CPF_CANDIDATO", "NR_CANDIDATO"]].head(10))
```

### Cruzamento com QSA (Receita Federal) para encontrar candidatos sócios de empresas

```python
# 1. Carregar candidatos
df_cand = baixar_candidatos(2022)

# 2. Carregar QSA da Receita Federal (previamente baixado)
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

# 3. Cruzar candidatos com sócios de empresas pelo CPF
df_cand["CPF_LIMPO"] = df_cand["NR_CPF_CANDIDATO"].str.zfill(11)
df_qsa["CPF_LIMPO"] = df_qsa["cpf_cnpj_socio"].str.zfill(11)

candidatos_socios = pd.merge(
    df_cand[["NM_CANDIDATO", "CPF_LIMPO", "DS_CARGO", "SG_PARTIDO", "SG_UF"]],
    df_qsa[["CPF_LIMPO", "cnpj_basico", "nome_socio", "qualificacao_socio"]],
    on="CPF_LIMPO",
    how="inner",
)

print(f"Candidatos com participação societária: {candidatos_socios['CPF_LIMPO'].nunique()}")
print(candidatos_socios.head(10))
```

## Campos disponíveis

Os CSVs de candidaturas contêm cabeçalho. Os principais campos são:

| Campo | Tipo | Descrição |
|---|---|---|
| `DT_GERACAO` | string | Data de geração do arquivo |
| `HH_GERACAO` | string | Hora de geração do arquivo |
| `ANO_ELEICAO` | string(4) | Ano da eleição |
| `CD_TIPO_ELEICAO` | string | Código do tipo de eleição |
| `NM_TIPO_ELEICAO` | string | Descrição do tipo de eleição (ordinária, suplementar) |
| `CD_ELEICAO` | string | Código da eleição |
| `DS_ELEICAO` | string | Descrição da eleição |
| `SG_UF` | string(2) | Sigla da UF |
| `SG_UE` | string | Sigla da unidade eleitoral |
| `NM_UE` | string | Nome da unidade eleitoral |
| `CD_CARGO` | string | Código do cargo |
| `DS_CARGO` | string | Descrição do cargo (Presidente, Governador, Senador, Deputado Federal, etc.) |
| `SQ_CANDIDATO` | string | Sequencial do candidato |
| `NR_CANDIDATO` | string | Número do candidato na urna |
| `NM_CANDIDATO` | string | Nome completo do candidato |
| `NM_URNA_CANDIDATO` | string | Nome de urna |
| `NM_SOCIAL_CANDIDATO` | string | Nome social do candidato |
| `NR_CPF_CANDIDATO` | string(11) | CPF do candidato |
| `NM_EMAIL` | string | E-mail do candidato |
| `CD_SITUACAO_CANDIDATURA` | string | Código da situação da candidatura |
| `DS_SITUACAO_CANDIDATURA` | string | Descrição (Apto, Inapto, Deferido, Indeferido) |
| `NR_PARTIDO` | string | Número do partido |
| `SG_PARTIDO` | string | Sigla do partido |
| `NM_PARTIDO` | string | Nome do partido |
| `NM_COLIGACAO` | string | Nome da coligação/federação |
| `SG_COLIGACAO` | string | Composição da coligação |
| `CD_NACIONALIDADE` | string | Código da nacionalidade |
| `DS_NACIONALIDADE` | string | Descrição da nacionalidade |
| `SG_UF_NASCIMENTO` | string(2) | UF de nascimento |
| `CD_MUNICIPIO_NASCIMENTO` | string | Código do município de nascimento |
| `NM_MUNICIPIO_NASCIMENTO` | string | Nome do município de nascimento |
| `DT_NASCIMENTO` | string | Data de nascimento (DD/MM/AAAA) |
| `NR_IDADE_DATA_POSSE` | string | Idade na data da posse |
| `NR_TITULO_ELEITORAL_CANDIDATO` | string | Número do título de eleitor |
| `CD_GENERO` | string | Código do gênero |
| `DS_GENERO` | string | Descrição (Masculino, Feminino) |
| `CD_GRAU_INSTRUCAO` | string | Código do grau de instrução |
| `DS_GRAU_INSTRUCAO` | string | Descrição do grau de instrução |
| `CD_ESTADO_CIVIL` | string | Código do estado civil |
| `DS_ESTADO_CIVIL` | string | Descrição do estado civil |
| `CD_COR_RACA` | string | Código da cor/raça |
| `DS_COR_RACA` | string | Descrição da cor/raça |
| `CD_OCUPACAO` | string | Código da ocupação |
| `DS_OCUPACAO` | string | Descrição da ocupação |
| `CD_SIT_TOT_TURNO` | string | Código do resultado (eleito, não eleito, 2o turno) |
| `DS_SIT_TOT_TURNO` | string | Descrição do resultado |
| `ST_REELEICAO` | string | Indica se é candidato à reeleição (S/N) |
| `ST_DECLARAR_BENS` | string | Indica se declarou bens (S/N) |
| `NR_PROTOCOLO_CANDIDATURA` | string | Número do protocolo de registro |
| `NR_PROCESSO` | string | Número do processo de registro |

## Cruzamentos possíveis

O **CPF do candidato** é o campo-ponte central que conecta a base de candidaturas a praticamente todas as outras fontes de dados governamentais:

| Cruzamento | Fonte relacionada | Chave de ligação | Finalidade |
|---|---|---|---|
| Candidatos x Sócios de empresas | [QSA — Quadro Societário](/docs/apis/receita-federal/qsa) | `NR_CPF_CANDIDATO` → `cpf_cnpj_socio` | Identificar candidatos que são sócios ou administradores de empresas |
| Candidatos x Empresas | [CNPJ Completa](/docs/apis/receita-federal/cnpj-completa) | Via QSA → `cnpj_basico` | Obter dados das empresas em que candidatos participam |
| Candidatos x Servidores públicos | [Servidores Federais](/docs/apis/transparencia-cgu/servidores-federais) | `CPF` | Verificar se candidatos são ou foram servidores públicos (acúmulo de cargo) |
| Candidatos x Contratos públicos | [Contratos Federais](/docs/apis/transparencia-cgu/contratos-federais) | Via QSA → `CNPJ` | Verificar se empresas de candidatos têm contratos com o governo |
| Candidatos x Emendas parlamentares | [Emendas Parlamentares](/docs/apis/transparencia-cgu/emendas-parlamentares) | `autor` / `NM_CANDIDATO` | Rastrear emendas de parlamentares eleitos |
| Candidatos x Doações | [Prestação de Contas](/docs/apis/justica-eleitoral-tse/prestacao-contas) | `SQ_CANDIDATO` / `CPF` | Analisar fontes de financiamento de campanha |
| Candidatos x Bens declarados | [Bens Declarados](/docs/apis/justica-eleitoral-tse/bens-declarados) | `SQ_CANDIDATO` | Acompanhar evolução patrimonial entre eleições |
| Candidatos x Votação | [Resultados Eleitorais](/docs/apis/justica-eleitoral-tse/resultados-eleitorais) | `NR_CANDIDATO` / `SQ_CANDIDATO` | Analisar desempenho eleitoral |

### Exemplo de cruzamento: candidatos que são servidores federais

```python
import requests
import pandas as pd

API_KEY = "SEU_TOKEN_AQUI"
BASE_URL = "https://api.portaldatransparencia.gov.br/api-de-dados"
headers = {"chave-api-dados": API_KEY, "Accept": "application/json"}

# 1. Carregar candidatos (previamente baixados)
df_cand = pd.read_csv(
    "dados_tse/consulta_cand_2022_BRASIL.csv",
    sep=";",
    encoding="latin-1",
    dtype=str,
)

# 2. Para cada candidato, consultar se é servidor federal
# (ATENÇÃO: respeitar rate limit de 30 req/min)
import time

candidatos_servidores = []
for _, row in df_cand.head(50).iterrows():
    cpf = row["NR_CPF_CANDIDATO"]
    if pd.isna(cpf) or cpf == "":
        continue

    resp = requests.get(
        f"{BASE_URL}/servidores/por-cpf",
        headers=headers,
        params={"cpf": cpf},
    )
    if resp.status_code == 200 and resp.json():
        candidatos_servidores.append({
            "candidato": row["NM_CANDIDATO"],
            "cpf": cpf,
            "cargo_eletivo": row["DS_CARGO"],
            "partido": row["SG_PARTIDO"],
            "servidor_info": resp.json(),
        })
    time.sleep(2)  # Respeitar rate limit

print(f"Candidatos que são servidores federais: {len(candidatos_servidores)}")
```

## Limitações conhecidas

| Limitação | Detalhes |
|---|---|
| **Encoding Latin-1** | Os arquivos usam encoding ISO-8859-1 (Latin-1), não UTF-8. Especificar `encoding="latin-1"` ao ler os dados. |
| **CPFs mascarados em anos antigos** | Em eleições anteriores a 2010, o CPF pode estar parcialmente mascarado ou ausente, dificultando cruzamentos. |
| **Nomes inconsistentes** | O mesmo candidato pode aparecer com grafias diferentes entre eleições (acentos, abreviações, nome de solteiro/casado). |
| **Candidaturas indeferidas** | A base inclui candidaturas com registro indeferido. Filtrar pelo campo `DS_SITUACAO_CANDIDATURA` para considerar apenas candidaturas válidas. |
| **Sem API de consulta** | Não existe API REST para consulta individual. É necessário baixar os arquivos CSV completos. |
| **Dados demográficos auto-declarados** | Informações como grau de instrução, ocupação e cor/raça são auto-declaradas pelo candidato e podem conter imprecisões. |
| **Mudanças de layout entre eleições** | Os nomes e a quantidade de colunas podem variar entre anos eleitorais. Sempre verificar o cabeçalho do CSV antes de processar. |
| **Coligações x Federações** | A partir de 2022, coligações para cargos proporcionais foram substituídas por federações partidárias, alterando os campos relacionados. |
| **Volume de dados municipais** | Eleições municipais (prefeitos e vereadores) geram arquivos significativamente maiores devido ao grande número de candidatos (~500 mil por eleição). |
| **Disponibilidade do CDN** | O servidor CDN do TSE pode apresentar lentidão em períodos eleitorais. O portal CKAN é uma alternativa de acesso. |
