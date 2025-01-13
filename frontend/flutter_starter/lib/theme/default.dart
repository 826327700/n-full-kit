import 'package:flutter/material.dart';

Color primaryColor=Colors.blue;
Color primaryLite=const Color.fromARGB(255, 220, 237, 252);
Color warningColor=const Color(0xffE98E65);
Color dangerColor=const Color(0xffff7071);

ThemeData get defaultThemeData=> ThemeData(
	platform: TargetPlatform.iOS,
	primaryColor:primaryColor,
	primaryColorLight:primaryLite,
	scaffoldBackgroundColor:const Color(0xfff6f6f7),
	fontFamily: 'SourceHanSansCN',
	textTheme: const TextTheme(
		bodyLarge: TextStyle(fontSize: 24.0,color: Color(0xff111111)),
		bodyMedium: TextStyle(fontSize: 14.0,color: Color(0xff111111)),
		bodySmall: TextStyle(fontSize: 12.0,color: Color(0xff999999)),
	),
	textSelectionTheme:TextSelectionThemeData(
		cursorColor: primaryColor,
		selectionColor: primaryColor.withOpacity(0.5),
		selectionHandleColor: primaryColor
	),
	appBarTheme: const AppBarTheme(
		centerTitle:true,
		backgroundColor: Colors.blue,
		elevation: 0,
		iconTheme: IconThemeData(
			color: Colors.white,
			size: 18
		),
		titleTextStyle:TextStyle(fontSize: 16,color: Colors.white),
		toolbarTextStyle: TextStyle(fontSize: 16,color: Colors.white),
		actionsIconTheme: IconThemeData(
			color: Colors.white,
			size: 18
		),
	),
	bottomNavigationBarTheme: BottomNavigationBarThemeData(
		selectedItemColor:primaryColor,
	),
	inputDecorationTheme: const InputDecorationTheme(
		hintStyle: TextStyle(color: Color(0xffc6c6c6))
	),
	elevatedButtonTheme: const ElevatedButtonThemeData(
		style: ButtonStyle(
			elevation: WidgetStatePropertyAll<double>(0),
		)
	),
	textButtonTheme: TextButtonThemeData(
		style: ButtonStyle(
			overlayColor: const WidgetStatePropertyAll(Colors.transparent),
			foregroundColor:WidgetStateProperty.resolveWith((states) {
				if (states.contains(WidgetState.pressed)) {
					return Colors.black54.withOpacity(0.8);
				}
				return Colors.black54;
			})
		)
	),
	radioTheme: RadioThemeData(
		fillColor: WidgetStatePropertyAll(primaryColor)
	), colorScheme: ColorScheme.fromSwatch().copyWith(
		secondary: warningColor,
	).copyWith(error: dangerColor),
);
