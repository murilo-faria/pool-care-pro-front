# Pool Care

Projeto de Programação para Web III com API FastAPI e app Flutter para o
controle de produtos de piscina.

## Backend

Dentro de `backend/`, configure o `.env` com `DATABASE_URL` e `SECRET_KEY` e
execute:

```powershell
poetry install
poetry run alembic upgrade head
poetry run uvicorn app.main:app --reload
```

## App Flutter

Com o backend rodando, dentro de `frontend/` execute:

```powershell
flutter pub get
flutter run -d chrome
```

As telas têm nome em `frontend/lib/routes.dart`, e o `main.dart` liga cada
nome à sua tela. As telas internas passam pelo `RotaProtegida`: sem sessão,
mostram o login.

A sessão (`SessaoService`) fica no topo do app em um
`ChangeNotifierProvider`. As telas usam `context.read` e `context.watch`, sem
receber a sessão pelo construtor. O token vive somente na memória; ao
recarregar a página, é preciso entrar novamente.
