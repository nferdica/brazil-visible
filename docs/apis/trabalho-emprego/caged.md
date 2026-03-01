---
title: CAGED — Cadastro Geral de Empregados e Desempregados
slug: caged
orgao: MTE
url_base: https://bi.mte.gov.br/bgcaged/
tipo_acesso: CSV Download
autenticacao: Não requerida
formato_dados: [CSV, TXT]
frequencia_atualizacao: Mensal
campos_chave:
  - competencia
  - codigo_municipio
  - cnae_2_0
  - cbo_2002
  - saldo_movimentacao
  - salario
  - grau_instrucao
tags:
  - trabalho
  - emprego
  - admissões
  - demissões
  - CAGED
  - Novo CAGED
  - CLT
  - mercado de trabalho
  - saldo de empregos
cruzamento_com:
  - rais
  - receita-federal/cnpj-completa
  - ibge-estatisticas/pnad-continua
  - ibge-estatisticas/pib-municipal
status: documentado
---

# CAGED — Cadastro Geral de Empregados e Desempregados

## O que é

O **CAGED (Cadastro Geral de Empregados e Desempregados)** é o registro administrativo que contabiliza as **admissões e desligamentos** de trabalhadores com carteira assinada (regime CLT) no Brasil, gerenciado pelo **Ministério do Trabalho e Emprego (MTE)**. Desde 2020, o sistema foi substituído pelo **Novo CAGED**, que unifica as informações do antigo CAGED com dados do **eSocial** e do **Empregador Web**.

O CAGED é o principal indicador mensal do mercado de trabalho formal, amplamente utilizado por:

- **Governo** — para políticas de emprego, seguro-desemprego e FGTS
- **Pesquisadores** — para análise conjuntural do mercado de trabalho
- **Imprensa** — como indicador econômico mensal (saldo de empregos)
- **Empresas** — para análise setorial e regional do mercado

Os dados incluem:

- **Admissões** — contratações com carteira assinada no mês
- **Desligamentos** — demissões, pedidos de demissão, aposentadorias, falecimentos
- **Saldo** — diferença entre admissões e desligamentos
- **Perfil** — município, setor econômico (CNAE), ocupação (CBO), salário, escolaridade, sexo, idade

## Como acessar

| Item | Detalhe |
|---|---|
| **URL base (Painel)** | `https://bi.mte.gov.br/bgcaged/` |
| **URL PDET** | `http://pdet.mte.gov.br/novo-caged` |
| **URL dados abertos** | `https://www.gov.br/trabalho-e-emprego/pt-br/assuntos/estatisticas-trabalho/novo-caged` |
| **URL Base dos Dados** | `https://basedosdados.org/dataset/br-me-caged` |
| **Autenticação** | Não requerida |
| **Formato** | CSV / TXT (delimitado por `;`) |
| **Publicação** | Mensal (~30 dias após o mês de referência) |

### FTP de microdados

```
ftp://ftp.mtps.gov.br/pdet/microdados/NOVO CAGED/
```

Estrutura:
```
NOVO CAGED/
├── AAAAMM/
│   ├── CAGEDMOV_AAAAMM.txt     # Movimentações declaradas no mês
│   ├── CAGEDFOR_AAAAMM.txt     # Movimentações fora do prazo
│   └── CAGEDEXC_AAAAMM.txt     # Exclusões
```

## Endpoints/recursos principais

| Arquivo | Conteúdo | Periodicidade |
|---|---|---|
| `CAGEDMOV_AAAAMM.txt` | Movimentações (admissões/desligamentos) declaradas no mês de competência | Mensal |
| `CAGEDFOR_AAAAMM.txt` | Movimentações declaradas fora do prazo (ajustes de meses anteriores) | Mensal |
| `CAGEDEXC_AAAAMM.txt` | Exclusões de movimentações informadas indevidamente | Mensal |
| **Painel PDET** | Consulta interativa com filtros por UF, município, setor, ocupação | Online |

### Tabelas no Base dos Dados (BigQuery)

| Tabela | Descrição |
|---|---|
| `basedosdados.br_me_caged.microdados_movimentacao` | Movimentações mensais |
| `basedosdados.br_me_caged.microdados_movimentacao_fora_prazo` | Declarações fora do prazo |
| `basedosdados.br_me_caged.microdados_exclusao` | Exclusões |

## Exemplo de uso

### Consulta via Base dos Dados (BigQuery)

```python
import basedosdados as bd

# Saldo de empregos por UF no último mês disponível
query = """
SELECT
    sigla_uf,
    SUM(CASE WHEN saldo_movimentacao = 1 THEN 1 ELSE 0 END) AS admissoes,
    SUM(CASE WHEN saldo_movimentacao = -1 THEN 1 ELSE 0 END) AS desligamentos,
    SUM(saldo_movimentacao) AS saldo
FROM `basedosdados.br_me_caged.microdados_movimentacao`
WHERE ano = 2024 AND mes = 12
GROUP BY sigla_uf
ORDER BY saldo DESC
"""

df = bd.read_sql(query, billing_project_id="seu-projeto-gcp")
print(df)
```

### Leitura direta dos microdados

```python
import pandas as pd

# Ler microdados do Novo CAGED
arquivo = "CAGEDMOV202412.txt"

df = pd.read_csv(
    arquivo,
    sep=";",
    encoding="latin-1",
    dtype=str,
    decimal=","
)

print(f"Total de movimentações: {len(df):,}")
print(f"Colunas: {list(df.columns)}")

# Saldo de empregos por setor (seção CNAE)
df["saldomovimentação"] = pd.to_numeric(df["saldomovimentação"], errors="coerce")

saldo_setor = (
    df.groupby("secção")["saldomovimentação"]
    .sum()
    .sort_values(ascending=False)
)

print("\nSaldo de empregos por seção CNAE:")
print(saldo_setor)
```

### Série histórica de saldo de empregos

```python
import pandas as pd
import glob

# Ler todos os meses de um ano
arquivos = sorted(glob.glob("CAGEDMOV2024*.txt"))
dfs = []

for arq in arquivos:
    df = pd.read_csv(arq, sep=";", encoding="latin-1", dtype=str, decimal=",")
    df["saldomovimentação"] = pd.to_numeric(df["saldomovimentação"], errors="coerce")
    mes = arq[-6:-4]
    saldo = df["saldomovimentação"].sum()
    dfs.append({"mes": mes, "saldo": saldo})

serie = pd.DataFrame(dfs)
print("Saldo mensal de empregos formais (2024):")
print(serie.to_string(index=False))
```

## Campos disponíveis

### Microdados de movimentação (`CAGEDMOV`)

| Campo | Tipo | Descrição |
|---|---|---|
| `competência` | string | Mês de referência (AAAAMM) |
| `região` | int | Código da região geográfica |
| `uf` | int | Código da UF |
| `município` | int | Código do município (IBGE 6 dígitos) |
| `secção` | string | Seção CNAE 2.0 (letra) |
| `subclasse` | string | CNAE 2.0 subclasse (7 dígitos) |
| `cbo2002ocupação` | string | Código CBO 2002 |
| `saldomovimentação` | int | +1 (admissão) ou -1 (desligamento) |
| `salário` | float | Salário mensal (R$) |
| `categoria` | int | Tipo de movimentação |
| `graudeinstrução` | int | Nível de escolaridade |
| `idade` | int | Idade do trabalhador |
| `sexo` | int | 1=Masculino, 3=Feminino |
| `raçacor` | int | 1=Branca, 2=Preta, 3=Amarela, 4=Parda, 5=Indígena, 6=Não informado, 9=Não identificado |
| `tipoempregador` | int | Tipo de empregador |
| `tipomovimentação` | int | Código da movimentação (admissão, demissão sem/com justa causa, etc.) |
| `tamestab` | int | Faixa de tamanho do estabelecimento |
| `horascontratuais` | int | Horas semanais de trabalho |
| `fonte` | int | Fonte da declaração (1=CAGED, 2=eSocial, 3=Empregador Web) |

## Cruzamentos possíveis

| Cruzamento | Fonte relacionada | Chave de ligação | Finalidade |
|---|---|---|---|
| Fluxo x Estoque | [RAIS](/docs/apis/trabalho-emprego/rais) | `município`, `CNAE`, `CBO` | Comparar fluxo mensal (CAGED) com estoque anual (RAIS) |
| Emprego formal x PNAD | [PNAD Contínua](/docs/apis/ibge-estatisticas/pnad-continua) | UF, setor | Comparar dados administrativos com pesquisa amostral de emprego |
| Saldo x PIB | [PIB Municipal](/docs/apis/ibge-estatisticas/pib-municipal) | `codigo_municipio` | Relacionar geração de empregos com crescimento econômico |
| Emprego x Empresas | [CNPJ Completa](/docs/apis/receita-federal/cnpj-completa) | `CNPJ` (disponível em versões restritas) | Enriquecer com dados cadastrais da empresa |

## Limitações conhecidas

| Limitação | Detalhes |
|---|---|
| **Apenas emprego formal (CLT)** | O CAGED cobre exclusivamente vínculos com carteira assinada. Trabalhadores informais, autônomos e MEIs não aparecem. |
| **Transição para Novo CAGED** | Desde janeiro de 2020, o sistema mudou. Dados anteriores a 2020 têm estrutura e cobertura diferentes. |
| **Declarações fora do prazo** | Movimentações declaradas com atraso (arquivo `CAGEDFOR`) podem alterar significativamente o saldo de meses anteriores. |
| **Sem CNPJ nos microdados públicos** | Os microdados públicos não incluem o CNPJ do empregador, apenas o município e setor. |
| **FTP instável** | O servidor FTP do MTE apresenta lentidão e indisponibilidade frequentes. |
| **Encoding Latin-1** | Arquivos usam encoding Latin-1 com separador `;` e decimal `,`. |
| **Revisões retroativas** | Os dados mensais são preliminares e sujeitos a revisões nos meses seguintes (declarações fora do prazo e exclusões). |
| **Categorias de movimentação** | Os códigos de tipo de movimentação são complexos e exigem o dicionário de dados para interpretação correta. |
