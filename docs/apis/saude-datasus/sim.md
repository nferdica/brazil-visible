---
title: SIM — Sistema de Informações sobre Mortalidade
slug: sim
orgao: DATASUS / MS
url_base: ftp://ftp.datasus.gov.br/dissemin/publicos/SIM/
tipo_acesso: FTP Download
autenticacao: Não requerida
formato_dados: [DBC, DBF, CSV]
frequencia_atualizacao: Anual
campos_chave:
  - CID-10
  - codigo_municipio
  - data_obito
  - idade
  - sexo
  - tipo_obito
tags:
  - saude
  - mortalidade
  - obitos
  - CID-10
  - causa mortis
  - epidemiologia
  - DATASUS
cruzamento_com:
  - saude-datasus/sih
  - saude-datasus/sinasc
  - saude-datasus/sinan
  - saude-datasus/cnes
  - saude-datasus/tabnet
  - ibge-estatisticas/censo-demografico
status: documentado
---

# SIM — Sistema de Informações sobre Mortalidade

## O que é

O **SIM (Sistema de Informações sobre Mortalidade)** é o sistema oficial de registro de óbitos no Brasil, gerenciado pelo **DATASUS/Ministério da Saúde**. Criado em 1975, o SIM é alimentado pelas **Declarações de Óbito (DO)**, documento obrigatório para qualquer falecimento em território nacional.

O sistema registra informações detalhadas sobre cada óbito:

- **Causa da morte** — codificada pela CID-10 (causa básica e causas contribuintes)
- **Local do óbito** — município de ocorrência e de residência
- **Dados demográficos** — idade, sexo, raça/cor, escolaridade, estado civil
- **Circunstância** — óbito natural, acidente, homicídio, suicídio, causa indeterminada
- **Dados médicos** — local de ocorrência (hospital, domicílio, via pública), se teve assistência médica

O SIM é a fonte primária para o cálculo de indicadores de mortalidade no Brasil, incluindo taxas de mortalidade geral, infantil, materna, por causas externas e por doenças específicas. É amplamente utilizado em epidemiologia, planejamento em saúde pública e produção de estatísticas vitais.

> **Importante:** O SIM registra todos os óbitos ocorridos no Brasil, independentemente de o falecido ser ou não usuário do SUS. A cobertura é estimada em cerca de 95% dos óbitos no país, com sub-registro maior nas regiões Norte e Nordeste.

## Como acessar

### Via FTP (dados brutos)

| Item | Detalhe |
|---|---|
| **URL base** | `ftp://ftp.datasus.gov.br/dissemin/publicos/SIM/CID10/DORES/` |
| **Formato** | DBC (DBF comprimido) — requer conversão |
| **Autenticação** | Não requerida |
| **Organização** | Arquivos por UF e ano (`DO{UF}{AAAA}.dbc`) |
| **Atualização** | Anual, com defasagem de 1 a 2 anos |

### Via OpenDATASUS

| Item | Detalhe |
|---|---|
| **URL** | `https://opendatasus.saude.gov.br/` |
| **Formato** | CSV, JSON |
| **Descrição** | Dados pré-processados com documentação e metadados |

### Via TabNet

| Item | Detalhe |
|---|---|
| **URL** | `http://tabnet.datasus.gov.br/cgi/deftohtm.exe?sim/cnv/obt10uf.def` |
| **Descrição** | Interface web para consulta e tabulação de dados de mortalidade |

### Via PySUS (recomendado para Python)

```bash
pip install pysus
```

## Endpoints/recursos principais

### Arquivos disponíveis no FTP

| Diretório | Descrição | Período |
|---|---|---|
| `CID10/DORES/` | Declarações de Óbito por residência (CID-10) | 1996 em diante |
| `CID10/DOFET/` | Óbitos fetais por residência (CID-10) | 1996 em diante |
| `CID9/DORES/` | Declarações de Óbito (CID-9) | 1979–1995 |

### Nomenclatura dos arquivos

Os arquivos seguem o padrão: `DO{UF}{AAAA}.dbc`

Exemplos:
- `DOSP2022.dbc` — Óbitos em São Paulo, 2022
- `DORJ2021.dbc` — Óbitos no Rio de Janeiro, 2021
- `DOBR2022.dbc` — Óbitos de todo o Brasil, 2022

### Caminho FTP completo

```
ftp://ftp.datasus.gov.br/dissemin/publicos/SIM/CID10/DORES/DO{UF}{AAAA}.dbc
```

## Exemplo de uso

### Download e leitura com PySUS

```python
from pysus.online_data.SIM import download
import pandas as pd

# Baixar dados de mortalidade de São Paulo, 2022
dados = download(states=["SP"], years=[2022])

# Converter para DataFrame
df = dados.to_dataframe()

print(f"Total de óbitos registrados: {len(df):,}")
print(f"Colunas disponíveis: {list(df.columns)}")
print(df.head())
```

### Análise de causas de mortalidade

```python
from pysus.online_data.SIM import download
import pandas as pd

# Baixar dados de mortalidade de Minas Gerais, 2022
dados = download(states=["MG"], years=[2022])
df = dados.to_dataframe()

# Top 10 causas de morte (causa básica - CID-10)
top_causas = (
    df.groupby("CAUSABAS")
    .size()
    .reset_index(name="total_obitos")
    .sort_values("total_obitos", ascending=False)
    .head(10)
)

print("Top 10 causas de morte em MG (2022):")
print(top_causas)
```

### Mortalidade por faixa etária e sexo

```python
from pysus.online_data.SIM import download
import pandas as pd

# Baixar dados do Rio de Janeiro
dados = download(states=["RJ"], years=[2022])
df = dados.to_dataframe()

# Converter campos
df["IDADE"] = pd.to_numeric(df["IDADE"], errors="coerce")
df["SEXO"] = df["SEXO"].map({"1": "Masculino", "2": "Feminino", "0": "Ignorado"})

# Criar faixas etárias a partir do campo IDADE
# O campo IDADE usa codificação especial: 4xx = anos, 3xx = meses, 2xx = dias
df["idade_anos"] = df["IDADE"].apply(
    lambda x: x - 400 if pd.notna(x) and x >= 400 else None
)

# Distribuição por sexo
obitos_sexo = df["SEXO"].value_counts()
print("Óbitos por sexo:")
print(obitos_sexo)

# Distribuição por faixa etária
bins = [0, 1, 5, 15, 30, 45, 60, 75, 120]
labels = ["<1", "1-4", "5-14", "15-29", "30-44", "45-59", "60-74", "75+"]
df["faixa_etaria"] = pd.cut(df["idade_anos"], bins=bins, labels=labels, right=False)

obitos_idade = df["faixa_etaria"].value_counts().sort_index()
print("\nÓbitos por faixa etária:")
print(obitos_idade)
```

### Mortalidade por causas externas (violência e acidentes)

```python
from pysus.online_data.SIM import download
import pandas as pd

# Baixar dados de todo o Brasil (pode ser demorado)
dados = download(states=["SP"], years=[2022])
df = dados.to_dataframe()

# Causas externas: CID-10 capítulo XX (V01-Y98)
df["causa_externa"] = df["CAUSABAS"].str.match(r"^[VWX Y]")

externas = df[df["causa_externa"] == True]
print(f"Óbitos por causas externas: {len(externas):,}")

# Subcategorias de causas externas
categorias = {
    "Acidentes de transporte": r"^V",
    "Quedas": r"^W0[0-9]|^W1[0-9]",
    "Afogamento": r"^W6[5-9]|^W7[0-4]",
    "Agressões (homicídios)": r"^X8[5-9]|^X9|^Y0",
    "Lesões autoprovocadas (suicídio)": r"^X[67]",
}

for nome, padrao in categorias.items():
    total = externas["CAUSABAS"].str.match(padrao).sum()
    print(f"  {nome}: {total:,}")
```

## Campos disponíveis

### Declaração de Óbito (DO) — campos principais

| Campo | Tipo | Descrição |
|---|---|---|
| `NUMERODO` | string | Número da Declaração de Óbito |
| `DTOBITO` | string(8) | Data do óbito (DDMMAAAA) |
| `HORAOBITO` | string(4) | Hora do óbito (HHMM) |
| `NATURAL` | string(3) | Naturalidade do falecido |
| `CODMUNRES` | string(6) | Código IBGE do município de residência |
| `CODMUNOCOR` | string(6) | Código IBGE do município de ocorrência do óbito |
| `IDADE` | string(3) | Idade (codificação: 4xx=anos, 3xx=meses, 2xx=dias, 1xx=horas) |
| `SEXO` | string(1) | Sexo (`1`=Masculino, `2`=Feminino, `0`=Ignorado) |
| `RACACOR` | string(1) | Raça/cor (`1`=Branca, `2`=Preta, `3`=Amarela, `4`=Parda, `5`=Indígena) |
| `ESTCIV` | string(1) | Estado civil |
| `ESC` | string(1) | Escolaridade (em anos de estudo) |
| `OCUP` | string(6) | Ocupação (código CBO) |
| `LOCOCOR` | string(1) | Local de ocorrência (`1`=Hospital, `2`=Outro estab. saúde, `3`=Domicílio, `4`=Via pública, `5`=Outros) |
| `CAUSABAS` | string(4) | Causa básica do óbito (código CID-10) |
| `LINHAA` | string | Causa na linha A da DO (causa terminal) |
| `LINHAB` | string | Causa na linha B da DO |
| `LINHAC` | string | Causa na linha C da DO |
| `LINHAD` | string | Causa na linha D da DO (causa básica) |
| `LINHAII` | string | Causas contribuintes (Parte II da DO) |
| `TIPOBITO` | string(1) | Tipo de óbito (`1`=Fetal, `2`=Não fetal) |
| `ASSISTMED` | string(1) | Teve assistência médica (`1`=Sim, `2`=Não, `9`=Ignorado) |
| `CIRCOBITO` | string(1) | Circunstância do óbito (`1`=Acidente, `2`=Suicídio, `3`=Homicídio, `4`=Outros, `9`=Ignorado) |
| `DTNASC` | string(8) | Data de nascimento (DDMMAAAA) |
| `CODESTAB` | string(7) | Código CNES do estabelecimento onde ocorreu o óbito |
| `ESCMAE` | string(1) | Escolaridade da mãe (para óbitos infantis) |
| `GESTACAO` | string(1) | Semanas de gestação (para óbitos fetais/infantis) |
| `PESO` | string(4) | Peso ao nascer em gramas (para óbitos infantis) |
| `FONTEINV` | string(1) | Fonte de investigação do óbito |
| `TPMORTEOCO` | string(1) | Momento do óbito em relação ao parto (óbitos fetais) |

## Cruzamentos possíveis

| Cruzamento | Fonte relacionada | Chave de ligação | Finalidade |
|---|---|---|---|
| Mortalidade x Internações | [SIH](/docs/apis/saude-datasus/sih) | `CID-10`, `municipio`, `periodo` | Calcular letalidade hospitalar: razão entre óbitos e internações por causa |
| Mortalidade x Nascimentos | [SINASC](/docs/apis/saude-datasus/sinasc) | `municipio`, `periodo` | Calcular mortalidade infantil (óbitos menores de 1 ano / nascidos vivos) |
| Mortalidade x Agravos | [SINAN](/docs/apis/saude-datasus/sinan) | `CID-10`, `municipio` | Calcular letalidade de doenças de notificação compulsória |
| Mortalidade x Estabelecimentos | [CNES](/docs/apis/saude-datasus/cnes) | `CNES` | Identificar hospitais com maiores taxas de óbito |
| Mortalidade x População | IBGE — Estimativas populacionais | `codigo_municipio` | Calcular taxas de mortalidade por 100.000 habitantes |
| Mortalidade x Tabulação | [TabNet](/docs/apis/saude-datasus/tabnet) | Diversos | Consulta rápida de indicadores de mortalidade |

### Exemplo de cruzamento: mortalidade infantil

```python
from pysus.online_data.SIM import download as download_sim
from pysus.online_data.SINASC import download as download_sinasc
import pandas as pd

# Baixar óbitos e nascimentos de SP, 2022
obitos = download_sim(states=["SP"], years=[2022]).to_dataframe()
nascimentos = download_sinasc(states=["SP"], years=[2022]).to_dataframe()

# Filtrar óbitos infantis (menores de 1 ano)
# Código de idade < 400 indica menos de 1 ano
obitos["IDADE"] = pd.to_numeric(obitos["IDADE"], errors="coerce")
obitos_infantis = obitos[obitos["IDADE"] < 400]

# Contar por município
obitos_mun = (
    obitos_infantis.groupby("CODMUNRES")
    .size()
    .reset_index(name="obitos_infantis")
)
nasc_mun = (
    nascimentos.groupby("CODMUNRES")
    .size()
    .reset_index(name="nascidos_vivos")
)

# Calcular taxa de mortalidade infantil (por 1.000 nascidos vivos)
mortalidade = obitos_mun.merge(nasc_mun, on="CODMUNRES", how="inner")
mortalidade["tmi"] = (
    mortalidade["obitos_infantis"] / mortalidade["nascidos_vivos"] * 1000
)

print("Taxa de Mortalidade Infantil por município (SP, 2022):")
print(mortalidade.sort_values("tmi", ascending=False).head(10))
```

## Limitações conhecidas

| Limitação | Detalhes |
|---|---|
| **Sub-registro de óbitos** | Embora a cobertura nacional seja de ~95%, em municípios pequenos do Norte e Nordeste o sub-registro pode ser significativo, subestimando a mortalidade real. |
| **Defasagem temporal** | Os dados anuais são liberados com atraso de 1 a 2 anos. Dados preliminares podem sofrer revisões posteriores. |
| **Formato DBC** | Os arquivos originais estão em formato DBC proprietário, exigindo PySUS ou ferramentas específicas para conversão. |
| **Qualidade da codificação CID-10** | A causa básica do óbito depende da qualidade do preenchimento da Declaração de Óbito pelo médico. Códigos "garbage" (causas mal definidas) ainda representam uma parcela significativa, especialmente em óbitos fora de hospitais. |
| **Causas mal definidas** | Óbitos classificados no capítulo XVIII da CID-10 (sintomas e sinais — R00-R99) indicam causas mal definidas. A proporção varia de 3% nas capitais a 20%+ em áreas rurais. |
| **Óbitos fetais** | São armazenados em arquivo separado (`DOFET`), com campos diferentes dos óbitos não fetais. |
| **Codificação de idade** | O campo IDADE usa codificação especial (4xx=anos, 3xx=meses, etc.), exigindo tratamento antes de análises por faixa etária. |
| **Sem geolocalização precisa** | Os dados contêm apenas código de município, sem coordenadas ou endereço do local do óbito. |
| **Instabilidade do servidor FTP** | O servidor FTP do DATASUS pode apresentar lentidão, especialmente quando arquivos grandes são solicitados. |
| **Protocolo FTP obsoleto em navegadores** | Navegadores modernos (Chrome, Firefox) removeram o suporte ao protocolo FTP. Para acessar os arquivos, utilize clientes FTP (FileZilla, wget, curl) ou a biblioteca PySUS. Alternativamente, acesse a página de transferência de arquivos do DATASUS em `https://datasus.saude.gov.br/transferencia-de-arquivos/`. |
