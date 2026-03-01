---
title: QSA — Quadro Societário
slug: qsa
orgao: Receita Federal
url_base: https://dados.rfb.gov.br/CNPJ/
tipo_acesso: CSV Download
autenticacao: Não requerida
formato_dados: [CSV]
frequencia_atualizacao: Mensal
campos_chave: [CNPJ básico, CPF/CNPJ do sócio, nome do sócio, qualificação do sócio]
tags:
  - sócios
  - quadro societário
  - QSA
  - cnpj
  - cpf
  - administradores
  - representante legal
  - participação societária
cruzamento_com:
  - cnpj-completa
  - estabelecimentos
  - simples-nacional
  - portal-transparencia
  - base-dos-dados
status: documentado
---

# QSA — Quadro Societário

## O que é

O **QSA (Quadro de Sócios e Administradores)** é o conjunto de dados que identifica todas as pessoas físicas e jurídicas que compõem a sociedade de cada empresa registrada no Brasil. Disponibilizado pela **Receita Federal do Brasil (RFB)** como dados abertos, os arquivos `Socios*.zip` contêm informações sobre sócios, administradores e representantes legais de todas as empresas com CNPJ ativo ou inativo.

Este é um dos datasets mais poderosos para análise de **redes de relacionamento empresarial**, permitindo mapear a estrutura societária de empresas, identificar sócios em comum entre diferentes CNPJs e rastrear vínculos entre pessoas físicas (CPF) e empresas (CNPJ).

**Fonte oficial:** https://dados.rfb.gov.br/CNPJ/

**Documentação do layout:** `layout_dados_abertos_cnpj.pdf` disponível na mesma URL base.

## Como acessar

| Item | Detalhe |
|---|---|
| **URL base** | `https://dados.rfb.gov.br/CNPJ/` |
| **Tipo de acesso** | Download direto de arquivos ZIP |
| **Autenticação** | Não requerida |
| **Formato** | CSV (sem cabeçalho, delimitado por `;`, encoding Latin-1/ISO-8859-1) |
| **Tamanho** | ~500 MB compactado (~2,5 GB descompactado, dividido em múltiplos arquivos) |

### Arquivos disponíveis

Os dados do QSA são divididos em múltiplos arquivos numerados:

- `Socios0.zip` a `Socios9.zip` — dados do quadro societário particionados

Cada arquivo ZIP contém um CSV sem cabeçalho. As colunas são posicionais e seguem o layout documentado pela Receita Federal.

### Download direto

```
https://dados.rfb.gov.br/CNPJ/Socios0.zip
https://dados.rfb.gov.br/CNPJ/Socios1.zip
...
https://dados.rfb.gov.br/CNPJ/Socios9.zip
```

## Endpoints/recursos principais

| Arquivo | Conteúdo | Tamanho aprox. |
|---|---|---|
| `Socios0.zip` a `Socios9.zip` | Dados dos sócios/administradores de todas as empresas | ~50-80 MB cada |
| `Qualificacoes.zip` | Tabela auxiliar de qualificações de sócios | ~1 KB |
| `Paises.zip` | Tabela auxiliar de países (para sócios estrangeiros) | ~5 KB |

### Tabelas auxiliares necessárias

| Arquivo | Descrição | Uso |
|---|---|---|
| `Qualificacoes.zip` | Códigos de qualificação de sócios | Decodificar campo `qualificacao_socio` e `qualificacao_representante_legal` |
| `Paises.zip` | Códigos de países | Decodificar campo `pais` de sócios estrangeiros |

## Exemplo de uso

### Download e leitura dos dados de sócios

```python
import requests
import zipfile
import pandas as pd
from io import BytesIO
from pathlib import Path

# Colunas do arquivo de Sócios conforme layout da Receita Federal
COLUNAS_SOCIOS = [
    "cnpj_basico",
    "identificador_socio",
    "nome_socio_razao_social",
    "cpf_cnpj_socio",
    "qualificacao_socio",
    "data_entrada_sociedade",
    "pais",
    "representante_legal",
    "nome_representante",
    "qualificacao_representante_legal",
    "faixa_etaria",
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


# Baixar o primeiro arquivo de sócios (Socios0.zip)
url = "https://dados.rfb.gov.br/CNPJ/Socios0.zip"
caminho_csv = baixar_e_extrair(url, Path("./dados_rfb"))

# Ler o CSV (sem cabeçalho, separador ";", encoding Latin-1)
df_socios = pd.read_csv(
    caminho_csv,
    sep=";",
    header=None,
    names=COLUNAS_SOCIOS,
    dtype=str,
    encoding="latin-1",
)

print(f"Registros carregados: {len(df_socios):,}")
print(df_socios.head())
```

### Consultar sócios de uma empresa

```python
def consultar_socios(df: pd.DataFrame, cnpj_basico: str) -> pd.DataFrame:
    """
    Retorna os sócios e administradores de uma empresa.

    Args:
        df: DataFrame com os dados de sócios
        cnpj_basico: 8 primeiros dígitos do CNPJ

    Returns:
        DataFrame com os sócios da empresa
    """
    return df[df["cnpj_basico"] == cnpj_basico.zfill(8)]


# Exemplo: consultar sócios de uma empresa
socios = consultar_socios(df_socios, "00000000")
for _, socio in socios.iterrows():
    tipo = "PJ" if socio["identificador_socio"] == "1" else "PF"
    print(f"  [{tipo}] {socio['nome_socio_razao_social']} "
          f"(Qualif: {socio['qualificacao_socio']}, "
          f"Entrada: {socio['data_entrada_sociedade']})")
```

### Mapear rede societária de uma pessoa

```python
def encontrar_empresas_por_socio(df: pd.DataFrame, nome_socio: str) -> pd.DataFrame:
    """
    Encontra todas as empresas em que uma pessoa aparece como sócia.
    Útil para análise de redes de relacionamento empresarial.

    Args:
        df: DataFrame com os dados de sócios
        nome_socio: Nome (ou parte do nome) do sócio

    Returns:
        DataFrame com as empresas encontradas
    """
    mask = df["nome_socio_razao_social"].str.contains(
        nome_socio, case=False, na=False
    )
    return df[mask][["cnpj_basico", "nome_socio_razao_social",
                      "qualificacao_socio", "data_entrada_sociedade"]]


# Encontrar todas as empresas de um determinado sócio
empresas = encontrar_empresas_por_socio(df_socios, "NOME DO SOCIO")
print(f"Empresas encontradas: {len(empresas)}")
print(empresas.head(10))
```

### Decodificar qualificações usando tabela auxiliar

```python
# Baixar tabela de qualificações
url_qualif = "https://dados.rfb.gov.br/CNPJ/Qualificacoes.zip"
caminho_qualif = baixar_e_extrair(url_qualif, Path("./dados_rfb"))

df_qualificacoes = pd.read_csv(
    caminho_qualif,
    sep=";",
    header=None,
    names=["codigo", "descricao"],
    dtype=str,
    encoding="latin-1",
)

# Juntar para obter descrição da qualificação
df_socios_decodificado = df_socios.merge(
    df_qualificacoes,
    left_on="qualificacao_socio",
    right_on="codigo",
    how="left",
    suffixes=("", "_qualif"),
)

print(df_socios_decodificado[
    ["cnpj_basico", "nome_socio_razao_social", "descricao"]
].head(10))
```

## Campos disponíveis

### Arquivo de Sócios (`Socios*.zip`)

Os CSVs **não possuem cabeçalho**. As colunas são posicionais, na seguinte ordem:

| Posição | Campo | Tipo | Descrição |
|---|---|---|---|
| 0 | `cnpj_basico` | string(8) | CNPJ básico da empresa (8 primeiros dígitos) |
| 1 | `identificador_socio` | string(1) | Tipo do sócio: `1`=Pessoa jurídica, `2`=Pessoa física, `3`=Estrangeiro |
| 2 | `nome_socio_razao_social` | string | Nome do sócio (PF) ou razão social (PJ) |
| 3 | `cpf_cnpj_socio` | string | CPF (PF) ou CNPJ (PJ) do sócio. CPFs são parcialmente ocultados (`***000000**`) |
| 4 | `qualificacao_socio` | string(2) | Código da qualificação do sócio (ver tabela `Qualificacoes.zip`) |
| 5 | `data_entrada_sociedade` | string(8) | Data de entrada na sociedade (formato `YYYYMMDD`) |
| 6 | `pais` | string(3) | Código do país do sócio estrangeiro (ver tabela `Paises.zip`) |
| 7 | `representante_legal` | string | CPF do representante legal (quando aplicável) |
| 8 | `nome_representante` | string | Nome do representante legal |
| 9 | `qualificacao_representante_legal` | string(2) | Código da qualificação do representante legal |
| 10 | `faixa_etaria` | string(1) | Faixa etária do sócio PF: `0`=Não se aplica, `1`=0-12, `2`=13-20, `3`=21-30, `4`=31-40, `5`=41-50, `6`=51-60, `7`=61-70, `8`=71-80, `9`=80+ |

### Tabela de Qualificações (`Qualificacoes.zip`)

| Posição | Campo | Tipo | Descrição |
|---|---|---|---|
| 0 | `codigo` | string(2) | Código da qualificação |
| 1 | `descricao` | string | Descrição (ex: "Sócio-Administrador", "Diretor", "Presidente") |

Exemplos de qualificações comuns:
- `05` — Administrador
- `10` — Diretor
- `16` — Presidente
- `22` — Sócio
- `49` — Sócio-Administrador

## Cruzamentos possíveis

O QSA conecta **pessoas (CPF)** a **empresas (CNPJ)**, sendo a peça central para análise de redes de relacionamento:

| Cruzamento | Fonte relacionada | Chave de ligação | Finalidade |
|---|---|---|---|
| Sócios x Dados cadastrais | [Base CNPJ Completa](/docs/apis/receita-federal/cnpj-completa) | `CNPJ básico` | Obter razão social, natureza jurídica e capital social das empresas dos sócios |
| Sócios x Estabelecimentos | [Estabelecimentos](/docs/apis/receita-federal/estabelecimentos) | `CNPJ básico` | Localizar endereços e contatos das empresas dos sócios |
| Sócios x Contratos públicos | [Portal da Transparência](/docs/apis/portais-centrais/portal-transparencia) | `CNPJ` | Verificar se empresas de determinados sócios recebem contratos públicos |
| Sócios x Doações eleitorais | TSE — Prestação de contas | `CPF` / `CNPJ` | Rastrear se sócios de empresas contratadas pelo governo fizeram doações a campanhas |
| Sócios x Sanções | CGU — CEIS/CNEP | `CNPJ` | Verificar se empresas de determinados sócios foram sancionadas |
| Sócios x Candidaturas | TSE — Candidaturas | `CPF` | Verificar se sócios de empresas são candidatos a cargos eletivos |
| Sócios x Servidores públicos | Portal da Transparência — Servidores | `CPF` | Identificar servidores públicos que são sócios de empresas |
| Sócios x Processos judiciais | CNJ — Processos | `CPF` / `CNPJ` | Cruzar sócios com processos judiciais |
| Sócios x Simples/MEI | [Simples Nacional/MEI](/docs/apis/receita-federal/simples-nacional) | `CNPJ básico` | Verificar regime tributário das empresas dos sócios |

### Exemplo de cruzamento: Mapear rede societária entre empresas contratadas pelo governo

```python
import pandas as pd

# Carregar dados de sócios (previamente baixados)
df_socios = pd.read_csv(
    "dados_rfb/Socios0.csv",
    sep=";", header=None, names=[
        "cnpj_basico", "identificador_socio", "nome_socio_razao_social",
        "cpf_cnpj_socio", "qualificacao_socio", "data_entrada_sociedade",
        "pais", "representante_legal", "nome_representante",
        "qualificacao_representante_legal", "faixa_etaria"
    ],
    dtype=str, encoding="latin-1",
)

# Lista de CNPJs de empresas contratadas pelo governo (obtida do Portal da Transparência)
cnpjs_contratados = ["12345678", "87654321", "11223344"]

# Filtrar sócios das empresas contratadas
socios_contratados = df_socios[
    df_socios["cnpj_basico"].isin(cnpjs_contratados)
]

# Encontrar sócios em comum (mesma pessoa em múltiplas empresas contratadas)
socios_duplicados = (
    socios_contratados
    .groupby("nome_socio_razao_social")["cnpj_basico"]
    .nunique()
    .reset_index()
    .rename(columns={"cnpj_basico": "num_empresas"})
)

socios_em_comum = socios_duplicados[socios_duplicados["num_empresas"] > 1]
print("Sócios presentes em múltiplas empresas contratadas:")
print(socios_em_comum.sort_values("num_empresas", ascending=False))
```

## Limitações conhecidas

| Limitação | Detalhes |
|---|---|
| **CPF parcialmente ocultado** | Os CPFs dos sócios pessoa física são parcialmente mascarados (`***000000**`) por determinação legal (LGPD), limitando cruzamentos diretos por CPF. O cruzamento por **nome** é possível, mas menos preciso. |
| **Sem cabeçalho nos CSVs** | Os arquivos CSV não possuem linha de cabeçalho. Consultar o `layout_dados_abertos_cnpj.pdf` para mapear as colunas. |
| **Encoding Latin-1** | Os arquivos usam encoding ISO-8859-1 (Latin-1). Especificar `encoding="latin-1"` ao ler os dados. |
| **Arquivos grandes** | O conjunto completo dos sócios ocupa ~500 MB compactado e ~2,5 GB descompactado. |
| **Dados não históricos** | Apenas o snapshot atual é publicado. Sócios que saíram da sociedade antes da data de extração não aparecem nos dados. |
| **Qualificação genérica** | Algumas qualificações são muito genéricas (ex: "Sócio"), não permitindo distinguir o papel real do sócio na empresa. |
| **Sócios estrangeiros** | Sócios estrangeiros podem ter dados incompletos (sem CPF/documento identificável). |
| **Sem percentual de participação** | Os dados não incluem o percentual de participação societária de cada sócio. |
| **Divisão em múltiplos arquivos** | Os dados são particionados em 10 arquivos sem critério documentado. Um sócio pode estar em qualquer partição. |
| **Faixa etária aproximada** | A faixa etária é informada em intervalos amplos (ex: 31-40), não sendo possível determinar a idade exata. |
