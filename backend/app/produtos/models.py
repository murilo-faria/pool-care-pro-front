from sqlalchemy import Column, Float, Integer, String

from ..database import Base


class Produto(Base):
    __tablename__ = "produtos"

    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String(120), nullable=False)
    preco_compra = Column(Float, nullable=False)
    preco_venda = Column(Float, nullable=False)