# Fantasmas no Servico Publico

## Descricao

Compara dados de **folha de pagamento federal** (Portal da Transparencia) com registros de **vinculos empregatícios** (RAIS/CAGED) para identificar **servidores fantasmas** — pessoas que recebem salario do governo sem exercer a funcao, ou que possuem vinculos incompativeis.

O cruzamento detecta situacoes como:
- Servidor com vinculo empregaticio em tempo integral no setor privado simultaneamente ao cargo publico
- Servidor falecido que continua na folha de pagamento
- Multiplos vinculos publicos incompativeis (acumulacao ilegal)

## Dificuldade

Intermediario

## Fontes de dados utilizadas

| Fonte | O que fornece |
|---|---|
| [CGU — Servidores Federais](../../docs/apis/transparencia-cgu/servidores-federais.md) | Nome, CPF (parcial), orgao, cargo, remuneracao |
| [CGU — Folha de Pagamento](../../docs/apis/transparencia-cgu/servidores-federais.md) | Valores pagos mensalmente a cada servidor |
| [Ministerio do Trabalho — RAIS](../../docs/apis/trabalho/rais.md) | Vinculos empregatícios formais (setor privado e publico) |
| [Ministerio do Trabalho — CAGED](../../docs/apis/trabalho/caged.md) | Admissoes e desligamentos mensais |
| [Portal da Transparencia — CEAF](../../docs/apis/transparencia-cgu/ceaf.md) | Servidores expulsos da administracao federal |

## Campos-ponte

- **CPF** — identificador principal para cruzamento entre folha de pagamento e vinculos RAIS/CAGED
- **Nome** — campo auxiliar quando CPF nao esta disponivel integralmente
- **PIS/PASEP** — identificador alternativo presente na RAIS

## Como usar

1. Instale as dependencias: `pip install -r requirements.txt`
2. Abra o notebook: `jupyter notebook notebook.ipynb`
3. Configure o orgao e periodo na celula de configuracao
4. Execute celula por celula para gerar o relatorio de inconsistencias

## Requisitos

- Python 3.9+
- Chave de API do Portal da Transparencia (gratuita): https://portaldatransparencia.gov.br/api-de-dados
- Microdados da RAIS (download): http://pdet.mte.gov.br/microdados-rais
- Microdados do CAGED (download): http://pdet.mte.gov.br/novo-caged
