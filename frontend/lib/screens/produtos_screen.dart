import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../models/produto.dart';
import '../routes.dart';
import '../services/produto_service.dart';
import '../widgets/app_drawer.dart';

class ProdutosScreen extends StatefulWidget {
  const ProdutosScreen({super.key});

  @override
  State<ProdutosScreen> createState() => _ProdutosScreenState();
}

class _ProdutosScreenState extends State<ProdutosScreen> {
  late Future<List<Produto>> produtos;

  @override
  void initState() {
    super.initState();
    produtos = context.read<ProdutoService>().listar();
  }

  void tentarDeNovo() {
    setState(() {
      produtos = context.read<ProdutoService>().listar();
    });
  }

  Future<void> abrirFormulario() async {
    final salvou = await Navigator.pushNamed(
      context,
      AppRoutes.formularioProduto,
    );
    if (salvou == true && mounted) tentarDeNovo();
  }

  Future<void> abrirProduto(int id) async {
    final mudou = await Navigator.pushNamed(
      context,
      AppRoutes.produto,
      arguments: id,
    );
    if (mudou == true && mounted) tentarDeNovo();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Produtos')),
      drawer: const AppDrawer(),
      floatingActionButton: FloatingActionButton(
        tooltip: 'Novo produto',
        onPressed: abrirFormulario,
        child: const Icon(Icons.add),
      ),
      body: FutureBuilder<List<Produto>>(
        future: produtos,
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
                  const Text('Não consegui carregar os produtos'),
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

          final lista = snapshot.data!;
          if (lista.isEmpty) {
            return const Center(child: Text('Nenhum produto ainda.'));
          }

          return ListView.builder(
            itemCount: lista.length,
            itemBuilder: (context, indice) {
              final produto = lista[indice];
              return ListTile(
                leading: const Icon(Icons.inventory_2),
                title: Text(produto.nome),
                subtitle: Text(
                  'Venda: R\$ ${produto.precoVenda.toStringAsFixed(2)}',
                ),
                trailing: const Icon(Icons.chevron_right),
                onTap: () => abrirProduto(produto.id),
              );
            },
          );
        },
      ),
    );
  }
}
