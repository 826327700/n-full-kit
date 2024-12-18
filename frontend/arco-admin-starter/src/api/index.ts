import { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from "axios";
import {localStorage,sessionStorage} from '@/utils/storage';
import { Api } from "./api";

export const api = new Api({
    baseURL: 'http://localhost:3000',
})
api.instance.interceptors.request.use((config:InternalAxiosRequestConfig) => {
	let token=sessionStorage.get('token')||localStorage.get('token')
	if(token){
		config.headers.Authorization = `Bearer ${token}`
	}
    return config;
})
api.instance.interceptors.response.use((res:AxiosResponse) => {
    return Promise.resolve(res)
}, (err:AxiosError) => {
    return Promise.reject(err.response);
})
