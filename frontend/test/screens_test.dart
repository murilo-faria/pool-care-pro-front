import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:http/http.dart' as http;
import 'package:http/testing.dart';
import 'package:provider/provider.dart';

import 'package:frontend/main.dart';
import 'package:frontend/repositories/usuario_repository.dart';
import 'package:frontend/routes.dart';
import 'package:frontend/screens/cadastro_screen.dart';
import 'package:frontend/screens/inicio_screen.dart';
import 'package:frontend/screens/login_screen.dart';
import 'package:frontend/screens/perfil_screen.dart';
import 'package:frontend/screens/produtos_screen.dart';
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

Widget appDeMentira(SessaoService sessao) =>
    ChangeNotifierProvider.value(value: sessao, child: const PoolCareApp());

Future<void> preencherEEntrar(WidgetTester tester, String senha) async {
  await tester.enterText(find.byType(TextField).at(0), 'ana@poolcare.com');
  await tester.enterText(find.byType(TextField).at(1), senha);
  await tester.tap(find.widgetWithText(ElevatedButton, 'Entrar'));
  await tester.pumpAndSettle();
}

Future<void> abrirOMenu(WidgetTester tester) async {
  await tester.tap(find.byIcon(Icons.menu));
  await tester.pumpAndSettle();
}

void main() {
  testWidgets('a tela de login tem e-mail, senha e o botão Entrar', (
    tester,
  ) async {
    await tester.pumpWidget(appDeMentira(sessaoDeMentira()));
    expect(find.byType(TextField), findsNWidgets(2));
    expect(find.widgetWithText(ElevatedButton, 'Entrar'), findsOneWidget);
    expect(find.text('Criar uma conta'), findsOneWidget);
  });

  testWidgets('a tela de cadastro tem nome, e-mail e senha', (tester) async {
    await tester.pumpWidget(const MaterialApp(home: CadastroScreen()));
    expect(find.byType(TextField), findsNWidgets(3));
  });

  testWidgets('com a senha certa, a rota /inicio abre a tela inicial', (
    tester,
  ) async {
    await tester.pumpWidget(appDeMentira(sessaoDeMentira()));
    await preencherEEntrar(tester, 'segredo123');
    expect(find.byType(InicioScreen), findsOneWidget);
    expect(find.text('Olá, Ana!'), findsOneWidget);
    expect(find.byType(LoginScreen), findsNothing);
  });

  testWidgets('com a senha errada, fica no login e mostra o erro', (
    tester,
  ) async {
    await tester.pumpWidget(appDeMentira(sessaoDeMentira()));
    await preencherEEntrar(tester, 'senha-errada');
    expect(find.text('E-mail ou senha incorretos'), findsOneWidget);
  });

  testWidgets('o link Criar uma conta abre o cadastro pelo nome da rota', (
    tester,
  ) async {
    await tester.pumpWidget(appDeMentira(sessaoDeMentira()));
    await tester.tap(find.text('Criar uma conta'));
    await tester.pumpAndSettle();
    expect(find.byType(CadastroScreen), findsOneWidget);
  });

  testWidgets('o guarda sem sessão mostra o login', (tester) async {
    await tester.pumpWidget(appDeMentira(sessaoDeMentira()));
    Navigator.of(tester.element(find.byType(LoginScreen)))
        .pushNamed(AppRoutes.inicio);
    await tester.pumpAndSettle();
    expect(find.byType(InicioScreen), findsNothing);
    expect(find.byType(LoginScreen), findsOneWidget);
  });

  testWidgets('o menu mostra o usuário e abre o perfil', (tester) async {
    await tester.pumpWidget(appDeMentira(sessaoDeMentira()));
    await preencherEEntrar(tester, 'segredo123');
    await abrirOMenu(tester);
    final menu = find.byType(Drawer);
    expect(
      find.descendant(of: menu, matching: find.text('Ana')),
      findsOneWidget,
    );
    expect(
      find.descendant(of: menu, matching: find.text('ana@poolcare.com')),
      findsOneWidget,
    );
    await tester.tap(find.descendant(of: menu, matching: find.text('Perfil')));
    await tester.pumpAndSettle();
    expect(find.byType(PerfilScreen), findsOneWidget);
  });

  testWidgets('sair volta ao login, limpa a pilha e apaga a sessão', (
    tester,
  ) async {
    final sessao = sessaoDeMentira();
    await tester.pumpWidget(appDeMentira(sessao));
    await preencherEEntrar(tester, 'segredo123');
    await tester.tap(find.text('Ver produtos'));
    await tester.pumpAndSettle();
    expect(find.byType(ProdutosScreen), findsOneWidget);
    await abrirOMenu(tester);
    await tester.tap(find.text('Sair'));
    await tester.pumpAndSettle();
    expect(find.byType(LoginScreen), findsOneWidget);
    expect(find.byType(ProdutosScreen), findsNothing);
    expect(
      Navigator.of(tester.element(find.byType(LoginScreen))).canPop(),
      isFalse,
    );
    expect(sessao.logado, isFalse);
  });

  testWidgets('o watch redesenha quando o service avisa', (tester) async {
    final sessao = sessaoDeMentira();
    await tester.pumpWidget(
      ChangeNotifierProvider.value(
        value: sessao,
        child: MaterialApp(
          home: Builder(
            builder: (context) =>
                Text(context.watch<SessaoService>().usuario?.nome ?? 'ninguém'),
          ),
        ),
      ),
    );
    expect(find.text('ninguém'), findsOneWidget);
    await sessao.entrar('ana@poolcare.com', 'segredo123');
    await tester.pump();
    expect(find.text('Ana'), findsOneWidget);
  });

  test('o service recusa campos vazios sem chamar a API', () async {
    pedidos = 0;
    final sessao = sessaoDeMentira();
    await expectLater(sessao.entrar('', ''), throwsA(isA<ErroDeLogin>()));
    expect(pedidos, 0);
    expect(sessao.logado, isFalse);
  });

  test('entrar e sair atualizam a sessão e avisam', () async {
    final sessao = sessaoDeMentira();
    var avisos = 0;
    sessao.addListener(() => avisos++);
    await sessao.entrar('ana@poolcare.com', 'segredo123');
    expect(sessao.usuario?.nome, 'Ana');
    expect(avisos, 1);
    sessao.sair();
    expect(sessao.logado, isFalse);
    expect(avisos, 2);
  });
}
