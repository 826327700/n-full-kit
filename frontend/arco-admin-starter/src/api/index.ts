import { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from "axios";
import { Api } from "./api";

export const api = new Api({
    baseURL: 'http://localhost:3000',
    securityWorker: (accessToken:string|null) =>
        accessToken ? { headers: { Authorization: `Bearer ${accessToken}` } } : {},
})
api.setSecurityData('token')
api.instance.interceptors.request.use((config:InternalAxiosRequestConfig) => {
    console.log(config);
    return config;
})
api.instance.interceptors.response.use((res:AxiosResponse) => {
    return Promise.resolve(res)
}, (err:AxiosError) => {
    console.log(err.response?.data);
    console.log(err.status);
    return Promise.reject(err.response?.data);
})