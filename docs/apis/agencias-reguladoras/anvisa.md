---
title: ANVISA Saúde — Registros de Medicamentos e Alimentos
slug: anvisa
orgao: ANVISA
url_base: https://dados.gov.br/dados/organizacoes/visualizar/agencia-nacional-de-vigilancia-sanitaria-anvisa
tipo_acesso: CSV Download
autenticacao: Não requerida
formato_dados: [CSV, JSON]
frequencia_atualizacao: Mensal
campos_chave:
  - numero_registro
  - nome_produto
  - principio_ativo
  - empresa_detentora
  - categoria_regulatoria
  - data_vencimento
tags:
  - ANVISA
  - medicamentos
  - alimentos
  - vigilância sanitária
  - registro de produtos
  - saúde
  - insumos farmacêuticos
cruzamento_com:
  - saude-datasus/sih
  - saude-datasus/cnes
  - receita-federal/cnpj-completa
status: documentado
---

# ANVISA Saúde — Registros de Medicamentos e Alimentos

## O que é

A **ANVISA (Agência Nacional de Vigilância Sanitária)** disponibiliza dados abertos sobre produtos regulados no Brasil, incluindo:

- **Medicamentos** — registro de medicamentos (referência, genérico, similar), princípio ativo, forma farmacêutica, via de administração, empresa detentora
- **Alimentos** — registro e notificação de alimentos, suplementos e ingredientes
- **Produtos para saúde** — equipamentos médicos, materiais, produtos para diagnóstico in vitro
- **Cosméticos e saneantes** — produtos de higiene pessoal, cosméticos, saneantes domissanitários
- **Agrotóxicos** — monografias e limites máximos de resíduos
- **Preços de medicamentos (CMED)** — tabela de preços máximos de medicamentos

Os dados de medicamentos são especialmente relevantes para pesquisadores de saúde, farmacêuticos e gestores do SUS.

## Como acessar

| Item | Detalhe |
|---|---|
| **dados.gov.br** | `https://dados.gov.br/dados/organizacoes/visualizar/agencia-nacional-de-vigilancia-sanitaria-anvisa` |
| **Portal ANVISA** | `https://www.gov.br/anvisa/pt-br/assuntos/medicamentos` |
| **Consulta de medicamentos** | `https://consultas.anvisa.gov.br/#/medicamentos/` |
| **CMED (preços)** | `https://www.gov.br/anvisa/pt-br/assuntos/medicamentos/cmed` |
| **Autenticação** | Não requerida (dados públicos) |
| **Formato** | CSV, XLSX, PDF |

## Endpoints/recursos principais

| Recurso | Conteúdo | Periodicidade |
|---|---|---|
| **Registro de medicamentos** | Medicamentos registrados (nome, princípio ativo, empresa) | Atualização contínua |
| **Tabela CMED** | Preços máximos de medicamentos | Mensal/Anual |
| **Produtos para saúde** | Equipamentos e dispositivos médicos registrados | Atualização contínua |
| **Bulário eletrônico** | Bulas de medicamentos registrados | Atualização contínua |
| **Recalls e alertas** | Produtos recolhidos e alertas sanitários | Sob demanda |

## Exemplo de uso

### Consultar medicamentos registrados

```python
import pandas as pd

# Download do arquivo de medicamentos registrados do dados.gov.br
df = pd.read_csv(
    "medicamentos_registrados.csv",
    sep=";",
    encoding="utf-8",
    dtype=str,
)

print(f"Total de medicamentos registrados: {len(df):,}")
print(f"Colunas: {list(df.columns)}")

# Distribuição por categoria regulatória
categorias = df["CATEGORIA_REGULATORIA"].value_counts()
print("\nMedicamentos por categoria:")
print(categorias)

# Top 10 empresas detentoras
empresas = df["EMPRESA_DETENTORA"].value_counts().head(10)
print("\nTop 10 empresas por número de registros:")
print(empresas)
```

### Consultar tabela CMED (preços de medicamentos)

```python
import pandas as pd

# Tabela CMED — preços máximos de medicamentos
df_cmed = pd.read_csv(
    "tabela_cmed.csv",
    sep=";",
    encoding="utf-8",
    dtype=str,
    decimal=","
)

# Converter preço para numérico
df_cmed["PMC 0%"] = pd.to_numeric(
    df_cmed["PMC 0%"].str.replace(",", "."), errors="coerce"
)

# Medicamentos mais caros
caros = df_cmed.nlargest(10, "PMC 0%")[["SUBSTÂNCIA", "PRODUTO", "PMC 0%"]]
print("Top 10 medicamentos mais caros (PMC):")
print(caros.to_string(index=False))
```

## Campos disponíveis

### Registro de medicamentos

| Campo | Tipo | Descrição |
|---|---|---|
| `NUMERO_REGISTRO` | string | Número de registro na ANVISA |
| `NOME_PRODUTO` | string | Nome comercial do medicamento |
| `PRINCIPIO_ATIVO` | string | Princípio ativo (substância) |
| `EMPRESA_DETENTORA` | string | Empresa titular do registro |
| `CNPJ` | string | CNPJ da empresa |
| `CATEGORIA_REGULATORIA` | string | Referência, Genérico, Similar, Biológico, Específico, Fitoterápico |
| `CLASSE_TERAPEUTICA` | string | Classificação terapêutica |
| `FORMA_FARMACEUTICA` | string | Comprimido, Cápsula, Solução, etc. |
| `VIA_ADMINISTRACAO` | string | Oral, Injetável, Tópica, etc. |
| `DATA_REGISTRO` | date | Data do registro |
| `DATA_VENCIMENTO` | date | Data de vencimento do registro |
| `SITUACAO` | string | Válido, Caduco, Cancelado |

### Tabela CMED (preços)

| Campo | Tipo | Descrição |
|---|---|---|
| `SUBSTÂNCIA` | string | Princípio ativo |
| `PRODUTO` | string | Nome comercial |
| `APRESENTAÇÃO` | string | Forma e quantidade |
| `PF 0%` | float | Preço Fábrica sem impostos |
| `PMC 0%` | float | Preço Máximo ao Consumidor sem impostos |
| `PMC 12%` | float | PMC com 12% de ICMS |
| `PMC 17%` | float | PMC com 17% de ICMS |
| `PMC 18%` | float | PMC com 18% de ICMS |
| `LISTA DE CONCESSÃO` | string | Lista de medicamentos com desconto obrigatório |

## Cruzamentos possíveis

| Cruzamento | Fonte relacionada | Chave de ligação | Finalidade |
|---|---|---|---|
| Medicamentos x Internações | [SIH](/docs/apis/saude-datasus/sih) | CID-10, procedimento | Analisar medicamentos disponíveis para condições que geram internações |
| Medicamentos x Estabelecimentos | [CNES](/docs/apis/saude-datasus/cnes) | Município, UF | Avaliar disponibilidade de medicamentos por região |
| Fabricantes x Empresas | [CNPJ Completa](/docs/apis/receita-federal/cnpj-completa) | CNPJ | Enriquecer dados dos fabricantes com informações cadastrais |

## Limitações conhecidas

| Limitação | Detalhes |
|---|---|
| **Sem API REST unificada** | Os dados estão dispersos em vários portais e formatos (CSV, XLSX, consultas web). Não há uma API unificada. |
| **Dados de preços complexos** | A tabela CMED tem múltiplas colunas de preço por alíquota de ICMS. Requer conhecimento regulatório para uso correto. |
| **Consultas web instáveis** | O sistema de consultas web da ANVISA pode apresentar lentidão e indisponibilidade. |
| **Registros vencidos na base** | A base pode conter registros de medicamentos com registro caduco ou cancelado. É necessário filtrar pelo campo de situação. |
| **Sem dados de vendas** | A ANVISA publica preços máximos, não dados de vendas efetivas. |
| **Formatos inconsistentes** | Os arquivos podem variar em formato, encoding e estrutura entre publicações. |
