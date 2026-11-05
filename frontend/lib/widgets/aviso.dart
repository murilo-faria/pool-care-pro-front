import 'package:flutter/material.dart';

void avisar(BuildContext context, String texto, {bool erro = false}) {
  final mensageiro = ScaffoldMessenger.of(context);
  mensageiro.hideCurrentSnackBar();
  mensageiro.showSnackBar(
    SnackBar(
      content: Text(texto),
      backgroundColor: erro ? Colors.red : Colors.green,
    ),
  );
}
