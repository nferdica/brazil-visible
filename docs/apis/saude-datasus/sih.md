---
title: SIH — Sistema de Informações Hospitalares
slug: sih
orgao: DATASUS / MS
url_base: ftp://ftp.datasus.gov.br/dissemin/publicos/SIHSUS/
tipo_acesso: FTP Download
autenticacao: Não requerida
formato_dados: [DBC, DBF, CSV]
frequencia_atualizacao: Mensal
campos_chave:
  - AIH
  - CNES
  - CID-10
  - codigo_municipio
  - procedimento_SUS
  - valor_internacao
tags:
  - saude
  - internacoes
  - hospitalar
  - AIH
  - SUS
  - procedimentos
  - leitos
  - DATASUS
cruzamento_com:
  - saude-datasus/cnes
  - saude-datasus/sim
  - saude-datasus/sinan
  - saude-datasus/tabnet
  - ibge-estatisticas/censo-demografico
status: documentado
---

# SIH — Sistema de Informações Hospitalares

## O que é

O **SIH (Sistema de Informações Hospitalares do SUS)** é o principal sistema de registro de internações hospitalares realizadas pelo Sistema Único de Saúde no Brasil. Gerenciado pelo **DATASUS/Ministério da Saúde**, o SIH processa as **Autorizações de Internação Hospitalar (AIH)**, que são documentos que autorizam e registram cada internação em hospitais da rede pública ou conveniada ao SUS.

O sistema contém informações detalhadas sobre:

- **Diagnósticos** — causa da internação codificada pela CID-10 (Classificação Internacional de Doenças)
- **Procedimentos realizados** — cirurgias, tratamentos clínicos, exames durante a internação
- **Dados do paciente** — idade, sexo, município de residência (sem dados de identificação pessoal)
- **Dados do hospital** — código CNES do estabelecimento, leitos utilizados
- **Dados financeiros** — valor pago pelo SUS, tempo de permanência, custos por procedimento

O SIH é fundamental para análises de morbidade hospitalar, planejamento de saúde, auditoria de gastos hospitalares e estudos epidemiológicos baseados em dados de internação.

> **Importante:** Os dados do SIH cobrem apenas internações pelo SUS (cerca de 75% das internações no Brasil). Internações em hospitais privados sem vínculo com o SUS não são registradas.

## Como acessar

### Via FTP (dados brutos)

| Item | Detalhe |
|---|---|
| **URL base** | `ftp://ftp.datasus.gov.br/dissemin/publicos/SIHSUS/` |
| **Formato** | DBC (DBF comprimido) — requer conversão |
| **Autenticação** | Não requerida |
| **Organização** | Pastas por ano e UF (`/200801_/Dados/`) |
| **Atualização** | Mensal, com defasagem de 2 a 6 meses |

### Via OpenDATASUS

| Item | Detalhe |
|---|---|
| **URL** | `https://opendatasus.saude.gov.br/` |
| **Formato** | CSV, JSON |
| **Descrição** | Portal mais moderno com dados pré-processados e documentação |

### Via TabNet

| Item | Detalhe |
|---|---|
| **URL** | `http://tabnet.datasus.gov.br/cgi/deftohtm.exe?sih/cnv/niuf.def` |
| **Descrição** | Interface web para tabulação e consulta interativa |

### Via PySUS (recomendado para Python)

O **PySUS** é uma biblioteca Python que automatiza o download e a conversão dos arquivos DBC do DATASUS:

```bash
pip install pysus
```

## Endpoints/recursos principais

Os dados do SIH são organizados em dois conjuntos principais de arquivos no FTP:

| Prefixo | Descrição | Conteúdo |
|---|---|---|
| `RD` | AIH Reduzida | Dados resumidos de cada internação (mais utilizado) |
| `RJ` | AIH Rejeitada | Internações cujas AIH foram rejeitadas na auditoria |
| `SP` | Serviços Profissionais | Procedimentos realizados por profissionais durante a internação |
| `ER` | AIH Rejeitada (erro) | Registros com erros de preenchimento |

### Nomenclatura dos arquivos

Os arquivos seguem o padrão: `{PREFIXO}{UF}{AAMM}.dbc`

Exemplos:
- `RDSP2301.dbc` — AIH Reduzida de São Paulo, janeiro de 2023
- `RDRJ2312.dbc` — AIH Reduzida do Rio de Janeiro, dezembro de 2023

### Caminho FTP completo

```
ftp://ftp.datasus.gov.br/dissemin/publicos/SIHSUS/200801_/Dados/RD{UF}{AAMM}.dbc
```

## Exemplo de uso

### Download e leitura com PySUS

```python
from pysus.online_data.SIH import download
import pandas as pd

# Baixar AIH Reduzida de São Paulo, janeiro de 2023
# Retorna um objeto Parquet que pode ser convertido para DataFrame
dados = download(states=["SP"], years=[2023], months=[1], group="RD")

# Converter para DataFrame
df = dados.to_dataframe()

print(f"Total de internações: {len(df):,}")
print(f"Colunas disponíveis: {list(df.columns)}")
print(df.head())
```

### Análise de internações por diagnóstico (CID-10)

```python
from pysus.online_data.SIH import download
import pandas as pd

# Baixar dados de internação de Minas Gerais, 2023
dados = download(states=["MG"], years=[2023], months=[1, 2, 3], group="RD")
df = dados.to_dataframe()

# Top 10 diagnósticos principais (CID-10)
top_diagnosticos = (
    df.groupby("DIAG_PRINC")
    .agg(
        total_internacoes=("N_AIH", "count"),
        valor_total=("VAL_TOT", "sum"),
        media_dias=("DIAS_PERM", "mean"),
    )
    .sort_values("total_internacoes", ascending=False)
    .head(10)
)

print("Top 10 diagnósticos — Internações SUS em MG (1º tri/2023):")
print(top_diagnosticos)
```

### Análise de custos hospitalares por município

```python
from pysus.online_data.SIH import download
import pandas as pd

# Baixar dados do Rio de Janeiro
dados = download(states=["RJ"], years=[2023], months=[6], group="RD")
df = dados.to_dataframe()

# Converter campos numéricos
df["VAL_TOT"] = pd.to_numeric(df["VAL_TOT"], errors="coerce")
df["DIAS_PERM"] = pd.to_numeric(df["DIAS_PERM"], errors="coerce")

# Gastos por município de internação
gastos_municipio = (
    df.groupby("MUNIC_RES")
    .agg(
        internacoes=("N_AIH", "count"),
        gasto_total=("VAL_TOT", "sum"),
        media_permanencia=("DIAS_PERM", "mean"),
    )
    .sort_values("gasto_total", ascending=False)
    .head(10)
)

print("Top 10 municípios por gasto hospitalar SUS:")
print(gastos_municipio)
```

## Campos disponíveis

### AIH Reduzida (RD) — campos principais

| Campo | Tipo | Descrição |
|---|---|---|
| `N_AIH` | string | Número da AIH (identificador da internação) |
| `UF_ZI` | string(6) | Código IBGE do município de internação |
| `ANO_CMPT` | string(4) | Ano de competência (processamento) |
| `MES_CMPT` | string(2) | Mês de competência |
| `ESPEC` | string(2) | Especialidade do leito |
| `CGC_HOSP` | string(14) | CNPJ do hospital |
| `CNES` | string(7) | Código CNES do estabelecimento de saúde |
| `MUNIC_RES` | string(6) | Código IBGE do município de residência do paciente |
| `NASC` | string(8) | Data de nascimento do paciente (AAAAMMDD) |
| `SEXO` | string(1) | Sexo do paciente (`1`=Masculino, `3`=Feminino) |
| `PROC_REA` | string(10) | Código do procedimento realizado (tabela SUS) |
| `DIAG_PRINC` | string(4) | Diagnóstico principal (código CID-10) |
| `DIAG_SECUN` | string(4) | Diagnóstico secundário (código CID-10) |
| `VAL_TOT` | float | Valor total pago pela internação (R$) |
| `VAL_SH` | float | Valor dos serviços hospitalares (R$) |
| `VAL_SP` | float | Valor dos serviços profissionais (R$) |
| `DT_INTER` | string(8) | Data da internação (AAAAMMDD) |
| `DT_SAIDA` | string(8) | Data de saída (AAAAMMDD) |
| `DIAS_PERM` | int | Dias de permanência hospitalar |
| `COBRANCA` | string(2) | Tipo de cobrança |
| `MORTE` | string(1) | Indicador de óbito durante a internação (`0`=Não, `1`=Sim) |
| `IDADE` | int | Idade do paciente |
| `MARCA_UTI` | string(2) | Indicador de uso de UTI |
| `UTI_MES_TO` | int | Total de dias em UTI |
| `COMPLEX` | string(2) | Complexidade do procedimento (alta, média, básica) |

## Cruzamentos possíveis

| Cruzamento | Fonte relacionada | Chave de ligação | Finalidade |
|---|---|---|---|
| Internações x Estabelecimentos | [CNES](/docs/apis/saude-datasus/cnes) | `CNES` | Identificar o hospital, tipo de estabelecimento, leitos disponíveis e profissionais |
| Internações x Mortalidade | [SIM](/docs/apis/saude-datasus/sim) | `CID-10`, `municipio`, `periodo` | Comparar internações com óbitos para calcular letalidade hospitalar |
| Internações x Doenças notificáveis | [SINAN](/docs/apis/saude-datasus/sinan) | `CID-10`, `municipio` | Correlacionar surtos de doenças notificáveis com aumento de internações |
| Internações x Nascimentos | [SINASC](/docs/apis/saude-datasus/sinasc) | `CNES`, `municipio` | Analisar internações obstétricas e neonatais junto com dados de nascimentos |
| Internações x População | IBGE — Estimativas populacionais | `codigo_municipio` | Calcular taxas de internação por 1.000 habitantes |
| Internações x Tabulação | [TabNet](/docs/apis/saude-datasus/tabnet) | Diversos | Consulta rápida de indicadores hospitalares sem necessidade de download |

### Exemplo de cruzamento: letalidade hospitalar por CID-10

```python
from pysus.online_data.SIH import download
import pandas as pd

# Baixar internações de SP
dados = download(states=["SP"], years=[2023], months=[1], group="RD")
df = dados.to_dataframe()

df["MORTE"] = pd.to_numeric(df["MORTE"], errors="coerce")

# Calcular taxa de letalidade por diagnóstico
letalidade = (
    df.groupby("DIAG_PRINC")
    .agg(
        total_internacoes=("N_AIH", "count"),
        total_obitos=("MORTE", "sum"),
    )
    .assign(taxa_letalidade=lambda x: x["total_obitos"] / x["total_internacoes"] * 100)
    .query("total_internacoes >= 100")
    .sort_values("taxa_letalidade", ascending=False)
    .head(10)
)

print("CID-10 com maior letalidade hospitalar (min. 100 internações):")
print(letalidade.round(2))
```

## Limitações conhecidas

| Limitação | Detalhes |
|---|---|
| **Cobertura restrita ao SUS** | Apenas internações financiadas pelo SUS são registradas. Internações particulares ou por convênios não aparecem nos dados. |
| **Formato DBC** | Os arquivos originais estão em formato DBC (DBF comprimido proprietário), que requer a biblioteca PySUS ou o descompressor `blast` para conversão. |
| **Defasagem temporal** | Os dados são disponibilizados com atraso de 2 a 6 meses em relação ao mês de competência. |
| **Dados administrativos** | O SIH é um sistema de faturamento, não de prontuário clínico. Os diagnósticos registrados podem refletir codificação para maximizar reembolso, não necessariamente o diagnóstico mais preciso. |
| **Sem identificação do paciente** | Não é possível rastrear um mesmo paciente entre internações diferentes (não há identificador único do paciente nos microdados públicos). |
| **Duplicidade de AIH** | Uma mesma internação pode gerar múltiplas AIH (de longa permanência), exigindo cuidado na contagem de internações. |
| **Qualidade da codificação CID-10** | A precisão do código CID-10 depende da qualidade da codificação feita pelo hospital. Diagnósticos genéricos (ex: R69 — "Causa mal definida") são frequentes. |
| **Instabilidade do FTP** | O servidor FTP do DATASUS pode apresentar lentidão ou indisponibilidade, especialmente em horários comerciais. |
| **Mudanças na tabela de procedimentos** | A tabela SUS de procedimentos sofre atualizações periódicas, o que pode dificultar análises longitudinais sem compatibilização de códigos. |
| **Protocolo FTP obsoleto em navegadores** | Navegadores modernos (Chrome, Firefox) removeram o suporte ao protocolo FTP. Para acessar os arquivos, utilize clientes FTP (FileZilla, wget, curl) ou a biblioteca PySUS. Alternativamente, acesse a página de transferência de arquivos do DATASUS em `https://datasus.saude.gov.br/transferencia-de-arquivos/`. |
