import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../models/produto.dart';
import '../services/produto_service.dart';
import 'produtos_screen.dart';

class FormularioProdutoScreen extends StatefulWidget {
  const FormularioProdutoScreen({super.key, this.produto});

  final Produto? produto;

  @override
  State<FormularioProdutoScreen> createState() =>
      _FormularioProdutoScreenState();
}

class _FormularioProdutoScreenState extends State<FormularioProdutoScreen> {
  final chave = GlobalKey<FormState>();
  late final TextEditingController nome;
  late final TextEditingController precoCompra;
  late final TextEditingController precoVenda;
  String? erro;
  bool salvando = false;

  bool get editando => widget.produto != null;

  @override
  void initState() {
    super.initState();
    nome = TextEditingController(text: widget.produto?.nome ?? '');
    precoCompra = TextEditingController(
      text: widget.produto?.precoCompra.toStringAsFixed(2) ?? '',
    );
    precoVenda = TextEditingController(
      text: widget.produto?.precoVenda.toStringAsFixed(2) ?? '',
    );
  }

  @override
  void dispose() {
    nome.dispose();
    precoCompra.dispose();
    precoVenda.dispose();
    super.dispose();
  }

  double? _valor(String texto) => double.tryParse(texto.replaceAll(',', '.'));

  String? validarNome(String? valor) {
    if ((valor ?? '').trim().isEmpty) return 'Informe o nome do produto';
    return null;
  }

  String? validarPreco(String? valor) {
    final preco = _valor(valor ?? '');
    if (preco == null) return 'Informe um preço válido';
    if (preco <= 0) return 'O preço deve ser maior que zero';
    return null;
  }

  Future<void> salvar() async {
    if (!chave.currentState!.validate()) return;

    setState(() {
      salvando = true;
      erro = null;
    });

    try {
      final servico = context.read<ProdutoService>();
      final compra = _valor(precoCompra.text)!;
      final venda = _valor(precoVenda.text)!;
      if (editando) {
        await servico.atualizar(
          widget.produto!.id,
          nome.text.trim(),
          compra,
          venda,
        );
      } else {
        await servico.criar(nome.text.trim(), compra, venda);
      }
    } on ErroDeProdutos catch (excecao) {
      if (!mounted) return;
      setState(() {
        erro = excecao.mensagem;
        salvando = false;
      });
      return;
    }

    if (!mounted) return;
    Navigator.pop(context, true);
  }

  @override
  Widget build(BuildContext context) {
    if (ModalRoute.of(context)!.isFirst) {
      return const ProdutosScreen();
    }

    return Scaffold(
      appBar: AppBar(title: Text(editando ? 'Editar produto' : 'Novo produto')),
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: Form(
          key: chave,
          child: ListView(
            children: [
              TextFormField(
                controller: nome,
                decoration: const InputDecoration(
                  labelText: 'Nome',
                  hintText: 'Ex.: Balde de cloro, barrilha ou algicida',
                ),
                validator: validarNome,
                textCapitalization: TextCapitalization.sentences,
              ),
              const SizedBox(height: 16),
              TextFormField(
                controller: precoCompra,
                decoration: const InputDecoration(labelText: 'Preço de compra'),
                keyboardType: const TextInputType.numberWithOptions(
                  decimal: true,
                ),
                validator: validarPreco,
              ),
              const SizedBox(height: 16),
              TextFormField(
                controller: precoVenda,
                decoration: const InputDecoration(labelText: 'Preço de venda'),
                keyboardType: const TextInputType.numberWithOptions(
                  decimal: true,
                ),
                validator: validarPreco,
              ),
              if (erro != null) ...[
                const SizedBox(height: 16),
                Text(erro!, style: const TextStyle(color: Colors.red)),
              ],
              const SizedBox(height: 24),
              ElevatedButton(
                onPressed: salvando ? null : salvar,
                child: Text(salvando ? 'Salvando...' : 'Salvar'),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
