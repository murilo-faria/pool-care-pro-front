import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:frontend/screens/formulario_produto_screen.dart';

// O formulario precisa de uma tela abaixo dele. Sozinho na pilha, ele volta
// para a lista de produtos, que e o comportamento pensado para um F5.
Future<void> abrirOFormulario(WidgetTester tester) async {
  await tester.pumpWidget(const MaterialApp(home: Scaffold()));
  Navigator.of(tester.element(find.byType(Scaffold))).push(
    MaterialPageRoute(builder: (_) => const FormularioProdutoScreen()),
  );
  await tester.pumpAndSettle();
}

void main() {
  testWidgets('o formulario vazio mostra as tres mensagens de validacao', (
    tester,
  ) async {
    await abrirOFormulario(tester);

    await tester.tap(find.text('Salvar'));
    await tester.pump();

    expect(find.text('Informe o nome do produto'), findsOneWidget);
    expect(find.text('Informe um preço válido'), findsNWidgets(2));
  });

  testWidgets('com nome e compra validos, somente a venda invalida fica', (
    tester,
  ) async {
    await abrirOFormulario(tester);
    await tester.enterText(find.byType(TextFormField).at(0), 'Algicida');
    await tester.enterText(find.byType(TextFormField).at(1), '30');
    await tester.enterText(find.byType(TextFormField).at(2), 'invalido');
    await tester.tap(find.text('Salvar'));
    await tester.pump();

    expect(find.text('Informe o nome do produto'), findsNothing);
    expect(find.text('Informe um preço válido'), findsOneWidget);
  });
}
