# 主进程开发指南

## 1. 架构概述
主进程采用NestJS框架，借助`@doubleshot/nest-electron`库使用微服务架构，通过Electron IPC与渲染进程通信。   
选用NestJS的理由：
- 模块化架构：便于功能解耦和扩展
- 依赖注入：简化服务管理和测试
- 强大的中间件支持：易于实现日志、异常处理等横切关注点
- TypeScript原生支持：提供更好的类型安全和开发体验
- 丰富的生态系统：可复用大量NestJS生态中的模块和工具

## 2. 进程间通信
使用Electron IPC进行进程间通信，主要场景：
- 主进程与渲染进程通信
- 主进程与预加载脚本通信
- 跨窗口通信

## 3. 异常处理
全局异常处理机制：
- 使用AllExceptionsFilter捕获所有异常
- 记录未捕获异常
- 记录未处理的Promise拒绝

## 4. 日志系统
日志配置：
- 日志级别：error
- 日志存储路径：~/Library/Application Support/{appName}/logs/main.log
- 支持开发环境调试日志


