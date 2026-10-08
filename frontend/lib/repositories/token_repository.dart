import 'package:shared_preferences/shared_preferences.dart';

class TokenRepository {
  static const _chave = 'token';

  Future<String?> ler() async =>
      (await SharedPreferences.getInstance()).getString(_chave);

  Future<void> salvar(String token) async {
    await (await SharedPreferences.getInstance()).setString(_chave, token);
  }

  Future<void> apagar() async {
    await (await SharedPreferences.getInstance()).remove(_chave);
  }
}
