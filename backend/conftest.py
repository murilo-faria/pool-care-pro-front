"""Configuracao comum dos testes de endpoint.

O pytest le este arquivo antes de importar a API. Por isso as variaveis sao
definidas antes do import: os testes nunca abrem o banco usado pelo app.
"""

import os

os.environ["DATABASE_URL"] = "sqlite:///./teste.db"
os.environ["SECRET_KEY"] = "uma-chave-so-para-os-testes-com-mais-de-32-letras"

import pytest
from fastapi.testclient import TestClient

from app.database import Base, engine
from app.main import app


@pytest.fixture
def cliente():
    """Cada teste recebe uma API com as tabelas vazias."""
    Base.metadata.create_all(engine)
    with TestClient(app) as test_client:
        yield test_client
    Base.metadata.drop_all(engine)
