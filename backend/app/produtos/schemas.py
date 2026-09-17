from pydantic import BaseModel, ConfigDict, field_validator


def _nome_legivel(nome: str) -> str:
    if not 2 <= len(nome.strip()) <= 120:
        raise ValueError("o nome precisa ter entre 2 e 120 caracteres")
    return nome.strip()


def _preco_positivo(preco: float) -> float:
    if preco <= 0:
        raise ValueError("o preco precisa ser maior que zero")
    return preco


class ProdutoCriar(BaseModel):
    nome: str
    preco_compra: float
    preco_venda: float

    @field_validator("nome")
    @classmethod
    def nome_legivel(cls, valor: str) -> str:
        return _nome_legivel(valor)

    @field_validator("preco_compra", "preco_venda")
    @classmethod
    def preco_positivo(cls, valor: float) -> float:
        return _preco_positivo(valor)


class ProdutoPublico(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    nome: str
    preco_compra: float
    preco_venda: float
    dono_id: int | None


class ProdutoAtualizar(BaseModel):
    nome: str | None = None
    preco_compra: float | None = None
    preco_venda: float | None = None

    @field_validator("nome")
    @classmethod
    def nome_legivel(cls, valor: str | None) -> str | None:
        return valor if valor is None else _nome_legivel(valor)

    @field_validator("preco_compra", "preco_venda")
    @classmethod
    def preco_positivo(cls, valor: float | None) -> float | None:
        return valor if valor is None else _preco_positivo(valor)
