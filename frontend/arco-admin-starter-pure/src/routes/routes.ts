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
                    title: '一级菜单',
                    icon: 'icon-folder',
                },
                component: () => import('@/views/page1/page1.vue')
            },
            {
                path: 'multi-page',
                name: 'multi-page',
                meta: {
                    title: '二级菜单',
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
