# Poolside Admin

Prompt para criação do Front-end do Admin Pool

Crie o front-end completo de um sistema web responsivo chamado Admin Pool, desenvolvido como Trabalho de Conclusão de Curso (TCC) para gerenciamento de empresas de manutenção de piscinas.

O sistema deve possuir um design moderno, profissional e intuitivo, utilizando tons de azul, branco e cinza. A interface deve seguir o padrão de sistemas administrativos (ERP), com menu lateral, barra superior, cards, tabelas, formulários, gráficos, filtros, modais e ícones.

O projeto deve conter apenas o front-end, utilizando dados fictícios para simular o funcionamento do sistema, sem implementar back-end.

Perfis de Usuário

Gestor

O Gestor possui acesso total ao sistema.

Ele poderá:

Visualizar todos os clientes.

Visualizar todos os funcionários.

Cadastrar, editar e excluir clientes.

Cadastrar, editar e excluir funcionários.

Definir o funcionário responsável por cada cliente.

Cadastrar, editar e excluir produtos.

Visualizar todos os pedidos de produtos.

Visualizar todas as Ordens de Serviço (OS).

Alterar o status dos pedidos e das Ordens de Serviço.

Acessar relatórios.

Visualizar o dashboard completo.

Funcionário

O Funcionário possui acesso restrito.

Ele poderá visualizar somente os clientes sob sua responsabilidade.

Também poderá:

Consultar seus clientes.

Solicitar produtos para seus clientes.

Abrir Ordens de Serviço para seus clientes.

Visualizar apenas os pedidos de produtos criados por ele.

Visualizar apenas as Ordens de Serviço criadas por ele.

Acompanhar o andamento das próprias solicitações.

O Funcionário não poderá visualizar clientes, pedidos ou Ordens de Serviço pertencentes a outros funcionários.

Dashboard

Dashboard do Gestor

Exibir:

Quantidade de clientes.

Quantidade de funcionários.

Quantidade de piscinas.

Pedidos pendentes.

Ordens de Serviço pendentes.

Clientes ativos.

Gráficos com indicadores.

Últimas solicitações.

Dashboard do Funcionário

Exibir apenas informações relacionadas às suas atividades:

Quantidade de clientes sob sua responsabilidade.

Pedidos pendentes.

Ordens de Serviço pendentes.

Últimas solicitações realizadas.

Cadastro de Clientes

Cada cliente deverá possuir:

Nome.

Telefone.

Endereço.

Bairro.

Cidade.

Dimensões da piscina.

Volume em litros.

Valor da mensalidade.

Funcionário responsável.

Observações.

Status.

Ao acessar um cliente deverão aparecer:

Dados completos.

Informações da piscina.

Histórico de pedidos de produtos.

Histórico de Ordens de Serviço.

Botão "Solicitar Produto".

Botão "Abrir Ordem de Serviço".

Cadastro de Produtos

Somente o Gestor poderá cadastrar produtos.

Cada produto deverá possuir:

Nome.

Categoria.

Unidade.

Estoque.

Estoque mínimo.

Preço médio.

Valor da última compra.

Valor da última venda.

Status.

Pedido de Produtos

O Funcionário deverá:

Entrar em um cliente.

Clicar em "Solicitar Produto".

O cliente já deverá aparecer selecionado automaticamente.

Escolher um ou mais produtos previamente cadastrados.

Informar a quantidade.

Adicionar observações.

Enviar a solicitação.

Cada pedido deverá conter:

Número.

Cliente.

Funcionário solicitante.

Data.

Produtos.

Quantidades.

Observações.

Status.

Status:

Pendente

Em análise

Aprovado

Separado

Entregue

Cancelado

O Gestor visualizará todos os pedidos.

O Funcionário visualizará somente os pedidos criados por ele.

Ordens de Serviço (OS)

O Funcionário deverá:

Entrar em um cliente.

Clicar em "Abrir Ordem de Serviço".

O cliente deverá aparecer automaticamente selecionado.

Informar a descrição detalhada do problema.

Selecionar a prioridade.

Adicionar observações.

Anexar imagens (simulação).

Enviar.

Cada Ordem de Serviço deverá possuir:

Número.

Cliente.

Funcionário solicitante.

Data.

Prioridade.

Descrição.

Observações.

Imagens.

Status.

Status:

Aberta

Em análise

Agendada

Em andamento

Aguardando peças

Concluída

Cancelada

O Gestor visualizará todas as Ordens de Serviço.

O Funcionário visualizará somente as Ordens de Serviço criadas por ele.

Relatórios

Criar uma tela de Relatórios, acessível apenas pelo Gestor.

Esta tela deverá permitir gerar e visualizar relatórios de:

Ordens de Serviço.

Pedidos de Produtos.

Os relatórios deverão possuir filtros como:

Cliente.

Funcionário.

Status.

Período (data inicial e data final).

Após aplicar os filtros, exibir uma tabela com os resultados e um resumo contendo:

Quantidade total de registros.

Quantidade por status.

Cliente.

Funcionário responsável.

Data da solicitação.

Adicionar botões simulados de:

Visualizar relatório.

Imprimir.

Exportar para PDF.

Exportar para Excel.

Menu do Gestor

Dashboard

Clientes

Funcionários

Produtos

Pedidos de Produtos

Ordens de Serviço

Relatórios

Configurações

Menu do Funcionário

Dashboard

Meus Clientes

Meus Pedidos

Minhas Ordens de Serviço

Meu Perfil

Regras do Sistema

O cliente é o centro do sistema.

Todo Pedido de Produto e toda Ordem de Serviço devem ser criados a partir do cadastro do cliente.

O Funcionário somente poderá visualizar clientes sob sua responsabilidade.

O Funcionário somente poderá visualizar os pedidos criados por ele.

O Funcionário somente poderá visualizar as Ordens de Serviço criadas por ele.

Somente o Gestor poderá cadastrar produtos.

Somente o Gestor poderá acessar relatórios.

Utilizar dados fictícios para demonstrar todas as telas e funcionalidades.

Criar uma interface moderna, limpa, profissional e totalmente responsiva, simulando um sistema comercial real pronto para apresentação de um Trabalho de Conclusão de Curso.

apenas o front

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://pool-care-pro-front.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/cf98b208-986a-46d0-b138-f3586e95d338).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
