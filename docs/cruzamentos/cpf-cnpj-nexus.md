---
title: "Rede CPF/CNPJ"
dificuldade: intermediário
fontes_utilizadas:
  - receita-federal/qsa
  - receita-federal/cnpj-completa
  - receita-federal/estabelecimentos
campos_ponte: [CPF, CNPJ]
tags: [rede societária, grafos, empresas, sócios, lavagem de dinheiro, shell companies]
sidebar_position: 3
---

# Rede CPF/CNPJ

## Objetivo

Mapear a **rede completa de relacionamentos empresariais** a partir de um unico CPF ou CNPJ, utilizando os dados abertos da Receita Federal. O resultado e um **grafo de conexoes** que mostra todas as empresas de uma pessoa, todos os socios dessas empresas, e todas as outras empresas desses socios — revelando redes de controle societario, empresas de fachada, laranjas e grupos economicos nao declarados.

Essa tecnica e fundamental para:
- Investigacoes de **lavagem de dinheiro**
- Identificacao de **grupos economicos** que se apresentam como empresas independentes
- Deteccao de **empresas de fachada** (shell companies)
- Analise de **concentracao de mercado** em licitacoes publicas

## Fluxo de dados

```
                    PONTO DE PARTIDA
                    (CPF ou CNPJ)
                         |
                         v
                  +--------------+
                  |     QSA      |
                  | (Socios*.zip)|
                  +--------------+
                    /          \
                   v            v
          +-----------+   +-----------+
          |  Nivel 1  |   |  Nivel 1  |
          |  CNPJ A   |   |  CNPJ B   |
          +-----------+   +-----------+
           /    |    \         |
          v     v     v        v
      +-----+-----+-----+  +-----+
      |CPF 1|CPF 2|CPF 3|  |CPF 4|     <-- Outros socios
      +-----+-----+-----+  +-----+         dessas empresas
         |     |               |
         v     v               v
      +-----+-----+        +-----+
      |CNPJ |CNPJ |        |CNPJ |     <-- Nivel 2:
      | C   | D   |        | E   |         outras empresas
      +-----+-----+        +-----+         desses socios
         |
         v
       (...)                            <-- Expansao recursiva

  FONTES DE DADOS:
  +----------------------------------------------+
  | QSA (Socios*.zip)    --> CPF <-> CNPJ basico |
  | CNPJ Completa        --> CNPJ basico -> dados|
  | Estabelecimentos     --> CNPJ completo, end. |
  +----------------------------------------------+
```

## Passo a passo

### 1. Definir o ponto de partida

Escolha um CPF (pessoa) ou CNPJ (empresa) como semente da investigacao.

### 2. Carregar os dados do QSA

Baixe todos os arquivos `Socios0.zip` a `Socios9.zip` do [QSA — Quadro Societario](../apis/receita-federal/qsa). Esses arquivos contem o mapeamento CPF/nome do socio para CNPJ basico da empresa.

### 3. Expansao de nivel 1

- **Se o ponto de partida e um CPF/nome:** busque no QSA todas as empresas (CNPJs) em que essa pessoa aparece como socia.
- **Se o ponto de partida e um CNPJ:** busque no QSA todos os socios (CPFs/nomes) dessa empresa.

### 4. Expansao de nivel 2

Para cada novo no encontrado no nivel 1, repita a busca:
- Para cada CNPJ novo, busque todos os socios
- Para cada CPF/nome novo, busque todas as empresas

### 5. Expansao recursiva (nivel N)

Continue expandindo ate atingir o nivel desejado de profundidade (recomendado: 2 a 3 niveis). Controle os nos ja visitados para evitar loops infinitos.

### 6. Enriquecer com dados cadastrais

Para cada CNPJ encontrado, consulte a [Base CNPJ Completa](../apis/receita-federal/cnpj-completa) para obter razao social, natureza juridica, capital social e porte. Consulte os [Estabelecimentos](../apis/receita-federal/estabelecimentos) para endereco e situacao cadastral.

### 7. Visualizar o grafo

Use a biblioteca NetworkX para construir e visualizar o grafo de conexoes.

## Exemplo de codigo

```python
import pandas as pd
import networkx as nx
import matplotlib.pyplot as plt
from pathlib import Path
from collections import deque

# ============================================================
# CONFIGURACAO
# ============================================================
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

DIRETORIO_DADOS = Path("./dados_rfb")
MAX_PROFUNDIDADE = 2  # Niveis de expansao (2-3 recomendado)


# ============================================================
# PASSO 1: Carregar dados da Receita Federal
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
            print(f"  Socios{i}: {len(df):,} registros")
    return pd.concat(dfs, ignore_index=True)


def carregar_empresas() -> pd.DataFrame:
    """Carrega dados cadastrais de empresas."""
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


print("Carregando dados da Receita Federal...")
df_socios = carregar_socios()
df_empresas = carregar_empresas()

# Normalizar nomes para busca
df_socios["nome_norm"] = (
    df_socios["nome_socio_razao_social"].str.upper().str.strip()
)


# ============================================================
# PASSO 2: Classe para construcao do grafo
# ============================================================
class RedeEmpresarial:
    """Constroi um grafo de relacionamentos CPF <-> CNPJ."""

    def __init__(self, df_socios: pd.DataFrame, df_empresas: pd.DataFrame):
        self.df_socios = df_socios
        self.df_empresas = df_empresas
        self.grafo = nx.Graph()
        self.visitados_cpf = set()
        self.visitados_cnpj = set()

    def buscar_empresas_por_nome(self, nome: str) -> pd.DataFrame:
        """Encontra empresas de uma pessoa pelo nome."""
        nome_norm = nome.upper().strip()
        return self.df_socios[self.df_socios["nome_norm"] == nome_norm]

    def buscar_socios_por_cnpj(self, cnpj_basico: str) -> pd.DataFrame:
        """Encontra socios de uma empresa pelo CNPJ basico."""
        return self.df_socios[
            self.df_socios["cnpj_basico"] == cnpj_basico.zfill(8)
        ]

    def obter_dados_empresa(self, cnpj_basico: str) -> dict:
        """Obtem dados cadastrais de uma empresa."""
        dados = self.df_empresas[
            self.df_empresas["cnpj_basico"] == cnpj_basico.zfill(8)
        ]
        if not dados.empty:
            row = dados.iloc[0]
            return {
                "razao_social": row["razao_social"],
                "natureza_juridica": row["natureza_juridica"],
                "capital_social": row["capital_social"],
            }
        return {}

    def expandir_a_partir_de_nome(self, nome: str, max_prof: int = 2):
        """Expande a rede a partir de um nome (CPF)."""
        fila = deque([(nome, "pessoa", 0)])

        while fila:
            entidade, tipo, profundidade = fila.popleft()

            if profundidade > max_prof:
                continue

            if tipo == "pessoa":
                if entidade in self.visitados_cpf:
                    continue
                self.visitados_cpf.add(entidade)

                # Adicionar no de pessoa ao grafo
                self.grafo.add_node(
                    entidade, tipo="pessoa", nivel=profundidade
                )

                # Buscar empresas dessa pessoa
                empresas = self.buscar_empresas_por_nome(entidade)
                for _, row in empresas.iterrows():
                    cnpj = row["cnpj_basico"]
                    qualif = row["qualificacao_socio"]

                    # Adicionar aresta pessoa -> empresa
                    self.grafo.add_edge(
                        entidade, cnpj,
                        qualificacao=qualif,
                        data_entrada=row["data_entrada_sociedade"],
                    )

                    # Enfileirar empresa para expansao
                    fila.append((cnpj, "empresa", profundidade + 1))

            elif tipo == "empresa":
                if entidade in self.visitados_cnpj:
                    continue
                self.visitados_cnpj.add(entidade)

                # Adicionar no de empresa ao grafo
                dados = self.obter_dados_empresa(entidade)
                self.grafo.add_node(
                    entidade, tipo="empresa",
                    nivel=profundidade,
                    **dados,
                )

                # Buscar socios dessa empresa
                socios = self.buscar_socios_por_cnpj(entidade)
                for _, row in socios.iterrows():
                    nome_socio = row["nome_norm"]
                    qualif = row["qualificacao_socio"]

                    # Adicionar aresta empresa -> socio
                    self.grafo.add_edge(
                        entidade, nome_socio,
                        qualificacao=qualif,
                        data_entrada=row["data_entrada_sociedade"],
                    )

                    # Enfileirar socio para expansao
                    fila.append((nome_socio, "pessoa", profundidade + 1))

    def expandir_a_partir_de_cnpj(self, cnpj_basico: str, max_prof: int = 2):
        """Expande a rede a partir de um CNPJ."""
        fila = deque([(cnpj_basico, "empresa", 0)])
        # Reutiliza a mesma logica da expansao acima
        while fila:
            entidade, tipo, profundidade = fila.popleft()
            if profundidade > max_prof:
                continue
            if tipo == "empresa":
                if entidade in self.visitados_cnpj:
                    continue
                self.visitados_cnpj.add(entidade)
                dados = self.obter_dados_empresa(entidade)
                self.grafo.add_node(
                    entidade, tipo="empresa", nivel=profundidade, **dados,
                )
                socios = self.buscar_socios_por_cnpj(entidade)
                for _, row in socios.iterrows():
                    nome_socio = row["nome_norm"]
                    self.grafo.add_edge(
                        entidade, nome_socio,
                        qualificacao=row["qualificacao_socio"],
                        data_entrada=row["data_entrada_sociedade"],
                    )
                    fila.append((nome_socio, "pessoa", profundidade + 1))
            elif tipo == "pessoa":
                if entidade in self.visitados_cpf:
                    continue
                self.visitados_cpf.add(entidade)
                self.grafo.add_node(
                    entidade, tipo="pessoa", nivel=profundidade,
                )
                empresas = self.buscar_empresas_por_nome(entidade)
                for _, row in empresas.iterrows():
                    cnpj = row["cnpj_basico"]
                    self.grafo.add_edge(
                        entidade, cnpj,
                        qualificacao=row["qualificacao_socio"],
                        data_entrada=row["data_entrada_sociedade"],
                    )
                    fila.append((cnpj, "empresa", profundidade + 1))

    def estatisticas(self) -> dict:
        """Retorna estatisticas do grafo."""
        pessoas = [n for n, d in self.grafo.nodes(data=True) if d.get("tipo") == "pessoa"]
        empresas = [n for n, d in self.grafo.nodes(data=True) if d.get("tipo") == "empresa"]
        return {
            "total_nos": self.grafo.number_of_nodes(),
            "total_arestas": self.grafo.number_of_edges(),
            "pessoas": len(pessoas),
            "empresas": len(empresas),
            "componentes_conexos": nx.number_connected_components(self.grafo),
        }

    def nos_mais_conectados(self, top_n: int = 10) -> list:
        """Retorna os nos com mais conexoes (hubs da rede)."""
        graus = sorted(
            self.grafo.degree(), key=lambda x: x[1], reverse=True
        )
        return graus[:top_n]


# ============================================================
# PASSO 3: Executar a expansao
# ============================================================
rede = RedeEmpresarial(df_socios, df_empresas)

# Opcao A: Partir de um nome (pessoa)
rede.expandir_a_partir_de_nome("NOME DA PESSOA", max_prof=MAX_PROFUNDIDADE)

# Opcao B: Partir de um CNPJ
# rede.expandir_a_partir_de_cnpj("12345678", max_prof=MAX_PROFUNDIDADE)

# Estatisticas
stats = rede.estatisticas()
print(f"\n=== ESTATISTICAS DA REDE ===")
print(f"Total de nos: {stats['total_nos']}")
print(f"  Pessoas: {stats['pessoas']}")
print(f"  Empresas: {stats['empresas']}")
print(f"Total de arestas: {stats['total_arestas']}")
print(f"Componentes conexos: {stats['componentes_conexos']}")

# Hubs (nos mais conectados)
print(f"\n=== NOS MAIS CONECTADOS ===")
for no, grau in rede.nos_mais_conectados(10):
    tipo = rede.grafo.nodes[no].get("tipo", "?")
    print(f"  [{tipo}] {no}: {grau} conexoes")


# ============================================================
# PASSO 4: Visualizar o grafo
# ============================================================
def visualizar_grafo(grafo: nx.Graph, titulo: str = "Rede Empresarial"):
    """Gera visualizacao do grafo de rede empresarial."""
    plt.figure(figsize=(16, 12))

    # Cores por tipo de no
    cores = []
    for _, dados in grafo.nodes(data=True):
        if dados.get("tipo") == "pessoa":
            cores.append("#3498db")  # Azul para pessoas
        else:
            cores.append("#e74c3c")  # Vermelho para empresas

    # Tamanho por grau de conexao
    tamanhos = [max(300, grafo.degree(n) * 100) for n in grafo.nodes()]

    pos = nx.spring_layout(grafo, k=2, iterations=50, seed=42)

    nx.draw(
        grafo, pos,
        node_color=cores,
        node_size=tamanhos,
        with_labels=True,
        font_size=6,
        font_weight="bold",
        edge_color="#bdc3c7",
        width=0.5,
        alpha=0.9,
    )

    plt.title(titulo, fontsize=16)
    plt.tight_layout()
    plt.savefig("rede_empresarial.png", dpi=150, bbox_inches="tight")
    plt.show()
    print("Grafo salvo em rede_empresarial.png")


visualizar_grafo(rede.grafo, "Rede Empresarial — Expansao a partir de NOME DA PESSOA")


# ============================================================
# PASSO 5: Exportar para analise
# ============================================================
# Exportar lista de arestas
arestas = []
for u, v, dados in rede.grafo.edges(data=True):
    arestas.append({
        "origem": u,
        "destino": v,
        "qualificacao": dados.get("qualificacao", ""),
        "data_entrada": dados.get("data_entrada", ""),
    })

df_arestas = pd.DataFrame(arestas)
df_arestas.to_csv("rede_arestas.csv", index=False)

# Exportar nos com atributos
nos = []
for no, dados in rede.grafo.nodes(data=True):
    nos.append({
        "id": no,
        "tipo": dados.get("tipo", ""),
        "razao_social": dados.get("razao_social", ""),
        "grau": rede.grafo.degree(no),
    })

df_nos = pd.DataFrame(nos)
df_nos.to_csv("rede_nos.csv", index=False)
print(f"\nExportados: rede_arestas.csv ({len(df_arestas)} arestas) "
      f"e rede_nos.csv ({len(df_nos)} nos)")
```

## Resultado esperado

O script produz:

1. **Estatisticas da rede** no console:
```
=== ESTATISTICAS DA REDE ===
Total de nos: 47
  Pessoas: 23
  Empresas: 24
Total de arestas: 52
Componentes conexos: 1

=== NOS MAIS CONECTADOS ===
  [pessoa] JOSE DA SILVA: 8 conexoes
  [empresa] 12345678: 5 conexoes
  [pessoa] MARIA SOUZA: 4 conexoes
```

2. **Grafo visual** salvo em `rede_empresarial.png` — nos azuis (pessoas) e vermelhos (empresas), com tamanho proporcional ao numero de conexoes.

3. **Arquivos CSV** para analise posterior: `rede_arestas.csv` (conexoes) e `rede_nos.csv` (entidades).

## Limitacoes

| Limitacao | Impacto | Mitigacao |
|---|---|---|
| **CPF parcialmente ocultado** | Busca por CPF direto e impossivel na maioria dos registros | Usar nome como identificador; combinar com faixa etaria e UF para desambiguar |
| **Homonimos** | Nomes iguais podem gerar conexoes falsas | Validar com campos auxiliares; para nomes muito comuns, exigir mais de um campo coincidente |
| **Explosao combinatoria** | Profundidade > 3 pode gerar grafos enormes | Limitar profundidade; filtrar por qualificacao (ex: apenas socios-administradores) |
| **Memoria RAM** | Base completa do QSA ocupa ~2,5 GB em disco e mais em memoria | Usar DuckDB ou processar por partição; filtrar socios por tipo (PF vs PJ) |
| **Dados nao historicos** | Apenas snapshot atual; ex-socios nao aparecem | Manter backups mensais para analise temporal |
| **Socios pessoa juridica** | Quando o socio e PJ, o campo contem CNPJ, nao CPF | Tratar recursivamente: buscar socios da PJ socia para chegar as PFs |
