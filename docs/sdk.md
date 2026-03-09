---
slug: sdk
sidebar_position: 4
title: SDK TypeScript
---

# SDK TypeScript

SDK unificado para acessar 93+ fontes de dados públicos brasileiros diretamente do seu código TypeScript/JavaScript.

## Instalação

```bash
npm install @brazilvisible/sdk
```

Compatível com **Node.js >=18**, **Deno**, **Bun** e **browsers** (fontes REST).

## Uso rápido

```typescript
import { bcb, ibge } from "@brazilvisible/sdk";

// Banco Central — taxa Selic
const selic = await bcb.sgs({ serie: 11, inicio: "2024-01-01", fim: "2024-12-31" });
console.log(selic);

// IBGE — dados agregados
const populacao = await ibge.agregados({ tabela: 1301, periodos: "2022", localidades: "N1" });
console.log(populacao);
```

## Autenticação

80% das APIs funcionam sem configuração. Para fontes que exigem API key (como o Portal da Transparência da CGU):

```typescript
import { cgu, configure } from "@brazilvisible/sdk";

// Opção 1: configuração no código
configure({ apiKeys: { cgu: "sua-chave-aqui" } });

// Opção 2: variável de ambiente
// export BV_CGU_API_KEY=sua-chave-aqui

const contratos = await cgu.contratos({ orgao: "25000", ano: 2024 });
const sancionadas = await cgu.ceis();
```

## Cruzamento de dados

O verdadeiro poder do SDK aparece ao cruzar fontes diferentes:

```typescript
import { cgu } from "@brazilvisible/sdk";

// Empresas sancionadas que ainda vencem licitações
const sancionadas = await cgu.ceis();
const contratos = await cgu.contratos({ ano: 2024 });

const cnpjsSancionados = new Set(sancionadas.map((s) => s.cnpj));
const irregulares = contratos.filter((c) => cnpjsSancionados.has(c.cnpj));
console.log(`${irregulares.length} contratos com empresas sancionadas`);
```

## Download de dados

Fontes que dependem de download CSV/ZIP (TSE, Receita, INEP) são tratadas automaticamente:

```typescript
import { tse, receita } from "@brazilvisible/sdk";

// TSE — candidaturas (baixa ZIP, descompacta, retorna array tipado)
const candidatos = await tse.candidaturas({ ano: 2022, estado: "SP" });
console.log(`${candidatos.length} candidaturas em SP`);

// Receita Federal — dados de empresas
const empresas = await receita.empresas({ chunk: 0 });
```

## Módulos disponíveis

### REST APIs

| Módulo | Import | Métodos principais | Auth |
|--------|--------|---------------------|------|
| **BCB** | `bcb` | `sgs`, `expectativas`, `ifdata` | Não |
| **IBGE** | `ibge` | `estados`, `municipios`, `agregados`, `nomes` | Não |
| **Tesouro** | `tesouro` | `entes`, `rreo`, `rgf` | Não |
| **IPEA** | `ipea` | `series`, `metadados` | Não |
| **CGU** | `cgu` | `ceis`, `cnep`, `cepim`, `contratos`, `servidores`, `emendas`, `viagens` | API Key |
| **CNJ** | `cnj` | `justicaNumeros`, `datajud` | Varia |
| **Segurança** | `seguranca` | `ocorrencias`, `indicadores` | Não |
| **Portais** | `portais` | `buscarConjuntos`, `recursos`, `baseDados` | Não |
| **Ambiente** | `ambiente` | `prodes`, `deter`, `focosCalor`, `ibamaMultas` | Não |
| **Transportes** | `transportes` | `anacVoos`, `prfAcidentes`, `denatranFrota` | Não |
| **Diários** | `diarios` | `dou`, `doe` | Não |
| **Governamentais** | `governamentais` | `cadin`, `siorg`, `siape` | Misto |
| **Outros** | `outros` | `ansOperadoras`, `antaqPortos`, `ancineProjetos` | Não |

### Download CSV/ZIP

| Módulo | Import | Métodos principais | Formato |
|--------|--------|---------------------|---------|
| **TSE** | `tse` | `candidaturas`, `bens`, `resultados`, `filiados` | ZIP/CSV |
| **Receita** | `receita` | `empresas`, `estabelecimentos`, `socios`, `simples` | ZIP/CSV |
| **Mercado/CVM** | `mercado` | `dfp`, `itr`, `ciasAbertas`, `fundos` | ZIP/CSV |
| **INEP** | `inep` | `enem`, `censoEscolar`, `censoSuperior` | ZIP/CSV |
| **Trabalho** | `trabalho` | `caged`, `rais` | ZIP/CSV |
| **Previdência** | `previdencia` | `beneficios`, `fundosPensao` | CSV |
| **Reguladoras** | `reguladoras` | `anatelAcessos`, `aneelTarifas`, `anpCombustiveis` | CSV |

### Especializados

| Módulo | Import | Notas |
|--------|--------|-------|
| **DATASUS** | `datasus` | FTP/DBC — fallback informativo |
| **Geo** | `geo` | WMS/WFS/GeoJSON — dados geoespaciais |

## Configuração avançada

```typescript
import { configure } from "@brazilvisible/sdk";

configure({
  timeout: 60000,       // timeout em ms (padrão: 30000)
  maxRetries: 5,        // tentativas de retry (padrão: 3)
  apiKeys: {
    cgu: "sua-chave",   // API keys por fonte
  },
});
```

## Repositório

O SDK é open-source e mantido junto com este catálogo:

- **Código fonte**: [github.com/nferdica/brazil-visible-sdk](https://github.com/nferdica/brazil-visible-sdk)
- **npm**: `@brazilvisible/sdk`
- **Licença**: MIT

## Relação com o catálogo

Este catálogo documenta as fontes para humanos. O SDK oferece acesso programático às mesmas fontes. O frontmatter de cada página de API (`url_base`, `formato_dados`, `tipo_acesso`) é a especificação que o SDK implementa.
