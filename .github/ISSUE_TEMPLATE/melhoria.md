---
name: Melhoria Geral
description: Sugerir melhorias na documentacao, no site ou no projeto em geral
labels: ["melhoria"]
body:
  - type: markdown
    attributes:
      value: |
        Use este template para sugerir melhorias que nao se encaixam em "Nova API" ou "Novo Cruzamento".
  - type: dropdown
    id: tipo
    attributes:
      label: Tipo de melhoria
      options:
        - Correcao de informacao desatualizada
        - Melhoria de documentacao existente
        - Novo exemplo de codigo
        - Correcao de link quebrado
        - Melhoria no site (layout, navegacao, busca)
        - Melhoria em CI/CD ou automacao
        - Outro
    validations:
      required: true
  - type: input
    id: pagina_afetada
    attributes:
      label: Pagina ou arquivo afetado
      description: Indique qual pagina ou arquivo precisa ser alterado (se aplicavel).
      placeholder: "Ex: docs/apis/banco-central/sgs-cambio.md"
    validations:
      required: false
  - type: textarea
    id: descricao
    attributes:
      label: Descricao da melhoria
      description: Descreva detalhadamente o que precisa ser melhorado e por que.
    validations:
      required: true
  - type: textarea
    id: proposta
    attributes:
      label: Proposta de solucao
      description: Se voce ja tem uma ideia de como resolver, descreva aqui.
    validations:
      required: false
---
