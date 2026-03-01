---
name: Nova API / Fonte de Dados
description: Sugerir ou documentar uma nova API ou fonte de dados publicos brasileiros
labels: ["feat", "nova-api"]
body:
  - type: markdown
    attributes:
      value: |
        Obrigado por contribuir com o Brazil Visible! Preencha as informacoes abaixo para sugerir uma nova fonte de dados.
  - type: input
    id: nome
    attributes:
      label: Nome da API ou fonte de dados
      description: Nome completo da API ou portal de dados.
      placeholder: "Ex: CNES - Cadastro Nacional de Estabelecimentos de Saude"
    validations:
      required: true
  - type: input
    id: orgao
    attributes:
      label: Orgao responsavel
      description: Sigla do orgao que disponibiliza os dados.
      placeholder: "Ex: DATASUS, BCB, CGU, IBGE"
    validations:
      required: true
  - type: input
    id: url
    attributes:
      label: URL da API ou portal
      description: Link para a documentacao ou portal de acesso aos dados.
      placeholder: "https://..."
    validations:
      required: true
  - type: dropdown
    id: tipo_acesso
    attributes:
      label: Tipo de acesso
      options:
        - API REST
        - Download CSV/ZIP
        - Web Scraping
        - FTP
        - SOAP/XML
        - Outro
    validations:
      required: true
  - type: dropdown
    id: autenticacao
    attributes:
      label: Autenticacao
      options:
        - Nao requerida
        - API Key
        - OAuth
        - Certificado digital
        - Cadastro obrigatorio
        - Outro
    validations:
      required: true
  - type: textarea
    id: descricao
    attributes:
      label: Descricao
      description: Descreva brevemente o que esta fonte de dados contem e por que e relevante para fiscalizacao governamental.
      placeholder: "Esta API permite consultar..."
    validations:
      required: true
  - type: textarea
    id: cruzamentos
    attributes:
      label: Possiveis cruzamentos
      description: Liste outras fontes de dados que poderiam ser cruzadas com esta (se souber).
      placeholder: |
        - CNPJ da Receita Federal (campo de ligacao: CNPJ)
        - Contratos Federais da CGU (campo de ligacao: codigo do orgao)
    validations:
      required: false
  - type: textarea
    id: observacoes
    attributes:
      label: Observacoes adicionais
      description: Informacoes extras, limitacoes conhecidas, dicas de uso, etc.
    validations:
      required: false
---
