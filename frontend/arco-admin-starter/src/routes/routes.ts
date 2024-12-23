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
        children:[
			{
				path: 'dashboard',
				name: 'dashboard',
				meta: {
					title: '欢迎页',
					icon: 'icon-home',
				},
				component: () => import('@/views/dashboard/index.vue')
			},
            {
                path: 'page1',
                name: 'page1',
                meta: {
                    title: '页面1',
                    icon: 'icon-folder',
                },
                component: () => import('@/views/page1/page1.vue')
            },
            {
                path: 'multi-page',
                name: 'multi-page',
                meta: {
                    title: '多页面',
                    icon: 'icon-folder',
                },
                children:[
                    {
                        path: 'page1',
                        name: 'multi-page-page1',
                        meta: {
                            title: '页面1',
                        },
                        component: () => import('@/views/page1/page1.vue')
                    },
                    {
                        path: 'page2',
                        name: 'multi-page-page2',
                        meta: {
                            title: '页面2',
                            hideInMenu: false
                        },
                        component: () => import('@/views/page2/page2.vue')
                    }
                ]
            },
			{
                path: 'system',
                name: 'system',
                meta: {
                    title: '系统管理',
                    icon: 'icon-settings',
                },
                children:[
                    {
                        path: 'account',
                        name: 'system-account',
                        meta: {
                            title: '管理员账号',
                            //前端声明该页面所用到的接口(权限),以便后端知道每一个页面默认有哪些权限 
                            //权限名称为该页面所用到的api接口 格式为：api.aaa.bbbb()=>aaa.bbbb
							permissions:[
								'admin.adminUsersControllerFindAll',
                                'admin.adminRolesControllerFindAll',
                                'admin.adminUsersControllerUpdate',
                                'admin.adminUsersControllerCreate',
                                'admin.adminUsersControllerRemove'
							]
                        },
                        component: () => import('@/views/system/account/index.vue')
                    },
                    {
                        path: 'role',
                        name: 'system-role',
                        meta: {
                            title: '角色管理',
                            //前端声明该页面所用到的接口(权限),以便后端知道每一个页面默认有哪些权限
                            //权限名称为该页面所用到的api接口 格式为：api.aaa.bbbb()=>aaa.bbbb
                            permissions:[
                                'admin.adminRolesControllerFindAllPermissions',
                                'admin.adminRolesControllerFindAllMenus',
                                'admin.adminRolesControllerFindAll',
                                'admin.adminRolesControllerUpdate',
                                'admin.adminRolesControllerCreate',
                                'admin.adminRolesControllerRemove',
                                'admin.adminRolesControllerUpdateAllMenus'
                            ]
                        },
                        component: () => import('@/views/system/role/index.vue')
                    },
                    {
                        path: 'dict',
                        name: 'system-dict',
                        meta: {
                            title: '字典管理',
                            //前端声明该页面所用到的接口(权限),以便后端知道每一个页面默认有哪些权限
                            //权限名称为该页面所用到的api接口 格式为：api.aaa.bbbb()=>aaa.bbbb
                            permissions:[
                                'admin.adminDictControllerFindAllTypes',
                                'admin.adminDictControllerCreateType',
                                'admin.adminDictControllerUpdateType',
                                'admin.adminDictControllerRemoveType',
                                'admin.adminDictControllerFindByType',
                                'admin.adminDictControllerUpdate',
                                'admin.adminDictControllerRemove',
                                'admin.adminDictControllerCreate',
                            ]
                        },
                        component: () => import('@/views/system/dict/index.vue')
                    }
                ]
            }
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
