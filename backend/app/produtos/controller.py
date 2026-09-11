from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from ..database import get_db
from ..seguranca import get_current_user
from . import service
from .schemas import ProdutoAtualizar, ProdutoCriar, ProdutoPublico


# Todas as rotas de produtos exigem um token válido.
router = APIRouter(
    prefix="/produtos",
    tags=["Produtos"],
    dependencies=[Depends(get_current_user)],
)


@router.get("/", response_model=list[ProdutoPublico])
def listar(db: Session = Depends(get_db)):
    return service.listar(db)


@router.post("/", response_model=ProdutoPublico, status_code=201)
def criar(
    dados: ProdutoCriar,
    db: Session = Depends(get_db),
):
    return service.criar(db, dados.model_dump())


@router.get("/{produto_id}", response_model=ProdutoPublico)
def buscar(
    produto_id: int,
    db: Session = Depends(get_db),
):
    return service.buscar(db, produto_id)


@router.patch("/{produto_id}", response_model=ProdutoPublico)
def atualizar(
    produto_id: int,
    dados: ProdutoAtualizar,
    db: Session = Depends(get_db),
):
    return service.atualizar(
        db,
        produto_id,
        dados.model_dump(exclude_unset=True),
    )


@router.delete("/{produto_id}", status_code=204)
def apagar(
    produto_id: int,
    db: Session = Depends(get_db),
):
    service.apagar(db, produto_id)