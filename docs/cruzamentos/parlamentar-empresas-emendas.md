---
title: "Parlamentar x Empresas x Emendas"
dificuldade: avançado
fontes_utilizadas:
  - justica-eleitoral-tse/candidaturas
  - justica-eleitoral-tse/prestacao-contas
  - receita-federal/qsa
  - receita-federal/cnpj-completa
  - receita-federal/estabelecimentos
  - transparencia-cgu/emendas-parlamentares
  - transparencia-cgu/contratos-federais
campos_ponte: [CPF, CNPJ]
tags: [corrupção, emendas, nepotismo, conflito de interesses, parlamentares, empresas]
sidebar_position: 2
---

# Parlamentar x Empresas x Emendas

## Objetivo

Verificar se parlamentares (deputados federais e senadores) possuem empresas — diretamente ou por meio de familiares e laranjas — que recebem dinheiro publico originado de emendas parlamentares ou contratos federais. Este cruzamento revela potenciais **conflitos de interesse**, **autobeneficiamento** e **uso de interpostas pessoas** (laranjas) para canalizar recursos publicos.

O fluxo investigativo parte do CPF do parlamentar, identifica suas participacoes societarias via Receita Federal, e verifica se essas empresas receberam recursos de emendas ou contratos do governo.

## Fluxo de dados

```
  TSE Candidaturas          Receita Federal            CGU Portal da
  (CPF do parlamentar)        (QSA + CNPJ)             Transparencia
  +------------------+     +------------------+     +------------------+
  | CPF candidato    |     | QSA: CPF socio   |     | Emendas:         |
  | Nome             |---->| --> CNPJ basico   |---->| nomeAutor        |
  | Partido          |     |                  |     | valorPago        |
  | Cargo eleito     |     | CNPJ Completa:   |     |                  |
  +------------------+     | razao social     |     | Contratos:       |
         |                 | natureza juridica|     | CNPJ contratado  |
         |                 +------------------+     | valor contrato   |
         |                        |                 +------------------+
         |                        |                        |
         v                        v                        v
  +------------------------------------------------------------------+
  |                     CRUZAMENTO (JOIN)                             |
  |------------------------------------------------------------------|
  | Parlamentar X (CPF: 123...)                                      |
  |   e socio da empresa Y (CNPJ: 456...)                            |
  |   que recebeu R$ Z em contratos originados de emendas do         |
  |   proprio parlamentar X                                          |
  +------------------------------------------------------------------+

  CAMPOS-PONTE:
  TSE ---[CPF]--> QSA ---[CNPJ basico]--> CNPJ Completa
                   |
                   +---[CNPJ]---> Contratos/Emendas (CGU)
```

## Passo a passo

### 1. Obter lista de parlamentares (TSE)

Baixe os dados de candidaturas eleitas do [TSE — Candidaturas](../apis/justica-eleitoral-tse/candidaturas). Filtre por cargo (Deputado Federal ou Senador) e resultado (eleito/suplente).

### 2. Buscar participacoes societarias (Receita Federal — QSA)

Para cada CPF de parlamentar, busque no [QSA — Quadro Societario](../apis/receita-federal/qsa) todas as empresas em que aparece como socio ou administrador. Como o CPF e parcialmente ocultado na base da Receita, use o **nome** do parlamentar como campo de busca alternativo.

### 3. Enriquecer com dados cadastrais (CNPJ Completa)

Para cada CNPJ encontrado no passo anterior, consulte a [Base CNPJ Completa](../apis/receita-federal/cnpj-completa) para obter razao social, natureza juridica, capital social e porte da empresa.

### 4. Localizar estabelecimentos (Estabelecimentos)

Consulte os [Estabelecimentos](../apis/receita-federal/estabelecimentos) para obter CNPJ completo (14 digitos), endereco e situacao cadastral de cada empresa encontrada.

### 5. Verificar recebimento de emendas e contratos (CGU)

Para cada CNPJ, consulte:
- [Emendas Parlamentares](../apis/transparencia-cgu/emendas-parlamentares) — verificar se o parlamentar e autor de emendas cujos recursos beneficiaram a empresa
- [Contratos Federais](../apis/transparencia-cgu/contratos-federais) — verificar se a empresa tem contratos com orgaos federais

### 6. Expandir a rede (familiares e socios em comum)

Para detectar laranjas e interpostas pessoas:
- Busque os **demais socios** de cada empresa do parlamentar
- Para cada socio encontrado, repita a busca no QSA para mapear **outras empresas** desses socios
- Verifique se essas empresas de segundo grau tambem recebem recursos publicos

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

# Colunas dos CSVs da Receita Federal (sem cabecalho)
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


# ============================================================
# PASSO 1: Carregar candidatos eleitos (TSE)
# ============================================================
# Baixe de https://dadosabertos.tse.jus.br/ o arquivo de candidaturas
# Filtrar deputados federais e senadores eleitos

df_candidatos = pd.read_csv(
    "consulta_cand_2022_BRASIL.csv",
    sep=";",
    encoding="latin-1",
    dtype=str,
)

# Filtrar apenas eleitos para cargos federais
parlamentares = df_candidatos[
    (df_candidatos["DS_CARGO"].isin(["DEPUTADO FEDERAL", "SENADOR"])) &
    (df_candidatos["DS_SIT_TOT_TURNO"].str.contains("ELEITO", na=False))
][["NR_CPF_CANDIDATO", "NM_CANDIDATO", "SG_PARTIDO", "DS_CARGO"]].copy()

parlamentares.rename(columns={
    "NR_CPF_CANDIDATO": "cpf",
    "NM_CANDIDATO": "nome",
    "SG_PARTIDO": "partido",
    "DS_CARGO": "cargo",
}, inplace=True)

print(f"Parlamentares eleitos: {len(parlamentares)}")


# ============================================================
# PASSO 2: Buscar socios no QSA da Receita Federal
# ============================================================
# Carregar TODOS os arquivos de socios (Socios0.zip a Socios9.zip)
# Previamente baixados de https://dados.rfb.gov.br/CNPJ/

def carregar_socios(diretorio: str) -> pd.DataFrame:
    """Carrega todos os arquivos de socios em um unico DataFrame."""
    dfs = []
    for i in range(10):
        caminho = Path(diretorio) / f"Socios{i}.csv"
        if caminho.exists():
            df = pd.read_csv(
                caminho, sep=";", header=None, names=COLUNAS_SOCIOS,
                dtype=str, encoding="latin-1",
            )
            dfs.append(df)
    return pd.concat(dfs, ignore_index=True)


df_socios = carregar_socios("./dados_rfb")
print(f"Registros de socios: {len(df_socios):,}")

# Normalizar nomes para matching
df_socios["nome_normalizado"] = (
    df_socios["nome_socio_razao_social"]
    .str.upper()
    .str.strip()
)
parlamentares["nome_normalizado"] = (
    parlamentares["nome"]
    .str.upper()
    .str.strip()
)

# Cruzar: encontrar empresas dos parlamentares
empresas_parlamentares = df_socios.merge(
    parlamentares,
    left_on="nome_normalizado",
    right_on="nome_normalizado",
    how="inner",
)

print(f"Parlamentares com participacao societaria: "
      f"{empresas_parlamentares['cpf'].nunique()}")
print(f"Empresas encontradas: "
      f"{empresas_parlamentares['cnpj_basico'].nunique()}")


# ============================================================
# PASSO 3: Enriquecer com dados cadastrais (CNPJ Completa)
# ============================================================
def carregar_empresas(diretorio: str) -> pd.DataFrame:
    """Carrega dados cadastrais de empresas."""
    dfs = []
    for i in range(10):
        caminho = Path(diretorio) / f"Empresas{i}.csv"
        if caminho.exists():
            df = pd.read_csv(
                caminho, sep=";", header=None, names=COLUNAS_EMPRESAS,
                dtype=str, encoding="latin-1",
            )
            dfs.append(df)
    return pd.concat(dfs, ignore_index=True)


df_empresas = carregar_empresas("./dados_rfb")

# Juntar dados cadastrais
empresas_parlamentares = empresas_parlamentares.merge(
    df_empresas[["cnpj_basico", "razao_social", "natureza_juridica", "capital_social"]],
    on="cnpj_basico",
    how="left",
)


# ============================================================
# PASSO 4: Verificar contratos federais (CGU)
# ============================================================
def buscar_contratos_por_cnpj(cnpj_14: str) -> list:
    """Consulta contratos federais de uma empresa no Portal da Transparencia."""
    try:
        resp = requests.get(
            f"{BASE_URL}/contratos",
            headers=HEADERS,
            params={"cnpjContratado": cnpj_14, "pagina": 1},
            timeout=30,
        )
        resp.raise_for_status()
        return resp.json()
    except Exception as e:
        print(f"Erro ao buscar contratos para {cnpj_14}: {e}")
        return []


# Para cada empresa de parlamentar, verificar contratos
# (limitado a amostra para respeitar rate limit)
resultados = []
cnpjs_unicos = empresas_parlamentares["cnpj_basico"].unique()[:50]  # Amostra

for cnpj_basico in cnpjs_unicos:
    # Montar CNPJ completo (basico + 0001 + DV generico para matriz)
    # Na pratica, use o CNPJ completo obtido do arquivo de Estabelecimentos
    cnpj_14 = cnpj_basico + "000100"  # Placeholder — usar dado real

    contratos = buscar_contratos_por_cnpj(cnpj_14)
    if contratos:
        parlamentar = empresas_parlamentares[
            empresas_parlamentares["cnpj_basico"] == cnpj_basico
        ].iloc[0]
        resultados.append({
            "parlamentar": parlamentar["nome"],
            "partido": parlamentar["partido"],
            "cnpj_basico": cnpj_basico,
            "razao_social": parlamentar.get("razao_social", "N/A"),
            "num_contratos": len(contratos),
            "valor_total": sum(c.get("valorInicial", 0) for c in contratos),
        })

    time.sleep(2)  # Respeitar rate limit (30 req/min)


# ============================================================
# RESULTADO
# ============================================================
df_resultado = pd.DataFrame(resultados)
if not df_resultado.empty:
    df_resultado = df_resultado.sort_values("valor_total", ascending=False)
    print("\n=== PARLAMENTARES COM EMPRESAS QUE TEM CONTRATOS FEDERAIS ===")
    print(df_resultado.to_string(index=False))
    df_resultado.to_csv("parlamentares_empresas_contratos.csv", index=False)
else:
    print("Nenhum cruzamento encontrado na amostra.")
```

## Resultado esperado

O script gera uma tabela como esta:

```
parlamentar          partido  cnpj_basico  razao_social                     num_contratos  valor_total
FULANO DA SILVA      PXX      12345678     SILVA ENGENHARIA LTDA            3              2.500.000,00
CICLANA DE SOUZA     PYY      87654321     CS CONSULTORIA E SERVICOS ME     1                450.000,00
```

Cada linha indica um parlamentar que possui (ou possuiu) participacao societaria em empresa que recebeu contratos do governo federal. O proximo passo investigativo e verificar:

- Se o **parlamentar e autor de emendas** que beneficiaram a mesma localidade/orgao da empresa
- Se a empresa **foi constituida apos** o parlamentar assumir o mandato
- Se os **demais socios** da empresa tem relacao familiar com o parlamentar (homonimia de sobrenome)

## Limitacoes

| Limitacao | Impacto | Mitigacao |
|---|---|---|
| **CPF parcialmente ocultado no QSA** | Impossivel cruzar diretamente por CPF na base da Receita Federal | Usar nome como campo de busca; validar com campos auxiliares (UF, faixa etaria) |
| **Homonimos** | Cruzamento por nome pode gerar falsos positivos | Validar cruzando com municipio do estabelecimento vs. base eleitoral do parlamentar |
| **Socios ocultos / laranjas** | Parlamentar pode usar interpostas pessoas sem vinculo formal | Expandir busca para socios de segundo grau e familiares |
| **Rate limit da API CGU** | 30 req/min limita volume de consultas | Usar batches com `time.sleep(2)` e processar por lotes |
| **Dados nao historicos** | QSA mostra apenas snapshot atual; parlamentar pode ter saido da sociedade | Manter backups mensais da base QSA para analise temporal |
| **Emendas sem beneficiario final** | API de emendas nem sempre identifica a empresa beneficiada | Complementar com dados de contratos e convenios do mesmo orgao/localidade |
| **Empresas inativas** | Empresa pode estar inativa mas constar no QSA | Filtrar por situacao cadastral "Ativa" no arquivo de Estabelecimentos |
