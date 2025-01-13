---
outline: deep
---
# 菜单配置

## 概述
在后台管理系统的UI交互中，左侧菜单是一个重要的导航区域，它承担着系统功能模块的分类展示和快速访问的作用。一个设计良好的菜单系统应该具备以下特点：

- **层级清晰** - 合理的菜单层级结构，便于用户理解和定位功能
- **权限控制** - 根据用户角色动态显示可访问的菜单项
- **状态联动** - 与路由系统配合，自动高亮当前访问路径对应的菜单项
- **灵活配置** - 支持通过配置文件或后端接口动态生成菜单结构
- **交互友好** - 提供展开/收起、悬浮提示等交互体验

本项目基于 [ArcoDesign](https://arco.design/vue/docs/start) 的 Menu 组件实现了一套`路由即菜单`的方案，支持：

- 多级菜单结构
- 菜单项与路由的自动关联
- 基于角色的权限控制
- 简单的配置方式

> [!TIP]
> 菜单配置位于 `src/router/routes.ts` 文件中，与路由配置共同维护

## 配置
在路由配置`src/router/routes.ts` 文件中，在`name`为`root`路由的`children`内声明的子路由，默认视为登录后的菜单页面：
```ts{14-25}
import frame from '@/components/frame/frame.vue'
import type { RouteRecordRaw } from 'vue-router'
const routes:Array<RouteRecordRaw>= [
    {
        path: '/',
        name: 'root',
        component: frame,
        meta:{
            title:"首页"
        },
		redirect:{
			name:"dashboard"
		},
        children:[ // [!code focus:12]
            // 这里声明的子路由即被读取为菜单对应的页面
            {
				path: 'dashboard',
				name: 'dashboard', //点击菜单时跳转的路由name
				meta: {
					title: '欢迎页',// 菜单显示名称
					icon: 'icon-home',// 菜单前的图标
				},
				component: () => import('@/views/dashboard/index.vue')
			},
        ]
    },
    {
        path: '/login',
        name: 'login',
        component: () => import('@/views/login/index.vue'),
        meta: {
            title: '登录'
        }
    },
    {
        path: '/:pathMatch(.*)*',
        name: '404',
        component: () => import('@/views/404/index.vue'),
        meta: {
            title: '404'
        }
    }
]

export default routes
```
`meta`属性中被菜单提取的有效字段：
- `title` 菜单显示名称
- `icon` 菜单图标，不填即不显示，建议二级菜单不填
- `hideInMenu` 不将路由显示在菜单中，默认false
- `permissions` 字符串数组，声明该路由页面用到了哪些`权限key`，仅用于配合`角色管理`-`更新菜单`功能，纯净模板可忽略此字段
