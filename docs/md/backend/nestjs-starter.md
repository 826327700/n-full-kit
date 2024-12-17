---
outline: deep
---

# NestJs后端模板

## 概述
基于NestJs开发的后端模板，提供了通用的开发环境和结构，封装了后端开发常用的功能模块，帮助开发者快速搭建后端应用。   
模板分为MySQL和MongoDB两个版本，适用于不同的数据库类型，推荐选择`MongoDB版本`。

## 目录结构
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

## 特性
- **模块化**：支持模块化开发，便于代码的组织和管理。
- **依赖注入**：内置依赖注入容器，简化了服务的管理。
- **中间件支持**：可以方便地使用中间件处理请求和响应。

