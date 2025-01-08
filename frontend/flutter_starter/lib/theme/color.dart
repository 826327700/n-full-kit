import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';

const darkBackground=Color(0xff131313);

extension CustomColorScheme on ColorScheme {

  	Color? get normalFontColor =>brightness == Brightness.light ? Colors.black87 : Colors.white;

  	Color? get greyColor =>brightness == Brightness.light ? Colors.grey : Colors.grey[400];

	Color? get customBackground =>brightness == Brightness.light ? Colors.white : darkBackground;

	Color? get chatListRowColor =>brightness == Brightness.light ? Colors.white : Colors.transparent;

	Color? get chatBackground =>brightness == Brightness.light ? CupertinoColors.secondarySystemBackground : Colors.transparent;
}
