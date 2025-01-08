
import 'package:get/get.dart';
import '../../../routes/app_pages.dart';
import '../models/login.model.dart';

class LoginController extends GetxController {
	final count = 0.obs;
	@override
	void onInit() {
		super.onInit();
	}

	@override
	void onReady() {
		super.onReady();
	}

	@override
	void onClose() {
		super.onClose();
	}

	void increment() => count.value++;

	login() async {
		Get.offNamed(Routes.HOME);
	}
}
