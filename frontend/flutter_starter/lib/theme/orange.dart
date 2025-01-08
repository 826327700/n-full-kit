import 'package:flutter/material.dart';
import 'default.dart';

Color primaryColor=const Color(0xffff9600);
Color warningColor=const Color(0xffE98E65);
Color dangerColor=const Color(0xffff7071);

ThemeData get orangeThemeData=> defaultThemeData.copyWith(
	primaryColor:primaryColor,
	primaryColorLight: const Color(0xFFFAC479),
	scaffoldBackgroundColor: const Color(0xfff5f5f5),
	bottomNavigationBarTheme: BottomNavigationBarThemeData(
		selectedItemColor:primaryColor,
	),
    elevatedButtonTheme: ElevatedButtonThemeData(
		style: ButtonStyle(
			backgroundColor: WidgetStatePropertyAll(primaryColor)
		)
	),
);
