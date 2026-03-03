---
title: SINAN — Sistema de Informação de Agravos de Notificação
slug: sinan
orgao: DATASUS / MS
url_base: ftp://ftp.datasus.gov.br/dissemin/publicos/SINAN/
tipo_acesso: FTP Download
autenticacao: Não requerida
formato_dados: [DBC, DBF, CSV]
frequencia_atualizacao: Mensal
campos_chave:
  - CID-10
  - codigo_municipio
  - data_notificacao
  - agravo
  - classificacao_final
tags:
  - saude
  - epidemiologia
  - doencas
  - notificacao compulsoria
  - vigilancia epidemiologica
  - dengue
  - tuberculose
  - DATASUS
cruzamento_com:
  - saude-datasus/sih
  - saude-datasus/sim
  - saude-datasus/cnes
  - saude-datasus/tabnet
  - ibge-estatisticas/censo-demografico
status: documentado
---

# SINAN — Sistema de Informação de Agravos de Notificação

## O que é

O **SINAN (Sistema de Informação de Agravos de Notificação)** é o principal sistema de vigilância epidemiológica do Brasil, gerenciado pelo **DATASUS/Ministério da Saúde**. O sistema registra as notificações e investigações de doenças e agravos de **notificação compulsória** — ou seja, doenças que, por lei, todo profissional de saúde é obrigado a comunicar às autoridades sanitárias.

O SINAN é alimentado pelas **Fichas de Notificação** e **Fichas de Investigação**, preenchidas por unidades de saúde em todo o país. O sistema permite:

- **Monitoramento epidemiológico** — acompanhar a incidência de doenças como dengue, tuberculose, hanseníase, meningite, COVID-19
- **Detecção de surtos** — identificar aumentos incomuns de casos em uma região
- **Planejamento de ações** — subsidiar medidas de controle e prevenção
- **Cálculo de indicadores** — taxas de incidência, prevalência, letalidade

A **Lista Nacional de Notificação Compulsória** inclui mais de 50 doenças e agravos, entre eles: dengue, chikungunya, zika, tuberculose, hanseníase, meningite, AIDS/HIV, sífilis, hepatites virais, leishmaniose, malária, leptospirose, acidentes com animais peçonhentos, violência interpessoal e intoxicações exógenas.

> **Importante:** O SINAN registra apenas doenças de notificação compulsória. Doenças comuns (gripe, resfriado, gastroenterite leve) não são notificadas, a menos que configurem surto.

## Como acessar

### Via FTP (dados brutos)

| Item | Detalhe |
|---|---|
| **URL base** | `ftp://ftp.datasus.gov.br/dissemin/publicos/SINAN/DADOS/` |
| **Formato** | DBC (DBF comprimido) — requer conversão |
| **Autenticação** | Não requerida |
| **Organização** | Arquivos por agravo e ano (`{AGRAVO}{UF}{AA}.dbc` ou `{AGRAVO}BR{AA}.dbc`) |
| **Atualização** | Mensal (dados preliminares) e anual (dados finais) |

### Via OpenDATASUS

| Item | Detalhe |
|---|---|
| **URL** | `https://opendatasus.saude.gov.br/` |
| **Formato** | CSV, JSON |
| **Descrição** | Dados de agravos selecionados com documentação e metadados |

### Via TabNet

| Item | Detalhe |
|---|---|
| **URL** | `http://tabnet.datasus.gov.br/cgi/deftohtm.exe?sinannet/cnv/denguebbr.def` |
| **Descrição** | Interface web para tabulação de dados epidemiológicos por agravo |

### Via PySUS (recomendado para Python)

```bash
pip install pysus
```

## Endpoints/recursos principais

### Agravos disponíveis no FTP

Os dados são organizados por agravo (doença), com prefixos específicos:

| Prefixo | Agravo | CID-10 |
|---|---|---|
| `DENG` | Dengue | A90-A91 |
| `CHIK` | Chikungunya | A92.0 |
| `ZIKA` | Zika | — |
| `TUBE` | Tuberculose | A15-A19 |
| `HANS` | Hanseníase | A30 |
| `MENI` | Meningite | G00-G03 |
| `HEPA` | Hepatites virais | B15-B19 |
| `LEIV` | Leishmaniose visceral | B55.0 |
| `LEIT` | Leishmaniose tegumentar | B55.1-B55.2 |
| `LEPR` | Leptospirose | A27 |
| `MALA` | Malária | B50-B54 |
| `ANIM` | Acidentes com animais peçonhentos | T63 |
| `SIFI` | Sífilis adquirida e congênita | A50-A53 |
| `AIDS` | AIDS | B20-B24 |
| `IEXO` | Intoxicação exógena | T36-T65 |
| `VIOL` | Violência interpessoal/autoprovocada | — |
| `RAIV` | Raiva humana | A82 |
| `TETA` | Tétano | A33-A35 |
| `COQU` | Coqueluche | A37 |

### Nomenclatura dos arquivos

Os arquivos seguem o padrão: `{AGRAVO}BR{AA}.dbc` (dados nacionais) ou `{AGRAVO}{UF}{AA}.dbc`

Exemplos:
- `DENGBR23.dbc` — Dengue, Brasil, 2023
- `TUBESP22.dbc` — Tuberculose, São Paulo, 2022

### Diretórios FTP

```
ftp://ftp.datasus.gov.br/dissemin/publicos/SINAN/DADOS/FINAIS/    (dados consolidados)
ftp://ftp.datasus.gov.br/dissemin/publicos/SINAN/DADOS/PRELIM/    (dados preliminares)
```

## Exemplo de uso

### Download e leitura com PySUS

```python
from pysus.online_data.SINAN import download
import pandas as pd

# Baixar dados de dengue do Brasil, 2023
dados = download(disease="dengue", years=[2023])

# Converter para DataFrame
df = dados.to_dataframe()

print(f"Total de notificações de dengue: {len(df):,}")
print(f"Colunas disponíveis: {list(df.columns)}")
print(df.head())
```

### Curva epidêmica de dengue

```python
from pysus.online_data.SINAN import download
import pandas as pd

# Baixar dados de dengue
dados = download(disease="dengue", years=[2023])
df = dados.to_dataframe()

# Converter data de notificação
df["DT_NOTIFIC"] = pd.to_datetime(df["DT_NOTIFIC"], format="%Y%m%d", errors="coerce")

# Semana epidemiológica
df["semana_epi"] = df["DT_NOTIFIC"].dt.isocalendar().week

# Curva epidêmica: casos por semana
curva = (
    df.groupby("semana_epi")
    .size()
    .reset_index(name="casos")
    .sort_values("semana_epi")
)

print("Curva epidêmica de dengue — 2023:")
print(curva.head(20))
```

### Análise de dengue por município e classificação

```python
from pysus.online_data.SINAN import download
import pandas as pd

# Baixar dados de dengue
dados = download(disease="dengue", years=[2023])
df = dados.to_dataframe()

# Classificação final: 1=Dengue, 2=Dengue com sinais de alarme,
# 3=Dengue grave, 5=Descartado, 8=Inconclusivo
classificacao = {
    "1": "Dengue clássica",
    "2": "Dengue com sinais de alarme",
    "3": "Dengue grave",
    "5": "Descartado",
    "8": "Inconclusivo",
}
df["classificacao"] = df["CLASSI_FIN"].map(classificacao)

print("Distribuição por classificação final:")
print(df["classificacao"].value_counts())

# Top 10 municípios com mais notificações confirmadas
confirmados = df[df["CLASSI_FIN"].isin(["1", "2", "3"])]
top_municipios = (
    confirmados.groupby("ID_MUNICIP")
    .size()
    .reset_index(name="casos_confirmados")
    .sort_values("casos_confirmados", ascending=False)
    .head(10)
)

print("\nTop 10 municípios — Dengue confirmada (2023):")
print(top_municipios)
```

### Monitoramento de tuberculose

```python
from pysus.online_data.SINAN import download
import pandas as pd

# Baixar dados de tuberculose
dados = download(disease="tuberculose", years=[2022])
df = dados.to_dataframe()

print(f"Notificações de tuberculose (2022): {len(df):,}")

# Distribuição por sexo
df["SEXO"] = df["CS_SEXO"].map({"M": "Masculino", "F": "Feminino", "I": "Ignorado"})
print("\nPor sexo:")
print(df["SEXO"].value_counts())

# Distribuição por faixa etária
df["NU_IDADE_N"] = pd.to_numeric(df["NU_IDADE_N"], errors="coerce")
bins = [0, 15, 30, 45, 60, 120]
labels = ["0-14", "15-29", "30-44", "45-59", "60+"]
df["faixa_etaria"] = pd.cut(df["NU_IDADE_N"], bins=bins, labels=labels, right=False)
print("\nPor faixa etária:")
print(df["faixa_etaria"].value_counts().sort_index())

# Desfecho do tratamento
desfecho = {
    "1": "Cura",
    "2": "Abandono",
    "3": "Óbito por tuberculose",
    "4": "Óbito por outras causas",
    "5": "Transferência",
    "9": "Ignorado",
}
df["desfecho"] = df["TRATAMENTO"].map(desfecho)
print("\nDesfecho do tratamento:")
print(df["desfecho"].value_counts())
```

## Campos disponíveis

### Ficha de Notificação — campos comuns a todos os agravos

| Campo | Tipo | Descrição |
|---|---|---|
| `NU_NOTIFIC` | string | Número da notificação |
| `DT_NOTIFIC` | string(8) | Data da notificação (AAAAMMDD) |
| `SEM_NOT` | string(6) | Semana epidemiológica da notificação (AAAASS) |
| `ID_MUNICIP` | string(6) | Código IBGE do município de notificação |
| `ID_UNIDADE` | string(7) | Código CNES da unidade notificadora |
| `DT_SIN_PRI` | string(8) | Data dos primeiros sintomas |
| `SEM_PRI` | string(6) | Semana epidemiológica dos primeiros sintomas |
| `NU_IDADE_N` | int | Idade do paciente |
| `CS_SEXO` | string(1) | Sexo (`M`=Masculino, `F`=Feminino, `I`=Ignorado) |
| `CS_RACA` | string(1) | Raça/cor |
| `CS_ESCOL_N` | string(2) | Escolaridade |
| `ID_MN_RESI` | string(6) | Código IBGE do município de residência |
| `CLASSI_FIN` | string(1) | Classificação final do caso |
| `EVOLUCAO` | string(1) | Evolução (`1`=Cura, `2`=Óbito pelo agravo, `3`=Óbito por outras causas, `9`=Ignorado) |
| `DT_OBITO` | string(8) | Data do óbito (quando aplicável) |
| `DT_ENCERRA` | string(8) | Data de encerramento da investigação |
| `CRITERIO` | string(1) | Critério de confirmação (`1`=Laboratorial, `2`=Clínico-epidemiológico) |
| `HOSPITALAR` | string(1) | Houve hospitalização (`1`=Sim, `2`=Não) |
| `DT_INTERNA` | string(8) | Data da internação |

### Campos específicos por agravo

Cada agravo possui campos adicionais na ficha de investigação. Exemplos para **dengue**:

| Campo | Tipo | Descrição |
|---|---|---|
| `SOROTIPO` | string(1) | Sorotipo de dengue (1, 2, 3, 4) |
| `RESUL_PRNT` | string(1) | Resultado do teste PRNT |
| `RESUL_NS1` | string(1) | Resultado do teste NS1 |
| `RESUL_VI_N` | string(1) | Resultado do isolamento viral |
| `RESUL_PCR` | string(1) | Resultado do PCR |
| `DT_CHIK_S1` | string(8) | Data da coleta da 1ª amostra sorológica |
| `PLASMATICO` | string(1) | Teve extravasamento plasmático |
| `PLAQUETAS` | string(1) | Contagem de plaquetas alterada |

## Cruzamentos possíveis

| Cruzamento | Fonte relacionada | Chave de ligação | Finalidade |
|---|---|---|---|
| Agravos x Internações | [SIH](/docs/apis/saude-datasus/sih) | `CID-10`, `municipio` | Analisar internações associadas a doenças notificáveis (ex: dengue grave) |
| Agravos x Mortalidade | [SIM](/docs/apis/saude-datasus/sim) | `CID-10`, `municipio` | Calcular letalidade de doenças de notificação compulsória |
| Agravos x Estabelecimentos | [CNES](/docs/apis/saude-datasus/cnes) | `CNES` | Identificar unidades notificadoras, capacidade de atendimento e diagnóstico |
| Agravos x População | IBGE — Estimativas populacionais | `codigo_municipio` | Calcular taxas de incidência (casos por 100.000 habitantes) |
| Agravos x Tabulação | [TabNet](/docs/apis/saude-datasus/tabnet) | Diversos | Consulta rápida de indicadores epidemiológicos por agravo |

### Exemplo de cruzamento: incidência de dengue por município

```python
from pysus.online_data.SINAN import download
import pandas as pd

# Baixar dados de dengue
dados = download(disease="dengue", years=[2023])
df = dados.to_dataframe()

# Filtrar casos confirmados
confirmados = df[df["CLASSI_FIN"].isin(["1", "2", "3"])]

# Casos por município de residência
casos_mun = (
    confirmados.groupby("ID_MN_RESI")
    .size()
    .reset_index(name="casos")
)

# Populações estimadas (exemplo simplificado — obter do IBGE)
# Em produção, usar estimativas populacionais do IBGE por município
populacao = pd.DataFrame({
    "ID_MN_RESI": ["355030", "330455", "310620"],
    "populacao": [12396372, 6775561, 2530701],
    "nome": ["São Paulo", "Rio de Janeiro", "Belo Horizonte"],
})

# Calcular taxa de incidência
incidencia = casos_mun.merge(populacao, on="ID_MN_RESI", how="inner")
incidencia["taxa_incidencia"] = incidencia["casos"] / incidencia["populacao"] * 100000

print("Taxa de incidência de dengue (por 100.000 hab.):")
print(incidencia[["nome", "casos", "populacao", "taxa_incidencia"]].round(1))
```

## Limitações conhecidas

| Limitação | Detalhes |
|---|---|
| **Subnotificação** | Nem todos os casos são notificados, especialmente doenças com sintomas leves (ex: dengue assintomática). A subnotificação pode variar de 2x a 10x dependendo do agravo. |
| **Defasagem temporal** | Dados preliminares são disponibilizados mensalmente, mas os dados finais (consolidados após investigação) podem demorar meses. |
| **Formato DBC** | Arquivos originais em formato proprietário DBC, exigindo PySUS ou ferramentas específicas para conversão. |
| **Classificação final pendente** | Muitas notificações permanecem sem classificação final (confirmado/descartado) por longo período, especialmente quando dependem de resultados laboratoriais. |
| **Mudanças nas fichas** | As fichas de investigação podem ser alteradas ao longo dos anos, acrescentando ou removendo campos. Análises longitudinais devem considerar versões diferentes. |
| **Dados por agravo** | Cada doença tem um arquivo separado com campos específicos. Não há um arquivo unificado de todas as notificações. |
| **Qualidade dos dados** | O preenchimento depende do profissional de saúde e da unidade notificadora. Campos como `CLASSI_FIN` (classificação final) e `CRITERIO` (critério de confirmação) podem ter alta proporção de dados faltantes. |
| **Sigilo do paciente** | Os microdados públicos são anonimizados — não contêm nome, CPF ou endereço do paciente, apenas município de residência. |
| **Instabilidade do servidor FTP** | O servidor FTP do DATASUS pode apresentar lentidão ou indisponibilidade. |
| **Duplicidade de notificações** | Pode haver notificações duplicadas para o mesmo caso (mesma pessoa notificada por diferentes unidades), exigindo deduplicação cuidadosa. |
| **Protocolo FTP obsoleto em navegadores** | Navegadores modernos (Chrome, Firefox) removeram o suporte ao protocolo FTP. Para acessar os arquivos, utilize clientes FTP (FileZilla, wget, curl) ou a biblioteca PySUS. Alternativamente, acesse a página de transferência de arquivos do DATASUS em `https://datasus.saude.gov.br/transferencia-de-arquivos/`. |
