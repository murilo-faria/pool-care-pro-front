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

  String _frase(String corpo) {
    final detalhe = jsonDecode(corpo)['detail'];
    if (detalhe is String) return detalhe;
    final primeiro = detalhe[0];
    return '${primeiro['loc'].last}: ${primeiro['msg']}';
  }
}
