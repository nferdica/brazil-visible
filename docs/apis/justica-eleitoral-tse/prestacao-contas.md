---
title: Prestação de Contas
slug: prestacao-contas
orgao: TSE
url_base: https://dadosabertos.tse.jus.br/
tipo_acesso: CSV Download
autenticacao: Não requerida
formato_dados: [CSV]
frequencia_atualizacao: Por eleição
campos_chave:
  - CPF_candidato
  - CNPJ_prestador_conta
  - CPF_CNPJ_doador
  - CPF_CNPJ_fornecedor
  - valor_receita
  - valor_despesa
  - sequencial_candidato
tags:
  - eleições
  - prestação de contas
  - financiamento de campanha
  - doações
  - receitas
  - despesas
  - fornecedores
  - campanha eleitoral
cruzamento_com:
  - receita-federal/cnpj-completa
  - receita-federal/qsa
  - transparencia-cgu/contratos-federais
  - transparencia-cgu/emendas-parlamentares
  - justica-eleitoral-tse/candidaturas
  - justica-eleitoral-tse/resultados-eleitorais
status: documentado
---

# Prestação de Contas

## O que é

A base de **Prestação de Contas** do **Tribunal Superior Eleitoral (TSE)** contém os registros detalhados de **receitas e despesas** de todas as campanhas eleitorais no Brasil. Os dados incluem doações recebidas (com identificação de doadores por CPF ou CNPJ), pagamentos a fornecedores, transferências entre comitês e partidos, e recursos do fundo eleitoral e partidário.

Este é um dos conjuntos de dados mais críticos para o controle social e o combate à corrupção. Permite rastrear o **fluxo de dinheiro** nas campanhas eleitorais, identificar doadores (pessoas físicas e jurídicas), fornecedores contratados e o volume de recursos movimentados por cada candidato, partido e comitê.

O cruzamento com bases da Receita Federal (CNPJ, QSA) e da CGU (contratos públicos) é essencial para identificar doadores que são sócios de empresas com contratos governamentais, empresas de fachada usadas para triangulação de recursos e fornecedores beneficiados após a eleição.

**Fonte oficial:** https://dadosabertos.tse.jus.br/dataset/prestacao-de-contas-eleitorais

**Download direto (CDN):** https://cdn.tse.jus.br/estatistica/sead/odsele/prestacao_contas/

## Como acessar

| Item | Detalhe |
|---|---|
| **URL base (CKAN)** | `https://dadosabertos.tse.jus.br/dataset/prestacao-de-contas-eleitorais` |
| **URL base (CDN)** | `https://cdn.tse.jus.br/estatistica/sead/odsele/prestacao_contas/` |
| **Tipo de acesso** | Download direto de arquivos ZIP contendo CSVs |
| **Autenticação** | Não requerida |
| **Formato** | CSV (delimitado por `;`, encoding Latin-1/ISO-8859-1) |
| **Tamanho** | Varia — pode chegar a centenas de MB por eleição |

### Organização dos arquivos

Os dados são organizados por ano, tipo de prestador e natureza (receita/despesa):

- **Receitas de candidatos:** `prestacao_contas_YYYY_candidatos_receitas.zip`
- **Despesas de candidatos:** `prestacao_contas_YYYY_candidatos_despesas.zip`
- **Receitas de partidos/comitês:** `prestacao_contas_YYYY_partidos_receitas.zip`
- **Despesas de partidos/comitês:** `prestacao_contas_YYYY_partidos_despesas.zip`

## Endpoints/recursos principais

| Recurso | Conteúdo | Cobertura |
|---|---|---|
| `prestacao_contas_YYYY_candidatos_receitas.zip` | Receitas (doações) de campanha por candidato | 2002 a 2024 |
| `prestacao_contas_YYYY_candidatos_despesas.zip` | Despesas de campanha por candidato | 2002 a 2024 |
| `prestacao_contas_YYYY_partidos_receitas.zip` | Receitas de partidos e comitês | 2002 a 2024 |
| `prestacao_contas_YYYY_partidos_despesas.zip` | Despesas de partidos e comitês | 2002 a 2024 |

### Download direto

```
https://cdn.tse.jus.br/estatistica/sead/odsele/prestacao_contas/prestacao_contas_2022_candidatos_receitas.zip
https://cdn.tse.jus.br/estatistica/sead/odsele/prestacao_contas/prestacao_contas_2022_candidatos_despesas.zip
https://cdn.tse.jus.br/estatistica/sead/odsele/prestacao_contas/prestacao_contas_2022_partidos_receitas.zip
https://cdn.tse.jus.br/estatistica/sead/odsele/prestacao_contas/prestacao_contas_2022_partidos_despesas.zip
```

## Exemplo de uso

### Download e leitura das receitas de campanha

```python
import requests
import zipfile
import pandas as pd
from io import BytesIO
from pathlib import Path


def baixar_receitas_candidatos(ano: int, destino: Path = Path("./dados_tse")) -> pd.DataFrame:
    """
    Baixa e carrega dados de receitas de candidatos.

    Args:
        ano: Ano da eleição (ex: 2022, 2020, 2018)
        destino: Diretório para salvar os arquivos

    Returns:
        DataFrame com receitas de todos os candidatos do ano
    """
    url = (
        f"https://cdn.tse.jus.br/estatistica/sead/odsele/"
        f"prestacao_contas/prestacao_contas_{ano}_candidatos_receitas.zip"
    )
    print(f"Baixando receitas de candidatos {ano}...")

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

    print(f"Receitas carregadas: {len(df):,}")
    return df


# Baixar receitas das eleições de 2022
df_receitas = baixar_receitas_candidatos(2022)
print(df_receitas.head())
```

### Análise de maiores doadores

```python
def maiores_doadores(df: pd.DataFrame, top_n: int = 20) -> pd.DataFrame:
    """
    Identifica os maiores doadores de campanha.

    Args:
        df: DataFrame com receitas de candidatos
        top_n: Quantidade de doadores a retornar

    Returns:
        DataFrame com maiores doadores
    """
    df["VR_RECEITA"] = pd.to_numeric(
        df["VR_RECEITA"].str.replace(",", "."), errors="coerce"
    )

    doadores = (
        df.groupby(["NR_CPF_CNPJ_DOADOR", "NM_DOADOR", "DS_ORIGEM_RECEITA"])
        .agg(
            total_doado=("VR_RECEITA", "sum"),
            qtd_doacoes=("VR_RECEITA", "count"),
            candidatos_beneficiados=("NM_CANDIDATO", "nunique"),
        )
        .reset_index()
        .sort_values("total_doado", ascending=False)
    )

    return doadores.head(top_n)


top_doadores = maiores_doadores(df_receitas)
print("Top 20 doadores — Eleições 2022:")
print(top_doadores[["NM_DOADOR", "total_doado", "qtd_doacoes", "candidatos_beneficiados"]])
```

### Cruzamento: doadores de campanha com contratos públicos

```python
# 1. Carregar receitas de campanha
df_receitas = baixar_receitas_candidatos(2022)
df_receitas["VR_RECEITA"] = pd.to_numeric(
    df_receitas["VR_RECEITA"].str.replace(",", "."), errors="coerce"
)

# 2. Filtrar doações de pessoas jurídicas (CNPJ)
# Nota: doações PJ foram proibidas em 2015, mas ainda há transferências via partidos
doacoes_pj = df_receitas[
    df_receitas["NR_CPF_CNPJ_DOADOR"].str.len() == 14
].copy()

# 3. Carregar QSA para encontrar sócios dos doadores
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

# 4. Cruzar doadores PF com sócios de empresas (via CPF)
doacoes_pf = df_receitas[
    df_receitas["NR_CPF_CNPJ_DOADOR"].str.len() == 11
].copy()

doadores_socios = pd.merge(
    doacoes_pf[["NR_CPF_CNPJ_DOADOR", "NM_DOADOR", "VR_RECEITA", "NM_CANDIDATO"]],
    df_qsa[["cpf_cnpj_socio", "cnpj_basico", "nome_socio"]],
    left_on="NR_CPF_CNPJ_DOADOR",
    right_on="cpf_cnpj_socio",
    how="inner",
)

print(f"Doadores PF que são sócios de empresas: {doadores_socios['NR_CPF_CNPJ_DOADOR'].nunique()}")
print(f"Empresas envolvidas: {doadores_socios['cnpj_basico'].nunique()}")

# 5. Verificar se essas empresas têm contratos com o governo
# (usando a API do Portal da Transparência)
import requests
import time

API_KEY = "SEU_TOKEN_AQUI"
headers = {"chave-api-dados": API_KEY, "Accept": "application/json"}

cnpjs_unicos = doadores_socios["cnpj_basico"].unique()[:20]  # Limitar para exemplo
for cnpj_basico in cnpjs_unicos:
    resp = requests.get(
        "https://api.portaldatransparencia.gov.br/api-de-dados/contratos",
        headers=headers,
        params={
            "cnpjContratado": cnpj_basico,
            "dataInicial": "01/01/2020",
            "dataFinal": "31/12/2024",
            "pagina": 1,
        },
    )
    if resp.status_code == 200 and resp.json():
        print(f"ALERTA: CNPJ {cnpj_basico} — doador de campanha COM contratos públicos!")
    time.sleep(2)  # Respeitar rate limit
```

## Campos disponíveis

### Receitas de candidatos

| Campo | Tipo | Descrição |
|---|---|---|
| `DT_GERACAO` | string | Data de geração do arquivo |
| `HH_GERACAO` | string | Hora de geração do arquivo |
| `ANO_ELEICAO` | string(4) | Ano da eleição |
| `CD_TIPO_ELEICAO` | string | Código do tipo de eleição |
| `NM_TIPO_ELEICAO` | string | Descrição do tipo de eleição |
| `SG_UF` | string(2) | Sigla da UF |
| `SG_UE` | string | Sigla da unidade eleitoral |
| `NM_UE` | string | Nome da unidade eleitoral |
| `SQ_CANDIDATO` | string | Sequencial do candidato |
| `NR_CANDIDATO` | string | Número do candidato na urna |
| `NM_CANDIDATO` | string | Nome do candidato |
| `NR_CPF_CANDIDATO` | string(11) | CPF do candidato |
| `NR_CPF_VICE_CANDIDATO` | string(11) | CPF do vice/suplente |
| `NR_PARTIDO` | string | Número do partido |
| `SG_PARTIDO` | string | Sigla do partido |
| `NR_RECIBO_ELEITORAL` | string | Número do recibo eleitoral |
| `NR_DOCUMENTO` | string | Número do documento fiscal |
| `NR_CPF_CNPJ_DOADOR` | string | CPF ou CNPJ do doador |
| `NM_DOADOR` | string | Nome/razão social do doador |
| `NM_DOADOR_RFB` | string | Nome do doador conforme Receita Federal |
| `CD_ESFERA_PARTIDARIA_DOADOR` | string | Esfera do partido doador |
| `SG_UF_DOADOR` | string(2) | UF do doador |
| `CD_CNAE_DOADOR` | string | CNAE (atividade econômica) do doador PJ |
| `DS_CNAE_DOADOR` | string | Descrição do CNAE do doador |
| `NR_CPF_CNPJ_DOADOR_ORIGINARIO` | string | CPF/CNPJ do doador originário (em caso de transferência) |
| `NM_DOADOR_ORIGINARIO` | string | Nome do doador originário |
| `NM_DOADOR_ORIGINARIO_RFB` | string | Nome do doador originário conforme RFB |
| `DS_ORIGEM_RECEITA` | string | Origem da receita (fundo eleitoral, doação PF, transferência partido, etc.) |
| `VR_RECEITA` | string | Valor da receita (formato decimal com vírgula) |
| `DS_FONTE_RECEITA` | string | Fonte da receita |
| `DT_RECEITA` | string | Data da receita (DD/MM/AAAA) |
| `DS_RECEITA` | string | Descrição da receita |

### Despesas de candidatos

| Campo | Tipo | Descrição |
|---|---|---|
| `SQ_CANDIDATO` | string | Sequencial do candidato |
| `NR_CPF_CANDIDATO` | string(11) | CPF do candidato |
| `NM_CANDIDATO` | string | Nome do candidato |
| `NR_CPF_CNPJ_FORNECEDOR` | string | CPF ou CNPJ do fornecedor |
| `NM_FORNECEDOR` | string | Nome/razão social do fornecedor |
| `NM_FORNECEDOR_RFB` | string | Nome conforme Receita Federal |
| `CD_CNAE_FORNECEDOR` | string | CNAE do fornecedor |
| `DS_TIPO_DESPESA` | string | Tipo de despesa (publicidade, transporte, pessoal, etc.) |
| `DS_DESPESA` | string | Descrição da despesa |
| `VR_DESPESA` | string | Valor da despesa (formato decimal com vírgula) |
| `DT_DESPESA` | string | Data da despesa |
| `NR_DOCUMENTO` | string | Número do documento fiscal |
| `DS_TIPO_DOCUMENTO` | string | Tipo de documento (nota fiscal, recibo, etc.) |

## Cruzamentos possíveis

| Cruzamento | Fonte relacionada | Chave de ligação | Finalidade |
|---|---|---|---|
| Doadores PJ x Empresas | [CNPJ Completa](/docs/apis/receita-federal/cnpj-completa) | `NR_CPF_CNPJ_DOADOR` → `CNPJ` | Identificar atividade, porte e situação cadastral dos doadores PJ |
| Doadores PF x Sócios | [QSA — Quadro Societário](/docs/apis/receita-federal/qsa) | `NR_CPF_CNPJ_DOADOR` → `cpf_cnpj_socio` | Descobrir se doadores PF são sócios de empresas com interesse público |
| Fornecedores x Empresas | [CNPJ Completa](/docs/apis/receita-federal/cnpj-completa) | `NR_CPF_CNPJ_FORNECEDOR` → `CNPJ` | Verificar situação cadastral e atividade de fornecedores de campanha |
| Fornecedores x Contratos públicos | [Contratos Federais](/docs/apis/transparencia-cgu/contratos-federais) | `NR_CPF_CNPJ_FORNECEDOR` → `cnpjContratado` | Identificar fornecedores de campanha que também são contratados pelo governo |
| Candidatos x Emendas | [Emendas Parlamentares](/docs/apis/transparencia-cgu/emendas-parlamentares) | `NM_CANDIDATO` / `CPF` | Cruzar doadores com beneficiários de emendas parlamentares |
| Receitas x Candidaturas | [Candidaturas](/docs/apis/justica-eleitoral-tse/candidaturas) | `SQ_CANDIDATO` | Enriquecer dados financeiros com informações do candidato |
| Receitas x Votação | [Resultados Eleitorais](/docs/apis/justica-eleitoral-tse/resultados-eleitorais) | `SQ_CANDIDATO` | Analisar correlação entre arrecadação e desempenho eleitoral |

### Exemplo de cruzamento: fornecedores de campanha que recebem contratos públicos

```python
import pandas as pd
import requests

API_KEY = "SEU_TOKEN_AQUI"
headers = {"chave-api-dados": API_KEY, "Accept": "application/json"}

# 1. Carregar despesas de candidatos eleitos
df_despesas = pd.read_csv(
    "dados_tse/prestacao_contas_2022_candidatos_despesas_BRASIL.csv",
    sep=";",
    encoding="latin-1",
    dtype=str,
)
df_despesas["VR_DESPESA"] = pd.to_numeric(
    df_despesas["VR_DESPESA"].str.replace(",", "."), errors="coerce"
)

# 2. Agregar por fornecedor
fornecedores = (
    df_despesas.groupby(["NR_CPF_CNPJ_FORNECEDOR", "NM_FORNECEDOR"])
    .agg(
        total_recebido=("VR_DESPESA", "sum"),
        candidatos_atendidos=("NM_CANDIDATO", "nunique"),
    )
    .reset_index()
    .sort_values("total_recebido", ascending=False)
)

# 3. Verificar se maiores fornecedores têm contratos com o governo
top_fornecedores_pj = fornecedores[
    fornecedores["NR_CPF_CNPJ_FORNECEDOR"].str.len() == 14
].head(10)

for _, row in top_fornecedores_pj.iterrows():
    cnpj = row["NR_CPF_CNPJ_FORNECEDOR"]
    resp = requests.get(
        "https://api.portaldatransparencia.gov.br/api-de-dados/contratos",
        headers=headers,
        params={
            "cnpjContratado": cnpj,
            "dataInicial": "01/01/2023",
            "dataFinal": "31/12/2025",
            "pagina": 1,
        },
    )
    if resp.status_code == 200 and resp.json():
        print(f"ALERTA: {row['NM_FORNECEDOR']} (CNPJ {cnpj})")
        print(f"  Recebeu R$ {row['total_recebido']:,.2f} de campanhas")
        print(f"  Possui contratos públicos pós-eleição!")
```

## Limitações conhecidas

| Limitação | Detalhes |
|---|---|
| **Encoding Latin-1** | Os arquivos usam encoding ISO-8859-1 (Latin-1). Especificar `encoding="latin-1"` ao ler os dados. |
| **Doações PJ proibidas desde 2015** | Desde a decisão do STF na ADI 4650, empresas não podem doar diretamente para campanhas. Porém, ainda existem transferências indiretas via partidos e fundos. |
| **Valores como texto** | Campos monetários usam vírgula como separador decimal (ex: `"15000,50"`). Requer conversão: `str.replace(",", ".")` seguido de `pd.to_numeric()`. |
| **Doador originário** | Em transferências entre partidos/comitês, o doador direto pode ser o partido, mas o **doador originário** é quem realmente contribuiu. Nem sempre este campo está preenchido. |
| **Inconsistências de CPF/CNPJ** | Doadores podem aparecer com CPF/CNPJ formatados de maneira inconsistente. Normalizar removendo pontos, traços e barras antes de cruzamentos. |
| **Mudanças de layout entre eleições** | A estrutura dos arquivos mudou significativamente ao longo dos anos, especialmente após a proibição de doações PJ. |
| **Contas parciais vs. finais** | Durante o período eleitoral, são divulgadas prestações parciais. Os dados finais são publicados após julgamento das contas pela Justiça Eleitoral. |
| **Volume de dados** | Eleições municipais geram volumes muito maiores devido à quantidade de candidatos (~500 mil). |
| **Candidatos com conta rejeitada** | A base inclui candidatos cujas contas foram rejeitadas ou não prestadas. Verificar o status da prestação. |
| **Sem API de consulta** | Não existe API REST para consulta individual. É necessário baixar todos os arquivos CSV. |
