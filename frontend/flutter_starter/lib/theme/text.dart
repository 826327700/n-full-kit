import 'package:flutter/material.dart';
import 'color.dart';

class TextStyles {
	BuildContext context;
	TextStyles(this.context);

	TextStyle get pageTitleText=>TextStyle(fontSize: 17,color:Theme.of(context).colorScheme.normalFontColor);
	TextStyle get normalTitleText=>TextStyle(fontSize: 16,color:Theme.of(context).colorScheme.normalFontColor);
	TextStyle get normalMiddleGreyText=>TextStyle(fontSize: 14,color:Theme.of(context).colorScheme.greyColor);
	TextStyle get normalSmallGreyText=>TextStyle(fontSize: 12,color:Theme.of(context).colorScheme.greyColor);
	TextStyle get bigText=>TextStyle(fontSize: 20,color:Theme.of(context).colorScheme.normalFontColor);
}
