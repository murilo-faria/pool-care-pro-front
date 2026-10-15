import '../models/produto.dart';
import '../repositories/produto_repository.dart';
import '../repositories/usuario_repository.dart';
import 'sessao_service.dart';

class ErroDeProdutos implements Exception {
  ErroDeProdutos(this.mensagem);

  final String mensagem;

  @override
  String toString() => mensagem;
}

class ProdutoService {
  ProdutoService(this.repositorio, this.sessao);

  final ProdutoRepository repositorio;
  final SessaoService sessao;

  Future<List<Produto>> listar() async {
    try {
      return await repositorio.listar(sessao.token!);
    } on RecusaDaApi catch (erro) {
      throw ErroDeProdutos(erro.mensagem);
    } on Exception {
      throw ErroDeProdutos(
        'Não consegui falar com a API. O uvicorn está rodando?',
      );
    }
  }

  Future<Produto> buscar(int id) async {
    try {
      return await repositorio.buscar(sessao.token!, id);
    } on RecusaDaApi catch (erro) {
      throw ErroDeProdutos(erro.mensagem);
    } on Exception {
      throw ErroDeProdutos(
        'Não consegui falar com a API. O uvicorn está rodando?',
      );
    }
  }
}
