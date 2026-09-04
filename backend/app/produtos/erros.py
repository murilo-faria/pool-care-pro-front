class ErroDeProduto(Exception):
    """Qualquer recusa relacionada aos produtos."""


class ProdutoNaoEncontrado(ErroDeProduto):
    """O produto solicitado não foi encontrado."""


class NomeJaCadastrado(ErroDeProduto):
    """Já existe um produto cadastrado com esse nome."""


class PrecoVendaInvalido(ErroDeProduto):
    """O preço de venda deve ser maior que o preço de compra."""


class ProdutoVinculadoAPedido(ErroDeProduto):
    """Não é permitido apagar um produto vinculado a um pedido."""