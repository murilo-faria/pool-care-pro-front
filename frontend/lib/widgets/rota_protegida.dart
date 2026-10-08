import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../screens/login_screen.dart';
import '../services/sessao_service.dart';

class RotaProtegida extends StatelessWidget {
  const RotaProtegida({super.key, required this.tela});

  final Widget tela;

  @override
  Widget build(BuildContext context) {
    return context.watch<SessaoService>().logado ? tela : const LoginScreen();
  }
}
