from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse

from .database import Base, engine
from .produtos import controller as produtos_controller
from .produtos.erros import ErroDeProduto, ProdutoNaoEncontrado


# Apenas para a aula: cria as tabelas ao iniciar.
# Em projetos reais, normalmente se utiliza Alembic.
Base.metadata.create_all(bind=engine)


app = FastAPI(
    title="API Admin Pool",
    version="0.3.0",
)


app.include_router(produtos_controller.router)


@app.exception_handler(ErroDeProduto)
def traduzir_recusa(request: Request, erro: ErroDeProduto):
    """Transforma os erros de produto em códigos HTTP."""

    codigo = 404 if isinstance(erro, ProdutoNaoEncontrado) else 409

    return JSONResponse(
        status_code=codigo,
        content={"detail": str(erro)},
    )