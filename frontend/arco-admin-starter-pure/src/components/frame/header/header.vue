<template>
    <a-card :bordered="false" class="no-padding">
        <div class="header">
            <div class="header-left">
                <Breadcrumb></Breadcrumb>
            </div>
            <div class="header-right">
                <a-space size="large">
                    <div class="icon-btn" @click="switchTheme">
                        <icon-moon-fill v-if="!state.isDark" :style="{ fontSize: '24px' }" />
                        <icon-sun-fill v-if="state.isDark" :style="{ fontSize: '24px' }" />
                    </div>
                    <User></User>
                </a-space>
            </div>
        </div>
    </a-card>

</template>

<script setup lang="ts">
import { onBeforeMount, reactive } from 'vue';
import Breadcrumb from './breadcrumb.vue';
import User from './user.vue';

const state = reactive({
    isDark: false
})

onBeforeMount(() => {
    state.isDark = localStorage.getItem('isDark') === 'true'
    if (state.isDark) {
        document.body.setAttribute('arco-theme', 'dark')
    }
})

const switchTheme = () => {
    if (state.isDark) {
        document.body.removeAttribute('arco-theme');
        state.isDark = false;
        localStorage.setItem('isDark', 'false')
    } else {
        document.body.setAttribute('arco-theme', 'dark')
        state.isDark = true;
        localStorage.setItem('isDark', 'true')
    }
}
</script>
<style scoped lang="scss">
.header {
    height: 50px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 13px;
    // background: #fff;
    border-radius: 8px;
    padding: 0 16px;

    .icon-btn {
        cursor: pointer;
    }
}
</style>