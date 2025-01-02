<template>
    <div class="user-block">
        <a-popover position="br" trigger="click" :content-style="{ padding: 0 }">
            <div class="user-row">
                <a-avatar :size="32" :style="{ backgroundColor: '#00d0b6' }">
                    {{userStore.userInfo.nickname.slice(0,1)}}
                </a-avatar>
                <span style="margin-left:10px;color:var(--color-text-1)">{{ userStore.userInfo.nickname }}</span>
                <icon-down />
            </div>
            <template #content>
                <a-menu>
                    <a-menu-item>
                        <icon-user />
                        <span>个人中心</span>
                    </a-menu-item>
                    <a-menu-item>
                        <icon-settings />
                        <span>设置</span>
                    </a-menu-item>
                    <a-menu-item @click="userStore.logout()">
                        <icon-send />
                        <span>退出登录</span>
                    </a-menu-item>
                </a-menu>
            </template>
        </a-popover>
    </div>
</template>

<script setup lang="ts">
import { useUserStore } from '@/store/user';

const userStore = useUserStore()
</script>
<style scoped lang="scss">
.user-block{
	cursor: pointer;
	display: flex;
	font-size: 14px;
	.user-row{
		display: flex;
		align-items: center;
		font-size: 14px;
		margin-right: 20px;
	}
	:deep(.arco-popover-popup-content){
		padding: 0;
	}
}
</style>
