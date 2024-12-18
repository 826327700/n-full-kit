import { createRouter, createWebHashHistory } from 'vue-router'
import {localStorage,sessionStorage} from '@/utils/storage';
import routes from './routes'

export const router = createRouter({
    history: createWebHashHistory(import.meta.env.BASE_URL),
    routes: routes
})

// 路由守卫
router.beforeEach(async (to, _from, next) => {
    // 如果是访问登录页，直接放行
    if (to.name === 'login') {
		// 如果已经登录，直接跳转到首页
		if (sessionStorage.get('token')||localStorage.get('token')) {
			next({ name: 'dashboard' })
			return
		}
        next()
        return
    }

    // 路由已加载完成，检查路由是否存在
    if (!router.hasRoute(to.name as string)) {
        next({ name: '404' })
        return
    }

    next()
})
