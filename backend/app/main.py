from fastapi import FastAPI
from .produtos import controller

app = FastAPI(title="API do Meu Projeto", version="0.1.0")
app.include_router(controller.router)
