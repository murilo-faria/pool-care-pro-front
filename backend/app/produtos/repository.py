from sqlalchemy.orm import Session

from .models import Produto

# Única parte do sistema que acessa diretamente o banco de dados.


def listar(db: Session, dono_id: int, nome: str | None = None):
    consulta = db.query(Produto).filter(Produto.dono_id == dono_id)
    if nome:
        consulta = consulta.filter(Produto.nome.ilike(f"%{nome}%"))
    return consulta.order_by(Produto.nome).all()


def buscar(db: Session, produto_id: int):
    return db.query(Produto).filter(Produto.id == produto_id).first()


def criar(db: Session, dados: dict):
    produto = Produto(**dados)
    db.add(produto)
    db.commit()
    db.refresh(produto)  # O banco cria o id.
    return produto


def buscar_por_nome(db: Session, dono_id: int, nome: str):
    return (
        db.query(Produto)
        .filter(Produto.dono_id == dono_id, Produto.nome == nome)
        .first()
    )


def atualizar(db: Session, produto: Produto, mudancas: dict):
    for campo, valor in mudancas.items():
        setattr(produto, campo, valor)

    db.commit()
    db.refresh(produto)
    return produto


def apagar(db: Session, produto: Produto):
    db.delete(produto)
    db.commit()
