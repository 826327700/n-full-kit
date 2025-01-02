<template>
    <div class="breadcrumb-box">
        <div class="arco-menu-collapse-button" @click="menuCollapsed = !menuCollapsed">
            <icon-menu-fold  v-if="!menuCollapsed"/>
            <icon-menu-unfold v-else/>
        </div>
        <a-breadcrumb>
            <a-breadcrumb-item v-for="(item, index) in breadcrumb" :key="index">
                <a-link v-if="item.components || item.redirect" :href="'#'+item.path">{{ item.meta.title }}</a-link>
                <a-link v-else>{{ item.meta.title }}</a-link>
            </a-breadcrumb-item>
        </a-breadcrumb>
    </div>
</template>

<script setup lang="ts">
import { router } from '@/routes';
import { computed } from 'vue';
import {menuCollapsed} from '../frame'

let breadcrumb = computed(() => router.currentRoute.value.matched)
</script>
<style scoped lang="scss">
.breadcrumb-box{
    display: flex;
    align-items: center;
    height: 100%;
    .arco-menu-collapse-button{
        margin-right: 16px;
        position: relative;
        left: unset;
        top: unset;
        right: unset;
        bottom: unset;
        color: var(--color-text-3);
        background-color: var(--color-fill-1);
        &:hover{
            background-color: var(--color-fill-3);
        }
    }
}
</style>