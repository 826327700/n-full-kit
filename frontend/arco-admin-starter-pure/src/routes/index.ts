import { createRouter, createWebHashHistory } from 'vue-router'
import routes from './routes'
import { getToken } from '@/utils/token';

export const router = createRouter({
    history: createWebHashHistory(import.meta.env.BASE_URL),
    routes: routes
})

// 路由守卫
router.beforeEach(async (to, from, next) => {
    // 如果是访问登录页，直接放行
    if (to.name === 'login') {
		// 如果已经登录，直接跳转到首页
		if (getToken()) {
			next({ name: 'dashboard' })
			return
		}
        next()
        return
    }else{
        // 如果没有登录，跳转到登录页
        if (!getToken()) {
            next({ name: 'login' })
            return
        }
    }
	next()
})
