
import 'package:get/get.dart';
import '../../../routes/app_pages.dart';

class LoginController extends GetxController {

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

	login() async {
		Get.offNamed(Routes.HOME);
	}
}
