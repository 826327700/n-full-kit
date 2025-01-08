import 'package:flutter/material.dart';
import 'package:get/get.dart';
import '/theme/text.dart';
import '../controllers/login.controller.dart';

class LoginView extends GetView<LoginController> {
	const LoginView({Key? key}) : super(key: key);
	@override
	Widget build(BuildContext context) {
		return Scaffold(
			body:Container(
				width: double.infinity,
				height: double.infinity,
				decoration: const BoxDecoration(
					image: DecorationImage(
						image: AssetImage("lib/assets/images/login_bg.jpg"),
						fit: BoxFit.cover
					)
				),
				child: Center(
					child: FractionallySizedBox(
						widthFactor: 0.9,
						child: IntrinsicHeight(
							child: Container(
								padding: const EdgeInsets.all(20),
								decoration: BoxDecoration(
									color: Colors.white,
									borderRadius: BorderRadius.circular(8)
								),
								child: Column(
									mainAxisAlignment: MainAxisAlignment.center,
									children: [
										const SizedBox(height: 20),
										Text("登录页",style:TextStyles(context).pageTitleText.copyWith(fontSize: 20)),
										const SizedBox(height: 50),
										Container(
											decoration: BoxDecoration(
												color: Colors.grey[200],
												borderRadius: BorderRadius.circular(25.0),
											),
											child: const TextField(
												decoration: InputDecoration(
													border: InputBorder.none,
													hintText: '请输入账号',
													prefixIcon:  Icon(Icons.person)
												),
											),
										),
										const SizedBox(height: 20),
										Container(
											decoration: BoxDecoration(
												color: Colors.grey[200],
												borderRadius: BorderRadius.circular(25.0),
											),
											child: const TextField(
												obscureText: true,
												decoration: InputDecoration(
													border: InputBorder.none,
													hintText: '请输入密码',
													prefixIcon:  Icon(Icons.lock)
												),
											),
										),
										const SizedBox(height: 40),
										SizedBox(
											width: double.infinity,
											child: ElevatedButton(
												onPressed: (){
													controller.login();
												},
												child: Text("登录".tr)
											),
										),
										const SizedBox(height: 20),
									],
								),
							),
						),
					),
				),
			),
		);
	}
}
