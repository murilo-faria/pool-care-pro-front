from sqlalchemy import Column, Float, ForeignKey, Integer, String
from sqlalchemy.orm import relationship

from ..database import Base


class Produto(Base):
    __tablename__ = "produtos"

    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String(120), nullable=False)
    preco_compra = Column(Float, nullable=False)
    preco_venda = Column(Float, nullable=False)
    dono_id = Column(
        Integer,
        ForeignKey("usuarios.id", name="fk_produtos_dono"),
        nullable=True,
    )
    dono = relationship("Usuario", back_populates="produtos")
