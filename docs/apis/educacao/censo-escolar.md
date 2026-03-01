---
title: Censo Escolar (Microdados)
slug: censo-escolar
orgao: INEP / MEC
url_base: https://www.gov.br/inep/pt-br/acesso-a-informacao/dados-abertos/microdados/censo-escolar
tipo_acesso: CSV Download
autenticacao: Não requerida
formato_dados: [CSV]
frequencia_atualizacao: Anual
campos_chave: [código escola, código município, código turma, matrícula, código docente, dependência administrativa, etapa ensino]
tags:
  - educação
  - censo escolar
  - escolas
  - matrículas
  - turmas
  - docentes
  - educação básica
  - INEP
  - microdados
cruzamento_com:
  - enem
  - censo-educacao-superior
  - fnde-repasses
  - ibge-estatisticas/censo-demografico
  - ibge-estatisticas/pib-municipios
status: documentado
---

# Censo Escolar (Microdados)

## O que é

O **Censo Escolar** é o principal levantamento estatístico da educação básica brasileira, realizado anualmente pelo **Instituto Nacional de Estudos e Pesquisas Educacionais Anísio Teixeira (INEP)**, vinculado ao **Ministério da Educação (MEC)**. Os microdados cobrem todas as escolas públicas e privadas do país, desde a educação infantil até o ensino médio, incluindo educação especial, EJA (Educação de Jovens e Adultos) e educação profissional.

Os dados são organizados em quatro grandes dimensões:

- **Escolas** — infraestrutura, localização, dependência administrativa, recursos disponíveis
- **Turmas** — etapa de ensino, horário de funcionamento, atividades complementares
- **Matrículas** — perfil dos alunos, idade, sexo, cor/raça, necessidades especiais, transporte escolar
- **Docentes** — formação, vínculo, disciplinas lecionadas, escolaridade

Esses dados são fundamentais para o planejamento de políticas públicas educacionais, cálculo do FUNDEB, distribuição de recursos e avaliação da infraestrutura escolar em todo o Brasil.

**Fonte oficial:** https://www.gov.br/inep/pt-br/acesso-a-informacao/dados-abertos/microdados/censo-escolar

**Documentação do layout:** Cada arquivo ZIP inclui um dicionário de dados em PDF/XLSX e o respectivo arquivo de leitura (script de importação).

## Como acessar

| Item | Detalhe |
|---|---|
| **URL base** | `https://www.gov.br/inep/pt-br/acesso-a-informacao/dados-abertos/microdados/censo-escolar` |
| **Tipo de acesso** | Download direto de arquivos ZIP |
| **Autenticação** | Não requerida |
| **Formato** | CSV (delimitado por `|` ou `;`, encoding Latin-1 ou UTF-8 dependendo do ano) |
| **Tamanho** | ~2-4 GB compactado (~10-20 GB descompactado, dependendo do ano) |

### Estrutura dos arquivos

Cada ano disponibiliza um arquivo ZIP contendo:

```
microdados_censo_escolar_AAAA/
├── dados/
│   ├── microdados_ed_basica_AAAA.csv       # Arquivo principal (ou dividido por dimensão)
│   ├── ESCOLAS.CSV
│   ├── TURMAS.CSV
│   ├── MATRICULA_*.CSV                      # Dividido por região (CO, NE, NO, SE, SUL)
│   └── DOCENTES_*.CSV                       # Dividido por região
├── leia-me/
│   └── Leia_me.txt
├── anexos/
│   └── DICIONARIO_DADOS.xlsx
└── scripts/
    └── INPUT_SAS_*.sas                      # Scripts de importação SAS
```

> **Nota:** A estrutura de diretórios e a nomenclatura dos arquivos podem variar entre os anos. Sempre verifique o conteúdo do ZIP antes de processar.

## Endpoints/recursos principais

Como se trata de download de arquivos (e não de uma API REST), os "recursos" são os próprios arquivos disponíveis:

| Arquivo | Conteúdo | Tamanho aprox. |
|---|---|---|
| `ESCOLAS.CSV` | Dados de todas as escolas do Brasil (~220 mil registros) | ~150 MB |
| `TURMAS.CSV` | Dados de todas as turmas (~2,3 milhões de registros) | ~500 MB |
| `MATRICULA_CO.CSV` a `MATRICULA_SUL.CSV` | Matrículas divididas por região (~47 milhões de registros no total) | ~5-8 GB total |
| `DOCENTES_CO.CSV` a `DOCENTES_SUL.CSV` | Dados de docentes divididos por região (~2,3 milhões de registros) | ~1-2 GB total |
| `DICIONARIO_DADOS.xlsx` | Dicionário com descrição de todos os campos | ~500 KB |

### Download

Os microdados estão disponíveis na página oficial do INEP. O download é feito diretamente pelo navegador ou via ferramentas como `wget`:

```bash
# Exemplo de download (o link exato pode mudar a cada publicação)
wget "https://download.inep.gov.br/dados_abertos/microdados_censo_escolar_2023.zip"
```

## Exemplo de uso

### Download e leitura dos dados de escolas

```python
import zipfile
import pandas as pd
from pathlib import Path

# Após baixar o ZIP manualmente da página do INEP
ZIP_PATH = Path("microdados_censo_escolar_2023.zip")
DESTINO = Path("./dados_censo_escolar")

# Extrair o ZIP
with zipfile.ZipFile(ZIP_PATH, "r") as zf:
    zf.extractall(DESTINO)
    print("Arquivos extraídos:")
    for nome in zf.namelist():
        print(f"  {nome}")

# Localizar o arquivo de escolas
# A estrutura pode variar; ajuste o caminho conforme o ano
arquivo_escolas = list(DESTINO.rglob("*ESCOLAS*.CSV"))[0]

# Ler o CSV de escolas
# O separador pode ser "|" ou ";", e o encoding pode ser "latin-1" ou "utf-8"
df_escolas = pd.read_csv(
    arquivo_escolas,
    sep="|",
    encoding="latin-1",
    dtype=str,
    low_memory=False,
)

print(f"Total de escolas: {len(df_escolas):,}")
print(f"Colunas: {list(df_escolas.columns[:10])}...")
print(df_escolas.head())
```

### Análise de infraestrutura escolar por UF

```python
# Selecionar colunas de interesse
colunas_infra = [
    "CO_UF", "NO_UF", "CO_ENTIDADE", "NO_ENTIDADE",
    "TP_DEPENDENCIA",  # 1=Federal, 2=Estadual, 3=Municipal, 4=Privada
    "IN_AGUA_POTAVEL", "IN_ENERGIA_REDE_PUBLICA",
    "IN_ESGOTO_REDE_PUBLICA", "IN_INTERNET",
    "IN_BANDA_LARGA", "IN_BIBLIOTECA",
    "IN_LABORATORIO_INFORMATICA", "IN_QUADRA_ESPORTES",
]

df_infra = df_escolas[colunas_infra].copy()

# Converter indicadores para numérico (0/1)
indicadores = [c for c in colunas_infra if c.startswith("IN_")]
for col in indicadores:
    df_infra[col] = pd.to_numeric(df_infra[col], errors="coerce")

# Percentual de escolas com internet por UF
internet_por_uf = (
    df_infra.groupby("NO_UF")["IN_INTERNET"]
    .mean()
    .mul(100)
    .round(1)
    .sort_values(ascending=False)
)

print("Percentual de escolas com internet por UF:")
print(internet_por_uf.to_string())
```

### Leitura de matrículas (arquivo grande — usar chunks)

```python
# Matrículas são arquivos muito grandes; usar leitura em chunks
arquivo_matriculas = list(DESTINO.rglob("*MATRICULA_SE*"))[0]

# Ler em chunks para não estourar a memória
chunks = pd.read_csv(
    arquivo_matriculas,
    sep="|",
    encoding="latin-1",
    dtype=str,
    chunksize=500_000,
)

total = 0
for i, chunk in enumerate(chunks):
    total += len(chunk)
    print(f"Chunk {i}: {len(chunk):,} registros (acumulado: {total:,})")

    # Processar cada chunk aqui (ex: filtrar por município, agregar)
    # resultado_parcial = chunk[chunk["CO_MUNICIPIO"] == "3550308"]  # São Paulo

print(f"\nTotal de matrículas na região SE: {total:,}")
```

### Contagem de docentes por formação

```python
arquivo_docentes = list(DESTINO.rglob("*DOCENTES_SE*"))[0]

df_docentes = pd.read_csv(
    arquivo_docentes,
    sep="|",
    encoding="latin-1",
    dtype=str,
    low_memory=False,
)

# TP_ESCOLARIDADE: 1=Fundamental incompleto, 2=Fundamental, 3=Médio, 4=Superior
escolaridade_map = {
    "1": "Fundamental incompleto",
    "2": "Fundamental completo",
    "3": "Ensino médio",
    "4": "Ensino superior",
}

contagem = (
    df_docentes["TP_ESCOLARIDADE"]
    .map(escolaridade_map)
    .value_counts()
)

print("Docentes por nível de escolaridade:")
print(contagem.to_string())
```

## Campos disponíveis

### Arquivo de Escolas (`ESCOLAS.CSV`)

| Campo | Tipo | Descrição |
|---|---|---|
| `CO_ENTIDADE` | int | Código identificador da escola (INEP) |
| `NO_ENTIDADE` | string | Nome da escola |
| `CO_UF` | int | Código da UF (IBGE) |
| `NO_UF` | string | Nome da UF |
| `CO_MUNICIPIO` | int | Código do município (IBGE) |
| `NO_MUNICIPIO` | string | Nome do município |
| `TP_DEPENDENCIA` | int | Dependência administrativa: 1=Federal, 2=Estadual, 3=Municipal, 4=Privada |
| `TP_LOCALIZACAO` | int | Localização: 1=Urbana, 2=Rural |
| `IN_AGUA_POTAVEL` | int | Possui água potável (0/1) |
| `IN_ENERGIA_REDE_PUBLICA` | int | Energia da rede pública (0/1) |
| `IN_ESGOTO_REDE_PUBLICA` | int | Esgoto via rede pública (0/1) |
| `IN_INTERNET` | int | Possui acesso à internet (0/1) |
| `IN_BANDA_LARGA` | int | Possui banda larga (0/1) |
| `IN_BIBLIOTECA` | int | Possui biblioteca (0/1) |
| `IN_LABORATORIO_INFORMATICA` | int | Possui laboratório de informática (0/1) |
| `IN_QUADRA_ESPORTES` | int | Possui quadra de esportes (0/1) |
| `QT_SALAS_EXISTENTES` | int | Quantidade de salas de aula existentes |
| `QT_SALAS_UTILIZADAS` | int | Quantidade de salas de aula utilizadas |
| `QT_FUNCIONARIOS` | int | Quantidade total de funcionários |

### Arquivo de Matrículas (`MATRICULA_*.CSV`)

| Campo | Tipo | Descrição |
|---|---|---|
| `CO_PESSOA_FISICA` | string | Código anonimizado do aluno (ID INEP) |
| `CO_ENTIDADE` | int | Código da escola |
| `CO_MUNICIPIO` | int | Código do município |
| `TP_SEXO` | int | Sexo: 1=Masculino, 2=Feminino |
| `TP_COR_RACA` | int | Cor/raça: 0=Não declarada, 1=Branca, 2=Preta, 3=Parda, 4=Amarela, 5=Indígena |
| `NU_IDADE` | int | Idade do aluno em anos |
| `TP_ETAPA_ENSINO` | int | Etapa de ensino (códigos variados) |
| `IN_TRANSPORTE_PUBLICO` | int | Utiliza transporte escolar público (0/1) |
| `IN_NECESSIDADE_ESPECIAL` | int | Possui necessidade educacional especial (0/1) |

### Arquivo de Docentes (`DOCENTES_*.CSV`)

| Campo | Tipo | Descrição |
|---|---|---|
| `CO_PESSOA_FISICA` | string | Código anonimizado do docente |
| `CO_ENTIDADE` | int | Código da escola |
| `TP_SEXO` | int | Sexo: 1=Masculino, 2=Feminino |
| `NU_IDADE` | int | Idade do docente |
| `TP_ESCOLARIDADE` | int | Nível de escolaridade (1 a 4) |
| `TP_TIPO_CONTRATACAO` | int | Tipo de contratação |
| `CO_CURSO_1` | int | Código do curso de graduação |
| `IN_DISC_LINGUA_PORTUGUESA` | int | Leciona Língua Portuguesa (0/1) |
| `IN_DISC_MATEMATICA` | int | Leciona Matemática (0/1) |
| `IN_DISC_CIENCIAS` | int | Leciona Ciências (0/1) |

> **Nota:** A lista acima é um subconjunto dos campos disponíveis. O dicionário de dados completo (`DICIONARIO_DADOS.xlsx`) inclui centenas de variáveis para cada dimensão.

## Cruzamentos possíveis

| Cruzamento | Fonte relacionada | Chave de ligação | Finalidade |
|---|---|---|---|
| Escolas x ENEM | [ENEM (Microdados)](/docs/apis/educacao/enem) | `CO_ESCOLA` / `CO_MUNICIPIO_PROVA` | Correlacionar infraestrutura escolar com desempenho no ENEM |
| Escolas x FUNDEB | [FNDE (Repasses)](/docs/apis/educacao/fnde-repasses) | `CO_MUNICIPIO` | Verificar a relação entre repasses do FUNDEB e infraestrutura escolar |
| Escolas x Censo Demográfico | IBGE — Censo Demográfico | `CO_MUNICIPIO` | Comparar número de escolas e matrículas com a população municipal |
| Escolas x PIB Municípios | IBGE — PIB Municípios | `CO_MUNICIPIO` | Analisar relação entre riqueza municipal e qualidade da infraestrutura escolar |
| Escolas x Educação Superior | [Censo da Educação Superior](/docs/apis/educacao/censo-educacao-superior) | `CO_MUNICIPIO` | Comparar oferta de educação básica e superior por município |
| Docentes x Educação Superior | [Censo da Educação Superior](/docs/apis/educacao/censo-educacao-superior) | `CO_CURSO_1` | Verificar formação dos docentes da educação básica em cursos superiores |

### Exemplo de cruzamento: Infraestrutura x Desempenho no ENEM

```python
import pandas as pd

# 1. Carregar dados de escolas (Censo Escolar)
df_escolas = pd.read_csv(
    "dados_censo_escolar/ESCOLAS.CSV",
    sep="|",
    encoding="latin-1",
    dtype=str,
    usecols=["CO_ENTIDADE", "NO_UF", "TP_DEPENDENCIA",
             "IN_INTERNET", "IN_BIBLIOTECA", "IN_LABORATORIO_INFORMATICA"],
)

# Converter indicadores para numérico
for col in ["IN_INTERNET", "IN_BIBLIOTECA", "IN_LABORATORIO_INFORMATICA"]:
    df_escolas[col] = pd.to_numeric(df_escolas[col], errors="coerce")

# 2. Carregar dados do ENEM (médias por escola)
df_enem = pd.read_csv(
    "dados_enem/MICRODADOS_ENEM_2023.csv",
    sep=";",
    encoding="latin-1",
    dtype=str,
    usecols=["CO_ESCOLA", "NU_NOTA_MT", "NU_NOTA_LC"],
)

df_enem["NU_NOTA_MT"] = pd.to_numeric(df_enem["NU_NOTA_MT"], errors="coerce")
df_enem["NU_NOTA_LC"] = pd.to_numeric(df_enem["NU_NOTA_LC"], errors="coerce")

# Média por escola
medias_escola = df_enem.groupby("CO_ESCOLA")[["NU_NOTA_MT", "NU_NOTA_LC"]].mean()

# 3. Cruzar: infraestrutura da escola x desempenho
df_cruzado = df_escolas.merge(
    medias_escola, left_on="CO_ENTIDADE", right_index=True, how="inner"
)

# Comparar notas médias: escolas com internet vs sem internet
com_internet = df_cruzado[df_cruzado["IN_INTERNET"] == 1]["NU_NOTA_MT"].mean()
sem_internet = df_cruzado[df_cruzado["IN_INTERNET"] == 0]["NU_NOTA_MT"].mean()

print(f"Nota média Matemática (com internet): {com_internet:.1f}")
print(f"Nota média Matemática (sem internet): {sem_internet:.1f}")
print(f"Diferença: {com_internet - sem_internet:.1f} pontos")
```

## Limitações conhecidas

| Limitação | Detalhes |
|---|---|
| **Arquivos muito grandes** | Os microdados completos ocupam vários GB descompactados, especialmente os arquivos de matrículas. Requer máquinas com bastante RAM ou processamento em chunks. |
| **Separador e encoding variam** | O separador (`;` ou `\|`) e o encoding (`latin-1` ou `utf-8`) podem mudar entre edições. Sempre verifique o dicionário de dados antes de processar. |
| **Estrutura de diretórios muda** | A organização dos arquivos dentro do ZIP varia entre os anos. O código de leitura pode precisar de ajustes para cada edição. |
| **Dados anonimizados** | Os códigos de alunos e docentes (`CO_PESSOA_FISICA`) são anonimizados e mudam a cada edição, impedindo o rastreamento longitudinal de indivíduos. |
| **Defasagem temporal** | Os microdados de um ano são publicados apenas no ano seguinte (ex: dados de 2023 publicados em 2024). |
| **Sem API de consulta** | Não existe API REST para consultar dados específicos. É necessário baixar o arquivo completo e processar localmente. |
| **Códigos precisam de decodificação** | Muitos campos usam códigos numéricos (ex: `TP_DEPENDENCIA`, `TP_COR_RACA`) que precisam ser mapeados usando o dicionário de dados. |
| **Download manual** | O link de download pode mudar a cada publicação, e o INEP não disponibiliza URLs estáveis. Pode ser necessário navegar pelo site para encontrar o arquivo correto. |
| **Matrículas divididas por região** | Os arquivos de matrículas e docentes são divididos por região geográfica (CO, NE, NO, SE, SUL), exigindo concatenação para análises nacionais. |
