---
title: SINASC — Sistema de Informações sobre Nascidos Vivos
slug: sinasc
orgao: DATASUS / MS
url_base: ftp://ftp.datasus.gov.br/dissemin/publicos/SINASC/
tipo_acesso: FTP Download
autenticacao: Não requerida
formato_dados: [DBC, DBF, CSV]
frequencia_atualizacao: Anual
campos_chave:
  - codigo_municipio
  - CNES
  - peso_nascer
  - idade_mae
  - tipo_parto
  - semanas_gestacao
tags:
  - saude
  - nascimentos
  - nascidos vivos
  - natalidade
  - parto
  - gestacao
  - DATASUS
cruzamento_com:
  - saude-datasus/sim
  - saude-datasus/sih
  - saude-datasus/cnes
  - saude-datasus/tabnet
  - ibge-estatisticas/censo-demografico
status: documentado
---

# SINASC — Sistema de Informações sobre Nascidos Vivos

## O que é

O **SINASC (Sistema de Informações sobre Nascidos Vivos)** é o sistema oficial de registro de nascimentos no Brasil, gerenciado pelo **DATASUS/Ministério da Saúde**. Implantado em 1990, o sistema é alimentado pelas **Declarações de Nascido Vivo (DN)**, documento padronizado e obrigatório emitido para todo nascimento com vida em território nacional.

O SINASC registra informações detalhadas sobre cada nascimento:

- **Dados do recém-nascido** — peso ao nascer, índice de Apgar, sexo, presença de anomalias congênitas
- **Dados da gestação** — duração (semanas), tipo de gravidez (única/múltipla), número de consultas de pré-natal
- **Dados do parto** — tipo de parto (vaginal/cesárea), local (hospital, domicílio), estabelecimento de saúde
- **Dados da mãe** — idade, escolaridade, raça/cor, estado civil, município de residência, número de filhos anteriores

O SINASC é fundamental para o cálculo de indicadores de saúde materno-infantil, incluindo taxas de natalidade, proporção de cesáreas, cobertura de pré-natal, incidência de baixo peso ao nascer e prematuridade.

> **Cobertura:** O SINASC cobre cerca de 97% dos nascimentos no Brasil, sendo a cobertura mais alta nas regiões Sul e Sudeste. A informação complementa os registros civis de nascimento feitos em cartório (IBGE).

## Como acessar

### Via FTP (dados brutos)

| Item | Detalhe |
|---|---|
| **URL base** | `ftp://ftp.datasus.gov.br/dissemin/publicos/SINASC/NOV/DNRES/` |
| **Formato** | DBC (DBF comprimido) — requer conversão |
| **Autenticação** | Não requerida |
| **Organização** | Arquivos por UF e ano (`DN{UF}{AAAA}.dbc`) |
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
| **URL** | `http://tabnet.datasus.gov.br/cgi/deftohtm.exe?sinasc/cnv/nvuf.def` |
| **Descrição** | Interface web para consulta e tabulação de dados de nascimentos |

### Via PySUS (recomendado para Python)

```bash
pip install pysus
```

## Endpoints/recursos principais

### Arquivos disponíveis no FTP

| Diretório | Descrição | Período |
|---|---|---|
| `NOV/DNRES/` | Declarações de Nascido Vivo por residência (novo layout) | 1996 em diante |
| `ANT/DNRES/` | Declarações de Nascido Vivo (layout antigo) | 1994–1995 |

### Nomenclatura dos arquivos

Os arquivos seguem o padrão: `DN{UF}{AAAA}.dbc`

Exemplos:
- `DNSP2022.dbc` — Nascimentos em São Paulo, 2022
- `DNRJ2021.dbc` — Nascimentos no Rio de Janeiro, 2021

### Caminho FTP completo

```
ftp://ftp.datasus.gov.br/dissemin/publicos/SINASC/NOV/DNRES/DN{UF}{AAAA}.dbc
```

## Exemplo de uso

### Download e leitura com PySUS

```python
from pysus.online_data.SINASC import download
import pandas as pd

# Baixar dados de nascidos vivos de São Paulo, 2022
dados = download(states=["SP"], years=[2022])

# Converter para DataFrame
df = dados.to_dataframe()

print(f"Total de nascidos vivos registrados: {len(df):,}")
print(f"Colunas disponíveis: {list(df.columns)}")
print(df.head())
```

### Análise de proporção de cesáreas por município

```python
from pysus.online_data.SINASC import download
import pandas as pd

# Baixar dados de Minas Gerais
dados = download(states=["MG"], years=[2022])
df = dados.to_dataframe()

# PARTO: 1=Vaginal, 2=Cesáreo
df["tipo_parto"] = df["PARTO"].map({"1": "Vaginal", "2": "Cesáreo"})

# Proporção de cesáreas por município
cesareas = (
    df.groupby("CODMUNRES")
    .apply(lambda g: pd.Series({
        "total_nascimentos": len(g),
        "cesareas": (g["PARTO"] == "2").sum(),
        "prop_cesarea": (g["PARTO"] == "2").mean() * 100,
    }))
    .reset_index()
    .query("total_nascimentos >= 100")
    .sort_values("prop_cesarea", ascending=False)
)

print("Municípios com maior proporção de cesáreas (min. 100 nascimentos):")
print(cesareas.head(10).round(1))
print(f"\nMédia estadual de cesáreas: {cesareas['prop_cesarea'].mean():.1f}%")
```

### Análise de baixo peso ao nascer e prematuridade

```python
from pysus.online_data.SINASC import download
import pandas as pd

# Baixar dados do Rio Grande do Sul
dados = download(states=["RS"], years=[2022])
df = dados.to_dataframe()

# Converter campos numéricos
df["PESO"] = pd.to_numeric(df["PESO"], errors="coerce")
df["GESTACAO"] = pd.to_numeric(df["GESTACAO"], errors="coerce")

# Baixo peso ao nascer (< 2.500g)
baixo_peso = df[df["PESO"] < 2500]
print(f"Nascidos com baixo peso (< 2.500g): {len(baixo_peso):,}")
print(f"Proporção: {len(baixo_peso) / len(df) * 100:.1f}%")

# Prematuridade (< 37 semanas de gestação)
# GESTACAO codificada: 1=<22sem, 2=22-27, 3=28-31, 4=32-36, 5=37-41, 6=42+
prematuros = df[df["GESTACAO"].isin([1, 2, 3, 4])]
print(f"\nNascidos prematuros (< 37 semanas): {len(prematuros):,}")
print(f"Proporção: {len(prematuros) / len(df) * 100:.1f}%")
```

### Perfil materno e cobertura de pré-natal

```python
from pysus.online_data.SINASC import download
import pandas as pd

# Baixar dados da Bahia
dados = download(states=["BA"], years=[2022])
df = dados.to_dataframe()

# Idade da mãe
df["IDADEMAE"] = pd.to_numeric(df["IDADEMAE"], errors="coerce")

faixas_mae = pd.cut(
    df["IDADEMAE"],
    bins=[0, 15, 20, 25, 30, 35, 40, 55],
    labels=["<15", "15-19", "20-24", "25-29", "30-34", "35-39", "40+"],
)
print("Distribuição por idade da mãe:")
print(faixas_mae.value_counts().sort_index())

# Consultas de pré-natal
# CONSPRENAT: número de consultas
df["CONSPRENAT"] = pd.to_numeric(df["CONSPRENAT"], errors="coerce")
print(f"\nMédia de consultas de pré-natal: {df['CONSPRENAT'].mean():.1f}")
print(f"Sem pré-natal (0 consultas): {(df['CONSPRENAT'] == 0).sum():,}")
print(f"Pré-natal adequado (7+ consultas): {(df['CONSPRENAT'] >= 7).sum():,}")
```

## Campos disponíveis

### Declaração de Nascido Vivo (DN) — campos principais

| Campo | Tipo | Descrição |
|---|---|---|
| `NUMERODN` | string | Número da Declaração de Nascido Vivo |
| `CODMUNRES` | string(6) | Código IBGE do município de residência da mãe |
| `CODMUNNASC` | string(6) | Código IBGE do município de nascimento |
| `CODESTAB` | string(7) | Código CNES do estabelecimento de saúde |
| `DTNASC` | string(8) | Data de nascimento (DDMMAAAA) |
| `HORANASC` | string(4) | Hora do nascimento (HHMM) |
| `SEXO` | string(1) | Sexo (`1`=Masculino, `2`=Feminino, `0`=Ignorado) |
| `PESO` | int | Peso ao nascer em gramas |
| `APGAR1` | string(2) | Índice de Apgar no 1º minuto |
| `APGAR5` | string(2) | Índice de Apgar no 5º minuto |
| `IDADEMAE` | int | Idade da mãe em anos |
| `ESCMAE` | string(1) | Escolaridade da mãe (em faixas de anos de estudo) |
| `RACACORMAE` | string(1) | Raça/cor da mãe (`1`=Branca, `2`=Preta, `3`=Amarela, `4`=Parda, `5`=Indígena) |
| `ESTCIVMAE` | string(1) | Estado civil da mãe |
| `GESTACAO` | string(1) | Semanas de gestação (`1`=menos de 22, `2`=22-27, `3`=28-31, `4`=32-36, `5`=37-41, `6`=42+) |
| `GRAVIDEZ` | string(1) | Tipo de gravidez (`1`=Única, `2`=Dupla, `3`=Tripla ou mais) |
| `PARTO` | string(1) | Tipo de parto (`1`=Vaginal, `2`=Cesáreo) |
| `CONSPRENAT` | int | Número de consultas de pré-natal |
| `QTDFILVIVO` | int | Número de filhos vivos anteriores |
| `QTDFILMORT` | int | Número de filhos mortos anteriores |
| `LOCNASC` | string(1) | Local de nascimento (`1`=Hospital, `2`=Outro estab. saúde, `3`=Domicílio, `4`=Outros) |
| `IDANOMAL` | string(1) | Presença de anomalia congênita (`1`=Sim, `2`=Não, `9`=Ignorado) |
| `CODANOMAL` | string | Código CID-10 da anomalia congênita (quando presente) |
| `RACACOR` | string(1) | Raça/cor do recém-nascido |
| `SEMAGESTAC` | int | Semanas de gestação (campo numérico, quando disponível) |

## Cruzamentos possíveis

| Cruzamento | Fonte relacionada | Chave de ligação | Finalidade |
|---|---|---|---|
| Nascimentos x Mortalidade | [SIM](/docs/apis/saude-datasus/sim) | `municipio`, `periodo` | Calcular mortalidade infantil (óbitos menores de 1 ano / nascidos vivos) |
| Nascimentos x Internações | [SIH](/docs/apis/saude-datasus/sih) | `CNES`, `municipio` | Analisar internações obstétricas e neonatais associadas aos nascimentos |
| Nascimentos x Estabelecimentos | [CNES](/docs/apis/saude-datasus/cnes) | `CNES` | Identificar maternidades, seus recursos e profissionais |
| Nascimentos x População | IBGE — Estimativas populacionais | `codigo_municipio` | Calcular taxa de natalidade (nascidos vivos por 1.000 habitantes) |
| Nascimentos x Tabulação | [TabNet](/docs/apis/saude-datasus/tabnet) | Diversos | Consulta rápida de indicadores de natalidade sem download |

### Exemplo de cruzamento: mortalidade neonatal

```python
from pysus.online_data.SINASC import download as download_sinasc
from pysus.online_data.SIM import download as download_sim
import pandas as pd

# Baixar nascimentos e óbitos de SP, 2022
nascimentos = download_sinasc(states=["SP"], years=[2022]).to_dataframe()
obitos = download_sim(states=["SP"], years=[2022]).to_dataframe()

# Filtrar óbitos neonatais (< 28 dias de vida)
# IDADE: 1xx=horas, 2xx=dias → menor que 228 (28 dias)
obitos["IDADE"] = pd.to_numeric(obitos["IDADE"], errors="coerce")
obitos_neonatais = obitos[
    (obitos["IDADE"] < 228) & (obitos["TIPOBITO"] == "2")
]

# Taxa de mortalidade neonatal por município
nasc_mun = nascimentos.groupby("CODMUNRES").size().reset_index(name="nascidos_vivos")
obit_mun = obitos_neonatais.groupby("CODMUNRES").size().reset_index(name="obitos_neonatais")

mortalidade = nasc_mun.merge(obit_mun, on="CODMUNRES", how="left").fillna(0)
mortalidade["taxa_neonatal"] = (
    mortalidade["obitos_neonatais"] / mortalidade["nascidos_vivos"] * 1000
)

print("Taxa de mortalidade neonatal (por 1.000 NV) — SP, 2022:")
print(mortalidade.sort_values("taxa_neonatal", ascending=False).head(10).round(2))
```

## Limitações conhecidas

| Limitação | Detalhes |
|---|---|
| **Defasagem temporal** | Os dados anuais são liberados com atraso de 1 a 2 anos. A consolidação final pode levar até 2 anos após o ano de referência. |
| **Formato DBC** | Arquivos originais em formato proprietário DBC, exigindo PySUS ou ferramentas específicas para conversão. |
| **Sub-registro residual** | Embora a cobertura seja alta (~97%), nascimentos domiciliares em áreas remotas podem não ser registrados, especialmente em comunidades indígenas e rurais. |
| **Campos com preenchimento incompleto** | Campos como `CODANOMAL` (anomalias congênitas), `CONSPRENAT` (consultas de pré-natal) e `ESCMAE` (escolaridade da mãe) podem ter alta proporção de dados faltantes em alguns municípios. |
| **Codificação de semanas de gestação** | O campo `GESTACAO` usa faixas categóricas, não o número exato de semanas. O campo `SEMAGESTAC` (numérico) foi introduzido posteriormente e pode não estar disponível em anos mais antigos. |
| **Mudanças no formulário** | A Declaração de Nascido Vivo passou por reformulações em 1999 e 2011, alterando campos disponíveis e codificações. Análises longitudinais devem considerar essas mudanças. |
| **Sem identificação individual** | Não há identificador único que permita vincular um nascimento a registros posteriores (internações, óbitos). Linkage probabilístico é necessário. |
| **Instabilidade do servidor FTP** | O servidor FTP do DATASUS pode apresentar lentidão ou indisponibilidade. |
| **Protocolo FTP obsoleto em navegadores** | Navegadores modernos (Chrome, Firefox) removeram o suporte ao protocolo FTP. Para acessar os arquivos, utilize clientes FTP (FileZilla, wget, curl) ou a biblioteca PySUS. Alternativamente, acesse a página de transferência de arquivos do DATASUS em `https://datasus.saude.gov.br/transferencia-de-arquivos/`. |
