---
outline: deep
lang: zh-CN
---

# 快速开始

## 概述
基于NestJs开发的后端模板，提供了通用的开发环境和结构，封装了后端开发常用的功能模块，帮助开发者快速搭建后端应用。   
模板分为MySQL和MongoDB两个版本，适用于不同的数据库类型，推荐选择`MongoDB版本`。
::: warning 注意
使用本模板需要具有一定NestJs开发经验。   
相关参考文档：
- [nestjs官网](https://nestjs.com/)
- [nestjs中文](https://docs.nestjs.cn/)
:::

## 创建项目
1. 在准备存放项目的目录下，使用`n-full-cli`工具输入命令创建：
2. 输入命令：`nfull create`
3. 选择：`backend / 后端`
4. 选择：`NestJS+Mysql`或者`NestJS+Mongo`
5. 输入项目名称并确定，它将会按照名称创建一个项目目录

```sh:no-line-numbers{4}
T  nfull create
|
o  Please select the project type / 请选择项目类型
|  ❯ backend / 后端 
|    frontend / 前端 
|
o  Please select a backend template / 请选择项目模板
|  ❯ NestJS+Mysql 
|    NestJS+Mongo
|
o  Please enter the project name: / 请输入你的项目名称
|  nest-project
| 
o  downloading template...
|
o  Template downloaded successfully to ./nest-project
|
|  To get started, navigate to the project directory:
|  cd nest-project
|  Then run the following command to install dependencies:
|  npm install or yarn install
-  npm run start:dev
```

## 项目目录
本项目的目录结构如下：
```
src
├── common // 公共目录
│   ├── decorators // 自定义装饰器
│   ├── dto // 公共dto
│   ├── filters // 自定义过滤器
│   ├── guards // 自定义守卫
│   ├── interceptors // 自定义拦截器
│   ├── interfaces // 公共接口
│   ├── logger // 日志
│   └── modules // 公共模块
│       ├── auth // 认证模块
│       ├── permission-collect // 权限信息收集模块
│       └── redis // redis模块
├── config // 配置目录
├── db // 数据库目录
│   ├── database.module.ts // 数据库入口模块
│   └── mongodb // mongodb数据库目录（如果是MongoDB版本）
│   └── mysql // mysql数据库目录（如果是MySQL版本）
├── endpoints // 服务端点入口目录
│   ├── admin // 管理后台端点
│   │   ├── admin-users // 管理员用户相关
│   │   └── admin.module.ts // 管理后台端点入口模块
│   ├── app // 前端应用端点
│   │   ├── app.module.ts // 前端应用端点入口模块
│   │   ├── error-example // 错误示例模块（可删除）
│   │   ├── rate-limit // 限流示例模块（可删除）
│   │   ├── redis-example // redis示例模块（可删除）
│   │   └── users // 用户管理模块（可删除）
│   └── endpoints.module.ts // 服务端点入口模块
├── main.ts // NestJs入口文件
└── root.module.ts // 根模块
```
**说明：** 基本上所有的业务代码都在`endpoints`目录中，初始模板的`endpoints`目录下有`admin`和`app`两个大模块，用于区分提供给admin后台管理和前台应用的接口。这个示例只是参照普遍的中小型软件架构，如果不合适你的项目，可以直接删除`admin`和`app`目录，重新创建业务入口模块。