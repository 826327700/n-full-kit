<template>
    <Wapper>
        <a-form :model="queryFilter" layout="inline" class="no-margin">
            <a-form-item field="keyword" label="关键词">
                <a-input v-model="queryFilter.keyword" placeholder="请输入关键词搜索" style="width: 300px;" />
            </a-form-item>
            <a-form-item>
                <a-space>
                    <a-button type="primary" @click="fetchData" v-permissions="['admin.adminUsersControllerFindAll']">
                        <template #icon>
                            <icon-search />
                        </template>
                        搜索
                    </a-button>
                    <a-button status="success" @click="form.visible = true"
                        v-permissions="['admin.adminUsersControllerCreate']">
                        <template #icon>
                            <icon-plus />
                        </template>
                        新增
                    </a-button>
                </a-space>
            </a-form-item>
        </a-form>
        <a-divider />
        <div class="table-box">
            <a-row :gutter="16">
                <a-col flex="200px" v-for="item in data" :key="item._id">
                    <a-card style="border-color: var(--color-success-light-4);" hoverable>
                        <a-typography-text>{{ item.type }}</a-typography-text>
                        <a-typography-text type="secondary" style="font-size: 12px;color: var(--color-text-3);">
                            {{ item.typeName }}
                        </a-typography-text>
                    </a-card>
                </a-col>
                <a-col flex="200px" v-for="item in data" :key="item._id">
                    <a-card style="border-color: var(--color-link-light-4);" hoverable>
                        <a-typography-text>{{ item.type }}</a-typography-text>
                        <a-typography-text type="secondary" style="font-size: 12px;color: var(--color-text-3);">
                            {{ item.typeName }}
                        </a-typography-text>
                    </a-card>
                </a-col>
                <a-col flex="200px" v-for="item in data" :key="item._id">
                    <a-card hoverable>
                        <a-typography-text>{{ item.type }}</a-typography-text>
                        <a-typography-text type="secondary" style="font-size: 12px;color: var(--color-text-3);">
                            {{ item.typeName }}
                        </a-typography-text>
                        <a-popover trigger="click" position="right">
                            <icon-right-circle class="show-child"/>
                            <template #content>
                                <a-list size="small" :max-height="240">
                                    <a-list-item>
                                        <a-typography-text>Man</a-typography-text>
                                        <a-typography-text type="secondary" style="font-size: 12px;color: var(--color-text-3);">
                                            男
                                        </a-typography-text>
                                    </a-list-item>
                                    
                                    <a-list-item>
                                       <a-link style="display: flex;;"><icon-plus /></a-link>
                                    </a-list-item>
                                </a-list>
                            </template>
                            </a-popover>
                    </a-card>
                </a-col>
            </a-row>
        </div>
    </Wapper>
</template>

<script setup lang="ts">
import { api } from '@/api';
import { usePaginatedQuery } from '@/common/hooks/query-list';
import { Form } from '@arco-design/web-vue';
import { reactive, useTemplateRef } from 'vue';

const queryFilter = reactive({
    // keyword:""
})

const {
    data,
    page,
    pageSize,
    total,
    loading,
    onPageChange,
    onPageSizeChange,
    fetchData
} = usePaginatedQuery<any>(api.admin.adminDictControllerFindAllTypes, queryFilter)

const formRef = useTemplateRef<InstanceType<typeof Form>>("formRef")
const form = reactive<any>({
    visible: false,
    id: "",
    data: {
        nickname: "",
        username: "",
        password: "",
        roles: [],
        status: "0"
    }
})
</script>
<style scoped lang="scss">
.show-child{
    position: absolute;
    right: 2px;
    top: 50%;
    transform: translateY(-50%);
    cursor: pointer;
    color: var(--color-text-3);
}
</style>