class Produto {
  Produto({
    required this.id,
    required this.nome,
    required this.precoCompra,
    required this.precoVenda,
  });

  final int id;
  final String nome;
  final double precoCompra;
  final double precoVenda;

  factory Produto.fromJson(Map<String, dynamic> json) {
    return Produto(
      id: json['id'],
      nome: json['nome'],
      precoCompra: (json['preco_compra'] as num).toDouble(),
      precoVenda: (json['preco_venda'] as num).toDouble(),
    );
  }
}
