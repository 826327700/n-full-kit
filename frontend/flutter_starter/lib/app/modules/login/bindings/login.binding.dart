import 'package:get/get.dart';
import '../controllers/login.controller.dart';

class LoginBinding extends Bindings {
	@override
	void dependencies() {
		Get.lazyPut<LoginController>(() => LoginController());
	}
}
