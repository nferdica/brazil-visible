---
title: Estabelecimentos
slug: estabelecimentos
orgao: Receita Federal
url_base: https://www.gov.br/receitafederal/dados
tipo_acesso: CSV Download
autenticacao: Não requerida
formato_dados: [CSV]
frequencia_atualizacao: Mensal
campos_chave: [CNPJ básico, CNPJ ordem, CNPJ DV, CNAE fiscal, CEP, UF, município, telefone, email]
tags:
  - estabelecimentos
  - cnpj
  - matrizes
  - filiais
  - endereço
  - telefone
  - email
  - CNAE
  - geolocalização
cruzamento_com:
  - cnpj-completa
  - qsa
  - simples-nacional
  - portal-transparencia
  - base-dos-dados
status: documentado
---

# Estabelecimentos

## O que é

O dataset de **Estabelecimentos** contém os dados completos de todos os estabelecimentos (matrizes e filiais) de todas as empresas registradas no Brasil, disponibilizado pela **Receita Federal do Brasil (RFB)** como dados abertos. Os arquivos `Estabelecimentos*.zip` incluem o **CNPJ completo** (14 dígitos), endereço, telefones, e-mail, CNAE (atividade econômica), situação cadastral e data de início de atividades.

Enquanto o arquivo de [Empresas](/docs/apis/receita-federal/cnpj-completa) contém apenas o CNPJ básico (8 dígitos) e dados da empresa como um todo, o arquivo de Estabelecimentos contém cada **unidade operacional** (matriz ou filial), com seu CNPJ completo e dados de localização. Uma mesma empresa pode ter dezenas ou centenas de estabelecimentos.

Este dataset e o maior em volume da base CNPJ, sendo essencial para **geolocalização de empresas**, análise de distribuição geográfica de atividades econômicas e obtenção de dados de contato (telefone e e-mail).

**Fonte oficial:** https://arquivos.receitafederal.gov.br/dados/cnpj/dados_abertos_cnpj/

**Documentação do layout:** `layout_dados_abertos_cnpj.pdf` disponível na mesma URL base.

## Como acessar

| Item | Detalhe |
|---|---|
| **URL base** | `https://arquivos.receitafederal.gov.br/dados/cnpj/dados_abertos_cnpj/` |
| **Tipo de acesso** | Download direto de arquivos ZIP |
| **Autenticação** | Não requerida |
| **Formato** | CSV (sem cabeçalho, delimitado por `;`, encoding Latin-1/ISO-8859-1) |
| **Tamanho** | ~4 GB compactado (~15 GB+ descompactado, dividido em múltiplos arquivos) |

### Arquivos disponíveis

Os dados de estabelecimentos são divididos em múltiplos arquivos numerados:

- `Estabelecimentos0.zip` a `Estabelecimentos9.zip` — dados particionados

Cada arquivo ZIP contém um CSV sem cabeçalho. As colunas são posicionais e seguem o layout documentado pela Receita Federal.

### Download direto

```
https://arquivos.receitafederal.gov.br/dados/cnpj/dados_abertos_cnpj/Estabelecimentos0.zip
https://arquivos.receitafederal.gov.br/dados/cnpj/dados_abertos_cnpj/Estabelecimentos1.zip
...
https://arquivos.receitafederal.gov.br/dados/cnpj/dados_abertos_cnpj/Estabelecimentos9.zip
```

## Endpoints/recursos principais

| Arquivo | Conteúdo | Tamanho aprox. |
|---|---|---|
| `Estabelecimentos0.zip` a `Estabelecimentos9.zip` | Dados de todos os estabelecimentos (CNPJ completo, endereço, contato, CNAE) | ~400-600 MB cada |
| `Cnaes.zip` | Tabela auxiliar de atividades econômicas (CNAE) | ~50 KB |
| `Municipios.zip` | Tabela auxiliar de municípios | ~15 KB |
| `Motivos.zip` | Tabela auxiliar de motivos de situação cadastral | ~5 KB |
| `Paises.zip` | Tabela auxiliar de países | ~5 KB |

### Tabelas auxiliares necessárias

| Arquivo | Descrição | Uso |
|---|---|---|
| `Cnaes.zip` | Códigos CNAE (Classificação Nacional de Atividades Econômicas) | Decodificar `cnae_fiscal` e CNAEs secundários |
| `Municipios.zip` | Códigos de municípios da Receita Federal | Decodificar campo `municipio` |
| `Motivos.zip` | Motivos de situação cadastral | Decodificar campo `motivo_situacao_cadastral` |

## Exemplo de uso

### Download e leitura dos dados de estabelecimentos

```python
import requests
import zipfile
import pandas as pd
from io import BytesIO
from pathlib import Path

# Colunas do arquivo de Estabelecimentos conforme layout da Receita Federal
COLUNAS_ESTABELECIMENTOS = [
    "cnpj_basico",
    "cnpj_ordem",
    "cnpj_dv",
    "identificador_matriz_filial",
    "nome_fantasia",
    "situacao_cadastral",
    "data_situacao_cadastral",
    "motivo_situacao_cadastral",
    "nome_cidade_exterior",
    "pais",
    "data_inicio_atividade",
    "cnae_fiscal",
    "cnae_fiscal_secundaria",
    "tipo_logradouro",
    "logradouro",
    "numero",
    "complemento",
    "bairro",
    "cep",
    "uf",
    "municipio",
    "ddd_1",
    "telefone_1",
    "ddd_2",
    "telefone_2",
    "ddd_fax",
    "fax",
    "correio_eletronico",
    "situacao_especial",
    "data_situacao_especial",
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


# Baixar o primeiro arquivo de estabelecimentos
url = "https://arquivos.receitafederal.gov.br/dados/cnpj/dados_abertos_cnpj/Estabelecimentos0.zip"
caminho_csv = baixar_e_extrair(url, Path("./dados_rfb"))

# Ler o CSV (sem cabeçalho, separador ";", encoding Latin-1)
df_estab = pd.read_csv(
    caminho_csv,
    sep=";",
    header=None,
    names=COLUNAS_ESTABELECIMENTOS,
    dtype=str,
    encoding="latin-1",
)

print(f"Registros carregados: {len(df_estab):,}")
print(df_estab.head())
```

### Montar o CNPJ completo e consultar um estabelecimento

```python
def montar_cnpj(row: pd.Series) -> str:
    """Monta o CNPJ completo (14 dígitos) a partir dos componentes."""
    return (
        row["cnpj_basico"].zfill(8)
        + row["cnpj_ordem"].zfill(4)
        + row["cnpj_dv"].zfill(2)
    )


# Adicionar coluna de CNPJ completo
df_estab["cnpj_completo"] = df_estab.apply(montar_cnpj, axis=1)

# Consultar estabelecimentos de uma empresa específica
cnpj_basico = "00000000"  # Banco do Brasil
estabelecimentos = df_estab[df_estab["cnpj_basico"] == cnpj_basico.zfill(8)]

print(f"Estabelecimentos encontrados: {len(estabelecimentos)}")
for _, est in estabelecimentos.head(5).iterrows():
    tipo = "Matriz" if est["identificador_matriz_filial"] == "1" else "Filial"
    print(f"  [{tipo}] CNPJ: {est['cnpj_completo']}")
    print(f"    {est['logradouro']}, {est['numero']} - {est['bairro']}")
    print(f"    {est['uf']} - CEP: {est['cep']}")
    print(f"    Tel: ({est['ddd_1']}) {est['telefone_1']}")
    print(f"    Email: {est['correio_eletronico']}")
    print()
```

### Filtrar estabelecimentos por UF e CNAE

```python
def filtrar_por_uf_cnae(
    df: pd.DataFrame, uf: str, cnae: str, apenas_ativos: bool = True
) -> pd.DataFrame:
    """
    Filtra estabelecimentos por UF e CNAE fiscal.

    Args:
        df: DataFrame de estabelecimentos
        uf: Sigla da UF (ex: 'SP', 'RJ')
        cnae: Código CNAE fiscal (ex: '4711301' para comércio varejista)
        apenas_ativos: Se True, retorna apenas situação cadastral '02' (Ativo)

    Returns:
        DataFrame filtrado
    """
    mask = (df["uf"] == uf) & (df["cnae_fiscal"] == cnae)
    if apenas_ativos:
        mask = mask & (df["situacao_cadastral"] == "02")
    return df[mask]


# Exemplo: supermercados ativos em São Paulo
supermercados_sp = filtrar_por_uf_cnae(df_estab, "SP", "4711301")
print(f"Supermercados ativos em SP: {len(supermercados_sp):,}")
```

### Análise geográfica por UF

```python
# Distribuição de estabelecimentos ativos por UF
ativos = df_estab[df_estab["situacao_cadastral"] == "02"]
distribuicao = (
    ativos.groupby("uf")
    .size()
    .reset_index(name="total")
    .sort_values("total", ascending=False)
)

print("Estabelecimentos ativos por UF (top 10):")
print(distribuicao.head(10).to_string(index=False))

# Distribuição por tipo (matriz vs filial)
tipo_map = {"1": "Matriz", "2": "Filial"}
ativos["tipo"] = ativos["identificador_matriz_filial"].map(tipo_map)
print(f"\nDistribuição Matriz/Filial:")
print(ativos["tipo"].value_counts())
```

### Decodificar CNAE usando tabela auxiliar

```python
# Baixar e ler tabela de CNAEs
url_cnaes = "https://arquivos.receitafederal.gov.br/dados/cnpj/dados_abertos_cnpj/Cnaes.zip"
caminho_cnaes = baixar_e_extrair(url_cnaes, Path("./dados_rfb"))

df_cnaes = pd.read_csv(
    caminho_cnaes,
    sep=";",
    header=None,
    names=["codigo", "descricao"],
    dtype=str,
    encoding="latin-1",
)

# Top 10 atividades econômicas mais frequentes
top_cnaes = (
    df_estab[df_estab["situacao_cadastral"] == "02"]
    .groupby("cnae_fiscal")
    .size()
    .reset_index(name="total")
    .sort_values("total", ascending=False)
    .head(10)
    .merge(df_cnaes, left_on="cnae_fiscal", right_on="codigo", how="left")
)

print("Top 10 atividades econômicas (CNAE):")
for _, row in top_cnaes.iterrows():
    print(f"  {row['cnae_fiscal']} - {row['descricao']}: {row['total']:,}")
```

## Campos disponíveis

### Arquivo de Estabelecimentos (`Estabelecimentos*.zip`)

Os CSVs **não possuem cabeçalho**. As colunas são posicionais, na seguinte ordem:

| Posição | Campo | Tipo | Descrição |
|---|---|---|---|
| 0 | `cnpj_basico` | string(8) | CNPJ básico (8 primeiros dígitos) — identifica a empresa |
| 1 | `cnpj_ordem` | string(4) | CNPJ ordem (4 dígitos) — identifica o estabelecimento (`0001`=Matriz) |
| 2 | `cnpj_dv` | string(2) | CNPJ dígito verificador (2 dígitos) |
| 3 | `identificador_matriz_filial` | string(1) | `1`=Matriz, `2`=Filial |
| 4 | `nome_fantasia` | string | Nome fantasia do estabelecimento |
| 5 | `situacao_cadastral` | string(2) | Código da situação: `01`=Nula, `02`=Ativa, `03`=Suspensa, `04`=Inapta, `08`=Baixada |
| 6 | `data_situacao_cadastral` | string(8) | Data da situação cadastral (formato `YYYYMMDD`) |
| 7 | `motivo_situacao_cadastral` | string(2) | Código do motivo (ver tabela `Motivos.zip`) |
| 8 | `nome_cidade_exterior` | string | Nome da cidade no exterior (apenas para empresas no exterior) |
| 9 | `pais` | string(3) | Código do país (ver tabela `Paises.zip`) |
| 10 | `data_inicio_atividade` | string(8) | Data de início de atividade (formato `YYYYMMDD`) |
| 11 | `cnae_fiscal` | string(7) | Código CNAE fiscal principal (atividade econômica principal) |
| 12 | `cnae_fiscal_secundaria` | string | Códigos CNAE secundários (separados por vírgula) |
| 13 | `tipo_logradouro` | string | Tipo de logradouro (Rua, Avenida, etc.) |
| 14 | `logradouro` | string | Nome do logradouro |
| 15 | `numero` | string | Número do endereço |
| 16 | `complemento` | string | Complemento do endereço |
| 17 | `bairro` | string | Bairro |
| 18 | `cep` | string(8) | CEP (sem formatação) |
| 19 | `uf` | string(2) | Sigla da Unidade Federativa |
| 20 | `municipio` | string(4) | Código do município (ver tabela `Municipios.zip`) |
| 21 | `ddd_1` | string(4) | DDD do telefone principal |
| 22 | `telefone_1` | string(8) | Número do telefone principal |
| 23 | `ddd_2` | string(4) | DDD do telefone secundário |
| 24 | `telefone_2` | string(8) | Número do telefone secundário |
| 25 | `ddd_fax` | string(4) | DDD do fax |
| 26 | `fax` | string(8) | Número do fax |
| 27 | `correio_eletronico` | string | Endereço de e-mail do estabelecimento |
| 28 | `situacao_especial` | string | Descrição da situação especial (se houver) |
| 29 | `data_situacao_especial` | string(8) | Data da situação especial (formato `YYYYMMDD`) |

### Valores do campo `situacao_cadastral`

| Código | Situação | Descrição |
|---|---|---|
| `01` | Nula | Cadastro nulo |
| `02` | Ativa | Empresa em funcionamento normal |
| `03` | Suspensa | Atividades temporariamente suspensas |
| `04` | Inapta | Empresa inapta por irregularidades |
| `08` | Baixada | CNPJ encerrado definitivamente |

### Composição do CNPJ completo

O CNPJ completo (14 dígitos) é formado pela concatenação de três campos:

```
CNPJ Completo = cnpj_basico (8) + cnpj_ordem (4) + cnpj_dv (2)
Exemplo:       00000000         + 0001         + 91
Resultado:     00000000000191
```

- **cnpj_basico**: identifica a empresa
- **cnpj_ordem**: identifica o estabelecimento (`0001` = matriz)
- **cnpj_dv**: dígito verificador

## Cruzamentos possíveis

| Cruzamento | Fonte relacionada | Chave de ligação | Finalidade |
|---|---|---|---|
| Estabelecimentos x Dados cadastrais | [Base CNPJ Completa](/docs/apis/receita-federal/cnpj-completa) | `CNPJ básico` | Obter razão social, natureza jurídica e capital social |
| Estabelecimentos x Sócios | [QSA — Quadro Societário](/docs/apis/receita-federal/qsa) | `CNPJ básico` | Identificar sócios de cada estabelecimento |
| Estabelecimentos x Simples/MEI | [Simples Nacional/MEI](/docs/apis/receita-federal/simples-nacional) | `CNPJ básico` | Verificar regime tributário |
| Estabelecimentos x Contratos | [Portal da Transparência](/docs/apis/portais-centrais/portal-transparencia) | `CNPJ completo` | Localizar geograficamente empresas contratadas pelo governo |
| Estabelecimentos x Sanções | CGU — CEIS/CNEP | `CNPJ completo` | Geolocalizar empresas sancionadas |
| Estabelecimentos x Licitações | ComprasNet / PNCP | `CNPJ completo` | Mapear localização de fornecedores do governo |
| Estabelecimentos x Dados geográficos | IBGE — Malhas municipais | `UF` + `Município` / `CEP` | Análise espacial de distribuição de empresas |
| Estabelecimentos x Dados tratados | [Base dos Dados](/docs/apis/portais-centrais/base-dos-dados) | `CNPJ` | Consultar dados padronizados e geocodificados |

### Exemplo de cruzamento: Estabelecimentos x CNPJ Completa x QSA

```python
import pandas as pd

# Carregar dados (previamente baixados)
df_estab = pd.read_csv(
    "dados_rfb/Estabelecimentos0.csv",
    sep=";", header=None,
    names=["cnpj_basico", "cnpj_ordem", "cnpj_dv",
           "identificador_matriz_filial", "nome_fantasia",
           "situacao_cadastral", "data_situacao_cadastral",
           "motivo_situacao_cadastral", "nome_cidade_exterior",
           "pais", "data_inicio_atividade", "cnae_fiscal",
           "cnae_fiscal_secundaria", "tipo_logradouro", "logradouro",
           "numero", "complemento", "bairro", "cep", "uf", "municipio",
           "ddd_1", "telefone_1", "ddd_2", "telefone_2",
           "ddd_fax", "fax", "correio_eletronico",
           "situacao_especial", "data_situacao_especial"],
    dtype=str, encoding="latin-1",
)

df_empresas = pd.read_csv(
    "dados_rfb/Empresas0.csv",
    sep=";", header=None,
    names=["cnpj_basico", "razao_social", "natureza_juridica",
           "qualificacao_responsavel", "capital_social",
           "porte_empresa", "ente_federativo_responsavel"],
    dtype=str, encoding="latin-1",
)

df_socios = pd.read_csv(
    "dados_rfb/Socios0.csv",
    sep=";", header=None,
    names=["cnpj_basico", "identificador_socio", "nome_socio_razao_social",
           "cpf_cnpj_socio", "qualificacao_socio", "data_entrada_sociedade",
           "pais", "representante_legal", "nome_representante",
           "qualificacao_representante_legal", "faixa_etaria"],
    dtype=str, encoding="latin-1",
)

# Filtrar matrizes ativas em uma UF
matrizes_sp = df_estab[
    (df_estab["uf"] == "SP") &
    (df_estab["identificador_matriz_filial"] == "1") &
    (df_estab["situacao_cadastral"] == "02")
].head(100)

# Enriquecer com dados cadastrais
matrizes_enriquecidas = matrizes_sp.merge(
    df_empresas[["cnpj_basico", "razao_social", "capital_social"]],
    on="cnpj_basico",
    how="left",
)

# Adicionar contagem de sócios
contagem_socios = (
    df_socios.groupby("cnpj_basico")
    .size()
    .reset_index(name="num_socios")
)
matrizes_enriquecidas = matrizes_enriquecidas.merge(
    contagem_socios, on="cnpj_basico", how="left"
)

print("Matrizes ativas em SP (com dados cadastrais e sócios):")
print(matrizes_enriquecidas[[
    "cnpj_basico", "razao_social", "cnae_fiscal",
    "bairro", "capital_social", "num_socios"
]].head(10))
```

## Limitações conhecidas

| Limitação | Detalhes |
|---|---|
| **Maior dataset da base CNPJ** | O conjunto de estabelecimentos ocupa ~4 GB compactado e ~15 GB+ descompactado. Requer significativa capacidade de armazenamento e memória. |
| **Sem cabeçalho nos CSVs** | Os arquivos CSV não possuem linha de cabeçalho. Consultar o `layout_dados_abertos_cnpj.pdf` para mapear as colunas. |
| **Encoding Latin-1** | Os arquivos usam encoding ISO-8859-1 (Latin-1). Especificar `encoding="latin-1"` ao ler os dados. |
| **Código de município proprietário** | O campo `municipio` usa um código interno da Receita Federal, diferente do código IBGE. A conversão requer a tabela `Municipios.zip`. |
| **Sem coordenadas geográficas** | Os dados incluem endereço textual, mas não latitude/longitude. Para geocodificação, é necessário usar serviços externos. |
| **E-mails podem estar desatualizados** | Muitas empresas não atualizam o e-mail cadastrado na Receita Federal, resultando em endereços inválidos. |
| **Telefones sem formatação padronizada** | DDD e número são armazenados em campos separados. Alguns registros contêm telefones incompletos ou inválidos. |
| **CNAEs secundários em campo único** | O campo `cnae_fiscal_secundaria` contém múltiplos códigos CNAE separados por vírgula em um único campo texto, exigindo parsing adicional. |
| **Divisão em múltiplos arquivos** | Os dados são particionados em 10 arquivos sem critério documentado. Os estabelecimentos de uma mesma empresa podem estar em qualquer partição. |
| **Atraso na atualização** | Atualização mensal com possível atraso de 30 a 60 dias em relação a alterações cadastrais. |
| **Dados históricos limitados** | Apenas o snapshot mais recente é disponibilizado. Para análise temporal, é necessário manter backups próprios de cada mês. |
| **Situação cadastral desatualizada** | Alguns estabelecimentos podem aparecer como "Ativo" mesmo já tendo encerrado atividades, caso o titular não tenha comunicado a Receita Federal. |
| **CNPJ alfanumérico (julho 2026)** | A partir de julho de 2026, novos CNPJs poderão conter letras além de números. Scripts que validam CNPJ como campo numérico de 14 dígitos precisarão ser atualizados. |
