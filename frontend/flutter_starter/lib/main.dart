import 'package:common_utils/common_utils.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:flutter_localizations/flutter_localizations.dart';

import 'package:get/get.dart';
import 'package:sp_util/sp_util.dart';

import 'app/routes/app_pages.dart';
import 'l18n/translations.dart';
import 'theme/theme.dart';

Future<void> main() async {
    WidgetsFlutterBinding.ensureInitialized();
	LogUtil.init(isDebug: kDebugMode);

	await SpUtil.getInstance();

	var currentTheme=AppTheme.getCurrentTheme();
	runApp(
		GetMaterialApp(
			title: "Application",
			debugShowCheckedModeBanner: false,
			theme: currentTheme.data,
			transitionDuration: const Duration(milliseconds: 400),
			//配置国际化参数
			localizationsDelegates:const [
				GlobalMaterialLocalizations.delegate,
				GlobalCupertinoLocalizations.delegate,
				GlobalWidgetsLocalizations.delegate
			],
			locale: const Locale('zh', 'CH'),
			supportedLocales: const[
				Locale('zh', 'CH'),
				Locale('en', 'US'),
			],
			translations: AppTranslations(),
			initialRoute: AppPages.INITIAL,
			getPages: AppPages.routes,
		),
	);
}
