import { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from "axios";
import { Api } from "./api";
import { router } from "@/routes";
import { Message } from "@arco-design/web-vue";
import { getToken, removeToken } from "@/utils/token";

export const api = new Api({
    baseURL: 'http://localhost:3000',
})
api.instance.interceptors.request.use((config:InternalAxiosRequestConfig) => {
	let token=getToken()
	if(token){
		config.headers.Authorization = `Bearer ${token}`
	}
    return config;
})
api.instance.interceptors.response.use((res:AxiosResponse) => {
    return Promise.resolve(res)
}, (err:AxiosError) => {
    if(err.response?.status===401){
        Message.error('未登录或登录已过期，请重新登录')
        removeToken()
        router.replace('/login')
    }else{
		//@ts-ignore
		Message.error(err.response?.data.message)
	}
    return Promise.reject(err.response);
})
