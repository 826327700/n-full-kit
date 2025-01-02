<template>
    <div class="not-found">
        <a-result status="404" subtitle="访问的页面不存在">
            <template #extra>
                <a-space>
                    <a-button type="primary" @click="router.go(-1)">返回</a-button>
                </a-space>
            </template>
        </a-result>
    </div>
</template>

<script setup lang="ts">
import { router } from '@/routes';
</script>

<style scoped lang="scss">
.not-found {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
    text-align: center;
}
</style>
