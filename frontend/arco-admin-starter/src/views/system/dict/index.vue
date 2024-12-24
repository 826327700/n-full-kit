<template>
    <Wapper>
        <a-form :model="queryFilter" layout="inline" class="no-margin">
            <a-form-item field="keyword" label="关键词">
                <a-input v-model="queryFilter.keyword" placeholder="请输入关键词搜索" style="width: 300px;" allow-clear/>
            </a-form-item>
            <a-form-item>
                <a-space>
                    <a-button type="primary" @click="fetchData" v-permissions="['admin.adminDictControllerFindAllTypes']">
                        <template #icon>
                            <icon-search />
                        </template>
                        搜索
                    </a-button>
                    <a-button status="success" @click="form.visible = true"
                        v-permissions="['admin.adminDictControllerCreateType']">
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
			<a-result status="404" subtitle="暂无数据" v-if="data.length==0"></a-result>
            <a-row :gutter="16" v-else>
                <a-col flex="200px" v-for="item in data" :key="item.id">
                    <a-card hoverable class="dict-card">
                        <a-typography-text>{{ item.type }}</a-typography-text>
                        <a-typography-text type="secondary" style="font-size: 12px;color: var(--color-text-3);">
                           <a-space>
                            {{ item.typeName }}
                            <icon-edit v-if="item.from=='custom'" style="cursor: pointer" @click="editDict(item)" v-permissions="['admin.adminDictControllerUpdateType']"></icon-edit>
                            <a-popconfirm content="此操作不可恢复，是否确认删除该记录?" type="warning" @ok="deleteDict(item)">
                                <icon-delete v-if="item.from=='custom'" style="cursor: pointer" v-permissions="['admin.adminDictControllerRemoveType']"></icon-delete>
                            </a-popconfirm>
                           </a-space>
                        </a-typography-text>
                        <a-popover trigger="click" position="right" @popup-visible-change="getDictOptions($event,item.type)">
                            <icon-right-circle class="show-child"  v-permissions="['admin.adminDictControllerFindByType']"/>
                            <template #content>
                                <a-list size="small" :max-height="240">
                                    <a-list-item v-for="option in currentOptions" :key="option.code">
                                        <a-space>
                                            <a-typography-text>{{ option.code }}</a-typography-text>
                                            <a-typography-text type="secondary"
                                                style="font-size: 12px;color: var(--color-text-3);">
                                                {{ option.label }}
                                            </a-typography-text>
                                            <icon-edit v-if="item.from=='custom'" style="cursor: pointer" @click="editDictValue(option)" v-permissions="['admin.adminDictControllerUpdate']"></icon-edit>
                                            <a-popconfirm content="此操作不可恢复，是否确认删除该记录?" type="warning" @ok="deleteDictValue(option)">
                                                <icon-delete v-if="item.from=='custom'" style="cursor: pointer" v-permissions="['admin.adminDictControllerRemove']"></icon-delete>
                                            </a-popconfirm>
                                        </a-space>
                                    </a-list-item>

                                    <a-list-item v-if="item.from=='custom'" style="cursor: pointer">
                                        <a-link style="display: flex;;" @click="addDictValue(item)" v-permissions="['admin.adminDictControllerCreate']"><icon-plus /></a-link>
                                    </a-list-item>
                                </a-list>
                            </template>
                        </a-popover>
                        <div class="dict-card-badge" v-if="item.from=='system'">系统内置</div>
                    </a-card>
                </a-col>
            </a-row>
        </div>
    </Wapper>

    <a-modal :title="form.id?'编辑字典':'新增字典'" v-model:visible="form.visible" :on-before-ok="submit">
        <a-form :model="form.data" ref="formRef" auto-label-width>
            <a-form-item label="字典key" field="type" :rules="[{ required: true, message: '请输入字典key' }]">
                <a-input :disabled="!!form.id" v-model="form.data.type" placeholder="请输入字典key"></a-input>
            </a-form-item>
            <a-form-item label="字典名称" field="typeName" :rules="[{ required: true, message: '请输入字典名称' }]">
                <a-input v-model="form.data.typeName" placeholder="请输入字典名称"></a-input>
            </a-form-item>
            <a-form-item label="是否启用" field="status">
                <a-switch checked-value="0" unchecked-value="1" v-model="form.data.status"></a-switch>
            </a-form-item>
        </a-form>
    </a-modal>

    <a-modal :title="valueForm.code?'编辑字典项':'新增字典项'" v-model:visible="valueForm.visible" :on-before-ok="valueSubmit">
        <a-form :model="valueForm.data" ref="valueFormRef" auto-label-width>
            <a-form-item label="字典项key" field="code" :rules="[{ required: true, message: '请输入字典项key' }]">
                <a-input v-model="valueForm.data.code" placeholder="请输入字典项key"></a-input>
            </a-form-item>
            <a-form-item label="字典项名称" field="label" :rules="[{ required: true, message: '请输入字典项名称' }]">
                <a-input v-model="valueForm.data.label" placeholder="请输入字典项名称"></a-input>
            </a-form-item>
            <a-form-item label="字典项排序" field="sort" :rules="[{ required: true, message: '请输入字典项排序' }]">
                <a-input-number v-model="valueForm.data.sort" placeholder="请输入字典项排序"></a-input-number>
            </a-form-item>
            <a-form-item label="是否启用" field="status">
                <a-switch checked-value="0" unchecked-value="1" v-model="valueForm.data.status"></a-switch>
            </a-form-item>
        </a-form>
    </a-modal>
</template>

<script setup lang="ts">
import { api } from '@/api';
import { AdminDictDto, AdminDictTypeDto } from '@/api/api';
import { usePaginatedQuery } from '@/common/hooks/query-list';
import { Form } from '@arco-design/web-vue';
import { reactive, ref, useTemplateRef } from 'vue';

const queryFilter = reactive({
    keyword:"",
	pageSize:9999
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

const currentOptions = ref<AdminDictDto[]>([])
const getDictOptions = async (visible:boolean,type: string) => {
    if(!visible){
        return
    }
    api.admin.adminDictControllerFindByType(type).then(res => {
        currentOptions.value = res.data.data
    })
}

const formRef = useTemplateRef<InstanceType<typeof Form>>("formRef")
const form = reactive<any>({
    visible: false,
    id: "",
    data: {
        type: "",
        typeName: "",
        status: "0"
    }
})
const editDict = (item: AdminDictTypeDto) => {
    form.id = item.id
    form.data.type = item.type
    form.data.typeName = item.typeName
    form.data.status = item.status
    form.visible = true
}
const submit = async () => {
    let err = await formRef.value?.validate()
    if (err) {
        return false
    }
    if (form.id) {
        await api.admin.adminDictControllerUpdateType(form.id, form.data).then(res => {
            formRef.value?.resetFields()
            form.id = ""
            form.visible = false
            fetchData()
        })
    } else {
        await api.admin.adminDictControllerCreateType(form.data).then(res => {
            formRef.value?.resetFields()
            form.visible = false
            fetchData()
        })
    }
    return true
}

const valueFormRef = useTemplateRef<InstanceType<typeof Form>>("formRef")
const valueForm = reactive<any>({
    visible: false,
    type: "",
    code: "",
    data: {
        type: "",
        code: "",
        label: "",
        sort: 0,
        status: "0"
    }
})
const addDictValue = (item: AdminDictTypeDto) => {
    valueForm.type=""
    valueForm.code=""
    valueForm.data.type = item.type
    valueForm.data.code = ""
    valueForm.data.label = ""
    valueForm.data.sort = 0
    valueForm.data.status = "0"
    valueForm.visible = true
}
const editDictValue = (item: AdminDictDto) => {
    valueForm.type=item.type
    valueForm.code=item.code
    valueForm.data.type = item.type
    valueForm.data.code = item.code
    valueForm.data.label = item.label
    valueForm.data.sort = item.sort
    valueForm.data.status = item.status
    valueForm.visible = true
}
const valueSubmit = async () => {
    let err = await valueFormRef.value?.validate()
    if (err) {
        return false
    }
    if (valueForm.code) {
        await api.admin.adminDictControllerUpdate(valueForm.type, valueForm.code, valueForm.data).then(res => {
            getDictOptions(true,valueForm.type)
            valueFormRef.value?.resetFields()
            valueForm.type = ""
            valueForm.code = ""
            valueForm.visible = false

        })
    } else {
        await api.admin.adminDictControllerCreate(valueForm.data).then(res => {
            getDictOptions(true,valueForm.data.type)
            valueForm.type = ""
            valueForm.code = ""
            valueFormRef.value?.resetFields()
            valueForm.visible = false
        })
    }
    return true
}

const deleteDict = (item: AdminDictTypeDto) => {
    api.admin.adminDictControllerRemoveType(item.type).then(res => {
        fetchData()
    })
}
const deleteDictValue = (item: AdminDictDto) => {
    api.admin.adminDictControllerRemove(item.type, item.code).then(res => {
        getDictOptions(true,item.type)
    })
}
</script>
<style scoped lang="scss">
.table-box{
	overflow-y: auto;
	overflow-x: hidden;
}
.show-child {
    position: absolute;
    right: 2px;
    top: 50%;
    transform: translateY(-50%);
    cursor: pointer;
    color: var(--color-text-3);
}
.dict-card{
    position: relative;
    overflow: hidden;
	margin-bottom: 16px;
}
.dict-card-badge{
    position: absolute;
    right: 0;
    top: 0;
    font-size: 10px;
    background-color: rgb(var(--primary-6));
    color: var(--color-neutral-1);
    padding: 2px 4px;
    border-bottom-left-radius: 6px;
}
</style>
