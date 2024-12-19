import {localStorage,sessionStorage} from '@/utils/storage';

export function getToken(){
    let token=sessionStorage.get('token')||localStorage.get('token')
    return token
}

export function setToken(token:string,remember:boolean){
    removeToken()
    if(remember){
        localStorage.set('token',token)
    }else{
        sessionStorage.set('token',token)
    }
}

export function removeToken(){
    localStorage.remove('token')
    sessionStorage.remove('token')
}