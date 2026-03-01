---
title: "Licitações x Sanções"
dificuldade: básico
fontes_utilizadas:
  - transparencia-cgu/contratos-federais
  - transparencia-cgu/ceis
  - transparencia-cgu/cnep
  - transparencia-cgu/ceaf
  - receita-federal/cnpj-completa
campos_ponte: [CNPJ, CPF]
tags: [licitações, sanções, CEIS, CNEP, CEAF, contratos, anticorrupção, compliance]
sidebar_position: 6
---

# Licitacoes x Sancoes

## Objetivo

Verificar se empresas que participam de licitacoes ou possuem contratos com o governo federal estao listadas nos **cadastros de sancoes** da CGU. Este e o cruzamento mais basico e essencial de compliance governamental, respondendo a pergunta:

> **O governo esta contratando empresas que ja foram punidas por corrupcao, fraude ou irregularidades?**

Os tres cadastros de sancoes verificados sao:
- [**CEIS**](../apis/transparencia-cgu/ceis) — Cadastro de Empresas Inidoneas e Suspensas (impedidas de licitar)
- [**CNEP**](../apis/transparencia-cgu/cnep) — Cadastro Nacional de Empresas Punidas (Lei Anticorrupcao)
- [**CEAF**](../apis/transparencia-cgu/ceaf) — Cadastro de Expulsoes da Administracao Federal (servidores expulsos)

O CEAF e usado de forma complementar: verifica se socios de empresas contratadas sao **ex-servidores expulsos** da administracao federal.

## Fluxo de dados

```
  CGU Contratos             CGU Sancoes              Receita Federal
  (Portal Transparencia)    (CEIS + CNEP + CEAF)     (CNPJ + QSA)
  +------------------+    +-------------------+    +------------------+
  | CNPJ contratado  |--->| CEIS:             |    | CNPJ Completa:   |
  | Valor contrato   |    |   CNPJ sancionado |    |   razao social   |
  | Orgao contratante|    |   data sancao     |    |   sit. cadastral |
  | Vigencia         |    |   tipo sancao     |    |                  |
  | Objeto           |    |                   |    | QSA:             |
  +------------------+    | CNEP:             |    |   CPF socio      |
                          |   CNPJ punido     |    |   nome socio     |
                          |   valor multa     |    +------------------+
                          |                   |            |
                          | CEAF:             |            |
                          |   CPF expulso     |<-----------+
                          |   cargo           |    (CPF socio = CPF expulso?)
                          +-------------------+

  CRUZAMENTO DIRETO (CNPJ):
  Contratos --[CNPJ]--> CEIS  = empresa contratada esta inidonea?
  Contratos --[CNPJ]--> CNEP  = empresa contratada foi punida?

  CRUZAMENTO INDIRETO (CPF via QSA):
  Contratos --[CNPJ]--> QSA --[CPF socio]--> CEAF = socio foi expulso?
```

## Passo a passo

### 1. Obter lista de contratos federais

Consulte a API de [Contratos Federais](../apis/transparencia-cgu/contratos-federais) para obter contratos vigentes, com CNPJ do contratado, valor e orgao contratante.

### 2. Obter cadastros de sancoes

Consulte as APIs de:
- [CEIS](../apis/transparencia-cgu/ceis) — empresas inidoneas e suspensas
- [CNEP](../apis/transparencia-cgu/cnep) — empresas punidas pela Lei Anticorrupcao

### 3. Cruzar contratos com CEIS

Faca o JOIN entre a lista de CNPJs dos contratados e a lista de CNPJs no CEIS. Qualquer correspondencia indica que uma empresa **impedida de licitar** possui contrato ativo.

### 4. Cruzar contratos com CNEP

Faca o JOIN entre a lista de CNPJs dos contratados e a lista de CNPJs no CNEP. Correspondencias indicam empresas punidas pela Lei Anticorrupcao com contratos ativos.

### 5. Cruzamento indireto via QSA e CEAF (opcional)

Para uma analise mais profunda:
- Obtenha o [QSA](../apis/receita-federal/qsa) das empresas contratadas para identificar os socios
- Cruze os nomes/CPFs dos socios com o [CEAF](../apis/transparencia-cgu/ceaf) para verificar se algum socio e ex-servidor expulso

### 6. Consolidar e classificar alertas

Classifique por gravidade:
- **Critico:** empresa no CEIS com contrato ativo (impedida de licitar)
- **Alto:** empresa no CNEP com contrato ativo (punida por corrupcao)
- **Medio:** socio de empresa contratada e ex-servidor expulso (CEAF)

## Exemplo de codigo

```python
import pandas as pd
import requests
import time

# ============================================================
# CONFIGURACAO
# ============================================================
API_KEY = "SEU_TOKEN_AQUI"
BASE_URL = "https://api.portaldatransparencia.gov.br/api-de-dados"
HEADERS = {"chave-api-dados": API_KEY, "Accept": "application/json"}


# ============================================================
# FUNCOES AUXILIARES
# ============================================================
def normalizar_cnpj(cnpj: str) -> str:
    """Remove formatacao do CNPJ e preenche com zeros."""
    if not cnpj:
        return ""
    import re
    return re.sub(r"[.\-/]", "", str(cnpj).strip()).zfill(14)


def coletar_paginado(endpoint: str, params: dict, max_paginas: int = 20) -> list:
    """Coleta dados paginados de um endpoint da API CGU."""
    todos = []
    for pagina in range(1, max_paginas + 1):
        try:
            params["pagina"] = pagina
            resp = requests.get(
                f"{BASE_URL}/{endpoint}",
                headers=HEADERS,
                params=params,
                timeout=30,
            )
            resp.raise_for_status()
            dados = resp.json()
            if not dados:
                break
            todos.extend(dados)
            time.sleep(2)  # Respeitar rate limit (30 req/min)
        except Exception as e:
            print(f"Erro no endpoint {endpoint}, pagina {pagina}: {e}")
            break
    return todos


# ============================================================
# PASSO 1: Coletar contratos federais vigentes
# ============================================================
print("Coletando contratos federais...")
contratos_raw = coletar_paginado(
    "contratos",
    params={
        "dataInicial": "01/01/2024",
        "dataFinal": "31/12/2024",
    },
    max_paginas=50,
)

df_contratos = pd.DataFrame(contratos_raw)
if not df_contratos.empty:
    df_contratos["cnpj_norm"] = df_contratos["cnpjContratado"].apply(normalizar_cnpj)
    print(f"Contratos coletados: {len(df_contratos)}")
    print(f"Empresas unicas: {df_contratos['cnpj_norm'].nunique()}")
else:
    print("Nenhum contrato coletado.")
    exit()


# ============================================================
# PASSO 2: Coletar cadastros de sancoes
# ============================================================
print("\nColetando CEIS (empresas inidoneas/suspensas)...")
ceis_raw = coletar_paginado("ceis", params={}, max_paginas=100)
df_ceis = pd.DataFrame(ceis_raw)
if not df_ceis.empty:
    df_ceis["cnpj_norm"] = df_ceis["cnpjSancionado"].apply(normalizar_cnpj)
    print(f"Registros CEIS: {len(df_ceis)}")

print("\nColetando CNEP (empresas punidas - Lei Anticorrupcao)...")
cnep_raw = coletar_paginado("cnep", params={}, max_paginas=50)
df_cnep = pd.DataFrame(cnep_raw)
if not df_cnep.empty:
    df_cnep["cnpj_norm"] = df_cnep["cnpjSancionado"].apply(normalizar_cnpj)
    print(f"Registros CNEP: {len(df_cnep)}")


# ============================================================
# PASSO 3: Cruzar contratos x CEIS
# ============================================================
print("\n=== CRUZAMENTO: CONTRATOS x CEIS ===")

if not df_ceis.empty:
    # CNPJs que estao em ambas as bases
    cnpjs_ceis = set(df_ceis["cnpj_norm"].unique())
    cnpjs_contratos = set(df_contratos["cnpj_norm"].unique())
    cnpjs_criticos = cnpjs_contratos & cnpjs_ceis

    if cnpjs_criticos:
        alertas_ceis = df_contratos[
            df_contratos["cnpj_norm"].isin(cnpjs_criticos)
        ].merge(
            df_ceis[["cnpj_norm", "tipoSancao", "dataInicioSancao",
                      "dataFimSancao", "orgaoSancionador"]],
            on="cnpj_norm",
            how="inner",
        )
        print(f"\n[CRITICO] {len(cnpjs_criticos)} empresa(s) contratada(s) "
              f"constam no CEIS!")
        for cnpj in cnpjs_criticos:
            info = alertas_ceis[alertas_ceis["cnpj_norm"] == cnpj].iloc[0]
            print(f"\n  CNPJ: {cnpj}")
            print(f"  Sancao: {info.get('tipoSancao', 'N/A')}")
            print(f"  Orgao sancionador: {info.get('orgaoSancionador', 'N/A')}")
            print(f"  Periodo sancao: {info.get('dataInicioSancao', '?')} "
                  f"a {info.get('dataFimSancao', 'vigente')}")
            contratos_empresa = df_contratos[df_contratos["cnpj_norm"] == cnpj]
            print(f"  Contratos ativos: {len(contratos_empresa)}")
            print(f"  Valor total: R$ "
                  f"{contratos_empresa['valorInicial'].sum():,.2f}")
    else:
        print("Nenhuma empresa contratada encontrada no CEIS.")
else:
    print("Base CEIS nao carregada.")


# ============================================================
# PASSO 4: Cruzar contratos x CNEP
# ============================================================
print("\n=== CRUZAMENTO: CONTRATOS x CNEP ===")

if not df_cnep.empty:
    cnpjs_cnep = set(df_cnep["cnpj_norm"].unique())
    cnpjs_alto = cnpjs_contratos & cnpjs_cnep

    if cnpjs_alto:
        alertas_cnep = df_contratos[
            df_contratos["cnpj_norm"].isin(cnpjs_alto)
        ].merge(
            df_cnep[["cnpj_norm", "tipoSancao", "dataInicioSancao",
                      "valorMulta", "orgaoSancionador"]],
            on="cnpj_norm",
            how="inner",
        )
        print(f"\n[ALTO] {len(cnpjs_alto)} empresa(s) contratada(s) "
              f"constam no CNEP!")
        for cnpj in cnpjs_alto:
            info = alertas_cnep[alertas_cnep["cnpj_norm"] == cnpj].iloc[0]
            print(f"\n  CNPJ: {cnpj}")
            print(f"  Sancao: {info.get('tipoSancao', 'N/A')}")
            print(f"  Valor multa: R$ {info.get('valorMulta', 0):,.2f}")
            contratos_empresa = df_contratos[df_contratos["cnpj_norm"] == cnpj]
            print(f"  Contratos ativos: {len(contratos_empresa)}")
    else:
        print("Nenhuma empresa contratada encontrada no CNEP.")
else:
    print("Base CNEP nao carregada.")


# ============================================================
# PASSO 5 (OPCIONAL): Cruzar socios x CEAF
# ============================================================
print("\n=== CRUZAMENTO INDIRETO: SOCIOS DE CONTRATADAS x CEAF ===")

# Coletar CEAF
ceaf_raw = coletar_paginado("ceaf", params={}, max_paginas=50)
df_ceaf = pd.DataFrame(ceaf_raw)

if not df_ceaf.empty:
    print(f"Registros CEAF: {len(df_ceaf)}")

    # Carregar QSA para identificar socios das empresas contratadas
    # (previamente baixado da Receita Federal)
    try:
        COLUNAS_SOCIOS = [
            "cnpj_basico", "identificador_socio", "nome_socio_razao_social",
            "cpf_cnpj_socio", "qualificacao_socio", "data_entrada_sociedade",
            "pais", "representante_legal", "nome_representante",
            "qualificacao_representante_legal", "faixa_etaria",
        ]
        df_socios = pd.read_csv(
            "dados_rfb/Socios0.csv",
            sep=";", header=None, names=COLUNAS_SOCIOS,
            dtype=str, encoding="latin-1",
        )
        df_socios["nome_norm"] = (
            df_socios["nome_socio_razao_social"].str.upper().str.strip()
        )

        # Socios das empresas contratadas
        cnpjs_basicos_contratados = set(
            df_contratos["cnpj_norm"].str[:8].unique()
        )
        socios_contratadas = df_socios[
            df_socios["cnpj_basico"].isin(cnpjs_basicos_contratados)
        ]

        # Cruzar com CEAF por nome
        df_ceaf["nome_norm"] = df_ceaf["nomePunido"].str.upper().str.strip()
        socios_expulsos = socios_contratadas.merge(
            df_ceaf[["nome_norm", "cargo", "orgaoLotacao", "tipoPunicao",
                      "dataPunicao"]],
            on="nome_norm",
            how="inner",
        )

        if not socios_expulsos.empty:
            print(f"\n[MEDIO] {socios_expulsos['nome_norm'].nunique()} "
                  f"socio(s) de empresa(s) contratada(s) constam no CEAF!")
            for _, row in socios_expulsos.drop_duplicates("nome_norm").iterrows():
                print(f"\n  Socio: {row['nome_norm']}")
                print(f"  CNPJ da empresa: {row['cnpj_basico']}")
                print(f"  Punicao: {row.get('tipoPunicao', 'N/A')}")
                print(f"  Ex-cargo: {row.get('cargo', 'N/A')}")
                print(f"  Ex-orgao: {row.get('orgaoLotacao', 'N/A')}")
        else:
            print("Nenhum socio de empresa contratada encontrado no CEAF.")

    except FileNotFoundError:
        print("Arquivo de socios (QSA) nao encontrado. "
              "Baixe de https://dados.rfb.gov.br/CNPJ/")


# ============================================================
# RESUMO FINAL
# ============================================================
print("\n" + "=" * 60)
print("RESUMO DO CRUZAMENTO LICITACOES x SANCOES")
print("=" * 60)
print(f"Contratos analisados: {len(df_contratos)}")
print(f"Empresas unicas: {df_contratos['cnpj_norm'].nunique()}")
print(f"Alertas CEIS (CRITICO): {len(cnpjs_criticos) if 'cnpjs_criticos' in dir() else 0}")
print(f"Alertas CNEP (ALTO): {len(cnpjs_alto) if 'cnpjs_alto' in dir() else 0}")
print(f"Alertas CEAF (MEDIO): "
      f"{socios_expulsos['nome_norm'].nunique() if 'socios_expulsos' in dir() and not socios_expulsos.empty else 0}")
```

## Resultado esperado

O script produz um relatorio consolidado:

```
=== CRUZAMENTO: CONTRATOS x CEIS ===

[CRITICO] 2 empresa(s) contratada(s) constam no CEIS!

  CNPJ: 12345678000190
  Sancao: Suspensao temporaria
  Orgao sancionador: CGU
  Periodo sancao: 2023-01-15 a 2025-01-15
  Contratos ativos: 3
  Valor total: R$ 2.100.000,00

  CNPJ: 98765432000155
  Sancao: Declaracao de inidoneidade
  Orgao sancionador: TCU
  Periodo sancao: 2022-06-01 a vigente
  Contratos ativos: 1
  Valor total: R$ 450.000,00

=== CRUZAMENTO: CONTRATOS x CNEP ===

[ALTO] 1 empresa(s) contratada(s) constam no CNEP!

  CNPJ: 11223344000166
  Sancao: Multa - Lei Anticorrupcao
  Valor multa: R$ 5.000.000,00
  Contratos ativos: 2

============================================================
RESUMO DO CRUZAMENTO LICITACOES x SANCOES
============================================================
Contratos analisados: 1.247
Empresas unicas: 823
Alertas CEIS (CRITICO): 2
Alertas CNEP (ALTO): 1
Alertas CEAF (MEDIO): 0
```

## Limitacoes

| Limitacao | Impacto | Mitigacao |
|---|---|---|
| **Rate limit da API** | 30 req/min limita a coleta de grandes volumes de contratos e sancoes | Processar em lotes; armazenar dados localmente para consultas repetidas |
| **Sancoes estaduais/municipais** | CEIS consolida todas as esferas, mas pode haver atraso na inclusao de sancoes subnacionais | Consultar tambem portais de transparencia estaduais |
| **CNPJ vs. CNPJ basico** | Sancao pode ser aplicada a um CNPJ especifico (filial), enquanto o contrato e com outro (matriz) | Normalizar para CNPJ basico (8 digitos) e verificar todos os estabelecimentos |
| **Sancoes vencidas** | CEIS/CNEP incluem sancoes ja expiradas | Filtrar por `dataFimSancao` para verificar se a sancao esta vigente |
| **Empresas de fachada** | Empresa sancionada pode ter criado novo CNPJ com os mesmos socios | Complementar com cruzamento QSA: verificar se socios da empresa sancionada aparecem em outras empresas contratadas |
| **Cobertura de contratos** | API de contratos cobre apenas o governo federal | Para estados e municipios, consultar portais proprios ou o PNCP (Portal Nacional de Contratacoes Publicas) |
| **Paginacao e volume** | Dados completos de contratos e sancoes requerem muitas paginas de consulta | Implementar coleta incremental; usar downloads em lote quando disponiveis |
| **Dados do CEAF** | Cruzamento por nome com CEAF e impreciso (homonimos) | Validar com campos adicionais (orgao, cargo, periodo) |
