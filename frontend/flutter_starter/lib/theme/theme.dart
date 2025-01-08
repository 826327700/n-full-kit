import 'package:flutter/material.dart';
import 'default.dart';
import 'orange.dart';

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
}


