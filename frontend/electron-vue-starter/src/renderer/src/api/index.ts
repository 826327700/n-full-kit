import { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from "axios";
import { Api } from "./api";
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

    }else{

	}
    return Promise.reject(err.response);
})
