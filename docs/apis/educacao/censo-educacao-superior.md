---
title: Censo da Educação Superior
slug: censo-educacao-superior
orgao: INEP / MEC
url_base: https://www.gov.br/inep/pt-br/acesso-a-informacao/dados-abertos/microdados/censo-da-educacao-superior
tipo_acesso: CSV Download
autenticacao: Não requerida
formato_dados: [CSV]
frequencia_atualizacao: Anual
campos_chave: [código IES, código curso, código município, categoria administrativa, organização acadêmica, vagas, ingressos, matrículas, concluintes]
tags:
  - educação
  - ensino superior
  - universidades
  - faculdades
  - cursos
  - vagas
  - docentes
  - graduação
  - INEP
  - microdados
cruzamento_com:
  - censo-escolar
  - enem
  - fnde-repasses
  - receita-federal/cnpj-completa
  - ibge-estatisticas/censo-demografico
status: documentado
---

# Censo da Educação Superior

## O que é

O **Censo da Educação Superior** é o levantamento estatístico anual realizado pelo **Instituto Nacional de Estudos e Pesquisas Educacionais Anísio Teixeira (INEP/MEC)** que abrange todas as Instituições de Educação Superior (IES) do Brasil — universidades, centros universitários, faculdades e institutos federais — públicas e privadas.

Os microdados cobrem três dimensões principais:

- **Instituições de Educação Superior (IES)** — dados cadastrais, categoria administrativa (pública federal, estadual, municipal ou privada), organização acadêmica (universidade, centro universitário, faculdade), localização, mantenedora
- **Cursos** — dados de cada curso de graduação oferecido, incluindo área CINE (Classificação Internacional Normalizada da Educação), grau acadêmico (bacharelado, licenciatura, tecnólogo), modalidade (presencial/EAD), vagas oferecidas, inscritos, ingressos, matrículas e concluintes
- **Docentes** — dados dos professores do ensino superior, incluindo titulação (especialista, mestre, doutor), regime de trabalho (integral, parcial, horista), vínculo empregatício, sexo, idade

Esses dados são fundamentais para avaliação de políticas de expansão do ensino superior, análise da oferta de vagas, evolução da titulação docente e planejamento de investimentos em educação.

**Fonte oficial:** https://www.gov.br/inep/pt-br/acesso-a-informacao/dados-abertos/microdados/censo-da-educacao-superior

## Como acessar

| Item | Detalhe |
|---|---|
| **URL base** | `https://www.gov.br/inep/pt-br/acesso-a-informacao/dados-abertos/microdados/censo-da-educacao-superior` |
| **Tipo de acesso** | Download direto de arquivo ZIP |
| **Autenticação** | Não requerida |
| **Formato** | CSV (delimitado por `;` ou `|`, encoding Latin-1 ou UTF-8 dependendo do ano) |
| **Tamanho** | ~200-500 MB compactado (~1-3 GB descompactado) |

### Estrutura dos arquivos

Cada ano disponibiliza um arquivo ZIP contendo:

```
microdados_educacao_superior_AAAA/
├── dados/
│   ├── MICRODADOS_CADASTRO_IES_AAAA.CSV      # Dados das IES
│   ├── MICRODADOS_CADASTRO_CURSOS_AAAA.CSV    # Dados dos cursos
│   └── SUP_DOCENTE_AAAA.CSV                   # Dados dos docentes
├── anexos/
│   ├── DICIONARIO_DE_DADOS.xlsx               # Dicionário de dados
│   └── tabelas_auxiliares/
│       ├── TAB_AREA_CINE.xlsx                 # Áreas de conhecimento CINE
│       └── TAB_MUNICIPIO.xlsx                 # Tabela de municípios
├── leia-me/
│   └── leia-me.txt
└── inputs/
    └── INPUT_SAS_*.sas
```

> **Nota:** A nomenclatura e a estrutura dos diretórios podem variar entre os anos. Verifique o conteúdo do ZIP.

## Endpoints/recursos principais

Como se trata de download de arquivos (e não de uma API REST), os "recursos" são os próprios arquivos disponíveis:

| Arquivo | Conteúdo | Tamanho aprox. |
|---|---|---|
| `MICRODADOS_CADASTRO_IES_AAAA.CSV` | Dados de todas as IES do Brasil (~2.600 instituições) | ~5 MB |
| `MICRODADOS_CADASTRO_CURSOS_AAAA.CSV` | Dados de todos os cursos de graduação (~45.000 cursos) | ~50 MB |
| `SUP_DOCENTE_AAAA.CSV` | Dados de todos os docentes do ensino superior (~400.000 registros) | ~200 MB |
| `DICIONARIO_DE_DADOS.xlsx` | Descrição de todos os campos e códigos | ~500 KB |

### Download

```bash
# Exemplo de download (o link exato pode mudar a cada publicação)
wget "https://download.inep.gov.br/microdados/microdados_censo_da_educacao_superior_2023.zip"
```

## Exemplo de uso

### Leitura dos dados das IES

```python
import zipfile
import pandas as pd
from pathlib import Path

# Após baixar o ZIP da página do INEP
ZIP_PATH = Path("microdados_censo_da_educacao_superior_2023.zip")
DESTINO = Path("./dados_censo_superior")

# Extrair
with zipfile.ZipFile(ZIP_PATH, "r") as zf:
    zf.extractall(DESTINO)

# Localizar o arquivo de IES
arquivo_ies = list(DESTINO.rglob("*CADASTRO_IES*.CSV"))[0]

# Ler o CSV
df_ies = pd.read_csv(
    arquivo_ies,
    sep=";",
    encoding="latin-1",
    dtype=str,
    low_memory=False,
)

print(f"Total de IES: {len(df_ies):,}")
print(f"Colunas: {list(df_ies.columns[:10])}...")
print(df_ies.head())
```

### Análise de IES por categoria administrativa

```python
# TP_CATEGORIA_ADMINISTRATIVA:
# 1=Pública Federal, 2=Pública Estadual, 3=Pública Municipal,
# 4=Privada com fins lucrativos, 5=Privada sem fins lucrativos,
# 7=Especial (ex: SENAI, SESC)
categoria_map = {
    "1": "Pública Federal",
    "2": "Pública Estadual",
    "3": "Pública Municipal",
    "4": "Privada (com fins lucrativos)",
    "5": "Privada (sem fins lucrativos)",
    "7": "Especial",
}

contagem_ies = (
    df_ies["TP_CATEGORIA_ADMINISTRATIVA"]
    .map(categoria_map)
    .value_counts()
)

print("Quantidade de IES por categoria administrativa:")
print(contagem_ies.to_string())
```

### Análise de cursos e vagas

```python
# Carregar dados de cursos
arquivo_cursos = list(DESTINO.rglob("*CADASTRO_CURSOS*.CSV"))[0]

df_cursos = pd.read_csv(
    arquivo_cursos,
    sep=";",
    encoding="latin-1",
    dtype=str,
    low_memory=False,
)

# Converter campos numéricos
for col in ["QT_VAGAS_TOTAL", "QT_INSCRITO_TOTAL", "QT_INGRESSO_TOTAL",
            "QT_MATRICULA_TOTAL", "QT_CONCLUINTE_TOTAL"]:
    df_cursos[col] = pd.to_numeric(df_cursos[col], errors="coerce")

# Top 10 cursos com mais matrículas
top_cursos = (
    df_cursos.groupby("NO_CURSO")["QT_MATRICULA_TOTAL"]
    .sum()
    .sort_values(ascending=False)
    .head(10)
)

print("Top 10 cursos por total de matrículas:")
for curso, matriculas in top_cursos.items():
    print(f"  {curso}: {matriculas:,.0f}")
```

### Vagas por modalidade (presencial vs EAD)

```python
# TP_MODALIDADE_ENSINO: 1=Presencial, 2=EAD
modalidade_map = {"1": "Presencial", "2": "EAD"}

vagas_modalidade = (
    df_cursos.groupby("TP_MODALIDADE_ENSINO")
    .agg(
        vagas=("QT_VAGAS_TOTAL", "sum"),
        matriculas=("QT_MATRICULA_TOTAL", "sum"),
        concluintes=("QT_CONCLUINTE_TOTAL", "sum"),
    )
)

vagas_modalidade.index = vagas_modalidade.index.map(modalidade_map)
print("Vagas, matrículas e concluintes por modalidade:")
print(vagas_modalidade.to_string())
```

### Análise de docentes por titulação

```python
# Carregar dados de docentes
arquivo_docentes = list(DESTINO.rglob("*DOCENTE*.CSV"))[0]

df_docentes = pd.read_csv(
    arquivo_docentes,
    sep=";",
    encoding="latin-1",
    dtype=str,
    low_memory=False,
)

# TP_ESCOLARIDADE: 1=Sem graduação, 2=Graduação, 3=Especialização,
#                   4=Mestrado, 5=Doutorado
titulacao_map = {
    "1": "Sem graduação",
    "2": "Graduação",
    "3": "Especialização",
    "4": "Mestrado",
    "5": "Doutorado",
}

contagem_titulacao = (
    df_docentes["TP_ESCOLARIDADE"]
    .map(titulacao_map)
    .value_counts()
)

print("Docentes por titulação:")
for titulo, qtd in contagem_titulacao.items():
    pct = qtd / len(df_docentes) * 100
    print(f"  {titulo}: {qtd:,} ({pct:.1f}%)")
```

## Campos disponíveis

### Arquivo de IES (`MICRODADOS_CADASTRO_IES_AAAA.CSV`)

| Campo | Tipo | Descrição |
|---|---|---|
| `CO_IES` | int | Código identificador da IES (INEP) |
| `NO_IES` | string | Nome da IES |
| `SG_IES` | string | Sigla da IES |
| `CO_MANTENEDORA` | string | Código da mantenedora |
| `TP_CATEGORIA_ADMINISTRATIVA` | int | Categoria: 1=Federal, 2=Estadual, 3=Municipal, 4=Privada c/ fins, 5=Privada s/ fins |
| `TP_ORGANIZACAO_ACADEMICA` | int | Organização: 1=Universidade, 2=Centro Universitário, 3=Faculdade, 4=IF/CEFET |
| `CO_MUNICIPIO` | int | Código do município sede (IBGE) |
| `NO_MUNICIPIO` | string | Nome do município sede |
| `SG_UF` | string | Sigla da UF |
| `QT_DOC_TOTAL` | int | Quantidade total de docentes |
| `QT_DOC_EX_FEMI` | int | Quantidade de docentes do sexo feminino |
| `QT_DOC_EX_MASC` | int | Quantidade de docentes do sexo masculino |
| `IN_ACESSO_PORTAL_CAPES` | int | Acesso ao Portal de Periódicos CAPES (0/1) |

### Arquivo de Cursos (`MICRODADOS_CADASTRO_CURSOS_AAAA.CSV`)

| Campo | Tipo | Descrição |
|---|---|---|
| `CO_CURSO` | int | Código do curso |
| `NO_CURSO` | string | Nome do curso |
| `CO_IES` | int | Código da IES |
| `TP_GRAU_ACADEMICO` | int | Grau: 1=Bacharelado, 2=Licenciatura, 3=Tecnólogo, 4=Bacharelado e Licenciatura |
| `TP_MODALIDADE_ENSINO` | int | Modalidade: 1=Presencial, 2=EAD |
| `CO_CINE_AREA_GERAL` | string | Código CINE da área geral do curso |
| `NO_CINE_AREA_GERAL` | string | Nome da área geral CINE |
| `QT_VAGAS_TOTAL` | int | Total de vagas oferecidas |
| `QT_INSCRITO_TOTAL` | int | Total de inscritos no processo seletivo |
| `QT_INGRESSO_TOTAL` | int | Total de ingressantes |
| `QT_MATRICULA_TOTAL` | int | Total de alunos matriculados |
| `QT_CONCLUINTE_TOTAL` | int | Total de concluintes |
| `CO_MUNICIPIO` | int | Código do município do curso (IBGE) |
| `TP_SITUACAO_CURSO` | int | Situação: em atividade, extinto, em extinção |

### Arquivo de Docentes (`SUP_DOCENTE_AAAA.CSV`)

| Campo | Tipo | Descrição |
|---|---|---|
| `CO_DOCENTE` | int | Código anonimizado do docente |
| `CO_IES` | int | Código da IES |
| `TP_SEXO` | int | Sexo: 1=Masculino, 2=Feminino |
| `NU_IDADE` | int | Idade do docente |
| `TP_COR_RACA` | int | Cor/raça (mesma codificação IBGE) |
| `TP_ESCOLARIDADE` | int | Titulação: 1=Sem graduação, 2=Graduação, 3=Especialização, 4=Mestrado, 5=Doutorado |
| `TP_REGIME_TRABALHO` | int | Regime: 1=Tempo integral, 2=Tempo parcial, 3=Horista |
| `IN_ATU_ENSINO` | int | Atua no ensino (0/1) |
| `IN_ATU_PESQUISA` | int | Atua em pesquisa (0/1) |
| `IN_ATU_EXTENSAO` | int | Atua em extensão (0/1) |
| `IN_ATU_GESTAO` | int | Atua em gestão/administração (0/1) |

> **Nota:** A lista acima apresenta um subconjunto dos campos. O dicionário de dados completo inclui muitas outras variáveis, incluindo desagregações por sexo, cor/raça e turno.

## Cruzamentos possíveis

| Cruzamento | Fonte relacionada | Chave de ligação | Finalidade |
|---|---|---|---|
| IES x Censo Escolar | [Censo Escolar](/docs/apis/educacao/censo-escolar) | `CO_MUNICIPIO` | Comparar oferta de educação básica e superior por município |
| IES x ENEM | [ENEM (Microdados)](/docs/apis/educacao/enem) | `CO_MUNICIPIO` | Analisar demanda (candidatos ENEM) vs oferta (vagas) por região |
| IES x FUNDEB/FNDE | [FNDE (Repasses)](/docs/apis/educacao/fnde-repasses) | `CO_MUNICIPIO` | Avaliar investimento em educação básica vs expansão do ensino superior |
| IES x CNPJ | [Receita Federal — CNPJ](/docs/apis/receita-federal/cnpj-completa) | `CNPJ da mantenedora` | Identificar dados cadastrais e societários das mantenedoras de IES privadas |
| IES x Censo Demográfico | IBGE — Censo Demográfico | `CO_MUNICIPIO` | Contextualizar oferta de ensino superior com perfil demográfico municipal |
| Cursos x Mercado de trabalho | CAGED/Novo CAGED | Área CINE / CBO | Correlacionar formação acadêmica com empregabilidade e salários |

### Exemplo de cruzamento: IES privadas x CNPJ da mantenedora

```python
import pandas as pd

# 1. Carregar dados de IES
df_ies = pd.read_csv(
    "dados_censo_superior/MICRODADOS_CADASTRO_IES_2023.CSV",
    sep=";",
    encoding="latin-1",
    dtype=str,
)

# Filtrar apenas IES privadas
df_privadas = df_ies[
    df_ies["TP_CATEGORIA_ADMINISTRATIVA"].isin(["4", "5"])
].copy()

print(f"IES privadas: {len(df_privadas):,}")

# 2. Carregar base CNPJ (previamente baixada)
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

# 3. Cruzar por CNPJ da mantenedora
# O campo CO_MANTENEDORA contém o CNPJ da mantenedora
df_privadas["cnpj_basico"] = df_privadas["CO_MANTENEDORA"].str[:8]

df_cruzado = df_privadas.merge(
    df_empresas[["cnpj_basico", "razao_social", "capital_social"]],
    on="cnpj_basico",
    how="left",
)

print("\nIES privadas com dados da mantenedora:")
print(df_cruzado[["NO_IES", "razao_social", "capital_social"]].head(10))
```

## Limitações conhecidas

| Limitação | Detalhes |
|---|---|
| **Encoding e separador variam** | O encoding (Latin-1 ou UTF-8) e o separador (`;` ou `\|`) podem mudar entre edições. Verifique o dicionário de dados antes de processar. |
| **Estrutura de diretórios muda** | A organização dos arquivos dentro do ZIP varia entre os anos. O código de importação pode precisar de ajustes. |
| **Dados anonimizados** | Os códigos de docentes são anonimizados e mudam a cada edição, impedindo o acompanhamento longitudinal de um mesmo docente. |
| **Dados de alunos limitados** | Os microdados de alunos individuais foram descontinuados em edições recentes por questões de privacidade. Os dados de matrículas são agregados por curso. |
| **Defasagem temporal** | Os microdados de um ano são publicados apenas no ano seguinte (ex: dados de 2023 publicados em meados de 2024). |
| **Sem API de consulta** | Não existe API REST para consulta individual. É necessário baixar o arquivo completo e processar localmente. |
| **Códigos CINE** | A classificação de áreas de curso usa o sistema CINE (internacional), que pode ser menos intuitivo que classificações brasileiras anteriores. Utilize a tabela auxiliar para decodificação. |
| **Download manual** | O link de download pode mudar a cada publicação. Pode ser necessário navegar pelo site do INEP para encontrar o arquivo correto. |
| **IES extintas** | Instituições que encerraram atividades podem não constar em edições posteriores. Para análise histórica, é necessário combinar múltiplos anos. |
