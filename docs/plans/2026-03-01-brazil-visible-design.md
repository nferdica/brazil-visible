# Brazil Visible — Design Document

## Visão Geral

Repositório de documentação que cataloga 93+ fontes de dados públicos brasileiros para fiscalização governamental. Inspirado pela comunidade br/acc e pelo trabalho de cruzamento de bases com grafos.

**Não é uma aplicação** — é um site de documentação (Docusaurus) com:
- Página dedicada para cada API/fonte de dados
- Receitas de cruzamento entre bases
- Exemplos de código reproduzíveis
- Suporte i18n (PT-BR + EN)

## Decisões de Design

| Decisão | Escolha | Justificativa |
|---|---|---|
| Público-alvo | Devs + jornalistas/pesquisadores | Maximiza impacto |
| Tipo de projeto | Repositório de documentação | Foco em conhecimento, não código |
| Framework | Docusaurus | Ecossistema maduro, i18n nativo, GitHub Pages |
| Idioma | PT-BR + EN (i18n) | PT-BR primário, EN para alcance internacional |
| Escopo inicial | Todas as 93 fontes | Visão completa desde o início |
| Template por API | Completo com frontmatter estruturado | Equilíbrio entre legibilidade e dados programáticos |
| Receitas de cruzamento | Sim, com prioridade | Diferencial do projeto |
| Arquitetura | Markdown + frontmatter YAML | Fácil contribuição + estrutura programática |

## Estrutura do Repositório

```
brazil-visible/
├── docs/
│   ├── intro.md
│   ├── como-contribuir.md
│   ├── apis/
│   │   ├── portais-centrais/
│   │   ├── banco-central/
│   │   ├── receita-federal/
│   │   ├── transparencia-cgu/
│   │   ├── tesouro-nacional/
│   │   ├── saude-datasus/
│   │   ├── educacao/
│   │   ├── justica-eleitoral-tse/
│   │   ├── poder-judiciario-cnj/
│   │   ├── meio-ambiente/
│   │   ├── trabalho-emprego/
│   │   ├── previdencia-social/
│   │   ├── mercado-financeiro/
│   │   ├── ibge-estatisticas/
│   │   ├── ipea/
│   │   ├── infraestrutura-transportes/
│   │   ├── agencias-reguladoras/
│   │   ├── dados-geoespaciais/
│   │   ├── diarios-oficiais/
│   │   ├── apis-governamentais/
│   │   ├── seguranca-publica/
│   │   └── outros/
│   └── cruzamentos/
│       ├── intro.md
│       └── [receitas-de-cruzamento].md
├── i18n/
│   └── en/
│       └── docusaurus-plugin-content-docs/
│           └── current/
├── src/
│   └── pages/
│       └── index.tsx
├── static/
├── docusaurus.config.ts
├── sidebars.ts
├── package.json
├── CONTRIBUTING.md
├── CODE_OF_CONDUCT.md
├── LICENSE (MIT)
└── CLAUDE.md
```

## Template por API (Frontmatter)

Cada API é um arquivo `.md` com frontmatter estruturado:

```yaml
---
title: Nome da API
slug: slug-unico
orgao: Órgão Responsável
url_base: https://...
tipo_acesso: API REST | CSV Download | CKAN | Scraping
autenticacao: Não requerida | API Key | OAuth
formato_dados: [JSON, CSV, XML]
frequencia_atualizacao: Diária | Mensal | Anual
campos_chave: [CPF, CNPJ, ...]
tags: [contratos, servidores, ...]
cruzamento_com: [categoria/slug-api]
status: documentado | parcial | stub
---
```

### Seções do corpo Markdown:
1. **O que é** — descrição da fonte
2. **Como acessar** — URL, autenticação, rate limits
3. **Endpoints/recursos principais** — tabela
4. **Exemplo de uso** — código Python reproduzível
5. **Campos disponíveis** — tabela com campo, tipo, descrição
6. **Cruzamentos possíveis** — links para outras APIs e receitas
7. **Limitações conhecidas** — rate limits, cobertura temporal, etc.

## Receitas de Cruzamento

Cada receita contém:

```yaml
---
title: "Nome da Receita"
dificuldade: básico | intermediário | avançado
fontes_utilizadas: [categoria/slug]
campos_ponte: [CPF, CNPJ, ...]
tags: [corrupção, emendas, ...]
---
```

### Seções:
1. **Objetivo** — o que o cruzamento revela
2. **Fluxo de dados** — diagrama ASCII das conexões entre bases
3. **Passo a passo** — instruções detalhadas
4. **Exemplo de código** — reproduzível
5. **Resultado esperado** — o que o output mostra
6. **Limitações** — caveats do cruzamento

## Categorias e APIs (93 fontes)

### Portais Centrais de Dados Abertos (4)
1. Portal Brasileiro de Dados Abertos
2. Portal da Transparência
3. Tesouro Transparente
4. Base dos Dados

### Banco Central do Brasil (10)
5. SGS/API BCB - Câmbio
6. SGS/API BCB - Juros
7. SGS/API BCB - Índices
8. SGS/API BCB - PIX
9. SGS/API BCB - Crédito
10. IFData
11. SGS/API BCB - Meios de Pagamento
12. SGS/API BCB - Base Monetária
13. SGS/API BCB - Reservas Internacionais

### Receita Federal (4)
14. Base CNPJ Completa
15. QSA (Quadro Societário)
16. Simples Nacional / MEI
17. Estabelecimentos

### Portal da Transparência / CGU (8)
18. Contratos Federais
19. Servidores Federais (Folha)
20. Emendas Parlamentares
21. CEIS
22. CNEP
23. CEPIM
24. CEAF
25. Viagens a Serviço

### Tesouro Nacional / Finanças Públicas (3)
27. SIAFI
28. SICONFI
29. SIOP

### Saúde - DATASUS (6)
30. SIH (Internações Hospitalares)
31. SIM (Mortalidade)
32. SINASC (Nascidos Vivos)
33. CNES (Estabelecimentos de Saúde)
34. SINAN (Agravos de Notificação)
35. TabNet

### Educação (4)
36. Censo Escolar (Microdados)
37. ENEM (Microdados)
38. Censo da Educação Superior
39. FNDE (Repasses)

### Justiça Eleitoral - TSE (7)
40. Candidaturas
41. Resultados Eleitorais
42. Prestação de Contas (Campanhas)
43. Bens Declarados
44. Filiados a Partidos
45. Boletins de Urna
46. Eleitorado

### Poder Judiciário - CNJ (4)
47. DataJud
48. Justiça em Números
49. BNMP
50. SISBAJUD

### Meio Ambiente (7)
51. Autos de Infração / Embargos (IBAMA)
52. PRODES (Desmatamento Anual)
53. DETER (Alertas em Tempo Real)
54. CAR (Cadastro Ambiental Rural)
55. Unidades de Conservação
56. Recursos Hídricos
57. Focos de Calor / Queimadas

### Trabalho e Emprego (2)
58. RAIS
59. CAGED

### Previdência e Assistência Social (2)
60. Benefícios INSS
61. PREVIC (Fundos de Pensão)

### Mercado Financeiro (4)
62. CVM - DFP/ITR (Demonstrações)
63. CVM - Administradores
64. CVM - Fatos Relevantes
65. B3 - Negociações

### IBGE - Estatísticas Nacionais (4)
66. Censo Demográfico
67. PNAD Contínua
68. PIB Municipal
69. IPCA / Inflação

### IPEA (1)
70. Ipeadata

### Infraestrutura e Transportes (5)
71. ANTT - Concessões Rodoviárias
72. ANAC - Aviação Civil
73. DNIT - Malha Rodoviária
74. DENATRAN / RENAVAM
75. PRF - Acidentes

### Agências Reguladoras (4)
76. ANEEL - Energia Elétrica
77. ANP - Petróleo e Gás
78. ANATEL - Telecomunicações
79. ANVISA - Saúde

### Dados Geoespaciais (5)
80. IBGE Geociências
81. INDE
82. INPE - Imagens de Satélite
83. CPRM - Geologia
84. INCRA - Estrutura Fundiária

### Diários Oficiais (2)
85. DOU (Diário Oficial da União)
86. DOEs Estaduais

### APIs Governamentais Consolidadas (3)
87. SIAPE (Servidores)
88. SIORG (Estrutura Organizacional)
89. CADIN (Devedores)

### Segurança Pública (1)
90. SINESP

### Outros (3)
91. ANS - Saúde Suplementar
92. ANCINE - Audiovisual
93. ANTAQ - Transporte Aquaviário

## CI/CD

- GitHub Actions: build Docusaurus em cada PR
- Deploy automático para GitHub Pages no merge para `main`
- Validação de frontmatter (schema check)

## Governança

- Licença: MIT
- CONTRIBUTING.md com guia para adicionar APIs e receitas
- CODE_OF_CONDUCT.md (Contributor Covenant)
- PR template
- Issue labels por categoria e tipo

## Branching

- `main` = produção (deploy automático)
- `develop` = desenvolvimento
- Feature branches para contribuições
