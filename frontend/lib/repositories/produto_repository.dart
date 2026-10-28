import 'dart:convert';

import 'package:http/http.dart' as http;

import '../models/produto.dart';
import 'usuario_repository.dart';

class ProdutoRepository {
  ProdutoRepository({http.Client? cliente})
    : cliente = cliente ?? http.Client();

  final http.Client cliente;

  Future<List<Produto>> listar(String token) async {
    final resposta = await cliente.get(
      Uri.parse('$enderecoDaApi/produtos/'),
      headers: {'Authorization': 'Bearer $token'},
    );
    if (resposta.statusCode != 200) {
      throw RecusaDaApi(resposta.statusCode, _frase(resposta.body));
    }
    final itens = jsonDecode(resposta.body) as List<dynamic>;
    return [
      for (final item in itens) Produto.fromJson(item as Map<String, dynamic>),
    ];
  }

  Future<Produto> buscar(String token, int id) async {
    final resposta = await cliente.get(
      Uri.parse('$enderecoDaApi/produtos/$id'),
      headers: {'Authorization': 'Bearer $token'},
    );
    if (resposta.statusCode != 200) {
      throw RecusaDaApi(resposta.statusCode, _frase(resposta.body));
    }
    return Produto.fromJson(jsonDecode(resposta.body) as Map<String, dynamic>);
  }

  Future<Produto> criar(
    String token,
    String nome,
    double precoCompra,
    double precoVenda,
  ) async {
    final resposta = await cliente.post(
      Uri.parse('$enderecoDaApi/produtos/'),
      headers: {
        'Authorization': 'Bearer $token',
        'Content-Type': 'application/json',
      },
      body: jsonEncode({
        'nome': nome,
        'preco_compra': precoCompra,
        'preco_venda': precoVenda,
      }),
    );
    if (resposta.statusCode != 201) {
      throw RecusaDaApi(resposta.statusCode, _frase(resposta.body));
    }
    return Produto.fromJson(jsonDecode(resposta.body) as Map<String, dynamic>);
  }

  Future<Produto> atualizar(
    String token,
    int id,
    String nome,
    double precoCompra,
    double precoVenda,
  ) async {
    final resposta = await cliente.patch(
      Uri.parse('$enderecoDaApi/produtos/$id'),
      headers: {
        'Authorization': 'Bearer $token',
        'Content-Type': 'application/json',
      },
      body: jsonEncode({
        'nome': nome,
        'preco_compra': precoCompra,
        'preco_venda': precoVenda,
      }),
    );
    if (resposta.statusCode != 200) {
      throw RecusaDaApi(resposta.statusCode, _frase(resposta.body));
    }
    return Produto.fromJson(jsonDecode(resposta.body) as Map<String, dynamic>);
  }

  Future<void> excluir(String token, int id) async {
    final resposta = await cliente.delete(
      Uri.parse('$enderecoDaApi/produtos/$id'),
      headers: {'Authorization': 'Bearer $token'},
    );
    if (resposta.statusCode != 204) {
      throw RecusaDaApi(resposta.statusCode, _frase(resposta.body));
    }
  }

  String _frase(String corpo) {
    final detalhe = jsonDecode(corpo)['detail'];
    if (detalhe is String) return detalhe;
    final primeiro = detalhe[0];
    final mensagem = (primeiro['msg'] as String).replaceFirst(
      'Value error, ',
      '',
    );
    return '${primeiro['loc'].last}: $mensagem';
  }
}
