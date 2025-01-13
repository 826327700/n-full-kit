import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'default.dart';
import 'orange.dart';
import 'package:sp_util/sp_util.dart';

class ThemeItem{
	String name;
	ThemeData data;
	ThemeItem({required this.name,required this.data});
}

class AppTheme {
	/// 默认主题
	static ThemeData defaultTheme=defaultThemeData;

	/// 橙色主题
	static ThemeData orangeTheme=orangeThemeData;

	static List<ThemeItem>themeList=[
		ThemeItem(name: "默认",data: defaultTheme),
		ThemeItem(name: "橙色",data: orangeTheme),
	];

	/// 切换主题
	static changeTheme(String themeName){
		var theme=themeList.firstWhere((item)=>item.name==themeName,orElse:() => themeList[0]);
		SpUtil.putString('currentThemeName', theme.name);
		Get.changeTheme(theme.data);
	}

	/// 获取当前主题
	static ThemeItem getCurrentTheme(){
		var currentThemeName=SpUtil.getString('currentThemeName')??"默认";
		var currentTheme=themeList.firstWhere((item)=>item.name==currentThemeName,orElse:() => themeList[0]);
		return currentTheme;
	}
}


