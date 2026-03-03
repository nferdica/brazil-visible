---
title: CNES — Cadastro Nacional de Estabelecimentos de Saúde
slug: cnes
orgao: DATASUS / MS
url_base: ftp://ftp.datasus.gov.br/dissemin/publicos/CNES/
tipo_acesso: FTP Download
autenticacao: Não requerida
formato_dados: [DBC, DBF, CSV]
frequencia_atualizacao: Mensal
campos_chave:
  - CNES
  - CNPJ
  - codigo_municipio
  - tipo_estabelecimento
  - natureza_juridica
tags:
  - saude
  - estabelecimentos
  - hospitais
  - UBS
  - profissionais de saude
  - leitos
  - equipamentos
  - infraestrutura
  - SUS
  - DATASUS
cruzamento_com:
  - saude-datasus/sih
  - saude-datasus/sim
  - saude-datasus/sinasc
  - saude-datasus/sinan
  - saude-datasus/tabnet
  - receita-federal/cnpj-completa
status: documentado
---

# CNES — Cadastro Nacional de Estabelecimentos de Saúde

## O que é

O **CNES (Cadastro Nacional de Estabelecimentos de Saúde)** é o sistema que cadastra todos os estabelecimentos de saúde do Brasil, sejam públicos ou privados, vinculados ou não ao SUS. Gerenciado pelo **DATASUS/Ministério da Saúde**, o CNES é o cadastro base que identifica e caracteriza a infraestrutura de saúde do país.

O sistema contém informações sobre:

- **Estabelecimentos** — hospitais, UBS (Unidades Básicas de Saúde), clínicas, laboratórios, farmácias, SAMU
- **Profissionais de saúde** — médicos, enfermeiros, dentistas e demais profissionais vinculados a cada estabelecimento
- **Leitos** — quantidade e tipo de leitos hospitalares (cirúrgico, clínico, obstétrico, pediátrico, UTI)
- **Equipamentos** — tomógrafos, ressonâncias magnéticas, raio-X, equipamentos de hemodiálise
- **Habilitações** — serviços especializados habilitados pelo Ministério da Saúde (ex: alta complexidade em oncologia)

O CNES é fundamental porque o **código CNES** (7 dígitos) é a chave primária utilizada em todos os demais sistemas de informação de saúde (SIH, SIA, SIM, SINASC, SINAN) para identificar o estabelecimento de saúde. É, portanto, o principal campo-ponte entre os sistemas de saúde.

> **Abrangência:** O CNES cadastra mais de 400.000 estabelecimentos de saúde em todo o Brasil, incluindo tanto os que atendem pelo SUS quanto os exclusivamente privados.

## Como acessar

### Via FTP (dados brutos)

| Item | Detalhe |
|---|---|
| **URL base** | `ftp://ftp.datasus.gov.br/dissemin/publicos/CNES/200508_/Dados/` |
| **Formato** | DBC (DBF comprimido) — requer conversão |
| **Autenticação** | Não requerida |
| **Organização** | Pastas por tipo de dado (ST, LT, EP, PF, etc.) e arquivos por UF e mês |
| **Atualização** | Mensal |

### Via API CNES (consulta individual)

| Item | Detalhe |
|---|---|
| **URL** | `https://cnes.datasus.gov.br/` |
| **Descrição** | Interface web com consulta individual por estabelecimento |

### Via OpenDATASUS

| Item | Detalhe |
|---|---|
| **URL** | `https://opendatasus.saude.gov.br/` |
| **Formato** | CSV, JSON |
| **Descrição** | Dados pré-processados com documentação |

### Via TabNet

| Item | Detalhe |
|---|---|
| **URL** | `http://tabnet.datasus.gov.br/cgi/deftohtm.exe?cnes/cnv/estabuf.def` |
| **Descrição** | Interface web para tabulação de dados de estabelecimentos e recursos |

### Via PySUS (recomendado para Python)

```bash
pip install pysus
```

## Endpoints/recursos principais

Os dados do CNES são organizados em múltiplos conjuntos de arquivos no FTP, cada um representando um aspecto diferente:

| Prefixo | Descrição | Conteúdo principal |
|---|---|---|
| `ST` | Estabelecimentos | Dados cadastrais (nome, endereço, tipo, natureza jurídica, CNPJ) |
| `LT` | Leitos | Quantidade e tipo de leitos por estabelecimento |
| `EP` | Equipamentos | Equipamentos disponíveis por estabelecimento |
| `PF` | Profissionais | Profissionais de saúde vinculados (CBO, carga horária, vínculo) |
| `HB` | Habilitações | Habilitações e serviços especializados |
| `SR` | Serviços | Serviços de saúde oferecidos |
| `EE` | Ensino | Estabelecimentos de ensino e pesquisa |
| `EF` | Estabelecimento Filantrópico | Dados de filantropias |
| `IN` | Incentivos | Incentivos financeiros recebidos |
| `RC` | Regra Contratual | Regras contratuais com o SUS |
| `GM` | Gestão e Metas | Indicadores de gestão |
| `DC` | Dados Complementares | Informações adicionais |

### Nomenclatura dos arquivos

Os arquivos seguem o padrão: `{PREFIXO}{UF}{AAMM}.dbc`

Exemplos:
- `STSP2301.dbc` — Estabelecimentos de São Paulo, janeiro de 2023
- `LTRJ2306.dbc` — Leitos do Rio de Janeiro, junho de 2023
- `PFMG2312.dbc` — Profissionais de Minas Gerais, dezembro de 2023

### Caminho FTP completo

```
ftp://ftp.datasus.gov.br/dissemin/publicos/CNES/200508_/Dados/{PREFIXO}/{PREFIXO}{UF}{AAMM}.dbc
```

## Exemplo de uso

### Download e leitura com PySUS

```python
from pysus.online_data.CNES import download
import pandas as pd

# Baixar dados de estabelecimentos de São Paulo, janeiro de 2023
dados = download(group="ST", states=["SP"], years=[2023], months=[1])

# Converter para DataFrame
df = dados.to_dataframe()

print(f"Total de estabelecimentos: {len(df):,}")
print(f"Colunas disponíveis: {list(df.columns)}")
print(df.head())
```

### Análise de infraestrutura hospitalar — leitos

```python
from pysus.online_data.CNES import download
import pandas as pd

# Baixar dados de leitos de São Paulo
dados_leitos = download(group="LT", states=["SP"], years=[2023], months=[1])
df_leitos = dados_leitos.to_dataframe()

# Converter campos numéricos
for col in ["QT_EXIST", "QT_CONTR", "QT_SUS"]:
    df_leitos[col] = pd.to_numeric(df_leitos[col], errors="coerce")

# Total de leitos por tipo
leitos_tipo = (
    df_leitos.groupby("TP_LEITO")
    .agg(
        leitos_existentes=("QT_EXIST", "sum"),
        leitos_sus=("QT_SUS", "sum"),
    )
    .sort_values("leitos_existentes", ascending=False)
)

print("Leitos hospitalares por tipo — SP (jan/2023):")
print(leitos_tipo)
print(f"\nTotal de leitos existentes: {leitos_tipo['leitos_existentes'].sum():,}")
print(f"Total de leitos SUS: {leitos_tipo['leitos_sus'].sum():,}")
```

### Análise de profissionais de saúde

```python
from pysus.online_data.CNES import download
import pandas as pd

# Baixar dados de profissionais de Minas Gerais
dados_prof = download(group="PF", states=["MG"], years=[2023], months=[1])
df_prof = dados_prof.to_dataframe()

# CBO (Classificação Brasileira de Ocupações) para médicos: começa com "225"
medicos = df_prof[df_prof["CBO"].str.startswith("225", na=False)]
print(f"Vínculos de médicos em MG: {len(medicos):,}")

# Distribuição por município
medicos_mun = (
    medicos.groupby("CODUFMUN")
    .size()
    .reset_index(name="vinculos_medicos")
    .sort_values("vinculos_medicos", ascending=False)
)

print("\nTop 10 municípios com mais vínculos de médicos:")
print(medicos_mun.head(10))
```

### Mapear equipamentos de alta complexidade

```python
from pysus.online_data.CNES import download
import pandas as pd

# Baixar dados de equipamentos
dados_equip = download(group="EP", states=["RJ"], years=[2023], months=[1])
df_equip = dados_equip.to_dataframe()

df_equip["QT_EXIST"] = pd.to_numeric(df_equip["QT_EXIST"], errors="coerce")
df_equip["QT_USO"] = pd.to_numeric(df_equip["QT_USO"], errors="coerce")

# Equipamentos de diagnóstico por imagem
equipamentos = (
    df_equip.groupby("CODEQUIP")
    .agg(
        total_existente=("QT_EXIST", "sum"),
        total_em_uso=("QT_USO", "sum"),
    )
    .sort_values("total_existente", ascending=False)
    .head(10)
)

print("Top 10 tipos de equipamento — RJ (jan/2023):")
print(equipamentos)
```

## Campos disponíveis

### Estabelecimentos (ST) — campos principais

| Campo | Tipo | Descrição |
|---|---|---|
| `CNES` | string(7) | Código CNES do estabelecimento (chave primária) |
| `CODUFMUN` | string(6) | Código IBGE do município |
| `COD_CEP` | string(8) | CEP do estabelecimento |
| `CPF_CNPJ` | string(14) | CPF ou CNPJ do estabelecimento |
| `RAZAO_SOC` | string | Razão social |
| `FANTASIA` | string | Nome fantasia |
| `NATUREZA` | string(2) | Código da natureza jurídica |
| `TP_ESTAB` | string(2) | Tipo de estabelecimento (hospital, UBS, clínica, etc.) |
| `TP_GESTAO` | string(1) | Tipo de gestão (`M`=Municipal, `E`=Estadual, `D`=Dupla) |
| `TP_UNID` | string(2) | Tipo de unidade |
| `VINC_SUS` | string(1) | Vínculo com o SUS (`1`=Sim, `0`=Não) |
| `ATEND_AMB` | string(1) | Atendimento ambulatorial |
| `ATEND_INT` | string(1) | Atendimento de internação |
| `ATEND_URG` | string(1) | Atendimento de urgência |
| `TURNO_AT` | string(2) | Turno de atendimento |
| `NIV_HIER` | string(2) | Nível de hierarquia no SUS |
| `GESPRam` | string(1) | Gestão plena do sistema |

### Leitos (LT) — campos principais

| Campo | Tipo | Descrição |
|---|---|---|
| `CNES` | string(7) | Código CNES do estabelecimento |
| `CODUFMUN` | string(6) | Código IBGE do município |
| `TP_LEITO` | string(2) | Tipo de leito (cirúrgico, clínico, obstétrico, pediátrico, etc.) |
| `CODLEITO` | string(2) | Código específico do tipo de leito |
| `QT_EXIST` | int | Quantidade de leitos existentes |
| `QT_CONTR` | int | Quantidade de leitos contratados |
| `QT_SUS` | int | Quantidade de leitos SUS |

### Profissionais (PF) — campos principais

| Campo | Tipo | Descrição |
|---|---|---|
| `CNES` | string(7) | Código CNES do estabelecimento |
| `CODUFMUN` | string(6) | Código IBGE do município |
| `CBO` | string(6) | Código CBO da ocupação do profissional |
| `CBOUNICO` | string(6) | CBO único do profissional |
| `NOMEPROF` | string | Nome do profissional |
| `CNS_PROF` | string(15) | Cartão Nacional de Saúde do profissional |
| `VINCULAC` | string(6) | Tipo de vínculo empregatício |
| `HORAAMB` | int | Carga horária ambulatorial semanal |
| `HORAHOSP` | int | Carga horária hospitalar semanal |

## Cruzamentos possíveis

| Cruzamento | Fonte relacionada | Chave de ligação | Finalidade |
|---|---|---|---|
| Estabelecimentos x Internações | [SIH](/docs/apis/saude-datasus/sih) | `CNES` | Analisar desempenho hospitalar: internações, custos e mortalidade por hospital |
| Estabelecimentos x Mortalidade | [SIM](/docs/apis/saude-datasus/sim) | `CNES` | Identificar hospitais com maiores taxas de óbito |
| Estabelecimentos x Nascimentos | [SINASC](/docs/apis/saude-datasus/sinasc) | `CNES` | Analisar maternidades: volume de partos, taxas de cesárea, baixo peso |
| Estabelecimentos x Agravos | [SINAN](/docs/apis/saude-datasus/sinan) | `CNES`, `municipio` | Relacionar unidades notificadoras com agravos de saúde |
| Estabelecimentos x CNPJ | [Receita Federal — CNPJ](/docs/apis/receita-federal/cnpj-completa) | `CNPJ` | Verificar situação cadastral e dados societários de estabelecimentos privados |
| Estabelecimentos x Tabulação | [TabNet](/docs/apis/saude-datasus/tabnet) | Diversos | Consulta rápida de indicadores de recursos de saúde |

### Exemplo de cruzamento: leitos x internações

```python
from pysus.online_data.CNES import download as download_cnes
from pysus.online_data.SIH import download as download_sih
import pandas as pd

# Baixar leitos e internações de SP, jan/2023
leitos = download_cnes(group="LT", states=["SP"], years=[2023], months=[1])
df_leitos = leitos.to_dataframe()

internacoes = download_sih(states=["SP"], years=[2023], months=[1], group="RD")
df_inter = internacoes.to_dataframe()

# Leitos totais por hospital
df_leitos["QT_SUS"] = pd.to_numeric(df_leitos["QT_SUS"], errors="coerce")
leitos_hosp = df_leitos.groupby("CNES")["QT_SUS"].sum().reset_index()

# Internações por hospital
inter_hosp = df_inter.groupby("CNES").size().reset_index(name="internacoes")

# Cruzar: taxa de ocupação estimada
ocupacao = leitos_hosp.merge(inter_hosp, on="CNES", how="inner")
ocupacao["taxa_ocupacao"] = (
    ocupacao["internacoes"] / (ocupacao["QT_SUS"] * 31) * 100  # 31 dias no mês
)

print("Hospitais com maior taxa de ocupação estimada:")
print(
    ocupacao.query("QT_SUS >= 50")
    .sort_values("taxa_ocupacao", ascending=False)
    .head(10)
    .round(1)
)
```

## Limitações conhecidas

| Limitação | Detalhes |
|---|---|
| **Atualização cadastral** | Embora a base seja mensal, muitos estabelecimentos não atualizam seus dados regularmente, resultando em informações desatualizadas sobre leitos, equipamentos e profissionais. |
| **Formato DBC** | Arquivos originais em formato proprietário DBC, exigindo PySUS ou ferramentas específicas para conversão. |
| **Volume de dados** | O CNES é composto por múltiplos conjuntos de dados (ST, LT, EP, PF, etc.), cada um com centenas de milhares a milhões de registros por mês. O processamento completo requer significativa capacidade computacional. |
| **Profissionais com múltiplos vínculos** | Um profissional de saúde pode ter vínculos em vários estabelecimentos. A contagem simples de registros superestima o número de profissionais. |
| **Leitos vs. realidade** | A quantidade de leitos cadastrados pode diferir da quantidade efetivamente operacional, especialmente em períodos de crise ou reforma. |
| **Estabelecimentos inativos** | Estabelecimentos desativados podem permanecer no cadastro por um período, inflando contagens. |
| **Falta de geolocalização** | Os dados contêm endereço e CEP, mas não coordenadas geográficas. Geocodificação é necessária para análises espaciais. |
| **Instabilidade do servidor FTP** | O servidor FTP do DATASUS pode apresentar lentidão ou indisponibilidade. |
| **Protocolo FTP obsoleto em navegadores** | Navegadores modernos (Chrome, Firefox) removeram o suporte ao protocolo FTP. Para acessar os arquivos, utilize clientes FTP (FileZilla, wget, curl) ou a biblioteca PySUS. Alternativamente, acesse a página de transferência de arquivos do DATASUS em `https://datasus.saude.gov.br/transferencia-de-arquivos/`. |
