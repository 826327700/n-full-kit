import { defineStore } from "pinia"
import { router } from "@/routes";
import { getToken, removeToken, setToken } from "@/utils/token";

interface MenuItem {
	label: string;
	path: string;
	name: string;
	meta?: {
		icon?: string;
		hideInMenu?: boolean;
	};
	children: MenuItem[];
}
export const useUserStore = defineStore('user',{
    state: () => ({
        userInfo:{
            /** 用户id */
            id: "",
            /** 用户昵称 */
            nickname: "",
        },
    }),
    getters:{
        menus:(state) => {
            let rootRoutes = router.getRoutes().find((item: any) => item.name === 'root')?.children
            let arr: (MenuItem | undefined)[] = []
            let res: MenuItem[] = []
            const createMenu = (item: any) => {
                if (item.meta?.hideInMenu) {
                    return
                }
                return {
                    name: item.name,
                    label: item.meta?.title,
                    meta: item.meta,
                    path: item.path,
                    children: item.children ? item.children.map((child: any) => createMenu(child)).filter((item: any) => item) : []
                } as MenuItem
            }
            if (!rootRoutes) return res
            for (const route of rootRoutes) {
                arr.push(createMenu(route))
            }
            res = arr.filter((item: any) => item) as MenuItem[]
            return res
        },
    },
    actions:{
        login({username,password,remember}:any){
			// 模拟登录
			return new Promise<void>((resolve, reject) => {
				setTimeout(() => {
					setToken("jwt-xxxx",remember)
					this.userInfo.id="1"
					this.userInfo.nickname="admin"
					router.replace({ name: 'dashboard' })
					resolve()
				}, 500);
			})


        },
        refreshLoginInfo(){
            let token=getToken()
            if(!token){
                return
            }
			// 模拟请求用户信息
            return new Promise<void>((resolve, reject) => {
				setTimeout(() => {
					this.userInfo.id="1"
					this.userInfo.nickname="admin"
					resolve()
				}, 100);
			})
        },
        logout(){
            removeToken()
            router.replace('/login')
        }
    }
})
