import { api } from "@/api"
import { UserInfo } from "@/api/api"
import { defineStore } from "pinia"
import { router } from "@/routes";
import { Message } from "@arco-design/web-vue";
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
            /** 用户菜单name */
            menus: [],
            /** 用户权限key */
            permissions: [],
        } as UserInfo,
    }),
    getters:{
        menus:(state) => {
            let rootRoutes = router.getRoutes().find((item: any) => item.name === 'root')?.children
            let arr: (MenuItem | undefined)[] = []
            let res: MenuItem[] = []
            const getAllNames = (item: any): string[] => {
                let names: string[] = [item.name]; // 首先将当前项的 name 加入数组

                if (item.children && item.children.length > 0) {
                    // 如果有 children，递归处理每个子项
                    item.children.forEach((child: any) => {
                        names = names.concat(getAllNames(child)); // 合并递归结果
                    });
                }

                return names;
            }
            const createMenu = (item: any) => {
                if (item.meta?.hideInMenu) {
                    return
                }
                let childNames = getAllNames(item)
                // if (!childNames.some((item: any) => state.userInfo.menus.includes(item))) {
                //     return
                // }
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
            console.log(res)
            return res
        },
    },
    actions:{
        login({username,password,remember}:any){
            return api.admin.adminUsersControllerLogin({
                username: username,
                password: password
            }).then(res => {
                this.userInfo=res.data.data!.user
                //跳转到当前角色所拥有的菜单的第一项
                if(this.menus.length>0){
                    setToken(res.data.data!.access_token,remember)
                    if(this.menus[0].children.length>0){
                        router.replace({ name: this.menus[0].children[0].name })
                    }else{
                        router.replace({ name: this.menus[0].name })
                    }
                }else{
                    Message.error('没有可用菜单，请联系管理员')
                }
                return Promise.resolve(res)
            })
        },
        refreshLoginInfo(){
            let token=getToken()
            if(!token){
                return
            }
            return api.admin.adminUsersControllerGetLoginInfo().then(res => {
                this.userInfo=res.data.data!
                return Promise.resolve(res)
            })
        },
        logout(){
            removeToken()
            router.replace('/login')
        }
    }
})
