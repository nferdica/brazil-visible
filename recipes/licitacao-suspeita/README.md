# Licitacao Suspeita

## Descricao

Cruza dados de **contratos governamentais** (ComprasNet / Portal da Transparencia) com a **composicao societaria** das empresas contratadas (QSA da Receita Federal) e com **doacoes eleitorais** (TSE) para identificar padroes suspeitos de direcionamento de licitacoes.

O fluxo investigativo responde a pergunta: **empresas que doaram para campanhas eleitorais estao sendo beneficiadas com contratos publicos?** E os socios dessas empresas tem vinculo com agentes publicos?

## Dificuldade

Avancado

## Fontes de dados utilizadas

| Fonte | O que fornece |
|---|---|
| [CGU — Contratos Federais](../../docs/apis/transparencia-cgu/contratos-federais.md) | Contratos vigentes, CNPJ contratado, valor, orgao |
| [CGU — Licitacoes](../../docs/apis/transparencia-cgu/licitacoes.md) | Processos licitatorios, modalidade, participantes |
| [Receita Federal — QSA](../../docs/apis/receita-federal/qsa.md) | Socios e administradores das empresas contratadas |
| [Receita Federal — CNPJ Completa](../../docs/apis/receita-federal/cnpj-completa.md) | Dados cadastrais (razao social, capital, porte) |
| [TSE — Prestacao de Contas](../../docs/apis/justica-eleitoral-tse/prestacao-contas.md) | Doacoes eleitorais (doador, valor, candidato beneficiado) |
| [CGU — CEIS](../../docs/apis/transparencia-cgu/ceis.md) | Empresas inidoneas e suspensas |
| [CGU — CNEP](../../docs/apis/transparencia-cgu/cnep.md) | Empresas punidas (Lei Anticorrupcao) |

## Campos-ponte

- **CNPJ** — conecta contratos com dados cadastrais da empresa e com doacoes eleitorais
- **CPF** — conecta socios de empresas contratadas com candidatos/doadores no TSE
- **Nome** — campo auxiliar para cruzamento quando CPF e parcial

## Como usar

1. Instale as dependencias: `pip install -r requirements.txt`
2. Abra o notebook: `jupyter notebook notebook.ipynb`
3. Configure o orgao e periodo de interesse na celula de configuracao
4. Execute celula por celula para gerar o relatorio de alertas

## Requisitos

- Python 3.9+
- Chave de API do Portal da Transparencia (gratuita): https://portaldatransparencia.gov.br/api-de-dados
- Dados da Receita Federal (download): https://dados.rfb.gov.br/CNPJ/
- Dados do TSE — prestacao de contas (download): https://dadosabertos.tse.jus.br/
