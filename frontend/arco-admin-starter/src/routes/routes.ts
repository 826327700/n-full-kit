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
        children:[
            {
                path: 'test',
                name: 'test',
                meta: {
                    title: '测试',
                    icon: 'icon-folder',
                    hideInMenu: false
                },
                component: () => import('@/views/login/test.vue')
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