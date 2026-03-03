---
title: Simples Nacional / MEI
slug: simples-nacional
orgao: Receita Federal
url_base: https://www.gov.br/receitafederal/dados
tipo_acesso: CSV Download
autenticacao: Não requerida
formato_dados: [CSV]
frequencia_atualizacao: Mensal
campos_chave: [CNPJ básico, opção pelo Simples, opção pelo MEI]
tags:
  - simples nacional
  - MEI
  - microempreendedor individual
  - regime tributário
  - optantes
  - cnpj
  - pequenas empresas
cruzamento_com:
  - cnpj-completa
  - qsa
  - estabelecimentos
  - portal-transparencia
  - base-dos-dados
status: documentado
---

# Simples Nacional / MEI

## O que é

O **Simples Nacional** é um regime tributário simplificado para micro e pequenas empresas no Brasil, e o **MEI (Microempreendedor Individual)** é uma subcategoria dentro desse regime, destinada a empreendedores com faturamento anual de ate R$ 81.000,00. A Receita Federal disponibiliza como dados abertos o arquivo `Simples.zip`, que contém a situação de cada CNPJ em relação a esses dois regimes.

O dataset informa quais empresas **optaram** pelo Simples Nacional e/ou pelo MEI, incluindo as **datas de opção e exclusão** de cada regime. Isso permite identificar o regime tributário de qualquer empresa brasileira e acompanhar mudanças ao longo do tempo.

**Fonte oficial:** https://arquivos.receitafederal.gov.br/dados/cnpj/dados_abertos_cnpj/

**Documentação do layout:** `layout_dados_abertos_cnpj.pdf` disponível na mesma URL base.

## Como acessar

| Item | Detalhe |
|---|---|
| **URL base** | `https://arquivos.receitafederal.gov.br/dados/cnpj/dados_abertos_cnpj/` |
| **Tipo de acesso** | Download direto de arquivo ZIP |
| **Autenticação** | Não requerida |
| **Formato** | CSV (sem cabeçalho, delimitado por `;`, encoding Latin-1/ISO-8859-1) |
| **Tamanho** | ~200 MB compactado (~1,5 GB descompactado, arquivo único) |

### Download direto

```
https://arquivos.receitafederal.gov.br/dados/cnpj/dados_abertos_cnpj/Simples.zip
```

Diferentemente dos outros arquivos da base CNPJ, o arquivo do Simples Nacional **não é particionado** — existe apenas um único arquivo `Simples.zip` contendo todos os registros.

## Endpoints/recursos principais

| Arquivo | Conteúdo | Tamanho aprox. |
|---|---|---|
| `Simples.zip` | Dados de opção pelo Simples Nacional e MEI para todos os CNPJs | ~200 MB compactado |

O arquivo contém um registro para cada CNPJ que já teve alguma relação com o Simples Nacional ou MEI, incluindo empresas que optaram e posteriormente foram excluídas.

## Exemplo de uso

### Download e leitura dos dados do Simples Nacional

```python
import requests
import zipfile
import pandas as pd
from io import BytesIO
from pathlib import Path

# Colunas do arquivo Simples conforme layout da Receita Federal
COLUNAS_SIMPLES = [
    "cnpj_basico",
    "opcao_simples",
    "data_opcao_simples",
    "data_exclusao_simples",
    "opcao_mei",
    "data_opcao_mei",
    "data_exclusao_mei",
]

def baixar_e_extrair(url: str, destino: Path) -> Path:
    """Baixa um arquivo ZIP e extrai o CSV contido nele."""
    print(f"Baixando {url}...")
    response = requests.get(url, stream=True)
    response.raise_for_status()

    with zipfile.ZipFile(BytesIO(response.content)) as zf:
        nome_csv = zf.namelist()[0]
        zf.extract(nome_csv, destino)
        print(f"Extraído: {destino / nome_csv}")
        return destino / nome_csv


# Baixar arquivo do Simples Nacional
url = "https://arquivos.receitafederal.gov.br/dados/cnpj/dados_abertos_cnpj/Simples.zip"
caminho_csv = baixar_e_extrair(url, Path("./dados_rfb"))

# Ler o CSV (sem cabeçalho, separador ";", encoding Latin-1)
df_simples = pd.read_csv(
    caminho_csv,
    sep=";",
    header=None,
    names=COLUNAS_SIMPLES,
    dtype=str,
    encoding="latin-1",
)

print(f"Registros carregados: {len(df_simples):,}")
print(df_simples.head())
```

### Filtrar empresas optantes pelo Simples Nacional

```python
def filtrar_optantes_simples(df: pd.DataFrame) -> pd.DataFrame:
    """
    Retorna apenas as empresas atualmente optantes pelo Simples Nacional.
    Critério: opcao_simples == 'S' e sem data de exclusão.
    """
    return df[
        (df["opcao_simples"] == "S") &
        (df["data_exclusao_simples"].isna() | (df["data_exclusao_simples"] == ""))
    ]


optantes_simples = filtrar_optantes_simples(df_simples)
print(f"Empresas optantes pelo Simples Nacional: {len(optantes_simples):,}")
```

### Filtrar Microempreendedores Individuais (MEI)

```python
def filtrar_mei(df: pd.DataFrame) -> pd.DataFrame:
    """
    Retorna apenas os MEIs atualmente ativos.
    Critério: opcao_mei == 'S' e sem data de exclusão.
    """
    return df[
        (df["opcao_mei"] == "S") &
        (df["data_exclusao_mei"].isna() | (df["data_exclusao_mei"] == ""))
    ]


meis_ativos = filtrar_mei(df_simples)
print(f"MEIs ativos: {len(meis_ativos):,}")
```

### Estatísticas gerais do Simples Nacional e MEI

```python
# Contagem por situação
print("=== Simples Nacional ===")
print(df_simples["opcao_simples"].value_counts())
print(f"\n=== MEI ===")
print(df_simples["opcao_mei"].value_counts())

# Evolução temporal: agrupar por ano de opção
df_simples["ano_opcao_simples"] = df_simples["data_opcao_simples"].str[:4]
evolucao = (
    df_simples[df_simples["opcao_simples"] == "S"]
    .groupby("ano_opcao_simples")
    .size()
    .reset_index(name="total")
)
print("\nNovas opções pelo Simples Nacional por ano:")
print(evolucao.tail(10))
```

### Verificar se empresa específica é optante

```python
def verificar_regime(df: pd.DataFrame, cnpj_basico: str) -> dict:
    """
    Verifica a situação de uma empresa no Simples Nacional e MEI.

    Args:
        df: DataFrame com dados do Simples
        cnpj_basico: 8 primeiros dígitos do CNPJ

    Returns:
        Dicionário com a situação do regime tributário
    """
    registro = df[df["cnpj_basico"] == cnpj_basico.zfill(8)]
    if registro.empty:
        return {"encontrado": False, "simples": None, "mei": None}

    r = registro.iloc[0]
    return {
        "encontrado": True,
        "simples": r["opcao_simples"] == "S",
        "data_opcao_simples": r["data_opcao_simples"],
        "data_exclusao_simples": r["data_exclusao_simples"],
        "mei": r["opcao_mei"] == "S",
        "data_opcao_mei": r["data_opcao_mei"],
        "data_exclusao_mei": r["data_exclusao_mei"],
    }


# Exemplo
resultado = verificar_regime(df_simples, "12345678")
if resultado["encontrado"]:
    print(f"Optante Simples: {'Sim' if resultado['simples'] else 'Não'}")
    print(f"Optante MEI: {'Sim' if resultado['mei'] else 'Não'}")
else:
    print("Empresa não encontrada na base do Simples Nacional.")
```

## Campos disponíveis

### Arquivo do Simples Nacional (`Simples.zip`)

Os CSVs **não possuem cabeçalho**. As colunas são posicionais, na seguinte ordem:

| Posição | Campo | Tipo | Descrição |
|---|---|---|---|
| 0 | `cnpj_basico` | string(8) | CNPJ básico da empresa (8 primeiros dígitos) |
| 1 | `opcao_simples` | string(1) | Opção pelo Simples Nacional: `S`=Sim, `N`=Não, em branco=Outros |
| 2 | `data_opcao_simples` | string(8) | Data de opção pelo Simples Nacional (formato `YYYYMMDD`) |
| 3 | `data_exclusao_simples` | string(8) | Data de exclusão do Simples Nacional (formato `YYYYMMDD`), em branco se ainda optante |
| 4 | `opcao_mei` | string(1) | Opção pelo MEI: `S`=Sim, `N`=Não, em branco=Outros |
| 5 | `data_opcao_mei` | string(8) | Data de opção pelo MEI (formato `YYYYMMDD`) |
| 6 | `data_exclusao_mei` | string(8) | Data de exclusão do MEI (formato `YYYYMMDD`), em branco se ainda optante |

### Valores do campo `opcao_simples` / `opcao_mei`

| Valor | Significado |
|---|---|
| `S` | Sim — empresa é optante pelo regime |
| `N` | Não — empresa não é optante ou foi excluída |
| *(em branco)* | Situação não determinada ou empresa nunca optou |

## Cruzamentos possíveis

| Cruzamento | Fonte relacionada | Chave de ligação | Finalidade |
|---|---|---|---|
| Simples x Dados cadastrais | [Base CNPJ Completa](/docs/apis/receita-federal/cnpj-completa) | `CNPJ básico` | Obter razão social, porte e natureza jurídica dos optantes |
| Simples x Sócios | [QSA — Quadro Societário](/docs/apis/receita-federal/qsa) | `CNPJ básico` | Identificar sócios de empresas do Simples/MEI |
| Simples x Estabelecimentos | [Estabelecimentos](/docs/apis/receita-federal/estabelecimentos) | `CNPJ básico` | Localizar endereços de empresas do Simples/MEI |
| MEI x Contratos públicos | [Portal da Transparência](/docs/apis/portais-centrais/portal-transparencia) | `CNPJ` | Verificar se MEIs recebem contratos do governo federal |
| Simples x Dados tratados | [Base dos Dados](/docs/apis/portais-centrais/base-dos-dados) | `CNPJ` | Consultar dados tratados e padronizados do Simples Nacional |
| MEI x Benefícios sociais | Previdência Social — Benefícios | `CPF (via QSA)` | Verificar se MEIs recebem benefícios previdenciários |
| Simples x Licitações | ComprasNet / PNCP | `CNPJ` | Verificar participação de empresas do Simples em licitações |

### Exemplo de cruzamento: Simples Nacional x Base CNPJ

```python
import pandas as pd

# Carregar dados do Simples (previamente baixados)
df_simples = pd.read_csv(
    "dados_rfb/Simples.csv",
    sep=";", header=None,
    names=["cnpj_basico", "opcao_simples", "data_opcao_simples",
           "data_exclusao_simples", "opcao_mei", "data_opcao_mei",
           "data_exclusao_mei"],
    dtype=str, encoding="latin-1",
)

# Carregar dados de empresas (previamente baixados)
df_empresas = pd.read_csv(
    "dados_rfb/Empresas0.csv",
    sep=";", header=None,
    names=["cnpj_basico", "razao_social", "natureza_juridica",
           "qualificacao_responsavel", "capital_social",
           "porte_empresa", "ente_federativo_responsavel"],
    dtype=str, encoding="latin-1",
)

# Cruzar: MEIs com dados cadastrais
meis = df_simples[df_simples["opcao_mei"] == "S"]
meis_com_dados = meis.merge(
    df_empresas[["cnpj_basico", "razao_social", "capital_social", "porte_empresa"]],
    on="cnpj_basico",
    how="inner",
)

print(f"MEIs com dados cadastrais encontrados: {len(meis_com_dados):,}")
print(meis_com_dados[["cnpj_basico", "razao_social", "data_opcao_mei"]].head(10))

# Distribuição de porte entre optantes do Simples
optantes = df_simples[df_simples["opcao_simples"] == "S"]
optantes_com_porte = optantes.merge(
    df_empresas[["cnpj_basico", "porte_empresa"]],
    on="cnpj_basico",
    how="inner",
)
portes = {
    "00": "Não informado",
    "01": "Micro empresa",
    "03": "Empresa de pequeno porte",
    "05": "Demais",
}
optantes_com_porte["porte_desc"] = optantes_com_porte["porte_empresa"].map(portes)
print("\nDistribuição por porte:")
print(optantes_com_porte["porte_desc"].value_counts())
```

## Limitações conhecidas

| Limitação | Detalhes |
|---|---|
| **Sem cabeçalho no CSV** | O arquivo CSV não possui linha de cabeçalho. Consultar o `layout_dados_abertos_cnpj.pdf` para mapear as colunas. |
| **Encoding Latin-1** | O arquivo usa encoding ISO-8859-1 (Latin-1). Especificar `encoding="latin-1"` ao ler os dados. |
| **Apenas snapshot atual** | Os dados refletem a situação no momento da extração. Não há serie histórica completa — apenas as datas de opção e exclusão mais recentes. |
| **Datas em formato YYYYMMDD** | As datas são armazenadas como strings no formato `YYYYMMDD` (ex: `"20150101"`). Requer conversão manual para tipo datetime. |
| **Campos em branco** | Campos de data podem estar em branco quando não se aplicam (ex: `data_exclusao_simples` vazio para empresa ainda optante). |
| **Cobertura do MEI** | Nem todos os MEIs possuem registro completo — alguns podem aparecer com `opcao_mei` em branco mesmo sendo enquadrados como MEI. |
| **Sem informação de faturamento** | Os dados não incluem faixas de faturamento, não sendo possível verificar se a empresa excede os limites do Simples/MEI. |
| **Arquivo único e grande** | Diferente dos outros datasets da Receita Federal, o Simples vem em arquivo único (~200 MB compactado), o que simplifica o download mas exige memória para processamento completo. |
| **Atraso na atualização** | A atualização mensal pode ter atraso de 30 a 60 dias em relação a mudanças reais no regime tributário das empresas. |
| **CNPJ alfanumérico (julho 2026)** | A partir de julho de 2026, novos CNPJs poderão conter letras além de números. Scripts que validam CNPJ como campo numérico de 14 dígitos precisarão ser atualizados. |
