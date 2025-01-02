<template>
    <a-card :bordered="false" class="fill flex-column" :title="title">
        {{ title }}
        <slot></slot>
    </a-card>
</template>

<script setup lang="ts">
import { router } from '@/routes';
import { computed } from 'vue';

const props = defineProps({
    useRouteName: {
        type: Boolean,
        default: false
    },
    title: {
        type: String,
        default: ''
    }
})
const title = computed(() => {
    return props.useRouteName ? router.currentRoute.value.meta.title : props.title
})

</script>
<style scoped lang="scss">
.page-wapper {
    box-sizing: border-box;
    height: 100%;
    background: #fff;
    padding: 16px;
    border-radius: 8px;
    display: flex;
    flex-direction: column;
    overflow: hidden;
}
</style>