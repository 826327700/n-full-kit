<template>
    <div class="login-bg">
        <div class="center-box-outer">
            <div class="center-box-inner">
                <div class="left">
                    <img src="@/assets/images/logo_login.png" alt="">
                </div>
                <div class="right">
                    <!-- <tiny-form label-position="top">
                        <tiny-form-item>
                            <h2>欢迎登录,后台管理系统</h2>
                            <p style="color:var(--tv-color-text-weaken);">xxx业务综合管理系统 ver 1.0.0</p>
                        </tiny-form-item>
                        <tiny-form-item label="账号" prop="username">
                            <tiny-input :prefix-icon="iconUser" placeholder="请输入登录账号"></tiny-input>
                        </tiny-form-item>
                        <tiny-form-item label="密码" prop="">
                            <tiny-input :prefix-icon="iconLock" placeholder="请输入登录密码" type="password" show-password></tiny-input>
                        </tiny-form-item>
                        <tiny-form-item>
                            <tiny-checkbox name="remember" label="记住密码">保持登录</tiny-checkbox>
                        </tiny-form-item>
                        <tiny-form-item>
                            <tiny-button type="primary" style="width: 100%;">登录</tiny-button>
                        </tiny-form-item>
                        <tiny-form-item>
                            <p style="color: var(--tv-color-text-weaken);text-align: right;">忘记密码？点此<tiny-link type="primary">找回密码</tiny-link></p>
                        </tiny-form-item>
                    </tiny-form> -->
                    <a-form>
                        <a-form-item>
                            <h2>欢迎登录,后台管理系统</h2>
                            <p style="color:var(--tv-color-text-weaken);">xxx业务综合管理系统 ver 1.0.0</p>
                        </a-form-item>
                        <a-form-item label="账号" prop="username">
                            <a-input  placeholder="请输入登录账号"></a-input>
                        </a-form-item>
                        <a-form-item label="密码" prop="">
                            <a-input  placeholder="请输入登录密码" type="password" show-password></a-input>
                        </a-form-item>
                        <a-form-item>
                            <a-checkbox name="remember" label="记住密码">保持登录</a-checkbox>
                        </a-form-item>
                        <a-form-item>
                            <a-button type="primary" style="width: 100%;">登录</a-button>
                        </a-form-item>
                        <a-form-item>
                            <p style="color: var(--tv-color-text-weaken);text-align: right;">忘记密码？点此<a-link type="primary">找回密码</a-link></p>
                        </a-form-item>
                    </a-form>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { api } from '@/api';
import { onMounted } from 'vue';
onMounted(() => {
    
    api.app.usersControllerFindAll().then(res => {
    console.log(res);
})

})
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
            background: #fff;
            border-radius: 8px;
            display: flex;
            overflow: hidden;
            border: 1px solid #fff;
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
                align-items: center
            }
        }
    }
}
</style>