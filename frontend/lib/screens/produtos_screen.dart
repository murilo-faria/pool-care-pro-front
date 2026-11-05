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
  String busca = '';
  final campoDaBusca = TextEditingController();

  @override
  void initState() {
    super.initState();
    produtos = context.read<ProdutoService>().listar();
  }

  @override
  void dispose() {
    campoDaBusca.dispose();
    super.dispose();
  }

  void buscar(String texto) {
    busca = texto.trim();
    pedirDeNovo();
  }

  void pedirDeNovo() {
    setState(() {
      produtos = context.read<ProdutoService>().listar(busca: busca);
    });
  }

  void limparABusca() {
    campoDaBusca.clear();
    buscar('');
  }

  Future<void> abrirFormulario() async {
    final salvou = await Navigator.pushNamed(
      context,
      AppRoutes.formularioProduto,
    );
    if (salvou == true && mounted) pedirDeNovo();
  }

  Future<void> abrirProduto(int id) async {
    final mudou = await Navigator.pushNamed(
      context,
      AppRoutes.produto,
      arguments: id,
    );
    if (mudou == true && mounted) pedirDeNovo();
  }

  Widget listaDosProdutos() {
    return FutureBuilder<List<Produto>>(
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
                  onPressed: pedirDeNovo,
                  child: const Text('Tentar de novo'),
                ),
              ],
            ),
          );
        }

        final lista = snapshot.data!;
        if (lista.isEmpty) {
          final frase = busca.isEmpty
              ? 'Nenhum produto ainda.'
              : 'Nenhum produto com "$busca" no nome.';
          return Center(child: Text(frase));
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
    );
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
      body: Column(
        children: [
          Padding(
            padding: const EdgeInsets.all(12),
            child: TextField(
              controller: campoDaBusca,
              decoration: InputDecoration(
                labelText: 'Buscar pelo nome',
                prefixIcon: const Icon(Icons.search),
                suffixIcon: busca.isEmpty
                    ? null
                    : IconButton(
                        tooltip: 'Limpar a busca',
                        onPressed: limparABusca,
                        icon: const Icon(Icons.clear),
                      ),
                border: const OutlineInputBorder(),
              ),
              textInputAction: TextInputAction.search,
              onSubmitted: buscar,
            ),
          ),
          Expanded(child: listaDosProdutos()),
        ],
      ),
    );
  }
}
