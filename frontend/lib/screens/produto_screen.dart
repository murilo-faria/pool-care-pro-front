import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../models/produto.dart';
import '../services/produto_service.dart';
import 'produtos_screen.dart';

class ProdutoScreen extends StatefulWidget {
  const ProdutoScreen({super.key, this.id});

  final int? id;

  @override
  State<ProdutoScreen> createState() => _ProdutoScreenState();
}

class _ProdutoScreenState extends State<ProdutoScreen> {
  late Future<Produto> pedido;

  @override
  void initState() {
    super.initState();
    if (widget.id != null) {
      pedido = context.read<ProdutoService>().buscar(widget.id!);
    }
  }

  void tentarDeNovo() {
    setState(() {
      pedido = context.read<ProdutoService>().buscar(widget.id!);
    });
  }

  @override
  Widget build(BuildContext context) {
    if (widget.id == null) return const ProdutosScreen();

    return Scaffold(
      appBar: AppBar(title: const Text('Produto')),
      body: FutureBuilder<Produto>(
        future: pedido,
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return const Center(child: CircularProgressIndicator());
          }
          if (snapshot.hasError) {
            return Center(
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  const Icon(Icons.cloud_off, size: 56),
                  const SizedBox(height: 16),
                  const Text('Não consegui carregar o produto'),
                  const SizedBox(height: 8),
                  Text(
                    '${snapshot.error}',
                    style: const TextStyle(color: Colors.red),
                  ),
                  const SizedBox(height: 16),
                  ElevatedButton(
                    onPressed: tentarDeNovo,
                    child: const Text('Tentar de novo'),
                  ),
                ],
              ),
            );
          }

          final produto = snapshot.data!;
          return ListView(
            children: [
              ListTile(
                leading: const Icon(Icons.inventory_2),
                title: const Text('Produto'),
                subtitle: Text(produto.nome),
              ),
              ListTile(
                leading: const Icon(Icons.shopping_cart),
                title: const Text('Preço de compra'),
                subtitle: Text('R\$ ${produto.precoCompra.toStringAsFixed(2)}'),
              ),
              ListTile(
                leading: const Icon(Icons.sell),
                title: const Text('Preço de venda'),
                subtitle: Text('R\$ ${produto.precoVenda.toStringAsFixed(2)}'),
              ),
            ],
          );
        },
      ),
    );
  }
}
