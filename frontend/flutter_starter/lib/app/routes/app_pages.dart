import 'package:get/get.dart';

import '../modules/home/bindings/home.binding.dart';
import '../modules/home/views/home.view.dart';
import '../modules/login/bindings/login.binding.dart';
import '../modules/login/views/login.view.dart';

part 'app_routes.dart';

class AppPages {
  AppPages._();

  static const INITIAL = Routes.LOGIN;

  static final routes = [
    GetPage(
      name: _Paths.LOGIN,
      page: () => const LoginView(),
      binding: LoginBinding(),
    ),
    GetPage(
      name: _Paths.HOME,
      page: () => const HomeView(),
      binding: HomeBinding(),
    ),
  ];
}
