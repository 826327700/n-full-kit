---
outline: deep
---
# 快速开始

## 项目概述
本项目是基于Uniapp + NutUI + Vue3 + Vite的小程序开发模板，支持快速构建跨平台小程序。主要特性包括：
- 主要目的用于开发小程序，但也支持H5、App等多端开发
- 集成NutUI组件库，提供丰富的UI组件
- 使用Pinia进行状态管理
- 支持TypeScript开发
- 使用Vite构建工具，开发体验更佳
::: warning 注意
使用本模板需要具有一定Uniapp开发经验。   
相关参考文档：
- [uniapp](https://uniapp.dcloud.net.cn)
- [nutui](https://nutui.jd.com/#/)
- [nutui-uniapp](https://nutui-uniapp.pages.dev/)
- [pinia](https://pinia.vuejs.org/)
:::

## 创建项目
1. 在准备存放项目的目录下，使用`n-full-cli`工具输入命令创建：
2. 输入命令：`nfull create`
3. 选择：`frontend / 前端`
4. 选择：`Uniapp+NutUI`
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
|  ❯ Uniapp+NutUI 
|    Electron+Vue+Nest 
|
o  Please enter the project name: / 请输入你的项目名称
|  uniapp-project
| 
o  downloading template...
|
o  Template downloaded successfully to ./uniapp-project
|
|  To get started, navigate to the project directory:
|  cd uniapp-project
|  Then run the following command to install dependencies:
|  npm install or yarn install
-  npm run dev:mp-weixin
```

## 项目结构
```
src/
├── App.vue //视图入口文件
├── api //api目录
│   ├── api.ts //由swagger-typescript-api自动生成的api请求代码
│   └── index.ts //导出请求代码
├── env.d.ts
├── main.ts //主入口文件
├── manifest.json //uniapp配置文件
├── pages //页面文件目录
│   └── index
│       └── index.vue
├── pages.json //页面声明文件
├── shime-uni.d.ts
├── static //静态资源目录
│   └── logo.png
├── store //pinia目录
│   └── test.ts
├── uni.scss //uni基础样式文件
└── utils //工具类目录
```

## 技术栈
- 框架：uniapp
- UI组件库：nutui-uniapp
- 状态管理：Pinia
- 构建工具：Vite
- 开发语言：TypeScript
