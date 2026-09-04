from pydantic import BaseModel, ConfigDict, Field


class ProdutoCriar(BaseModel):
    nome: str = Field(min_length=2, max_length=120)
    preco_compra: float = Field(gt=0)
    preco_venda: float = Field(gt=0)


class ProdutoPublico(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    nome: str
    preco_compra: float
    preco_venda: float


class ProdutoAtualizar(BaseModel):
    nome: str | None = Field(default=None, min_length=2, max_length=120)
    preco_compra: float | None = Field(default=None, gt=0)
    preco_venda: float | None = Field(default=None, gt=0)