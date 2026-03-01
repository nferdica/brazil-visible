---
title: ENEM (Microdados)
slug: enem
orgao: INEP / MEC
url_base: https://www.gov.br/inep/pt-br/acesso-a-informacao/dados-abertos/microdados/enem
tipo_acesso: CSV Download
autenticacao: Não requerida
formato_dados: [CSV]
frequencia_atualizacao: Anual
campos_chave: [inscrição, código escola, código município, notas TRI, nota redação, perfil socioeconômico, tipo prova]
tags:
  - educação
  - ENEM
  - vestibular
  - notas
  - desempenho
  - redação
  - perfil socioeconômico
  - INEP
  - microdados
  - ensino médio
cruzamento_com:
  - censo-escolar
  - censo-educacao-superior
  - fnde-repasses
  - ibge-estatisticas/censo-demografico
status: documentado
---

# ENEM (Microdados)

## O que é

Os **Microdados do ENEM** (Exame Nacional do Ensino Médio) são o conjunto de dados individuais de todos os participantes do exame, disponibilizados anualmente pelo **Instituto Nacional de Estudos e Pesquisas Educacionais Anísio Teixeira (INEP/MEC)**. O ENEM é a principal porta de entrada para o ensino superior no Brasil, sendo utilizado pelo SISU, ProUni e FIES.

Os microdados incluem:

- **Notas** — notas nas 4 provas objetivas (Ciências da Natureza, Ciências Humanas, Linguagens e Códigos, Matemática) calculadas pela Teoria de Resposta ao Item (TRI), além da nota da redação
- **Perfil socioeconômico** — respostas ao questionário socioeconômico (escolaridade dos pais, renda familiar, acesso a bens, tipo de escola)
- **Dados da inscrição** — município de residência, município da prova, tipo de escola (pública/privada), faixa etária, sexo, cor/raça
- **Dados da prova** — tipo de prova (cor/código), língua estrangeira escolhida, atendimento especializado, situação de presença

Com mais de **5 milhões de inscritos por edição**, os microdados do ENEM constituem uma das bases mais ricas para análises educacionais e socioeconômicas do Brasil.

**Fonte oficial:** https://www.gov.br/inep/pt-br/acesso-a-informacao/dados-abertos/microdados/enem

## Como acessar

| Item | Detalhe |
|---|---|
| **URL base** | `https://www.gov.br/inep/pt-br/acesso-a-informacao/dados-abertos/microdados/enem` |
| **Tipo de acesso** | Download direto de arquivo ZIP |
| **Autenticação** | Não requerida |
| **Formato** | CSV (delimitado por `;`, encoding UTF-8 ou Latin-1 dependendo do ano) |
| **Tamanho** | ~500 MB a 1 GB compactado (~2-5 GB descompactado) |

### Estrutura dos arquivos

Cada ano disponibiliza um arquivo ZIP contendo:

```
microdados_enem_AAAA/
├── DADOS/
│   └── MICRODADOS_ENEM_AAAA.csv          # Arquivo principal com todos os participantes
├── DICIONÁRIO/
│   └── Dicionario_Microdados_Enem_AAAA.xlsx
├── INPUTS/
│   ├── INPUT_SAS_AAAA.sas
│   └── INPUT_SPSS_AAAA.sps
├── PROVAS/
│   └── (cadernos de prova em PDF, quando disponíveis)
└── LEIA-ME/
    └── Leia_me_Microdados_Enem_AAAA.txt
```

## Endpoints/recursos principais

Como se trata de download de arquivos (e não de uma API REST), os "recursos" são os próprios arquivos disponíveis:

| Arquivo | Conteúdo | Tamanho aprox. |
|---|---|---|
| `MICRODADOS_ENEM_AAAA.csv` | Dados individuais de todos os participantes (~5 milhões de linhas) | ~2-5 GB |
| `Dicionario_Microdados_Enem_AAAA.xlsx` | Dicionário com descrição de todos os campos e códigos | ~200 KB |
| Cadernos de prova (PDF) | Provas aplicadas na edição (quando disponíveis) | Variável |

### Download

Os microdados estão disponíveis na página oficial do INEP:

```bash
# Exemplo de download (o link exato pode mudar a cada publicação)
wget "https://download.inep.gov.br/microdados/microdados_enem_2023.zip"
```

## Exemplo de uso

### Download e leitura dos microdados

```python
import zipfile
import pandas as pd
from pathlib import Path

# Após baixar o ZIP da página do INEP
ZIP_PATH = Path("microdados_enem_2023.zip")
DESTINO = Path("./dados_enem")

# Extrair
with zipfile.ZipFile(ZIP_PATH, "r") as zf:
    zf.extractall(DESTINO)

# Localizar o arquivo CSV principal
arquivo_csv = list(DESTINO.rglob("MICRODADOS_ENEM_*.csv"))[0]

# Ler o CSV (arquivo grande — pode levar alguns minutos)
df = pd.read_csv(
    arquivo_csv,
    sep=";",
    encoding="latin-1",
    dtype=str,
    low_memory=False,
)

print(f"Total de participantes: {len(df):,}")
print(f"Colunas ({len(df.columns)}): {list(df.columns[:10])}...")
```

### Análise de notas por UF

```python
# Converter notas para numérico
colunas_notas = ["NU_NOTA_CN", "NU_NOTA_CH", "NU_NOTA_LC", "NU_NOTA_MT", "NU_NOTA_REDACAO"]
for col in colunas_notas:
    df[col] = pd.to_numeric(df[col], errors="coerce")

# Filtrar apenas participantes presentes em todas as provas
df_presentes = df.dropna(subset=colunas_notas)

# Calcular nota média total por UF
df_presentes["NOTA_MEDIA"] = df_presentes[colunas_notas].mean(axis=1)

media_por_uf = (
    df_presentes.groupby("SG_UF_PROVA")["NOTA_MEDIA"]
    .mean()
    .sort_values(ascending=False)
    .round(1)
)

print("Nota média por UF:")
print(media_por_uf.to_string())
```

### Análise do perfil socioeconômico

```python
# Q006 = Renda mensal familiar
# Códigos: A=Nenhuma, B=Até R$1.320, C=R$1.320-R$1.980, etc.
renda_map = {
    "A": "Nenhuma renda",
    "B": "Até R$ 1.320",
    "C": "R$ 1.320 a R$ 1.980",
    "D": "R$ 1.980 a R$ 2.640",
    "E": "R$ 2.640 a R$ 3.300",
    "F": "R$ 3.300 a R$ 3.960",
    "G": "R$ 3.960 a R$ 5.280",
    "H": "R$ 5.280 a R$ 6.600",
    "I": "R$ 6.600 a R$ 7.920",
    "J": "R$ 7.920 a R$ 9.240",
    "K": "R$ 9.240 a R$ 10.560",
    "L": "R$ 10.560 a R$ 13.200",
    "M": "R$ 13.200 a R$ 15.840",
    "N": "R$ 15.840 a R$ 19.800",
    "O": "R$ 19.800 a R$ 26.400",
    "P": "Acima de R$ 26.400",
    "Q": "Não declarada",
}

# Nota média por faixa de renda
notas_renda = (
    df_presentes.groupby("Q006")["NOTA_MEDIA"]
    .mean()
    .round(1)
)

for codigo, media in notas_renda.items():
    desc = renda_map.get(codigo, codigo)
    print(f"{desc}: {media}")
```

### Notas por tipo de escola (pública vs privada)

```python
# TP_ESCOLA: 1=Não respondeu, 2=Pública, 3=Privada
tipo_escola_map = {"1": "Não respondeu", "2": "Pública", "3": "Privada"}

notas_escola = (
    df_presentes.groupby("TP_ESCOLA")[colunas_notas]
    .mean()
    .round(1)
)

notas_escola.index = notas_escola.index.map(tipo_escola_map)
print("Notas médias por tipo de escola:")
print(notas_escola.to_string())
```

## Campos disponíveis

### Dados do participante

| Campo | Tipo | Descrição |
|---|---|---|
| `NU_INSCRICAO` | string | Número de inscrição do participante |
| `NU_ANO` | int | Ano da edição do ENEM |
| `TP_FAIXA_ETARIA` | int | Faixa etária do participante (códigos) |
| `TP_SEXO` | string | Sexo: `M`=Masculino, `F`=Feminino |
| `TP_COR_RACA` | int | Cor/raça: 0=Não declarado, 1=Branca, 2=Preta, 3=Parda, 4=Amarela, 5=Indígena |
| `TP_ESTADO_CIVIL` | int | Estado civil |
| `SG_UF_PROVA` | string | Sigla da UF onde fez a prova |
| `CO_MUNICIPIO_PROVA` | int | Código do município da prova (IBGE) |
| `CO_ESCOLA` | int | Código da escola (INEP) |
| `TP_ESCOLA` | int | Tipo de escola: 1=Não respondeu, 2=Pública, 3=Privada |

### Notas

| Campo | Tipo | Descrição |
|---|---|---|
| `NU_NOTA_CN` | float | Nota em Ciências da Natureza (TRI) |
| `NU_NOTA_CH` | float | Nota em Ciências Humanas (TRI) |
| `NU_NOTA_LC` | float | Nota em Linguagens e Códigos (TRI) |
| `NU_NOTA_MT` | float | Nota em Matemática (TRI) |
| `NU_NOTA_REDACAO` | float | Nota da redação (0 a 1000) |
| `NU_NOTA_COMP1` a `NU_NOTA_COMP5` | float | Notas por competência da redação (0 a 200 cada) |
| `TP_STATUS_REDACAO` | int | Situação da redação (1=Sem problemas, 2=Anulada, etc.) |

### Presença e provas

| Campo | Tipo | Descrição |
|---|---|---|
| `TP_PRESENCA_CN` | int | Presença em Ciências da Natureza: 0=Faltou, 1=Presente, 2=Eliminado |
| `TP_PRESENCA_CH` | int | Presença em Ciências Humanas |
| `TP_PRESENCA_LC` | int | Presença em Linguagens e Códigos |
| `TP_PRESENCA_MT` | int | Presença em Matemática |
| `CO_PROVA_CN` | int | Código da prova de Ciências da Natureza (cor/tipo) |
| `TP_LINGUA` | int | Língua estrangeira: 0=Inglês, 1=Espanhol |

### Questionário socioeconômico (seleção)

| Campo | Tipo | Descrição |
|---|---|---|
| `Q001` | string | Escolaridade do pai |
| `Q002` | string | Escolaridade da mãe |
| `Q006` | string | Renda mensal familiar (faixas A-Q) |
| `Q024` | string | Possui computador em casa |
| `Q025` | string | Possui acesso à internet |

> **Nota:** O questionário socioeconômico possui mais de 25 perguntas. Consulte o dicionário de dados completo para a lista integral.

## Cruzamentos possíveis

| Cruzamento | Fonte relacionada | Chave de ligação | Finalidade |
|---|---|---|---|
| ENEM x Escolas | [Censo Escolar](/docs/apis/educacao/censo-escolar) | `CO_ESCOLA` | Correlacionar infraestrutura escolar com desempenho no ENEM |
| ENEM x FUNDEB | [FNDE (Repasses)](/docs/apis/educacao/fnde-repasses) | `CO_MUNICIPIO_PROVA` | Avaliar impacto dos investimentos em educação no desempenho |
| ENEM x Educação Superior | [Censo da Educação Superior](/docs/apis/educacao/censo-educacao-superior) | `CO_MUNICIPIO_PROVA` | Analisar demanda x oferta de vagas no ensino superior por região |
| ENEM x Censo Demográfico | IBGE — Censo Demográfico | `CO_MUNICIPIO_PROVA` | Contextualizar desempenho com indicadores socioeconômicos municipais |
| ENEM x IDH/IDHM | IPEA — Atlas do Desenvolvimento | `CO_MUNICIPIO_PROVA` | Correlacionar desempenho no ENEM com IDH municipal |

### Exemplo de cruzamento: ENEM x Censo Escolar

```python
import pandas as pd

# 1. Carregar microdados do ENEM
df_enem = pd.read_csv(
    "dados_enem/MICRODADOS_ENEM_2023.csv",
    sep=";",
    encoding="latin-1",
    dtype=str,
    usecols=["CO_ESCOLA", "NU_NOTA_MT", "NU_NOTA_REDACAO"],
)

# Converter notas para numérico
df_enem["NU_NOTA_MT"] = pd.to_numeric(df_enem["NU_NOTA_MT"], errors="coerce")
df_enem["NU_NOTA_REDACAO"] = pd.to_numeric(df_enem["NU_NOTA_REDACAO"], errors="coerce")

# Médias por escola
medias = df_enem.groupby("CO_ESCOLA").agg(
    nota_mt_media=("NU_NOTA_MT", "mean"),
    nota_red_media=("NU_NOTA_REDACAO", "mean"),
    qtd_alunos=("NU_NOTA_MT", "count"),
).round(1)

# 2. Carregar dados de escolas (Censo Escolar)
df_escolas = pd.read_csv(
    "dados_censo_escolar/ESCOLAS.CSV",
    sep="|",
    encoding="latin-1",
    dtype=str,
    usecols=["CO_ENTIDADE", "NO_ENTIDADE", "TP_DEPENDENCIA",
             "IN_INTERNET", "IN_BIBLIOTECA"],
)

# 3. Cruzar
df_resultado = df_escolas.merge(
    medias,
    left_on="CO_ENTIDADE",
    right_index=True,
    how="inner",
)

# Escolas públicas vs privadas com melhor desempenho
for dep, nome in [("2", "Estadual"), ("3", "Municipal"), ("4", "Privada")]:
    subset = df_resultado[df_resultado["TP_DEPENDENCIA"] == dep]
    if not subset.empty:
        print(f"{nome}: Matemática={subset['nota_mt_media'].mean():.1f}, "
              f"Redação={subset['nota_red_media'].mean():.1f}, "
              f"Escolas={len(subset):,}")
```

## Limitações conhecidas

| Limitação | Detalhes |
|---|---|
| **Arquivo muito grande** | O CSV principal pode ter mais de 5 milhões de linhas e ocupar vários GB. Requer máquinas com bastante RAM ou uso de processamento em chunks/Dask. |
| **Encoding variável** | O encoding do CSV pode ser Latin-1 ou UTF-8, dependendo da edição. Verifique sempre antes de processar. |
| **Dados anonimizados** | O número de inscrição (`NU_INSCRICAO`) é anonimizado. Não é possível identificar participantes individualmente ou rastrear o mesmo participante em edições diferentes. |
| **Código da escola pode ser nulo** | Nem todos os participantes possuem `CO_ESCOLA` preenchido (ex: treineiros, candidatos que já concluíram o ensino médio há anos). |
| **Notas nulas para ausentes** | Participantes que faltaram a uma prova possuem nota nula (`NaN`). É fundamental filtrar por presença (`TP_PRESENCA_*`) antes de calcular estatísticas. |
| **Defasagem temporal** | Os microdados de uma edição são publicados no primeiro semestre do ano seguinte. |
| **Sem API de consulta** | Não existe API REST para consulta individual. É necessário baixar o arquivo completo e processar localmente. |
| **Questionário pode mudar** | As perguntas do questionário socioeconômico (Q001-Q025+) podem ser alteradas entre edições, dificultando comparações longitudinais. |
| **Download manual** | Os links de download podem mudar a cada publicação. Pode ser necessário navegar pelo site do INEP para encontrar o arquivo. |
| **TRI dificulta comparação direta** | As notas das provas objetivas usam a Teoria de Resposta ao Item (TRI), cujas escalas variam entre edições. A comparação direta entre anos diferentes deve ser feita com cautela. |
