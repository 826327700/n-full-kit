import { createRouter, createWebHashHistory } from 'vue-router'
import routes from './routes'
import { getToken } from '@/utils/token';
import { useUserStore } from '@/store/user';


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


    // 检查是否有权限访问
    const userStore = useUserStore()
    if(to.matched.length>0&&to.matched[0].name=='root'){
        await userStore.refreshLoginInfo()
        if (!userStore.userInfo.menus.includes(to.name as string)){
            next({name:'404',replace:true})
        }
    }
    next()
})
