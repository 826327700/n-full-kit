---
outline: deep
---
# 快速开始

## 概述
这是一个基于 Electron + Vue3 + Nest 的桌面应用开发模板，基于`electron-vite`框架进行封装，集成了以下特性：
- 使用 Vite 进行快速构建
- 集成 NestJS 作为主进程框架
- 自动生成`preload`预加载脚本
- 支持 Windows、Mac、Linux 多平台打包

::: warning 注意
使用本模板需要具有一定`Electron`和`Nestjs`开发经验。   
相关参考文档：
- [Electron](https://www.electronjs.org/)
- [Nestjs](https://nestjs.com/)
- [electron-vite](https://cn.electron-vite.org/)
:::

## 创建项目
1. 在准备存放项目的目录下，使用`n-full-cli`工具输入命令创建：
2. 输入命令：`nfull create`
3. 选择：`frontend / 前端`
4. 选择：`Electron+Vue+Nest`
5. 输入项目名称并确定，它将会按照名称创建一个项目目录

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
|    Flutter+GetX 
|    Uniapp+NutUI 
|  ❯ Electron+Vue+Nest 
|
o  Please enter the project name: / 请输入你的项目名称
|  electron-project
| 
o  downloading template...
|
o  Template downloaded successfully to ./electron-project
|
|  To get started, navigate to the project directory:
|  cd electron-project
|  Then run the following command to install dependencies:
|  npm install or yarn install
-  npm run dev
```

## 项目结构
```
.
├── src/
│   ├── main/        # 主进程代码
│   ├── preload/     # 预加载脚本
│   └── renderer/    # 渲染进程代码（Vue3）
├── electron.vite.config.ts  # 构建配置
└── package.json     # 项目配置
```
其中主进程目录结构：
```
main/
├── app.module.ts //nestjs的主模块
├── check-update.ts //检测版本更新脚本
├── decorators //装饰器目录
│   └── bind-renderer-method.ts
├── electron.ts //初始化electron主进程
├── filter //nestjs过滤器目录
│   └── all-exceptions.filter.ts
├── index.ts //主入口
├── modules //nestjs模块目录
```
预加载脚本目录结构：
```
preload
├── api.d.ts //主进程与渲染进程的通信类型声明 由命令自动生成
├── api.ts //主进程与渲染进程的通信方法声明 由命令自动生成
├── index.d.ts //类型声明
└── index.ts //脚本入口
```

## 技术栈
- 前端框架：Vue3 + TypeScript
- 构建工具：Vite + SWC
- 桌面框架：Electron
- 后端框架：NestJS
