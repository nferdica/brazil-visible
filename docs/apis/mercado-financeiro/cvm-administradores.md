---
title: CVM Administradores — Diretores e Conselheiros
slug: cvm-administradores
orgao: CVM
url_base: https://dados.cvm.gov.br/dataset/cia_aberta-doc-fre
tipo_acesso: CSV Download
autenticacao: Não requerida
formato_dados: [CSV]
frequencia_atualizacao: Anual
campos_chave:
  - cnpj_cia
  - nome_administrador
  - cargo
  - data_posse
  - cpf
tags:
  - CVM
  - administradores
  - diretores
  - conselheiros
  - governança corporativa
  - empresas abertas
  - FRE
cruzamento_com:
  - cvm-dfp-itr
  - cvm-fatos-relevantes
  - b3-negociacoes
  - receita-federal/cnpj-completa
status: documentado
---

# CVM Administradores — Diretores e Conselheiros

## O que é

Os dados de **administradores de companhias abertas** são extraídos do **FRE (Formulário de Referência)**, documento obrigatório que as empresas listadas em bolsa devem entregar à **CVM (Comissão de Valores Mobiliários)**. O FRE contém informações detalhadas sobre a gestão da empresa, incluindo:

- **Membros da administração** — diretores estatutários e membros do conselho de administração
- **Remuneração** — valores pagos à administração (agregados)
- **Experiência profissional** — formação e histórico dos administradores
- **Participação acionária** — ações detidas por administradores
- **Estrutura de governança** — comitês, política de remuneração, conflitos de interesse

Esses dados são fundamentais para análise de **governança corporativa**, identificação de redes de relacionamento entre empresas e avaliação da qualidade da gestão.

## Como acessar

| Item | Detalhe |
|---|---|
| **Portal CKAN** | `https://dados.cvm.gov.br/dataset/cia_aberta-doc-fre` |
| **URL direta dos arquivos** | `https://dados.cvm.gov.br/dados/CIA_ABERTA/DOC/FRE/DADOS/` |
| **Autenticação** | Não requerida |
| **Formato** | CSV (delimitado por `;`, encoding Latin-1) |

### Arquivos disponíveis

Os dados do FRE são divididos em múltiplos arquivos CSV, cada um correspondendo a uma seção do formulário:

```
fre_cia_aberta_AAAA.csv                  # Metadados dos FRE entregues
fre_cia_aberta_administrador_AAAA.csv    # Dados de administradores
fre_cia_aberta_remuneracao_AAAA.csv      # Remuneração da administração
fre_cia_aberta_posicao_acionaria_AAAA.csv # Posição acionária
```

## Endpoints/recursos principais

| Arquivo | Conteúdo |
|---|---|
| `fre_cia_aberta_administrador_AAAA.csv` | Nome, CPF, cargo, data de posse, prazo do mandato |
| `fre_cia_aberta_remuneracao_AAAA.csv` | Remuneração fixa, variável e total da administração |
| `fre_cia_aberta_posicao_acionaria_AAAA.csv` | Ações detidas por administradores |
| `fre_cia_aberta_AAAA.csv` | Metadados dos formulários entregues |

## Exemplo de uso

### Listar administradores de uma empresa

```python
import pandas as pd

# Download do arquivo de administradores
url = (
    "https://dados.cvm.gov.br/dados/CIA_ABERTA/DOC/FRE/DADOS/"
    "fre_cia_aberta_administrador_2023.csv"
)

df = pd.read_csv(url, sep=";", encoding="latin-1", dtype=str)

print(f"Total de registros: {len(df):,}")
print(f"Colunas: {list(df.columns)}")

# Filtrar administradores de uma empresa (ex: Itaú Unibanco)
itau = df[df["DENOM_CIA"].str.contains("ITAU", case=False, na=False)]
print(f"\nAdministradores do Itaú: {len(itau)}")
print(itau[["NOME_ADMINISTRADOR", "CARGO", "DT_POSSE"]].to_string(index=False))
```

### Identificar administradores em múltiplas empresas

```python
import pandas as pd

url = (
    "https://dados.cvm.gov.br/dados/CIA_ABERTA/DOC/FRE/DADOS/"
    "fre_cia_aberta_administrador_2023.csv"
)

df = pd.read_csv(url, sep=";", encoding="latin-1", dtype=str)

# Encontrar pessoas que atuam em mais de uma empresa
multi_empresa = (
    df.groupby("NOME_ADMINISTRADOR")["DENOM_CIA"]
    .nunique()
    .reset_index()
    .rename(columns={"DENOM_CIA": "num_empresas"})
)

multi = multi_empresa[multi_empresa["num_empresas"] > 1].sort_values(
    "num_empresas", ascending=False
)

print("Administradores que atuam em múltiplas empresas:")
print(multi.head(20).to_string(index=False))
```

## Campos disponíveis

### Administradores (`fre_cia_aberta_administrador`)

| Campo | Tipo | Descrição |
|---|---|---|
| `CNPJ_CIA` | string | CNPJ da companhia |
| `DENOM_CIA` | string | Denominação social |
| `DT_REFER` | date | Data de referência do FRE |
| `VERSAO` | int | Versão do documento |
| `NOME_ADMINISTRADOR` | string | Nome completo do administrador |
| `CPF_ADMINISTRADOR` | string | CPF do administrador |
| `CARGO` | string | Cargo exercido (Diretor Presidente, Conselheiro, etc.) |
| `DT_POSSE` | date | Data de posse no cargo |
| `DT_MANDATO_FIM` | date | Data de término do mandato |
| `ORGAO_ADM` | string | Órgão (Diretoria, Conselho de Administração, Conselho Fiscal) |
| `ELEITO_CONTROLADOR` | string | Eleito pelo controlador (S/N) |

## Cruzamentos possíveis

| Cruzamento | Fonte relacionada | Chave de ligação | Finalidade |
|---|---|---|---|
| Gestão x Desempenho | [CVM DFP/ITR](/docs/apis/mercado-financeiro/cvm-dfp-itr) | `CNPJ_CIA` | Correlacionar perfil de gestão com resultados financeiros |
| Gestão x Eventos | [CVM Fatos Relevantes](/docs/apis/mercado-financeiro/cvm-fatos-relevantes) | `CNPJ_CIA` | Analisar mudanças na administração e eventos corporativos |
| Gestão x Mercado | [B3 Negociações](/docs/apis/mercado-financeiro/b3-negociacoes) | `CNPJ_CIA` / Ticker | Avaliar impacto de mudanças de gestão no preço das ações |
| Administradores x Empresas | [CNPJ Completa](/docs/apis/receita-federal/cnpj-completa) | `CPF` / `CNPJ` | Identificar participação dos administradores em outras empresas |

## Limitações conhecidas

| Limitação | Detalhes |
|---|---|
| **Dados anuais** | O FRE é entregue anualmente, com atualização eventual. Mudanças de administradores durante o ano podem não ser refletidas imediatamente. |
| **Encoding e separador** | Arquivos usam encoding Latin-1, separador `;`. |
| **Versões múltiplas** | Empresas podem reapresentar o FRE (campo `VERSAO` > 1). Filtrar pela última versão. |
| **Nomes não padronizados** | Nomes de administradores podem variar entre empresas (abreviações, acentos). Cruzamentos por nome requerem normalização. |
| **CPF parcialmente mascarado** | Em algumas versões, o CPF pode estar parcialmente oculto, dificultando cruzamentos. |
| **Apenas companhias abertas** | Cobre somente empresas registradas na CVM com valores mobiliários negociados. Empresas de capital fechado não aparecem. |
