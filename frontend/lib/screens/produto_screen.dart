import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../models/produto.dart';
import '../routes.dart';
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
  String? erroDaExclusao;

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

  Future<void> editar(Produto produto) async {
    final salvou = await Navigator.pushNamed(
      context,
      AppRoutes.formularioProduto,
      arguments: produto,
    );
    if (salvou == true && mounted) Navigator.pop(context, true);
  }

  Future<void> excluir(Produto produto) async {
    final confirmou = await showDialog<bool>(
      context: context,
      builder: (contexto) => AlertDialog(
        title: Text('Excluir ${produto.nome}?'),
        content: const Text('Tem certeza? Esta ação não pode ser desfeita.'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(contexto, false),
            child: const Text('Cancelar'),
          ),
          ElevatedButton(
            onPressed: () => Navigator.pop(contexto, true),
            child: const Text('Excluir'),
          ),
        ],
      ),
    );
    if (confirmou != true || !mounted) return;

    try {
      await context.read<ProdutoService>().excluir(produto.id);
    } on ErroDeProdutos catch (excecao) {
      if (!mounted) return;
      setState(() => erroDaExclusao = excecao.mensagem);
      return;
    }
    if (!mounted) return;
    Navigator.pop(context, true);
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
            padding: const EdgeInsets.all(8),
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
              if (erroDaExclusao != null)
                Padding(
                  padding: const EdgeInsets.all(8),
                  child: Text(
                    erroDaExclusao!,
                    style: const TextStyle(color: Colors.red),
                  ),
                ),
              const SizedBox(height: 16),
              ElevatedButton.icon(
                onPressed: () => editar(produto),
                icon: const Icon(Icons.edit),
                label: const Text('Editar'),
              ),
              const SizedBox(height: 8),
              OutlinedButton.icon(
                onPressed: () => excluir(produto),
                icon: const Icon(Icons.delete),
                label: const Text('Excluir'),
              ),
            ],
          );
        },
      ),
    );
  }
}
