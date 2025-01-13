import 'package:flutter/material.dart';
import 'package:flutter_starter/theme/theme.dart';

import 'package:get/get.dart';
import 'package:sp_util/sp_util.dart';

import '../controllers/home.controller.dart';

class HomeView extends GetView<HomeController> {
  const HomeView({Key? key}) : super(key: key);
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('HomeView'),
        centerTitle: true,
      ),
      body: SizedBox(
		width: double.infinity,
		child: Column(
			mainAxisAlignment: MainAxisAlignment.center,
			crossAxisAlignment: CrossAxisAlignment.center,
			spacing: 10,
			children: [
				const Text(
					'HomeView is working',
					style: TextStyle(fontSize: 20),
				),
				Text(
					'切换主题'.tr
				),
				Row(
					mainAxisAlignment: MainAxisAlignment.center,
					spacing: 10,
					children: [
						ElevatedButton(
							onPressed: () {
								AppTheme.changeTheme(AppTheme.themeList[0].name);
							},
							child: Text('默认主题'.tr),
						),
						ElevatedButton(
							onPressed: () {
								AppTheme.changeTheme(AppTheme.themeList[1].name);
							},
							child: Text('橙色主题'.tr),
						),
					],
				),
                ElevatedButton(
                    onPressed: () {
                        SpUtil.getString('locale') == 'zh_CN'?Get.updateLocale(Locale('en', 'US')):Get.updateLocale(Locale('zh', 'CN'));
                        SpUtil.getString('locale') == 'zh_CN'?SpUtil.putString('locale', 'en_US'):SpUtil.putString('locale', 'zh_CN');
                    },
                    child: Text('切换语言'.tr),
                ),
			],
		),
	  ),
    );
  }
}
