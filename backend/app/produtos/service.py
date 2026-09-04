"""Regras de negócio dos produtos, e mais nada.

Quem fala HTTP é o controller, quem fala SQL é o repository.
O service apenas aplica as regras e repassa o banco ao repository.
"""

from . import repository
from .erros import (
    NomeJaCadastrado,
    PrecoVendaInvalido,
    ProdutoNaoEncontrado,
)


def listar(db):
    return repository.listar(db)


def buscar(db, produto_id):
    produto = repository.buscar(db, produto_id)

    if produto is None:
        raise ProdutoNaoEncontrado(
            f"Produto {produto_id} não foi encontrado"
        )

    return produto


def criar(db, dados):
    # RN01: não cadastrar produtos com o mesmo nome.
    if repository.buscar_por_nome(db, dados["nome"]):
        raise NomeJaCadastrado(
            f"Já existe um produto chamado {dados['nome']}"
        )

    # RN02: preço de venda deve ser maior que o preço de compra.
    if dados["preco_venda"] <= dados["preco_compra"]:
        raise PrecoVendaInvalido(
            "O preço de venda deve ser maior que o preço de compra"
        )

    return repository.criar(db, dados)


def atualizar(db, produto_id, mudancas):
    produto = buscar(db, produto_id)

    novo_nome = mudancas.get("nome")

    if novo_nome and novo_nome != produto.nome:
        if repository.buscar_por_nome(db, novo_nome):
            raise NomeJaCadastrado(
                f"Já existe um produto chamado {novo_nome}"
            )

    # Usa o valor novo quando enviado; caso contrário, mantém o atual.
    preco_compra = mudancas.get(
        "preco_compra",
        produto.preco_compra,
    )
    preco_venda = mudancas.get(
        "preco_venda",
        produto.preco_venda,
    )

    if preco_venda <= preco_compra:
        raise PrecoVendaInvalido(
            "O preço de venda deve ser maior que o preço de compra"
        )

    return repository.atualizar(db, produto, mudancas)


def apagar(db, produto_id):
    produto = buscar(db, produto_id)

    # A verificação de pedidos será adicionada quando Pedido existir.
    repository.apagar(db, produto)