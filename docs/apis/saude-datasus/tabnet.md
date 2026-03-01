---
title: TabNet — Ferramenta de Tabulação de Dados do SUS
slug: tabnet
orgao: DATASUS / MS
url_base: http://tabnet.datasus.gov.br/
tipo_acesso: Web Interface
autenticacao: Não requerida
formato_dados: [CSV, HTML]
frequencia_atualizacao: Mensal
campos_chave:
  - CID-10
  - codigo_municipio
  - CNES
  - procedimento_SUS
tags:
  - saude
  - tabulacao
  - indicadores
  - SUS
  - mortalidade
  - morbidade
  - nascimentos
  - epidemiologia
  - DATASUS
cruzamento_com:
  - saude-datasus/sih
  - saude-datasus/sim
  - saude-datasus/sinasc
  - saude-datasus/sinan
  - saude-datasus/cnes
status: documentado
---

# TabNet — Ferramenta de Tabulação de Dados do SUS

## O que é

O **TabNet** é a ferramenta de tabulação e consulta de dados do SUS desenvolvida e mantida pelo **DATASUS/Ministério da Saúde**. Diferente dos outros sistemas de informação que disponibilizam microdados para download, o TabNet é uma **interface web interativa** que permite realizar consultas e cruzamentos diretamente no navegador, sem necessidade de baixar os dados brutos.

O TabNet permite:

- **Tabulação cruzada** — selecionar linhas, colunas e conteúdo para montar tabelas personalizadas
- **Filtros geográficos** — filtrar por UF, região de saúde, município
- **Filtros temporais** — selecionar períodos específicos (mês, ano)
- **Indicadores pré-calculados** — taxas, proporções e totais já computados
- **Exportação** — download dos resultados em CSV e formato tabular

O TabNet agrega dados de todos os principais sistemas de informação de saúde:

| Sistema | Dados disponíveis no TabNet |
|---|---|
| SIH | Internações, procedimentos hospitalares, AIH |
| SIM | Óbitos por causa, local, perfil demográfico |
| SINASC | Nascidos vivos, tipo de parto, perfil materno |
| SINAN | Doenças de notificação compulsória |
| CNES | Estabelecimentos, leitos, equipamentos, profissionais |
| SIA | Produção ambulatorial |
| PNI | Imunizações (cobertura vacinal) |

> **Quando usar o TabNet:** O TabNet é ideal para consultas rápidas, geração de indicadores pontuais e validação de análises. Para análises complexas ou processamento de grandes volumes de dados, recomenda-se o download dos microdados via FTP/PySUS.

## Como acessar

| Item | Detalhe |
|---|---|
| **URL principal** | `http://tabnet.datasus.gov.br/` |
| **Autenticação** | Não requerida |
| **Formato de saída** | Tabela HTML (visualização) ou CSV (download) |
| **Interface** | Formulário web com seleção de variáveis |
| **Disponibilidade** | 24/7, mas pode apresentar lentidão em horários de pico |

### URLs por sistema

| Sistema | URL do TabNet |
|---|---|
| **SIH - Internações** | `http://tabnet.datasus.gov.br/cgi/deftohtm.exe?sih/cnv/niuf.def` |
| **SIM - Mortalidade** | `http://tabnet.datasus.gov.br/cgi/deftohtm.exe?sim/cnv/obt10uf.def` |
| **SINASC - Nascimentos** | `http://tabnet.datasus.gov.br/cgi/deftohtm.exe?sinasc/cnv/nvuf.def` |
| **SINAN - Agravos** | `http://tabnet.datasus.gov.br/cgi/deftohtm.exe?sinannet/cnv/denguebbr.def` |
| **CNES - Estabelecimentos** | `http://tabnet.datasus.gov.br/cgi/deftohtm.exe?cnes/cnv/estabuf.def` |
| **SIA - Ambulatorial** | `http://tabnet.datasus.gov.br/cgi/deftohtm.exe?sia/cnv/qauf.def` |
| **PNI - Imunizações** | `http://tabnet.datasus.gov.br/cgi/deftohtm.exe?pni/cnv/cpniuf.def` |

### Como funciona a interface

1. **Selecione o sistema** — acesse a URL correspondente ao sistema desejado
2. **Monte a tabela** — escolha:
   - **Linha**: variável para as linhas da tabela (ex: município, faixa etária)
   - **Coluna**: variável para as colunas (ex: ano, sexo)
   - **Conteúdo**: métrica a ser exibida (ex: número de internações, valor total)
3. **Aplique filtros** — selecione período, UF, faixa etária, etc.
4. **Visualize e exporte** — a tabela é exibida no navegador; clique em "Copia como .CSV" para download

## Endpoints/recursos principais

O TabNet não possui uma API REST formal, mas sua interface pode ser acessada programaticamente via requisições HTTP POST, enviando os parâmetros do formulário.

### Estrutura da URL

```
http://tabnet.datasus.gov.br/cgi/deftohtm.exe?{arquivo_definicao}
```

O `{arquivo_definicao}` é um arquivo `.def` que configura as opções disponíveis para cada tabulação.

### Parâmetros de formulário (POST)

| Parâmetro | Descrição |
|---|---|
| `Linha` | Variável para as linhas |
| `Coluna` | Variável para as colunas |
| `Incremento` | Métrica / conteúdo |
| `Arquivos` | Arquivo(s) de dados a consultar |
| `pesqmes*` | Filtros de período (meses) |
| `SRegi` | Filtro de região |
| `SEstado` | Filtro de estado |
| `SMunicipio` | Filtro de município |

### Principais tabulações disponíveis

| Tabulação | Descrição |
|---|---|
| **Morbidade hospitalar** | Internações por CID-10, sexo, faixa etária, município |
| **Mortalidade geral** | Óbitos por causa, local, perfil demográfico |
| **Mortalidade infantil** | Óbitos em menores de 1 ano, neonatais e pós-neonatais |
| **Nascidos vivos** | Nascimentos por tipo de parto, peso, perfil materno |
| **Doenças de notificação** | Casos por agravo, semana epidemiológica, município |
| **Recursos de saúde** | Leitos, equipamentos, profissionais por município |
| **Produção ambulatorial** | Procedimentos ambulatoriais realizados pelo SUS |
| **Cobertura vacinal** | Doses aplicadas e cobertura por vacina e município |

## Exemplo de uso

### Acesso programático com Python (web scraping do TabNet)

```python
import requests
import pandas as pd
from io import StringIO

def consultar_tabnet(
    url_def: str,
    linha: str,
    coluna: str,
    conteudo: str,
    periodos: list[str],
    filtros: dict = None,
) -> pd.DataFrame:
    """
    Consulta o TabNet programaticamente via POST.

    Args:
        url_def: URL completa do TabNet com o arquivo .def
        linha: Código da variável para linhas
        coluna: Código da variável para colunas
        conteudo: Código da métrica/conteúdo
        periodos: Lista de períodos (ex: ['2301', '2302'] para jan-fev/2023)
        filtros: Dicionário com filtros adicionais

    Returns:
        DataFrame com os dados tabulados
    """
    data = {
        "Linha": linha,
        "Coluna": coluna,
        "Incremento": conteudo,
        "Arquivos": periodos,
        "pesqmes1": "Digite o texto e tecle ENTER",
        "SMession": "novo",
        "SRegi": "TODAS_AS_CATEGORIAS__",
        "SEstado": "TODAS_AS_CATEGORIAS__",
    }

    if filtros:
        data.update(filtros)

    response = requests.post(url_def, data=data)
    response.encoding = "iso-8859-1"

    # O TabNet retorna HTML; é necessário parsear a tabela
    # Esta é uma abordagem simplificada
    tabelas = pd.read_html(StringIO(response.text), header=0)

    if tabelas:
        return tabelas[0]
    return pd.DataFrame()


# Exemplo: óbitos por UF, ano 2022
url = "http://tabnet.datasus.gov.br/cgi/deftohtm.exe?sim/cnv/obt10uf.def"
df = consultar_tabnet(
    url_def=url,
    linha="Unidade_da_Federação",
    coluna="não ativa",
    conteudo="Óbitos_p/Residênc",
    periodos=["obt10uf.dbf"],
)

print("Óbitos por UF (TabNet):")
print(df.head())
```

### Usando a biblioteca tabnet_py (alternativa)

```python
# Instalação: pip install tabnet-datasus
# Nota: esta biblioteca simplifica o acesso ao TabNet

import pandas as pd

# Abordagem alternativa: usar requests diretamente com parâmetros conhecidos
# para baixar dados em CSV do TabNet

url_csv = "http://tabnet.datasus.gov.br/cgi/tabcgi.exe?sim/cnv/obt10uf.def"

# Os parâmetros exatos variam por tabulação
# Consulte a interface web para identificar os valores corretos
params = {
    "Linha": "Unidade_da_Federação",
    "Coluna": "Ano_do_Óbito",
    "Incremento": "Óbitos_p/Residênc",
    "Arquivos": ["obtbr22.dbf", "obtbr21.dbf"],
    "formato": "table",
}

response = requests.post(url_csv, data=params)
response.encoding = "iso-8859-1"

# Parse do resultado
tabelas = pd.read_html(StringIO(response.text), decimal=",", thousands=".")
if tabelas:
    df = tabelas[0]
    print(df)
```

### Usando PySUS com TabNet

```python
# O PySUS inclui funções auxiliares para consultas ao TabNet
from pysus.online_data import parquet_to_dataframe

# Para a maioria dos casos, é mais prático usar PySUS para baixar
# os microdados completos e fazer a tabulação localmente:

from pysus.online_data.SIM import download
import pandas as pd

# Baixar microdados e tabular localmente
dados = download(states=["SP"], years=[2022])
df = dados.to_dataframe()

# Tabulação equivalente ao TabNet: óbitos por causa e faixa etária
tabela = pd.crosstab(
    df["CAUSABAS"].str[:3],  # Capítulo CID-10 (3 caracteres)
    df["SEXO"].map({"1": "Masculino", "2": "Feminino"}),
    margins=True,
)

print("Tabulação equivalente ao TabNet — Óbitos por CID-10 e sexo:")
print(tabela.head(10))
```

## Campos disponíveis

O TabNet não possui campos fixos como os microdados — ele apresenta **variáveis de tabulação** que dependem do sistema consultado. As principais variáveis disponíveis em cada sistema são:

### Variáveis de linha/coluna (SIM — Mortalidade)

| Variável | Descrição |
|---|---|
| `Unidade_da_Federação` | UF de ocorrência ou residência |
| `Município` | Município (código IBGE) |
| `Capítulo_CID-10` | Capítulo da CID-10 (grupos de causas) |
| `Categoria_CID-10` | Categoria específica da CID-10 |
| `Sexo` | Masculino, Feminino |
| `Faixa_Etária` | Faixas etárias predefinidas |
| `Cor/raça` | Branca, Preta, Parda, Amarela, Indígena |
| `Escolaridade` | Faixas de escolaridade |
| `Local_ocorrência` | Hospital, Domicílio, Via pública, etc. |
| `Ano_do_Óbito` | Ano de referência |

### Variáveis de conteúdo (métricas)

| Métrica | Descrição |
|---|---|
| `Óbitos_p/Residênc` | Número de óbitos por local de residência |
| `Óbitos_p/Ocorrênc` | Número de óbitos por local de ocorrência |
| `Internações` | Número de internações (SIH) |
| `Valor_total` | Valor total pago pelo SUS |
| `Dias_permanência` | Total de dias de permanência hospitalar |
| `Nascidos_vivos` | Número de nascidos vivos (SINASC) |
| `Casos` | Número de casos notificados (SINAN) |

## Cruzamentos possíveis

O TabNet, por ser uma ferramenta de tabulação, já permite cruzamentos internos entre variáveis do mesmo sistema. Porém, não permite cruzamentos entre sistemas diferentes diretamente. Para isso, é necessário utilizar os microdados.

| Cruzamento (via TabNet) | Descrição |
|---|---|
| Mortalidade x Região | Óbitos por causa e UF/município |
| Mortalidade x Demografia | Óbitos por sexo, faixa etária e raça/cor |
| Internações x Diagnóstico | AIH por CID-10, com valores e permanência |
| Nascimentos x Tipo de parto | Nascidos vivos por tipo de parto e município |
| Recursos x Região | Leitos, equipamentos e profissionais por município |

Para cruzamentos entre sistemas, utilize os microdados disponíveis em:
- [SIH](/docs/apis/saude-datasus/sih) — Internações hospitalares
- [SIM](/docs/apis/saude-datasus/sim) — Mortalidade
- [SINASC](/docs/apis/saude-datasus/sinasc) — Nascidos vivos
- [SINAN](/docs/apis/saude-datasus/sinan) — Agravos de notificação
- [CNES](/docs/apis/saude-datasus/cnes) — Estabelecimentos de saúde

## Limitações conhecidas

| Limitação | Detalhes |
|---|---|
| **Sem API REST formal** | O TabNet não possui uma API documentada. O acesso programático requer engenharia reversa dos parâmetros de formulário POST, que podem mudar sem aviso. |
| **Interface desatualizada** | A interface web do TabNet é antiga (baseada em CGI dos anos 2000), com usabilidade limitada e sem design responsivo. |
| **Sem cruzamento entre sistemas** | Não é possível cruzar dados de sistemas diferentes (ex: SIH com SIM) diretamente no TabNet. Cada consulta é restrita a um sistema. |
| **Limitação de resultados** | Consultas muito amplas (muitos municípios, muitos anos) podem falhar por timeout ou retornar dados incompletos. |
| **Encoding ISO-8859-1** | As páginas e CSVs do TabNet usam encoding Latin-1, não UTF-8. É necessário especificar o encoding ao processar os dados. |
| **Formato de números** | Números usam vírgula como separador decimal e ponto como separador de milhar (padrão brasileiro), exigindo tratamento na importação. |
| **Dados agregados** | O TabNet retorna apenas dados tabulados (agregados). Para microdados individuais, é necessário acessar o FTP ou usar PySUS. |
| **Instabilidade** | O servidor pode apresentar lentidão ou indisponibilidade, especialmente em horários de pico. Não há SLA documentado. |
| **Sem versionamento** | Quando os dados são atualizados, versões anteriores das tabulações não ficam disponíveis. Não há como reproduzir uma consulta com dados de uma data passada. |
| **Parâmetros não documentados** | Os códigos internos dos parâmetros de consulta (ex: nomes de variáveis, arquivos `.def`) não são documentados publicamente. É necessário inspecionar o HTML da página para identificá-los. |
