# Pool Care — produto tem dono

API de produtos com cadastro, login e migrações. Cada produto pertence ao
usuário autenticado: um usuário vê e altera somente o próprio catálogo. A
listagem permite busca por nome e as validações retornam mensagens em
português.

## Rodar

Instale o Poetry e, dentro de `backend/`, execute:

```powershell
poetry install
```

Crie o arquivo `.env` com estas variáveis:

```env
DATABASE_URL=sqlite:///./pool-care.db
SECRET_KEY=uma_chave_local
```

Crie ou atualize o banco pelas migrações e suba a API:

```powershell
poetry run alembic upgrade head
poetry run uvicorn app.main:app --reload
```

Abra `http://127.0.0.1:8000/docs`.

## Conferir pelo /docs

1. Cadastre dois usuários e faça login pelo botão **Authorize** usando o e-mail no campo `username`.
2. Com o primeiro usuário, cadastre um produto. A resposta traz `dono_id`, sem que ele seja enviado no pedido.
3. Entre com o segundo usuário. `GET /produtos/` não mostra o produto da primeira pessoa e `GET /produtos/{id}` retorna 404.
4. Use `GET /produtos/?nome=...` para buscar no próprio catálogo.
5. Envie um nome curto ou preço menor ou igual a zero para conferir a resposta 422 em português.

## Estrutura

- `app/produtos/`: produto, regras, consultas e rotas.
- `app/usuarios/`: cadastro e login.
- `app/seguranca.py`: senha, token e usuário autenticado.
- `alembic/versions/`: histórico do banco; a primeira migração cria as tabelas e a segunda adiciona `produtos.dono_id`.
