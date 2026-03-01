---
title: RAIS — Relação Anual de Informações Sociais
slug: rais
orgao: MTE
url_base: https://bi.mte.gov.br/bgcaged/
tipo_acesso: CSV Download
autenticacao: Não requerida
formato_dados: [CSV, TXT]
frequencia_atualizacao: Anual
campos_chave:
  - cnpj_raiz
  - codigo_municipio
  - cnae_2_0
  - cbo_2002
  - vinculo_ativo
  - remuneracao_media
  - grau_instrucao
tags:
  - trabalho
  - emprego
  - vínculos formais
  - salários
  - RAIS
  - CLT
  - mercado de trabalho
  - microdados
cruzamento_com:
  - caged
  - receita-federal/cnpj-completa
  - ibge-estatisticas/pib-municipal
  - ibge-estatisticas/censo-demografico
  - previdencia-social/beneficios-inss
status: documentado
---

# RAIS — Relação Anual de Informações Sociais

## O que é

A **RAIS (Relação Anual de Informações Sociais)** é um registro administrativo obrigatório para todos os empregadores formais no Brasil, gerenciado pelo **Ministério do Trabalho e Emprego (MTE)**. Os microdados da RAIS constituem a principal fonte de informações sobre o mercado de trabalho formal brasileiro, contendo dados sobre vínculos empregatícios, remunerações, características dos trabalhadores e dos estabelecimentos empregadores.

A RAIS é preenchida anualmente por todos os estabelecimentos com CNPJ (inclusive aqueles sem empregados, que apresentam a RAIS Negativa) e cobre:

- **Vínculos empregatícios** — tipo de vínculo (CLT, estatutário, temporário), data de admissão/desligamento, causa do desligamento
- **Remuneração** — salário contratual, remuneração média e de dezembro, horas contratuais
- **Perfil do trabalhador** — sexo, idade, raça/cor, grau de instrução, nacionalidade
- **Estabelecimento** — CNAE (atividade econômica), porte, município, natureza jurídica
- **Ocupação** — CBO 2002 (Classificação Brasileira de Ocupações)

Os microdados identificados (com CNPJ) estão disponíveis no portal de dados abertos do MTE e no Base dos Dados.

## Como acessar

| Item | Detalhe |
|---|---|
| **URL base (MTE)** | `https://bi.mte.gov.br/bgcaged/` |
| **URL dados abertos** | `https://www.gov.br/trabalho-e-emprego/pt-br/assuntos/estatisticas-trabalho/microdados-rais-e-caged` |
| **URL Base dos Dados** | `https://basedosdados.org/dataset/br-me-rais` |
| **Autenticação** | Não requerida (download público) |
| **Formato** | CSV / TXT (delimitado por `;`) |
| **Tamanho** | ~5-15 GB compactado por ano (vínculos) |

### FTP de microdados

Os microdados estão disponíveis via FTP do MTE:

```
ftp://ftp.mtps.gov.br/pdet/microdados/RAIS/
```

Estrutura dos diretórios:
```
RAIS/
├── AAAA/
│   ├── RAIS_VINC_PUB_CENTRO_OESTE.txt
│   ├── RAIS_VINC_PUB_MG_ES_RJ.txt
│   ├── RAIS_VINC_PUB_NORDESTE.txt
│   ├── RAIS_VINC_PUB_NORTE.txt
│   ├── RAIS_VINC_PUB_SP.txt
│   └── RAIS_VINC_PUB_SUL.txt
└── Layouts/
    └── Layout_Microdados_RAIS.xls
```

## Endpoints/recursos principais

Como se trata de download de microdados (não API REST), os recursos são os arquivos disponíveis:

| Arquivo | Conteúdo | Tamanho aprox. |
|---|---|---|
| `RAIS_VINC_PUB_*.txt` | Vínculos empregatícios por região | ~2-5 GB cada |
| `RAIS_ESTAB_PUB.txt` | Dados de estabelecimentos | ~500 MB |
| `Layout_Microdados_RAIS.xls` | Dicionário de variáveis | ~200 KB |

### Consulta via Base dos Dados (BigQuery)

A forma mais prática de consultar a RAIS é via **Base dos Dados**, que disponibiliza os microdados tratados no Google BigQuery:

| Tabela | Descrição |
|---|---|
| `basedosdados.br_me_rais.microdados_vinculos` | Vínculos empregatícios |
| `basedosdados.br_me_rais.microdados_estabelecimentos` | Estabelecimentos |

## Exemplo de uso

### Consulta via Base dos Dados (BigQuery)

```python
import basedosdados as bd

# Média salarial por UF (vínculos ativos em dezembro)
query = """
SELECT
    sigla_uf,
    COUNT(*) AS total_vinculos,
    AVG(valor_remuneracao_media) AS salario_medio
FROM `basedosdados.br_me_rais.microdados_vinculos`
WHERE ano = 2022
  AND vinculo_ativo_3112 = 1
GROUP BY sigla_uf
ORDER BY salario_medio DESC
"""

df = bd.read_sql(query, billing_project_id="seu-projeto-gcp")
print(df.head(10))
```

### Leitura direta dos microdados

```python
import pandas as pd

# Ler microdados da RAIS (arquivo grande — usar chunks)
arquivo = "RAIS_VINC_PUB_SP.txt"

df = pd.read_csv(
    arquivo,
    sep=";",
    encoding="latin-1",
    dtype=str,
    low_memory=False,
    decimal=","
)

print(f"Total de vínculos (SP): {len(df):,}")
print(f"Colunas: {list(df.columns[:10])}...")

# Distribuição por grau de instrução
instrucao_map = {
    "1": "Analfabeto",
    "2": "Fundamental incompleto",
    "3": "Fundamental incompleto",
    "4": "Fundamental completo",
    "5": "Fundamental completo",
    "6": "Médio incompleto",
    "7": "Médio completo",
    "8": "Superior incompleto",
    "9": "Superior completo",
    "10": "Mestrado",
    "11": "Doutorado",
}

contagem = df["Grau Instrução após 2005"].map(instrucao_map).value_counts()
print("\nDistribuição por escolaridade:")
print(contagem)
```

## Campos disponíveis

### Vínculos empregatícios

| Campo | Tipo | Descrição |
|---|---|---|
| `Município` | int | Código do município (IBGE 6 dígitos) |
| `CNAE 2.0 Classe` | string | Classificação de atividade econômica |
| `CBO Ocupação 2002` | string | Código da ocupação |
| `Grau Instrução após 2005` | int | Nível de escolaridade (1 a 11) |
| `Sexo Trabalhador` | int | 1=Masculino, 2=Feminino |
| `Idade` | int | Idade do trabalhador |
| `Raça Cor` | int | 1=Indígena, 2=Branca, 4=Preta, 6=Amarela, 8=Parda, 9=Não identificado |
| `Vl Remun Média (SM)` | float | Remuneração média em salários mínimos |
| `Vl Remun Dezembro (SM)` | float | Remuneração em dezembro em salários mínimos |
| `Vl Remun Média Nom` | float | Remuneração média nominal (R$) |
| `Vínculo Ativo 31/12` | int | Vínculo ativo em 31/12 (0/1) |
| `Tipo Vínculo` | int | Tipo de vínculo (CLT, estatutário, etc.) |
| `Mês Admissão` | int | Mês de admissão |
| `Mês Desligamento` | int | Mês de desligamento (00 = ativo) |
| `Motivo Desligamento` | int | Causa do desligamento |
| `Tempo Emprego` | float | Tempo no emprego em meses |
| `Qtd Hora Contr` | int | Horas contratuais semanais |
| `Tamanho Estabelecimento` | int | Faixa de tamanho do estabelecimento |
| `Natureza Jurídica` | int | Natureza jurídica do empregador |
| `CNPJ / CEI` | string | Identificador do estabelecimento |
| `Ind Simples` | int | Optante pelo Simples Nacional (0/1) |

## Cruzamentos possíveis

| Cruzamento | Fonte relacionada | Chave de ligação | Finalidade |
|---|---|---|---|
| Vínculos x Empresas | [CNPJ Completa](/docs/apis/receita-federal/cnpj-completa) | `CNPJ / CEI` | Enriquecer dados de vínculos com informações cadastrais da empresa |
| Vínculos x Admissões/Demissões | [CAGED](/docs/apis/trabalho-emprego/caged) | `CNPJ`, `CBO`, `município` | Comparar estoque (RAIS) com fluxo (CAGED) de empregos |
| Emprego x PIB Municipal | [PIB Municipal](/docs/apis/ibge-estatisticas/pib-municipal) | `codigo_municipio` | Correlacionar emprego formal com produção econômica |
| Emprego x População | [Censo Demográfico](/docs/apis/ibge-estatisticas/censo-demografico) | `codigo_municipio` | Calcular taxa de formalização do mercado de trabalho |
| Vínculos x Benefícios | [Benefícios INSS](/docs/apis/previdencia-social/beneficios-inss) | `municipio`, `cnpj` | Analisar transição emprego formal → benefícios previdenciários |

## Limitações conhecidas

| Limitação | Detalhes |
|---|---|
| **Arquivos muito grandes** | Os microdados de vínculos ocupam dezenas de GB descompactados. Processamento exige máquinas robustas ou uso de chunks/BigQuery. |
| **Apenas emprego formal** | A RAIS cobre exclusivamente vínculos formais (CLT, estatutários). Trabalhadores informais, autônomos e MEIs não aparecem. |
| **Defasagem temporal** | Os microdados de um ano são publicados com 1-2 anos de atraso (ex: dados de 2022 publicados em 2024). |
| **Encoding e separador** | Arquivos usam encoding Latin-1 e separador `;` com decimal `,` (padrão brasileiro). |
| **Dados anonimizados** | Nas versões públicas, o CPF do trabalhador não está disponível. O CNPJ está disponível. |
| **FTP instável** | O servidor FTP do MTE pode apresentar lentidão e interrupções frequentes no download. |
| **Sem API REST** | Não existe API de consulta — é necessário baixar os arquivos completos. A alternativa é usar o Base dos Dados (BigQuery). |
| **Layout varia entre anos** | O nome e a ordem das colunas podem mudar entre edições. Sempre consulte o layout correspondente ao ano desejado. |
