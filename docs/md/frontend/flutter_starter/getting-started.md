---
outline: deep
lang: zh-CN
---

# 快速开始

## 概述
Flutter是一个由Google开发的开源UI软件开发工具包，用于创建高性能、高保真、跨平台的应用程序。Flutter使用Dart语言进行开发，并提供了丰富的组件和工具，帮助开发者快速构建美观的用户界面。   
Flutter可用于以下开发场景：
- 移动端App（iOS/Android）
- web网页
- 桌面客户端（Windows/macos/linux）
- 嵌入式设备
- 作为模块嵌入到原生iOS/Android工程中
- 作为模块嵌入到web网页工程中
- 微信小程序（需借助[MPFlutter](https://mpflutter.com/)）
- ...
  
本模板结合流行的`GetX`框架，封装了一个较为纯净的项目起始模板，用于快速创建基于Flutter项目。

::: warning 注意
使用本模板需要具有一定Flutter开发经验。   
相关参考文档：
- [Flutter官网](https://flutter.dev/docs/get-started/install)
- [pub.dev](https://pub.dev)
- [getx](https://pub.dev/packages/get)
- [get_cli](https://pub.dev/packages/get_cli)
:::

## 创建项目
1. 在准备存放项目的目录下，使用`n-full-cli`工具输入命令创建：
2. 输入命令：`nfull create`
3. 选择：`frontend / 前端`
4. 选择：`Flutter+GetX`
5. 输入项目名称并确定，它将会按照名称创建一个项目目录（注意，flutter项目的名称不能出现`-`中划线，请用下划线代替`_`）

```sh:no-line-numbers{5,10}
T  nfull create
|
o  Please select the project type / 请选择项目类型
|    backend / 后端 
|  ❯ frontend / 前端 
|
o  Please select a backend template / 请选择项目模板
|    Vue3+Arco Design Admin 
|    Vue3+Arco Design Admin pure 
|  ❯ Flutter+GetX 
|    Uniapp+NutUI 
|    Electron+Vue+Nest 
|
o  Please enter the project name: / 请输入你的项目名称
|  flutter_project
| 
o  downloading template...
|
o  Template downloaded successfully to ./flutter_project
|
|  To get started, navigate to the project directory:
|  cd flutter_project
|  Then run the following command to install dependencies:
|  flutter pub get
-  flutter run
```

## 项目目录
本项目的目录结构如下：
```
lib
├── app //主业务代码目录
│   ├── modules //模块模块
│   │   ├── home //首页模块
│   │   │   ├── bindings
│   │   │   │   └── home.binding.dart
│   │   │   ├── controllers
│   │   │   │   └── home.controller.dart
│   │   │   └── views
│   │   │       └── home.view.dart
│   │   └── login //登录页模块
│   │       ├── bindings
│   │       │   └── login.binding.dart
│   │       ├── controllers
│   │       │   └── login.controller.dart
│   │       └── views
│   │           └── login.view.dart
│   └── routes //路由目录 由get_cli自动生成
│       ├── app_pages.dart
│       └── app_routes.dart
├── assets //资源目录
│   ├── fonts //字体文件目录
│   └── images //图片文件目录
├── l18n //多语言目录
│   └── translations.dart //多语言内容文件
├── main.dart //程序主入口
└── theme //自定义主题目录
```