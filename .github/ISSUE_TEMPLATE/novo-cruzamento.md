---
name: Nova Receita de Cruzamento
description: Sugerir ou documentar uma nova receita de cruzamento entre fontes de dados
labels: ["feat", "cruzamento"]
body:
  - type: markdown
    attributes:
      value: |
        Obrigado por contribuir! Receitas de cruzamento mostram como combinar dados de diferentes fontes para gerar insights sobre a gestao publica.
  - type: input
    id: titulo
    attributes:
      label: Titulo da receita
      description: Nome descritivo para o cruzamento proposto.
      placeholder: "Ex: Empresas sancionadas que doaram para campanhas eleitorais"
    validations:
      required: true
  - type: textarea
    id: objetivo
    attributes:
      label: Objetivo
      description: O que esta analise busca responder ou revelar?
      placeholder: "Identificar empresas que foram sancionadas pela CGU e que tambem aparecem como doadoras em campanhas eleitorais..."
    validations:
      required: true
  - type: textarea
    id: fontes
    attributes:
      label: Fontes de dados envolvidas
      description: Liste as APIs/fontes que serao cruzadas.
      placeholder: |
        1. CEIS (CGU) - Cadastro de Empresas Inidoneas e Suspensas
        2. Prestacao de Contas (TSE) - Doacoes de campanha
    validations:
      required: true
  - type: textarea
    id: campos_ligacao
    attributes:
      label: Campos de ligacao
      description: Quais campos conectam as bases de dados?
      placeholder: |
        - CNPJ (presente em ambas as bases)
        - CPF do responsavel
    validations:
      required: true
  - type: textarea
    id: resultado_esperado
    attributes:
      label: Resultado esperado
      description: O que o usuario deve encontrar ao executar esta receita?
      placeholder: "Uma lista de empresas que aparecem simultaneamente no CEIS e como doadoras de campanhas..."
    validations:
      required: false
  - type: textarea
    id: observacoes
    attributes:
      label: Observacoes adicionais
      description: Limitacoes, cuidados com qualidade de dados, etc.
    validations:
      required: false
---
