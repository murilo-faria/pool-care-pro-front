"""Testes da API de Produtos: pedidos reais, sem uvicorn e sem o banco local."""

PRODUTO = {
    "nome": "Balde de cloro",
    "preco_compra": 80.0,
    "preco_venda": 120.0,
}


def entrar(cliente, email):
    """Cria uma conta, faz o login e devolve o cabecalho com o token."""
    cliente.post(
        "/usuarios/",
        json={"nome": "Teste", "email": email, "senha": "segredo123"},
    )
    resposta = cliente.post(
        "/usuarios/login",
        data={"username": email, "password": "segredo123"},
    )
    return {"Authorization": "Bearer " + resposta.json()["access_token"]}


def test_criar_um_produto_devolve_201_com_o_nome(cliente):
    ana = entrar(cliente, "ana@ifg.edu.br")

    resposta = cliente.post("/produtos/", json=PRODUTO, headers=ana)

    assert resposta.status_code == 201
    assert resposta.json()["nome"] == "Balde de cloro"


def test_sem_token_a_api_recusa(cliente):
    resposta = cliente.get("/produtos/")

    assert resposta.status_code == 401


def test_outro_usuario_nao_ve_os_produtos_da_ana(cliente):
    ana = entrar(cliente, "ana@ifg.edu.br")
    bruno = entrar(cliente, "bruno@ifg.edu.br")
    cliente.post("/produtos/", json=PRODUTO, headers=ana)

    lista_da_ana = cliente.get("/produtos/", headers=ana).json()
    lista_do_bruno = cliente.get("/produtos/", headers=bruno).json()

    assert len(lista_da_ana) == 1
    assert lista_do_bruno == []
