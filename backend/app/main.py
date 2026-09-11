from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse

from .database import Base, engine
from .produtos import controller as produtos_controller
from .produtos.erros import ErroDeProduto, ProdutoNaoEncontrado
from .usuarios import controller as usuarios_controller
from .usuarios.erros import CredenciaisInvalidas, ErroDeUsuario


# Para a aula: cria as tabelas que ainda não existem.
Base.metadata.create_all(bind=engine)


app = FastAPI(
    title="API Admin Pool",
    version="0.4.0",
)


# Rotas de usuários: cadastro e login.
app.include_router(usuarios_controller.router)

# Rotas protegidas de produtos.
app.include_router(produtos_controller.router)


@app.exception_handler(ErroDeProduto)
def traduzir_recusa_de_produto(
    request: Request,
    erro: ErroDeProduto,
):
    codigo = 404 if isinstance(erro, ProdutoNaoEncontrado) else 409

    return JSONResponse(
        status_code=codigo,
        content={"detail": str(erro)},
    )


@app.exception_handler(ErroDeUsuario)
def traduzir_recusa_de_usuario(
    request: Request,
    erro: ErroDeUsuario,
):
    if isinstance(erro, CredenciaisInvalidas):
        return JSONResponse(
            status_code=401,
            content={"detail": str(erro)},
            headers={"WWW-Authenticate": "Bearer"},
        )

    return JSONResponse(
        status_code=409,
        content={"detail": str(erro)},
    )