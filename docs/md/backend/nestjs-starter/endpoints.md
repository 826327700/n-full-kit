---
outline: deep
---

# 业务端点

## endpoints
`src/endpoints`目录是项目业务代码入口，所有的业务相关代码集中写在这个目录下，可以根据业务用途和分类，使用不同的目录名称进行归档，`src/endpoints`根目录下的`endpoints.module.ts`用于注册所有业务端点并导出给最外层的`root.module.ts`。

本模板中内置了`admin`和`app`两个大分类和大分类下的一些功能模块用于示例：
- `admin` 提供给admin后台管理的接口
- `app` 提供给前台应用程序的接口

```
├── admin // admin大分类
│   ├── admin-dict // admin大分类下的功能模块 字典模块
│   ├── admin-roles // admin大分类下的功能模块 角色模块
│   ├── admin-users // admin大分类下的功能模块 用户模块
│   └── admin.module.ts // 将admin分类下的所有模块注册并导出给endpoints.module.ts
├── app // app大分类
│   ├── app.module.ts // 将app分类下的所有模块注册并导出给endpoints.module.ts
│   ├── error-example // app大分类下的功能模块 错误示例模块
│   ├── rate-limit // app大分类下的功能模块 限流示例模块
│   ├── redis-example // app大分类下的功能模块 redis使用示例模块
│   └── users // app大分类下的功能模块 用户增删改查示例模块
└── endpoints.module.ts // 将端点模块注册并导出给root.module.ts
```
可以根据需求自行增加或删除端点分类。   
**注意：如果需要使用内置的RBAC权限系统，请勿删除admin目录**

## 新增端点分类
如果需要新增端点分类，只需要在`src/endpoints`下新建一个目录，例如`web`，然后在`web`内写入一个`web.module.ts`:
```ts
import { Module } from '@nestjs/common';
@Module({
	imports: [
		
	],
})
export class WebModule {}
```
目录结构示例如下：
```
├── admin // admin大分类
│   ├── ...
│   └── admin.module.ts 
├── app // app大分类
│   ├── app.module.ts 
│   ├── ...
├── web // web大分类
│   ├── web.module.ts 
│   ├── ...
└── endpoints.module.ts 
```
然后将`WebModule`在`endpoints.module.ts`中注册即可。后续`web`相关的功能模块，均在`web`目录下创建和编写即可。建议使用`@nestjs/cli`，在`web`目录下执行`nest g res xxx`即可创建功能模块，并自动注册到`WebModule`。