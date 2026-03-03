# Raio-X do Parlamentar

## Descricao

Dado o nome de um parlamentar (deputado federal ou senador), este notebook consolida informacoes de multiplas fontes publicas para construir um **perfil completo** do politico, incluindo patrimonio declarado, participacoes societarias, sancoes e gastos parlamentares.

O objetivo e permitir que qualquer cidadao possa realizar uma investigacao basica sobre seus representantes, usando apenas dados publicos e abertos.

## Dificuldade

Avancado

## Fontes de dados utilizadas

| Fonte | O que fornece |
|---|---|
| [TSE — Candidaturas](../../docs/apis/justica-eleitoral-tse/candidaturas.md) | Dados da candidatura, partido, cargo, resultado |
| [TSE — Prestacao de Contas](../../docs/apis/justica-eleitoral-tse/prestacao-contas.md) | Patrimonio declarado (bens de candidato) |
| [Receita Federal — QSA](../../docs/apis/receita-federal/qsa.md) | Empresas em que o parlamentar e socio |
| [Receita Federal — CNPJ Completa](../../docs/apis/receita-federal/cnpj-completa.md) | Dados cadastrais das empresas |
| [CGU — CEIS](../../docs/apis/transparencia-cgu/ceis.md) | Empresas inidoneas e suspensas |
| [CGU — CNEP](../../docs/apis/transparencia-cgu/cnep.md) | Empresas punidas (Lei Anticorrupcao) |
| [CGU — CEPIM](../../docs/apis/transparencia-cgu/cepim.md) | Entidades impedidas (convenios) |
| [CGU — Gastos por Cartao de Pagamento](../../docs/apis/transparencia-cgu/cartao-pagamento.md) | Gastos com cartao corporativo |
| [Portal da Transparencia — Emendas](../../docs/apis/transparencia-cgu/emendas-parlamentares.md) | Emendas parlamentares de autoria do politico |

## Campos-ponte

- **CPF** — identifica o parlamentar nas bases do TSE e permite cruzamento com QSA (parcial)
- **CNPJ** — conecta empresas do parlamentar com cadastros de sancoes e contratos
- **Nome** — campo de busca alternativo quando CPF nao esta disponivel ou e parcial

## Como usar

1. Instale as dependencias: `pip install -r requirements.txt`
2. Abra o notebook: `jupyter notebook notebook.ipynb`
3. Siga as instrucoes em cada celula, preenchendo o nome ou CPF do parlamentar
4. Execute celula por celula para construir o perfil

## Requisitos

- Python 3.9+
- Chave de API do Portal da Transparencia (gratuita): https://portaldatransparencia.gov.br/api-de-dados
- Dados da Receita Federal (download): https://dados.rfb.gov.br/CNPJ/
- Dados do TSE (download): https://dadosabertos.tse.jus.br/
