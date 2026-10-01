import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:http/http.dart' as http;
import 'package:http/testing.dart';

import 'package:frontend/repositories/usuario_repository.dart';
import 'package:frontend/screens/cadastro_screen.dart';
import 'package:frontend/screens/login_screen.dart';
import 'package:frontend/services/sessao_service.dart';

int pedidos = 0;

SessaoService sessaoDeMentira() {
  final cliente = MockClient((pedido) async {
    pedidos++;
    if (pedido.url.path == '/usuarios/login') {
      if (pedido.bodyFields['password'] == 'segredo123') {
        return http.Response(jsonEncode({'access_token': 'token-da-ana'}), 200);
      }
      return http.Response('{"detail": "E-mail ou senha incorretos"}', 401);
    }
    if (pedido.url.path == '/usuarios/eu' &&
        pedido.headers['Authorization'] == 'Bearer token-da-ana') {
      return http.Response(
        jsonEncode({'id': 1, 'nome': 'Ana', 'email': 'ana@poolcare.com'}),
        200,
      );
    }
    return http.Response('{"detail": "Not authenticated"}', 401);
  });
  return SessaoService(UsuarioRepository(cliente: cliente));
}

Future<void> preencherEEntrar(WidgetTester tester, String senha) async {
  await tester.enterText(find.byType(TextField).at(0), 'ana@poolcare.com');
  await tester.enterText(find.byType(TextField).at(1), senha);
  await tester.tap(find.widgetWithText(ElevatedButton, 'Entrar'));
  await tester.pumpAndSettle();
}

void main() {
  testWidgets('login tem campos e botão', (tester) async {
    await tester.pumpWidget(
      MaterialApp(home: LoginScreen(sessao: sessaoDeMentira())),
    );
    expect(find.byType(TextField), findsNWidgets(2));
    expect(find.widgetWithText(ElevatedButton, 'Entrar'), findsOneWidget);
    expect(find.text('Criar uma conta'), findsOneWidget);
  });

  testWidgets('cadastro tem nome, e-mail e senha', (tester) async {
    await tester.pumpWidget(const MaterialApp(home: CadastroScreen()));
    expect(find.byType(TextField), findsNWidgets(3));
  });

  testWidgets('senha certa abre a tela inicial', (tester) async {
    await tester.pumpWidget(
      MaterialApp(home: LoginScreen(sessao: sessaoDeMentira())),
    );
    await preencherEEntrar(tester, 'segredo123');
    expect(find.text('Olá, Ana!'), findsOneWidget);
    expect(find.byType(LoginScreen), findsNothing);
  });

  testWidgets('senha errada mostra erro', (tester) async {
    await tester.pumpWidget(
      MaterialApp(home: LoginScreen(sessao: sessaoDeMentira())),
    );
    await preencherEEntrar(tester, 'senha-errada');
    expect(find.text('E-mail ou senha incorretos'), findsOneWidget);
  });

  test('service recusa campos vazios sem chamar a API', () async {
    pedidos = 0;
    final sessao = sessaoDeMentira();
    await expectLater(sessao.entrar('', ''), throwsA(isA<ErroDeLogin>()));
    expect(pedidos, 0);
  });
}
