---
title: "Servidor Público x Empresas"
dificuldade: intermediário
fontes_utilizadas:
  - transparencia-cgu/servidores-federais
  - receita-federal/qsa
  - receita-federal/cnpj-completa
  - receita-federal/estabelecimentos
  - transparencia-cgu/contratos-federais
campos_ponte: [CPF, CNPJ, código de órgão]
tags: [servidores públicos, conflito de interesses, empresas, contratos, nepotismo]
sidebar_position: 4
---

# Servidor Publico x Empresas

## Objetivo

Identificar **servidores publicos federais** que sao socios ou administradores de empresas que recebem contratos do governo, especialmente do proprio orgao onde o servidor trabalha. Este cruzamento revela potenciais:

- **Conflitos de interesse** — servidor que influencia contratacoes que beneficiam sua propria empresa
- **Vedacoes legais** — a Lei 8.112/90 proibe servidores de participar de gerencia ou administracao de empresa privada (com excecoes)
- **Nepotismo empresarial** — empresas de familiares de servidores sendo contratadas pelo mesmo orgao

## Fluxo de dados

```
  CGU Servidores          Receita Federal            CGU Contratos
  (Portal Transparencia)    (QSA + CNPJ)            (Portal Transparencia)
  +------------------+   +------------------+     +------------------+
  | Nome servidor    |   | QSA:             |     | Contratos:       |
  | CPF (parcial)    |-->| nome socio       |     | CNPJ contratado  |
  | Orgao exercicio  |   | CNPJ basico      |<--->| codigo orgao     |
  | Cargo            |   |                  |     | valor contrato   |
  | Remuneracao      |   | CNPJ Completa:   |     | objeto           |
  +------------------+   | razao social     |     +------------------+
                          | sit. cadastral   |
                          +------------------+

  CRUZAMENTO:
  +-----------------------------------------------------------------+
  | 1. Servidor "Joao" do orgao "MEC" (cod 26000)                   |
  | 2. Joao e socio da empresa "ABC Ltda" (CNPJ 12345678)           |
  | 3. ABC Ltda tem contrato de R$ 500k com o MEC (cod 26000)       |
  | --> ALERTA: servidor socio de empresa contratada pelo            |
  |     proprio orgao                                                |
  +-----------------------------------------------------------------+

  CAMPOS-PONTE:
  Servidores --[nome]--> QSA --[CNPJ]--> Contratos
                                    \
  Servidores --[cod.orgao]-----------+--> Contratos
```

## Passo a passo

### 1. Obter lista de servidores federais

Consulte a API de [Servidores Federais](../apis/transparencia-cgu/servidores-federais) para obter a lista de servidores ativos, com nome, CPF (parcial), orgao de exercicio e cargo. Como alternativa, use os dados de download em lote disponiveis no Portal da Transparencia.

### 2. Buscar participacoes societarias no QSA

Para cada servidor, busque no [QSA — Quadro Societario](../apis/receita-federal/qsa) todas as empresas em que aparece como socio. Use o **nome** como campo de busca (CPF e parcialmente ocultado em ambas as bases).

### 3. Filtrar empresas ativas

Consulte os [Estabelecimentos](../apis/receita-federal/estabelecimentos) para verificar a situacao cadastral de cada empresa encontrada. Filtre apenas empresas com situacao "Ativa" (codigo `02`).

### 4. Enriquecer com dados cadastrais

Consulte a [Base CNPJ Completa](../apis/receita-federal/cnpj-completa) para obter razao social, natureza juridica, capital social e CNAE (atividade economica).

### 5. Verificar contratos com o governo

Consulte os [Contratos Federais](../apis/transparencia-cgu/contratos-federais) para verificar se as empresas dos servidores tem contratos com orgaos federais. O caso mais grave e quando o contrato e com o **mesmo orgao** onde o servidor trabalha.

### 6. Classificar por nivel de risco

Atribua niveis de risco:
- **Critico:** servidor e socio de empresa contratada pelo proprio orgao
- **Alto:** servidor e socio de empresa contratada por outro orgao federal
- **Medio:** servidor e socio de empresa ativa, sem contratos federais identificados
- **Baixo:** servidor e socio de empresa inativa ou MEI

## Exemplo de codigo

```python
import pandas as pd
import requests
import time
from pathlib import Path

# ============================================================
# CONFIGURACAO
# ============================================================
API_KEY = "SEU_TOKEN_AQUI"
BASE_URL = "https://api.portaldatransparencia.gov.br/api-de-dados"
HEADERS = {"chave-api-dados": API_KEY, "Accept": "application/json"}

COLUNAS_SOCIOS = [
    "cnpj_basico", "identificador_socio", "nome_socio_razao_social",
    "cpf_cnpj_socio", "qualificacao_socio", "data_entrada_sociedade",
    "pais", "representante_legal", "nome_representante",
    "qualificacao_representante_legal", "faixa_etaria",
]

COLUNAS_EMPRESAS = [
    "cnpj_basico", "razao_social", "natureza_juridica",
    "qualificacao_responsavel", "capital_social",
    "porte_empresa", "ente_federativo_responsavel",
]

COLUNAS_ESTABELECIMENTOS = [
    "cnpj_basico", "cnpj_ordem", "cnpj_dv", "identificador_matriz_filial",
    "nome_fantasia", "situacao_cadastral", "data_situacao_cadastral",
    "motivo_situacao_cadastral", "nome_cidade_exterior", "pais",
    "data_inicio_atividade", "cnae_fiscal_principal", "cnae_fiscal_secundaria",
    "tipo_logradouro", "logradouro", "numero", "complemento", "bairro",
    "cep", "uf", "municipio", "ddd1", "telefone1", "ddd2", "telefone2",
    "ddd_fax", "fax", "correio_eletronico", "situacao_especial",
    "data_situacao_especial",
]

DIRETORIO_DADOS = Path("./dados_rfb")


# ============================================================
# PASSO 1: Obter servidores de um orgao (CGU API)
# ============================================================
def coletar_servidores(codigo_orgao: str, max_paginas: int = 5) -> pd.DataFrame:
    """Coleta servidores de um orgao via API do Portal da Transparencia."""
    todos = []
    for pagina in range(1, max_paginas + 1):
        try:
            resp = requests.get(
                f"{BASE_URL}/servidores",
                headers=HEADERS,
                params={
                    "codigoOrgaoExercicio": codigo_orgao,
                    "pagina": pagina,
                },
                timeout=30,
            )
            resp.raise_for_status()
            dados = resp.json()
            if not dados:
                break
            todos.extend(dados)
            time.sleep(2)  # Respeitar rate limit
        except Exception as e:
            print(f"Erro na pagina {pagina}: {e}")
            break

    return pd.DataFrame(todos)


# Exemplo: servidores do Ministerio da Educacao (26000)
CODIGO_ORGAO = "26000"
print(f"Coletando servidores do orgao {CODIGO_ORGAO}...")
df_servidores = coletar_servidores(CODIGO_ORGAO, max_paginas=10)
print(f"Servidores coletados: {len(df_servidores)}")


# ============================================================
# PASSO 2: Carregar QSA da Receita Federal
# ============================================================
def carregar_socios() -> pd.DataFrame:
    """Carrega todos os arquivos de socios."""
    dfs = []
    for i in range(10):
        caminho = DIRETORIO_DADOS / f"Socios{i}.csv"
        if caminho.exists():
            df = pd.read_csv(
                caminho, sep=";", header=None, names=COLUNAS_SOCIOS,
                dtype=str, encoding="latin-1",
            )
            dfs.append(df)
    return pd.concat(dfs, ignore_index=True)


print("Carregando QSA...")
df_socios = carregar_socios()
df_socios["nome_norm"] = df_socios["nome_socio_razao_social"].str.upper().str.strip()
print(f"Registros de socios: {len(df_socios):,}")


# ============================================================
# PASSO 3: Cruzar servidores com QSA
# ============================================================
# Normalizar nomes dos servidores
df_servidores["nome_norm"] = df_servidores["nome"].str.upper().str.strip()

# Merge por nome (campo comum entre as duas bases)
cruzamento = df_socios.merge(
    df_servidores[["nome_norm", "nome", "cargo", "nomeOrgaoExercicio",
                    "codigoOrgaoExercicio"]],
    on="nome_norm",
    how="inner",
)

print(f"\nServidores encontrados no QSA: {cruzamento['nome_norm'].nunique()}")
print(f"Empresas associadas: {cruzamento['cnpj_basico'].nunique()}")


# ============================================================
# PASSO 4: Enriquecer com dados cadastrais e filtrar ativas
# ============================================================
def carregar_empresas() -> pd.DataFrame:
    dfs = []
    for i in range(10):
        caminho = DIRETORIO_DADOS / f"Empresas{i}.csv"
        if caminho.exists():
            df = pd.read_csv(
                caminho, sep=";", header=None, names=COLUNAS_EMPRESAS,
                dtype=str, encoding="latin-1",
            )
            dfs.append(df)
    return pd.concat(dfs, ignore_index=True)


def carregar_estabelecimentos() -> pd.DataFrame:
    dfs = []
    for i in range(10):
        caminho = DIRETORIO_DADOS / f"Estabelecimentos{i}.csv"
        if caminho.exists():
            df = pd.read_csv(
                caminho, sep=";", header=None, names=COLUNAS_ESTABELECIMENTOS,
                dtype=str, encoding="latin-1",
            )
            dfs.append(df)
    return pd.concat(dfs, ignore_index=True)


print("Carregando dados cadastrais...")
df_empresas = carregar_empresas()
df_estab = carregar_estabelecimentos()

# Juntar dados cadastrais
cruzamento = cruzamento.merge(
    df_empresas[["cnpj_basico", "razao_social", "natureza_juridica", "capital_social"]],
    on="cnpj_basico",
    how="left",
)

# Filtrar apenas matrizes ativas (situacao_cadastral = '02')
matrizes_ativas = df_estab[
    (df_estab["identificador_matriz_filial"] == "1") &
    (df_estab["situacao_cadastral"] == "02")
][["cnpj_basico", "cnae_fiscal_principal", "uf", "municipio"]]

cruzamento = cruzamento.merge(
    matrizes_ativas,
    on="cnpj_basico",
    how="inner",  # Apenas empresas ativas
)

print(f"Servidores com empresas ativas: {cruzamento['nome_norm'].nunique()}")


# ============================================================
# PASSO 5: Verificar contratos com o governo
# ============================================================
def buscar_contratos(cnpj_completo: str) -> list:
    """Busca contratos federais de uma empresa."""
    try:
        resp = requests.get(
            f"{BASE_URL}/contratos",
            headers=HEADERS,
            params={"cnpjContratado": cnpj_completo, "pagina": 1},
            timeout=30,
        )
        resp.raise_for_status()
        return resp.json()
    except Exception:
        return []


# Verificar contratos para uma amostra de empresas
alertas = []
cnpjs_verificar = cruzamento["cnpj_basico"].unique()[:30]  # Amostra

for cnpj_basico in cnpjs_verificar:
    # Buscar CNPJ completo da matriz (basico + 0001 + DV)
    estab_info = df_estab[
        (df_estab["cnpj_basico"] == cnpj_basico) &
        (df_estab["identificador_matriz_filial"] == "1")
    ]
    if estab_info.empty:
        continue

    row_estab = estab_info.iloc[0]
    cnpj_completo = (
        cnpj_basico + row_estab["cnpj_ordem"] + row_estab["cnpj_dv"]
    )

    contratos = buscar_contratos(cnpj_completo)
    if contratos:
        servidor_info = cruzamento[
            cruzamento["cnpj_basico"] == cnpj_basico
        ].iloc[0]

        for contrato in contratos:
            orgao_contrato = contrato.get("codigoOrgao", "")
            orgao_servidor = servidor_info.get("codigoOrgaoExercicio", "")

            # Classificar risco
            if orgao_contrato == orgao_servidor:
                risco = "CRITICO"
            else:
                risco = "ALTO"

            alertas.append({
                "servidor": servidor_info["nome"],
                "cargo": servidor_info["cargo"],
                "orgao_servidor": servidor_info["nomeOrgaoExercicio"],
                "empresa": servidor_info.get("razao_social", "N/A"),
                "cnpj": cnpj_completo,
                "orgao_contrato": contrato.get("nomeOrgao", "N/A"),
                "valor_contrato": contrato.get("valorInicial", 0),
                "objeto": contrato.get("objeto", "N/A")[:80],
                "risco": risco,
            })

    time.sleep(2)  # Respeitar rate limit


# ============================================================
# RESULTADO
# ============================================================
df_alertas = pd.DataFrame(alertas)
if not df_alertas.empty:
    df_alertas = df_alertas.sort_values(
        "risco", ascending=True  # CRITICO primeiro
    )
    print("\n=== ALERTAS: SERVIDORES COM EMPRESAS CONTRATADAS ===")
    for _, alerta in df_alertas.iterrows():
        print(f"\n[{alerta['risco']}] {alerta['servidor']}")
        print(f"  Cargo: {alerta['cargo']}")
        print(f"  Orgao: {alerta['orgao_servidor']}")
        print(f"  Empresa: {alerta['empresa']} (CNPJ: {alerta['cnpj']})")
        print(f"  Contrato com: {alerta['orgao_contrato']}")
        print(f"  Valor: R$ {alerta['valor_contrato']:,.2f}")

    df_alertas.to_csv("alertas_servidores_empresas.csv", index=False)
    print(f"\nTotal de alertas: {len(df_alertas)}")
    print(f"  CRITICO: {len(df_alertas[df_alertas['risco'] == 'CRITICO'])}")
    print(f"  ALTO: {len(df_alertas[df_alertas['risco'] == 'ALTO'])}")
else:
    print("\nNenhum alerta encontrado na amostra.")
```

## Resultado esperado

O script gera alertas classificados por nivel de risco:

```
=== ALERTAS: SERVIDORES COM EMPRESAS CONTRATADAS ===

[CRITICO] JOAO DA SILVA
  Cargo: ANALISTA DE TECNOLOGIA DA INFORMACAO
  Orgao: MINISTERIO DA EDUCACAO
  Empresa: SILVA TECNOLOGIA LTDA (CNPJ: 12345678000190)
  Contrato com: MINISTERIO DA EDUCACAO
  Valor: R$ 1.200.000,00

[ALTO] MARIA DE SOUZA
  Cargo: ASSISTENTE ADMINISTRATIVO
  Orgao: MINISTERIO DA SAUDE
  Empresa: MS CONSULTORIA EIRELI (CNPJ: 87654321000155)
  Contrato com: MINISTERIO DA DEFESA
  Valor: R$ 350.000,00

Total de alertas: 2
  CRITICO: 1
  ALTO: 1
```

O arquivo `alertas_servidores_empresas.csv` contem todos os registros para analise posterior.

## Limitacoes

| Limitacao | Impacto | Mitigacao |
|---|---|---|
| **CPF ocultado em ambas as bases** | Tanto a API de servidores quanto o QSA da Receita ocultam parcialmente o CPF | Cruzar por nome normalizado; validar com cargo e orgao |
| **Homonimos** | Nomes comuns geram falsos positivos, especialmente em orgaos grandes | Combinar nome com UF do estabelecimento vs. orgao do servidor; revisar manualmente alertas criticos |
| **Apenas Executivo Federal** | API de servidores cobre apenas o Poder Executivo Federal | Para legislativo/judiciario, usar dados de outras fontes (portais proprios) |
| **Empresas de familiares** | Servidor pode usar conjuge ou filhos como socios | Expandir busca para socios das empresas do servidor (segundo grau) |
| **Rate limit** | 30 req/min limita volume de consultas de contratos | Processar em lotes com intervalo; priorizar servidores de cargos de decisao |
| **Vedacao nao e absoluta** | Servidores podem ser socios sem cargo de gerencia (permitido em alguns casos) | Filtrar por qualificacao do socio: focar em "Socio-Administrador" (49) e "Administrador" (05) |
| **Dados temporais** | Servidor pode ter saido do cargo ou da empresa | Validar situacao do vinculo (ativo) e situacao cadastral da empresa (ativa) |
