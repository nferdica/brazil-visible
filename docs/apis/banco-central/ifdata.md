---
title: IFData
slug: ifdata
orgao: BCB
url_base: https://www3.bcb.gov.br/ifdata/
tipo_acesso: CSV Download
autenticacao: Não requerida
formato_dados: [CSV, HTML]
frequencia_atualizacao: Trimestral
campos_chave: [cnpj, instituicao, tipo_instituicao, ativo_total, patrimonio_liquido]
tags: [bancos, instituições financeiras, balanços, demonstrações financeiras, IFData, supervisão bancária]
cruzamento_com:
  - sgs-juros
  - sgs-credito
  - receita-federal/cnpj
  - transparencia-cgu/ceis
status: parcial
---

# IFData

## O que é

O **IFData** é o portal do Banco Central do Brasil que disponibiliza dados contábeis e financeiros das instituições financeiras autorizadas a funcionar no país. O sistema permite consultar informações como ativo total, patrimônio líquido, carteira de crédito, resultado líquido, índices de basileia e muito mais, para bancos comerciais, bancos de investimento, financeiras, cooperativas de crédito e demais instituições supervisionadas pelo BCB.

Os dados são extraídos dos documentos contábeis obrigatórios enviados pelas instituições ao BCB (COSIF - Plano Contábil das Instituições do Sistema Financeiro Nacional) e são atualizados trimestralmente.

**Importante**: o IFData é uma **interface web**, não uma API REST. Os dados podem ser consultados via navegador e exportados em CSV.

## Como acessar

| Item | Detalhe |
|---|---|
| **URL** | `https://www3.bcb.gov.br/ifdata/` |
| **Tipo de acesso** | Interface web com download de CSV |
| **Autenticação** | Não requerida |
| **Rate limit** | N/A (interface web) |
| **Formatos** | CSV (exportação), HTML (visualização) |

### Navegação no portal

1. Acessar `https://www3.bcb.gov.br/ifdata/`
2. Selecionar a data-base (trimestre)
3. Escolher o tipo de relatório (Resumo, Ativo, Passivo, etc.)
4. Selecionar tipo de instituição ou instituição específica
5. Clicar em "Exportar" para obter o CSV

### Download programático

Embora não haja API REST oficial, é possível acessar os dados programaticamente via requisições HTTP simulando a navegação do portal.

## Endpoints/recursos principais

### Relatórios disponíveis

| Relatório | Descrição | Granularidade |
|---|---|---|
| Resumo | Visão geral das principais contas | Por instituição |
| Ativo | Composição do ativo (carteira de crédito, títulos, etc.) | Por instituição |
| Passivo | Composição do passivo (depósitos, captações, etc.) | Por instituição |
| Demonstração de Resultado | Receitas, despesas e resultado líquido | Por instituição |
| Informações de Capital | Patrimônio de referência, índice de Basileia | Por instituição |
| Segmentação de Crédito | Carteira por segmento (PF, PJ, rural, etc.) | Por instituição |

### Tipos de instituição

| Tipo | Descrição |
|---|---|
| b1 | Bancos comerciais, múltiplos e Caixa Econômica |
| b2 | Bancos de investimento |
| b3s | Bancos de câmbio e de desenvolvimento |
| b4 | Bancos de câmbio |
| n1 | Financeiras (SCFI) |
| c1 | Cooperativas de crédito |

## Exemplo de uso

### Download e análise de dados do IFData

```python
import requests
import pandas as pd
from io import StringIO

# O IFData não possui API REST formal. Os dados são obtidos via
# interface web. Abaixo, um exemplo de como processar um CSV
# previamente baixado do portal.

# Após baixar o CSV do portal IFData:
# 1. Acesse https://www3.bcb.gov.br/ifdata/
# 2. Selecione data-base, relatório e tipo de instituição
# 3. Exporte como CSV

# Exemplo de leitura de CSV baixado
# df = pd.read_csv("ifdata_resumo_2024T4.csv", sep=";", encoding="latin-1")

# Alternativa: usar a API de dados abertos do BCB para informações cadastrais
url = (
    "https://olinda.bcb.gov.br/olinda/servico/"
    "Informes_ListaTarifasPorInstituicaoFinanceira/versao/v1/odata/"
    "ListaTarifasPorInstituicaoFinanceira"
)
params = {
    "$top": 5,
    "$format": "json",
    "$orderby": "NomeInstituicao asc"
}

response = requests.get(url, params=params)
response.raise_for_status()
dados = response.json()["value"]

for d in dados:
    print(f"{d['NomeInstituicao']} - {d.get('NomeServico', 'N/A')}")
```

### Consultar instituições autorizadas via OLINDA

```python
import requests

# Lista de instituições autorizadas pelo BCB
url = (
    "https://olinda.bcb.gov.br/olinda/servico/"
    "Informes_ListaDeBancosComerciaisEMultiplos/versao/v1/odata/"
    "ListaDeBancosComerciaisEMultiplos"
)
params = {
    "$format": "json",
    "$top": 10,
    "$orderby": "NomeReducao asc"
}

response = requests.get(url, params=params)
response.raise_for_status()
dados = response.json()["value"]

print("Bancos comerciais e múltiplos (primeiros 10):")
for banco in dados:
    print(f"  {banco['NomeReducao']} - CNPJ: {banco.get('Cnpj', 'N/A')}")
```

### Análise de ranking bancário

```python
import pandas as pd

# Exemplo com dados hipotéticos do IFData (após download manual)
# Em produção, ler o CSV real baixado do portal

dados_exemplo = {
    "Instituicao": ["Itaú Unibanco", "Banco do Brasil", "Bradesco", "Caixa", "Santander"],
    "AtivoTotal_BRL_Bi": [2200, 2100, 1800, 1600, 1100],
    "PatrimonioLiquido_BRL_Bi": [180, 160, 140, 120, 90],
    "IndiceBasileia_pct": [13.5, 17.2, 14.8, 18.5, 14.1],
}

df = pd.DataFrame(dados_exemplo)
df["ROE_estimado"] = (df["AtivoTotal_BRL_Bi"] * 0.01 / df["PatrimonioLiquido_BRL_Bi"]) * 100

print("Ranking por Ativo Total:")
print(df.sort_values("AtivoTotal_BRL_Bi", ascending=False).to_string(index=False))
```

## Campos disponíveis

### Relatório Resumo (campos principais)

| Campo | Tipo | Descrição |
|---|---|---|
| `Instituicao` | string | Nome da instituição financeira |
| `CodInst` | string | Código da instituição no BCB |
| `CNPJ` | string | CNPJ da instituição |
| `TipoInstituicao` | string | Classificação (banco comercial, cooperativa, etc.) |
| `AtivoTotal` | decimal | Ativo total (R$ mil) |
| `PatrimonioLiquido` | decimal | Patrimônio líquido (R$ mil) |
| `LucroLiquido` | decimal | Resultado líquido no período (R$ mil) |
| `CarteiraCreditoTotal` | decimal | Total da carteira de crédito (R$ mil) |
| `DepositosTotal` | decimal | Total de depósitos captados (R$ mil) |
| `IndiceBasileia` | decimal | Índice de Basileia (%) |
| `IndiceImobilizacao` | decimal | Índice de imobilização (%) |
| `NumAgencias` | int | Número de agências |
| `NumPostosAtendimento` | int | Número de postos de atendimento |

## Cruzamentos possíveis

- **[SGS/API BCB - Juros](sgs-juros)** — comparar taxas cobradas por instituição com a Selic e o CDI
- **[SGS/API BCB - Crédito](sgs-credito)** — cruzar dados de crédito agregados com informações por instituição
- **Receita Federal (CNPJ)** — obter dados cadastrais complementares das instituições via CNPJ
- **CGU (CEIS/CNEP)** — verificar se instituições financeiras constam em cadastros de punições
- **CVM** — cruzar com dados de companhias abertas (para bancos listados em bolsa)

## Limitações conhecidas

- **Não é API REST**: o IFData é uma interface web; não há endpoint REST documentado para consulta direta
- **Atualização trimestral**: dados são publicados com defasagem de aproximadamente 90 dias após o encerramento do trimestre
- **Download manual**: a exportação CSV requer navegação manual no portal; automação via scraping é frágil e pode quebrar com alterações no site
- **Formato inconsistente**: os CSVs exportados podem ter variações de formato (encoding, separadores) entre versões
- **Dados consolidados vs. individuais**: dados de conglomerados bancários podem ser apresentados de forma consolidada, dificultando a análise de entidades individuais
- **Cobertura**: apenas instituições autorizadas pelo BCB; não inclui fintechs não reguladas ou instituições de pagamento menores
- **Sem API de séries temporais**: para acompanhar a evolução ao longo do tempo, é necessário baixar manualmente os dados de cada trimestre
