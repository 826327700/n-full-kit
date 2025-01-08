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
	LogUtil.init(isDebug: kDebugMode);

	await SpUtil.getInstance();

	var currentThemeName=SpUtil.getString('currentThemeName')??"默认";
	var currentTheme=AppTheme.themeList.firstWhere((item)=>item.name==currentThemeName,orElse:() => AppTheme.themeList[0]);
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
