import { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from "axios";
import { Api } from "./api";
import { getToken, removeToken } from "@/utils/token";
import axios from 'axios-miniprogram';

export const api = new Api()
// @ts-ignore
api.instance=axios.create({
	baseURL: 'http://localhost:3000',
})
api.instance.interceptors.request.use((config:InternalAxiosRequestConfig) => {
	let token=getToken()
	config.headers.Authorization = `Bearer ${token}`
	if(token){
		config.headers.Authorization = `Bearer ${token}`
	}
    return config;
})
api.instance.interceptors.response.use((res:AxiosResponse) => {
    return Promise.resolve(res)
}, (err:AxiosError) => {
    if(err.response?.status===401){
        uni.showModal({
			title: '提示',
			content: '未登录或登陆过期，请重新登录',
			showCancel: false
		})
        removeToken()
    }else{

		uni.showToast({
			//@ts-ignore
			title: err.response?.data.message || '未知错误',
			icon: 'error'
		})
	}
    return Promise.reject(err.response);
})
