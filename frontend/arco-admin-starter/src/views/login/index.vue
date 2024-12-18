<template>
    <div class="login-bg">
        <div class="center-box-outer">
            <div class="center-box-inner">
                <div class="left">
                    <img src="@/assets/images/logo_login.png" alt="">
                </div>
                <div class="right">
                    <a-form :model="form" ref="formRef" layout="vertical" class="login-form">
                        <a-form-item>
                            <h2>欢迎登录,后台管理系统</h2>
                            <p>xxx业务综合管理系统 ver 1.0.0</p>
                        </a-form-item>
                        <a-form-item label="账号" field="username" :rules="[{ required: true, message: '请输入登录账号' }]">
                            <a-input v-model="form.username" placeholder="请输入登录账号"></a-input>
                        </a-form-item>
                        <a-form-item label="密码" field="password" :rules="[{ required: true, message: '请输入登录密码' }]">
                            <a-input v-model="form.password" placeholder="请输入登录密码" type="password" show-password></a-input>
                        </a-form-item>
                        <a-form-item>
                            <a-checkbox v-model="form.remember" name="remember" label="记住密码">保持登录</a-checkbox>
                        </a-form-item>
                        <a-form-item>
                            <a-button type="primary" style="width: 100%;" @click="login">登录</a-button>
                        </a-form-item>
                        <a-form-item>
                            <p style="text-align: right;">忘记密码？点此<a-link type="primary">找回密码</a-link></p>
                        </a-form-item>
                    </a-form>
                </div>
            </div>
        </div>

		<p class="copyright">Copyright © 2024 N-Full-Kit Powered By Vue3+Arco Design</p>
    </div>
</template>

<script setup lang="ts">
import { api } from '@/api';
import { onMounted, reactive,useTemplateRef } from 'vue';
import { Form } from '@arco-design/web-vue';
import {localStorage,sessionStorage} from '@/utils/storage';
import { router } from '@/routes';

const formRef = useTemplateRef<InstanceType<typeof Form>>("formRef")
const form = reactive({
	username: '',
	password: '',
	remember: false
})

onMounted(()=>{
	api.admin.adminUsersControllerFindAll()
})

const login = async () => {
	let err=await formRef.value?.validate()
	if(!err){
		api.admin.adminUsersControllerLogin({
			username: form.username,
			password: form.password
		}).then(res => {
			if(form.remember){
				sessionStorage.remove('token')
				localStorage.set('token',res.data.data!.access_token)
			}else{
				localStorage.remove('token')
				sessionStorage.set('token',res.data.data!.access_token)
			}
			router.replace("/")
		})
	}

}
</script>
<style scoped lang="scss">
.login-bg {
    width: 100vw;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    overflow: hidden;
    &::before {
        content: '';
        position: absolute;
        top: -16px;
        left: -16px;
        right: -16px;
        bottom: -16px;
        background: #ebf0fa url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIiIGhlaWdodD0iMTIiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iNiIgY3k9IjYiIHI9Ii43NSIgZmlsbD0iI0M1Q0VFMCIvPjwvc3ZnPg==) repeat;
        z-index: -1;
    }
    .center-box-outer{
        width: 950px;
        height: 620px;
        background: rgba($color: #fff, $alpha: 0.4);
        border-radius: 16px;
        padding: 12px;
        backdrop-filter: blur(10px);
        .center-box-inner{
            width: 100%;
            height: 100%;
            background: var(--color-bg-2);
            border-radius: 8px;
            display: flex;
            overflow: hidden;
            // border: 1px solid #fff;
            box-shadow: 0 0 10px rgba($color: #000, $alpha: 0.06);
            .left{
                flex: 1;
                height: 100%;
                background: #f7f6f9;
                img{
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }
            }
            .right{
                flex: 1;
                padding: 32px;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
				h2{
					color: var(--color-text-1);
				}
            }
        }
    }
	.copyright{
		color: var(--color-text-2);
		position: absolute;
		bottom: 16px;
		left: 50%;
		transform: translateX(-50%)
	}
}
</style>
<style lang="scss">
.login-form{
	.arco-form-item-content-flex{
		display: block
	}
	p{
		color:var(--color-text-2)
	}
}
</style>
