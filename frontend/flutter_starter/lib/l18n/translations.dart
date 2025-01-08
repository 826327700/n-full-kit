import 'package:get/get.dart';

class AppTranslations extends Translations {
  @override
  Map<String, Map<String, String>> get keys => {
        'en_US': {
          '登录': 'Login',
		  '切换语言': 'Switch Language',
          '切换主题': 'Switch Theme'
        },
        'zh_CN': {
          '登录': '登录',
		  '切换语言': '切换语言',
          '切换主题': '切换主题'
        }
    };
}
