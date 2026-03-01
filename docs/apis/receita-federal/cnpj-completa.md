---
title: Base CNPJ Completa
slug: cnpj-completa
orgao: Receita Federal
url_base: https://dados.rfb.gov.br/CNPJ/
tipo_acesso: CSV Download
autenticacao: Não requerida
formato_dados: [CSV]
frequencia_atualizacao: Mensal
campos_chave: [CNPJ básico, razão social, natureza jurídica, capital social, porte empresa]
tags:
  - empresas
  - cnpj
  - razão social
  - situação cadastral
  - natureza jurídica
  - capital social
  - porte empresa
  - CNAE
  - dados abertos
cruzamento_com:
  - portal-transparencia
  - base-dos-dados
  - portal-dados-abertos
  - ifdata
  - qsa
  - estabelecimentos
  - simples-nacional
status: documentado
---

# Base CNPJ Completa

## O que é

A **Base CNPJ Completa** é o conjunto de dados cadastrais de todas as empresas registradas no Brasil (~57 milhões de CNPJs), disponibilizado pela **Receita Federal do Brasil (RFB)** como dados abertos. O arquivo `Empresas*.zip` contém informações de identificação de cada empresa a partir do **CNPJ básico** (8 primeiros dígitos), incluindo razão social, natureza jurídica, qualificação do responsável, capital social, porte da empresa e ente federativo responsável.

Este é um dos conjuntos de dados mais críticos de todo o ecossistema de dados abertos brasileiro. O **CNPJ** é o principal campo-ponte (*bridge field*) para cruzamento entre bases de dados governamentais — conectando informações fiscais, contratuais, eleitorais, societárias e de sanções.

**Fonte oficial:** https://dados.rfb.gov.br/CNPJ/

**Documentação do layout:** A Receita Federal disponibiliza o arquivo `layout_dados_abertos_cnpj.pdf` na mesma URL base, que descreve o esquema completo de todos os arquivos CSV.

## Como acessar

| Item | Detalhe |
|---|---|
| **URL base** | `https://dados.rfb.gov.br/CNPJ/` |
| **Tipo de acesso** | Download direto de arquivos ZIP |
| **Autenticação** | Não requerida |
| **Formato** | CSV (sem cabeçalho, delimitado por `;`, encoding Latin-1/ISO-8859-1) |
| **Tamanho** | ~1,2 GB compactado (~5 GB descompactado, dividido em múltiplos arquivos) |

### Arquivos disponíveis

Os dados de empresas são divididos em múltiplos arquivos numerados:

- `Empresas0.zip` a `Empresas9.zip` — dados das empresas particionados

Cada arquivo ZIP contém um CSV sem cabeçalho. As colunas são posicionais e seguem o layout documentado pela Receita Federal.

### Tabelas auxiliares (lookup)

Para decodificar os códigos presentes nos dados, é necessário baixar também:

| Arquivo | Descrição |
|---|---|
| `Cnaes.zip` | Tabela de códigos CNAE (atividades econômicas) |
| `Naturezas.zip` | Tabela de naturezas jurídicas |
| `Qualificacoes.zip` | Tabela de qualificações de sócios |
| `Paises.zip` | Tabela de países |
| `Municipios.zip` | Tabela de municípios |
| `Motivos.zip` | Tabela de motivos de situação cadastral |

## Endpoints/recursos principais

Como se trata de download de arquivos (e não de uma API REST), os "recursos" são os próprios arquivos disponíveis:

| Arquivo | Conteúdo | Tamanho aprox. |
|---|---|---|
| `Empresas0.zip` a `Empresas9.zip` | Dados cadastrais (CNPJ básico, razão social, natureza jurídica, capital social, porte) | ~100-150 MB cada |
| `Estabelecimentos0.zip` a `Estabelecimentos9.zip` | Dados dos estabelecimentos (CNPJ completo, endereço, telefone, e-mail, CNAE) | ~400-600 MB cada |
| `Socios0.zip` a `Socios9.zip` | Quadro Societário e de Administradores | ~50-80 MB cada |
| `Simples.zip` | Opção pelo Simples Nacional e MEI | ~200 MB |
| `layout_dados_abertos_cnpj.pdf` | Documentação oficial do layout dos arquivos | ~200 KB |

### Download direto

```
https://dados.rfb.gov.br/CNPJ/Empresas0.zip
https://dados.rfb.gov.br/CNPJ/Empresas1.zip
...
https://dados.rfb.gov.br/CNPJ/Empresas9.zip
```

## Exemplo de uso

### Download e leitura dos dados de empresas

```python
import requests
import zipfile
import pandas as pd
from io import BytesIO
from pathlib import Path

# Colunas do arquivo de Empresas conforme layout da Receita Federal
COLUNAS_EMPRESAS = [
    "cnpj_basico",
    "razao_social",
    "natureza_juridica",
    "qualificacao_responsavel",
    "capital_social",
    "porte_empresa",
    "ente_federativo_responsavel",
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


# Baixar o primeiro arquivo de empresas (Empresas0.zip)
url = "https://dados.rfb.gov.br/CNPJ/Empresas0.zip"
caminho_csv = baixar_e_extrair(url, Path("./dados_rfb"))

# Ler o CSV (sem cabeçalho, separador ";", encoding Latin-1)
df = pd.read_csv(
    caminho_csv,
    sep=";",
    header=None,
    names=COLUNAS_EMPRESAS,
    dtype=str,
    encoding="latin-1",
)

print(f"Registros carregados: {len(df):,}")
print(df.head())
```

### Consulta por CNPJ básico

```python
def consultar_empresa(df: pd.DataFrame, cnpj_basico: str) -> pd.DataFrame:
    """
    Consulta dados de uma empresa pelo CNPJ básico (8 dígitos).

    Args:
        df: DataFrame com os dados de empresas
        cnpj_basico: 8 primeiros dígitos do CNPJ (ex: '00000000')

    Returns:
        DataFrame filtrado com os dados da empresa
    """
    return df[df["cnpj_basico"] == cnpj_basico.zfill(8)]


# Exemplo: consultar Banco do Brasil (CNPJ básico: 00000000)
resultado = consultar_empresa(df, "00000000")
if not resultado.empty:
    print(f"Razão Social: {resultado.iloc[0]['razao_social']}")
    print(f"Natureza Jurídica: {resultado.iloc[0]['natureza_juridica']}")
    print(f"Capital Social: R$ {resultado.iloc[0]['capital_social']}")
```

### Carregar todos os arquivos de empresas

```python
from pathlib import Path

def carregar_todas_empresas(diretorio: Path) -> pd.DataFrame:
    """
    Carrega todos os arquivos de empresas (Empresas0 a Empresas9) em um único DataFrame.

    Atenção: requer ~5 GB de RAM. Para máquinas com menos memória,
    considere usar Dask ou processar arquivo por arquivo.
    """
    dfs = []
    for i in range(10):
        url = f"https://dados.rfb.gov.br/CNPJ/Empresas{i}.zip"
        caminho = baixar_e_extrair(url, diretorio)
        df_parte = pd.read_csv(
            caminho,
            sep=";",
            header=None,
            names=COLUNAS_EMPRESAS,
            dtype=str,
            encoding="latin-1",
        )
        dfs.append(df_parte)
        print(f"Empresas{i}: {len(df_parte):,} registros")

    df_completo = pd.concat(dfs, ignore_index=True)
    print(f"\nTotal de empresas: {len(df_completo):,}")
    return df_completo
```

### Decodificar natureza jurídica usando tabela auxiliar

```python
# Baixar e ler tabela de naturezas jurídicas
url_naturezas = "https://dados.rfb.gov.br/CNPJ/Naturezas.zip"
caminho_nat = baixar_e_extrair(url_naturezas, Path("./dados_rfb"))

df_naturezas = pd.read_csv(
    caminho_nat,
    sep=";",
    header=None,
    names=["codigo", "descricao"],
    dtype=str,
    encoding="latin-1",
)

# Juntar com dados de empresas para obter descrição da natureza jurídica
df_empresas = df.merge(
    df_naturezas,
    left_on="natureza_juridica",
    right_on="codigo",
    how="left",
    suffixes=("", "_natureza"),
)

print(df_empresas[["razao_social", "descricao"]].head(10))
```

## Campos disponíveis

### Arquivo de Empresas (`Empresas*.zip`)

Os CSVs **não possuem cabeçalho**. As colunas são posicionais, na seguinte ordem:

| Posição | Campo | Tipo | Descrição |
|---|---|---|---|
| 0 | `cnpj_basico` | string(8) | CNPJ básico (8 primeiros dígitos) — identifica a empresa |
| 1 | `razao_social` | string | Razão social / nome empresarial |
| 2 | `natureza_juridica` | string(4) | Código da natureza jurídica (ver tabela `Naturezas.zip`) |
| 3 | `qualificacao_responsavel` | string(2) | Código da qualificação do responsável (ver tabela `Qualificacoes.zip`) |
| 4 | `capital_social` | string | Capital social da empresa (formato numérico com vírgula decimal) |
| 5 | `porte_empresa` | string(2) | Código do porte: `00`=Não informado, `01`=Micro empresa, `03`=Empresa de pequeno porte, `05`=Demais |
| 6 | `ente_federativo_responsavel` | string | Ente federativo responsável (preenchido apenas para naturezas jurídicas específicas) |

### Tabelas auxiliares

#### Naturezas jurídicas (`Naturezas.zip`)

| Posição | Campo | Tipo | Descrição |
|---|---|---|---|
| 0 | `codigo` | string(4) | Código da natureza jurídica |
| 1 | `descricao` | string | Descrição (ex: "Sociedade Empresária Limitada") |

#### CNAEs (`Cnaes.zip`)

| Posição | Campo | Tipo | Descrição |
|---|---|---|---|
| 0 | `codigo` | string(7) | Código CNAE (ex: "4711301") |
| 1 | `descricao` | string | Descrição da atividade econômica |

#### Qualificações (`Qualificacoes.zip`)

| Posição | Campo | Tipo | Descrição |
|---|---|---|---|
| 0 | `codigo` | string(2) | Código da qualificação |
| 1 | `descricao` | string | Descrição (ex: "Sócio-Administrador") |

## Cruzamentos possíveis

O CNPJ é o **campo-ponte mais importante** do ecossistema de dados abertos brasileiros. A Base CNPJ Completa permite cruzamentos com praticamente todas as outras fontes:

| Cruzamento | Fonte relacionada | Chave de ligação | Finalidade |
|---|---|---|---|
| Empresas x Contratos federais | [Portal da Transparência](/docs/apis/portais-centrais/portal-transparencia) | `CNPJ` | Identificar quem são as empresas que recebem dinheiro público |
| Empresas x Sanções | CGU — CEIS/CNEP | `CNPJ` | Verificar se empresa está impedida de contratar com o governo |
| Empresas x Doações eleitorais | TSE — Prestação de contas | `CNPJ` | Rastrear doações de empresas a campanhas eleitorais |
| Empresas x Sócios | [QSA — Quadro Societário](/docs/apis/receita-federal/qsa) | `CNPJ básico` | Identificar sócios e administradores de cada empresa |
| Empresas x Estabelecimentos | [Estabelecimentos](/docs/apis/receita-federal/estabelecimentos) | `CNPJ básico` | Localizar matrizes e filiais, endereços, telefones e e-mails |
| Empresas x Simples/MEI | [Simples Nacional/MEI](/docs/apis/receita-federal/simples-nacional) | `CNPJ básico` | Verificar opção pelo Simples Nacional ou enquadramento MEI |
| Empresas x Instituições financeiras | [IFData — BCB](/docs/apis/banco-central/ifdata) | `CNPJ` | Cruzar dados cadastrais com informações financeiras de bancos |
| Empresas x Dados abertos | [Base dos Dados](/docs/apis/portais-centrais/base-dos-dados) | `CNPJ` | Consultar dados tratados e padronizados da base CNPJ |
| Empresas x Licitações | ComprasNet / PNCP | `CNPJ` | Verificar participação em licitações públicas |
| Empresas x CVM | CVM — Companhias abertas | `CNPJ` | Identificar empresas de capital aberto e seus demonstrativos |

### Exemplo de cruzamento: Empresas x Portal da Transparência

```python
import pandas as pd
import requests

API_KEY = "SEU_TOKEN_AQUI"
BASE_URL = "https://api.portaldatransparencia.gov.br/api-de-dados"
headers = {"chave-api-dados": API_KEY, "Accept": "application/json"}

# 1. Carregar base de empresas (previamente baixada)
df_empresas = pd.read_csv(
    "dados_rfb/Empresas0.csv",
    sep=";",
    header=None,
    names=["cnpj_basico", "razao_social", "natureza_juridica",
           "qualificacao_responsavel", "capital_social",
           "porte_empresa", "ente_federativo_responsavel"],
    dtype=str,
    encoding="latin-1",
)

# 2. Consultar contratos de uma empresa específica no Portal da Transparência
cnpj_completo = "00000000000191"  # Banco do Brasil
resp = requests.get(
    f"{BASE_URL}/contratos",
    headers=headers,
    params={"cnpjContratado": cnpj_completo, "pagina": 1},
)
contratos = pd.DataFrame(resp.json())

# 3. Enriquecer contratos com dados cadastrais da empresa
cnpj_basico = cnpj_completo[:8]
dados_empresa = df_empresas[df_empresas["cnpj_basico"] == cnpj_basico]

if not dados_empresa.empty and not contratos.empty:
    empresa = dados_empresa.iloc[0]
    print(f"Empresa: {empresa['razao_social']}")
    print(f"Natureza Jurídica: {empresa['natureza_juridica']}")
    print(f"Capital Social: R$ {empresa['capital_social']}")
    print(f"Contratos encontrados: {len(contratos)}")
```

## Limitações conhecidas

| Limitação | Detalhes |
|---|---|
| **Arquivos muito grandes** | O conjunto completo ocupa ~5 GB compactado e ~20 GB+ descompactado. Requer boa capacidade de armazenamento e memória RAM para processamento. |
| **Sem cabeçalho nos CSVs** | Os arquivos CSV não possuem linha de cabeçalho. É necessário consultar o `layout_dados_abertos_cnpj.pdf` ou esta documentação para mapear as colunas. |
| **Encoding Latin-1** | Os arquivos usam encoding ISO-8859-1 (Latin-1), não UTF-8. É necessário especificar `encoding="latin-1"` ao ler os dados. |
| **Capital social como texto** | O campo de capital social é armazenado como string com vírgula como separador decimal (ex: `"1000000,00"`). Requer conversão manual para numérico. |
| **Atraso na atualização** | Embora a atualização seja mensal, pode haver atraso de 30 a 60 dias entre o cadastro/alteração na Receita e a publicação nos dados abertos. |
| **Sem API de consulta individual** | Não existe API REST para consultar um CNPJ específico. É necessário baixar todo o conjunto de dados e fazer a busca localmente. |
| **Divisão em múltiplos arquivos** | Os dados são particionados em 10 arquivos (Empresas0 a Empresas9), sem critério documentado de distribuição. Uma empresa pode estar em qualquer partição. |
| **Mudanças no layout** | A Receita Federal pode alterar o layout dos dados sem aviso prévio. Sempre verifique o PDF de layout antes de processar uma nova versão. |
| **Disponibilidade do servidor** | O servidor `dados.rfb.gov.br` pode apresentar lentidão ou indisponibilidade, especialmente nos dias imediatamente após a publicação de uma nova versão mensal. |
| **Dados históricos limitados** | Apenas o *snapshot* mais recente é disponibilizado. Não há séries históricas — se precisar de dados anteriores, é necessário manter backups próprios. |
