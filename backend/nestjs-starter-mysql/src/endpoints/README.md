# 目录结构说明

本目录包含应用程序的所有业务逻辑代码，按照服务对象进行目录划分。

## 目录组织

代码按不同的服务对象组织到子目录中：

### 当前结构
- `app/` - 存放服务于移动端/网页端的模块
- `admin/` - 存放服务于管理后台的模块

### 添加新的服务对象

可以根据需求添加新的服务对象目录，例如：
- `api/` - 用于外部API服务
- `worker/` - 用于后台工作服务
- `webhook/` - 用于webhook处理服务

## 模块集成

要集成新模块：
1. 为你的服务对象创建新目录
2. 实现你的模块
3. 在 `endpoints.module.ts` 中导入模块

示例：
```typescript
@Module({
  imports: [
    AppModule,
    AdminModule,
    // 在这里添加你的新模块
  ]
})
```

---

# Entries Directory Structure

This directory contains all the business logic code of the application, organized by service consumers.

## Directory Organization

The code is organized into subdirectories based on different service consumers:

### Current Structure
- `app/` - Contains modules serving mobile/web app clients
- `admin/` - Contains modules serving admin dashboard/backend management

### Adding New Service Consumers

You can add new service consumer directories as needed. Examples might include:
- `api/` - For external API services
- `worker/` - For background worker services
- `webhook/` - For webhook handling services

## Module Integration

To integrate new modules:
1. Create a new directory for your service consumer
2. Implement your module(s)
3. Import the module in `endpoints.module.ts`

Example:
```typescript
@Module({
  imports: [
    AppModule,
    AdminModule,
    // Add your new module here
  ]
})