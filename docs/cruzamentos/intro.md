---
title: "Introdução aos Cruzamentos"
sidebar_position: 1
---

# Introdução aos Cruzamentos de Dados

## O que são cruzamentos de dados?

**Cruzamento de dados** (ou *data cross-referencing*) e a tecnica de conectar duas ou mais bases de dados independentes atraves de **campos em comum** para revelar informacoes que nenhuma base sozinha consegue mostrar. No contexto da fiscalizacao governamental brasileira, cruzamentos permitem:

- Detectar **conflitos de interesse** (ex: servidor publico que e socio de empresa fornecedora do proprio orgao)
- Rastrear **fluxos de dinheiro publico** (ex: emendas parlamentares que beneficiam empresas ligadas ao autor)
- Identificar **redes de relacionamento** (ex: grupo de empresas com socios em comum recebendo contratos)
- Verificar **conformidade legal** (ex: empresa contratada que consta em cadastros de sancoes)
- Monitorar **impacto ambiental** (ex: desmatamento detectado dentro de propriedade rural cadastrada)

## Campos-ponte (Bridge Fields)

O cruzamento so e possivel quando duas bases compartilham um **campo-ponte** — um identificador presente em ambas que permite a ligacao. No ecossistema de dados publicos brasileiros, os principais campos-ponte sao:

| Campo-ponte | Formato | Onde aparece | Poder de cruzamento |
|---|---|---|---|
| **CPF** | 11 digitos | TSE, CGU Servidores, QSA, IBAMA, CAR | Conecta pessoas fisicas entre bases |
| **CNPJ** | 14 digitos (basico: 8) | Receita Federal, CGU Contratos, CEIS/CNEP, TSE | Conecta empresas entre bases |
| **Codigo de orgao** | SIAFI/SIORG | CGU, Tesouro, SIAPE | Conecta orgaos governamentais |
| **Codigo IBGE** | 7 digitos (municipio) | IBGE, DETER, PRODES, CAR, TSE | Conecta por localizacao |
| **Coordenadas geograficas** | Lat/Lon ou poligono | DETER, PRODES, CAR, IBAMA | Conecta por sobreposicao espacial |
| **Nome** | Texto livre | Todas as bases | Ultimo recurso (falivel, requer normalizacao) |

## Mapa dos nexos de dados

O diagrama abaixo mostra como as principais bases de dados se conectam atraves dos campos-ponte:

```
                          CAMPO-PONTE: CPF
                               |
        +----------------------+----------------------+
        |                      |                      |
        v                      v                      v
  +-----------+        +--------------+       +---------------+
  |    TSE    |        |     CGU      |       | Receita Fed.  |
  |-----------|        |--------------|       |---------------|
  |Candidatura|        |  Servidores  |       |  QSA (Socios) |
  |Prest.Conta|        |  Federais    |       |               |
  |Bens Decl. |        |  CEAF        |       |               |
  +-----------+        +--------------+       +-------+-------+
        |                      |                      |
        |              CAMPO-PONTE: CNPJ              |
        |                      |                      |
        +----------+-----------+-----------+----------+
                   |                       |
                   v                       v
           +--------------+        +--------------+
           |     CGU      |        | Receita Fed. |
           |--------------|        |--------------|
           |  Contratos   |        | CNPJ Complet |
           |  Emendas     |        | Estabelecim. |
           |  CEIS/CNEP   |        | Simples Nac. |
           +--------------+        +--------------+
                   |
        CAMPO-PONTE: CODIGO DE ORGAO
                   |
           +--------------+
           |   Tesouro    |
           |--------------|
           |    SIAFI     |
           |  Orcamento   |
           +--------------+


        CAMPO-PONTE: COORDENADAS / COD. IBGE
                       |
        +--------------+--------------+
        |              |              |
        v              v              v
  +-----------+  +-----------+  +-----------+
  |   INPE    |  |   IBAMA   |  |   SICAR   |
  |-----------|  |-----------|  |-----------|
  |   DETER   |  | Infracoes |  |    CAR    |
  |   PRODES  |  | Embargos  |  | Prop.Rural|
  +-----------+  +-----------+  +-----------+
```

## Arquitetura de um cruzamento tipico

Todo cruzamento segue um fluxo padrao:

```
  FONTE A              CAMPO-PONTE              FONTE B
  +--------+          +-----------+          +--------+
  | Dados  |--CNPJ--->|           |<--CNPJ---|  Dados |
  | de     |          |   JOIN    |          |  de    |
  | Emendas|          | (merge)   |          | Socios |
  +--------+          +-----------+          +--------+
                            |
                            v
                    +---------------+
                    |   RESULTADO   |
                    |---------------|
                    | Parlamentar X |
                    | e socio da    |
                    | empresa Y que |
                    | recebeu       |
                    | emenda Z      |
                    +---------------+
```

**Passos gerais:**

1. **Obter dados da Fonte A** — download ou consulta via API
2. **Obter dados da Fonte B** — download ou consulta via API
3. **Normalizar os campos-ponte** — padronizar CPF/CNPJ (remover pontuacao, preencher zeros a esquerda)
4. **Executar o JOIN (merge)** — cruzar as bases pelo campo em comum
5. **Filtrar e analisar resultados** — identificar registros relevantes
6. **Validar** — confirmar achados manualmente antes de publicar

## Normalizacao de campos-ponte

A qualidade do cruzamento depende da normalizacao correta dos campos-ponte. Use estas funcoes utilitarias em Python:

```python
import re

def normalizar_cpf(cpf: str) -> str:
    """Remove formatacao e preenche com zeros a esquerda."""
    if not cpf:
        return ""
    cpf_limpo = re.sub(r"[.\-/*]", "", str(cpf).strip())
    return cpf_limpo.zfill(11)


def normalizar_cnpj(cnpj: str) -> str:
    """Remove formatacao e preenche com zeros a esquerda."""
    if not cnpj:
        return ""
    cnpj_limpo = re.sub(r"[.\-/]", "", str(cnpj).strip())
    return cnpj_limpo.zfill(14)


def cnpj_basico(cnpj: str) -> str:
    """Extrai os 8 primeiros digitos (CNPJ basico) de um CNPJ completo."""
    return normalizar_cnpj(cnpj)[:8]


def normalizar_nome(nome: str) -> str:
    """
    Normaliza nome para cruzamento por texto.
    Remove acentos, converte para maiusculo, remove espacos extras.
    """
    import unicodedata
    if not nome:
        return ""
    nome = unicodedata.normalize("NFD", nome)
    nome = "".join(c for c in nome if unicodedata.category(c) != "Mn")
    nome = nome.upper().strip()
    nome = re.sub(r"\s+", " ", nome)
    return nome
```

## Receitas disponíveis

Este catalogo contem as seguintes receitas de cruzamento, organizadas por nivel de complexidade:

| Receita | Dificuldade | Campos-ponte | O que revela |
|---|---|---|---|
| [Parlamentar x Empresas x Emendas](./parlamentar-empresas-emendas) | Avancado | CPF, CNPJ | Politicos com empresas que recebem emendas |
| [Rede CPF/CNPJ](./cpf-cnpj-nexus) | Intermediario | CPF, CNPJ | Mapeamento completo de rede societaria |
| [Servidor Publico x Empresas](./servidor-publico-empresas) | Intermediario | CPF, CNPJ | Servidores donos de empresas fornecedoras |
| [Desmatamento x CAR x Embargos](./desmatamento-car-embargos) | Avancado | Coordenadas, Cod. IBGE | Desmatamento em propriedades cadastradas |
| [Licitacoes x Sancoes](./licitacoes-sancoes) | Basico | CNPJ | Empresas contratadas que estao sancionadas |

## Ferramentas recomendadas

| Ferramenta | Uso | Link |
|---|---|---|
| **Python + pandas** | Cruzamentos tabulares (CPF, CNPJ) | https://pandas.pydata.org/ |
| **GeoPandas** | Cruzamentos geoespaciais (coordenadas, poligonos) | https://geopandas.org/ |
| **NetworkX** | Analise de redes (grafos de socios/empresas) | https://networkx.org/ |
| **DuckDB** | Processamento eficiente de arquivos grandes | https://duckdb.org/ |
| **QGIS** | Visualizacao e analise geoespacial | https://qgis.org/ |

## Cuidados importantes

:::warning Atencao: responsabilidade no uso dos dados

1. **LGPD e CPFs ocultados** — Muitas bases ocultam parcialmente o CPF (`***123456**`). Isso limita cruzamentos diretos por CPF e exige uso de cruzamento por nome (menos preciso).

2. **Falsos positivos** — Homonimos (pessoas com mesmo nome) podem gerar cruzamentos incorretos. Sempre valide resultados cruzando com campos adicionais (UF, data de nascimento, etc.).

3. **Dados desatualizados** — Bases tem frequencias de atualizacao diferentes. Um socio pode ter saido de uma empresa, mas ainda constar na ultima versao publicada.

4. **Etica jornalistica** — Cruzamentos revelam indicios, nao provas. Sempre de direito de resposta e contextualize os achados antes de publicar.

5. **Rate limits de APIs** — Respeite os limites de requisicoes por minuto de cada API. Use `time.sleep()` e implemente retry com backoff exponencial.

:::
