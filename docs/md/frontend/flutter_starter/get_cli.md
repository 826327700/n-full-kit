---
outline: deep
lang: zh-CN
---

# get_cli

## 概述

`get_cli`是`GetX™`框架的官方CLI工具，旨在帮助开发者快速生成基于`GetX™`框架的Flutter项目基础结构和代码，提高开发效率。   
本项目模板建议使用`get_cli`来生成路由和视图模块，以保证目录和代码结构的统一性。
::: tip 提示
- [getx](https://pub.dev/packages/get)
- [get_cli](https://pub.dev/packages/get_cli)
:::

## 安装

可以通过以下命令全局安装`get_cli`：

```bash
dart pub global activate get_cli
```

安装完成后，可以通过以下命令验证安装是否成功：

```bash
get_cli --version
```

## 生成页面

使用以下命令生成一个新的页面：

```bash
get create page:home
```

该命令将在`lib/app/modules`目录下生成一个名为`home`的页面模块，包括页面、控制器和绑定文件，并自动将该页面注册到路由表中。   
`路由表`配置在`lib/app/routes`目录，由`get_cli`生成，一般无需手动修改。   
跳转路由页面示例代码：
```dart
Get.to(Routes.HOME) //这里的Routes.HOME由`get_cli`生成
```

## 生成控制器

使用以下命令生成一个新的控制器：

```bash
get create controller:home
```

该命令将在`lib/app/modules/home/controllers`目录下生成一个名为`home.controller.dart`的控制器文件。

## 其他命令

`生成页面`和`生成控制器`只是在本模板中常用的两个命令，`get_cli`还提供了许多其他命令来帮助开发者快速生成和管理项目中的代码结构。以下是一些常用命令：

- 生成模型：

```bash
get create model:user
```

- 生成存储库：

```bash
get create repository:user
```

- 生成绑定：

```bash
get create binding:home
```
更多使用方法请查看[get_cli文档](https://pub.dev/packages/get_cli)