<template>
	<Wapper>
		<TableView :request-fn="api.admin.adminUsersControllerFindAll" :query-filter="queryFilter" ref="toolbarRef">
			<template #toolbar="{ fetchData }">
				<a-form :model="queryFilter" layout="inline" class="no-margin">
					<a-form-item field="keyword" label="关键词">
						<a-input v-model="queryFilter.keyword" placeholder="请输入关键词搜索" style="width: 300px;"/>
					</a-form-item>
					<a-form-item>
						<a-space>
							<a-button type="primary" @click="fetchData" v-permissions="['admin.adminUsersControllerFindAll']">
								<template #icon>
									<icon-search />
								</template>
								搜索
							</a-button>
							<a-button status="success" @click="form.visible=true" v-permissions="['admin.adminUsersControllerCreate']">
								<template #icon>
									<icon-plus />
								</template>
								新增
							</a-button>
						</a-space>
					</a-form-item>
				</a-form>
			</template>
			<template #columns>
				<a-table-column title="用户名" data-index="username"></a-table-column>
					<a-table-column title="昵称" data-index="nickname"></a-table-column>
					<a-table-column title="所属角色" data-index="roles">
						<template #cell="{ record }">
							<a-tooltip v-for="item in record.roles" :key="item" :content="item.description">
								<a-tag color="blue">{{ item.name }}</a-tag>
							</a-tooltip>
						</template>
					</a-table-column>
					<a-table-column title="当前状态" data-index="status">
						<template #cell="{ record }">
							<a-tag v-if="record.status=='0'" color="green">启用</a-tag>
							<a-tag v-if="record.status=='1'"  color="red">禁用</a-tag>
						</template>
					</a-table-column>
					<a-table-column title="创建时间" data-index="createdAt">
						<template #cell="{ record }">
							{{ dayjs(record.createdAt).format('YYYY-MM-DD HH:mm:ss') }}
						</template>
					</a-table-column>
					<a-table-column title="操作" align="center">
						<template #cell="{ record }">
							<a-space>
								<a-link type="primary" @click="openEdit(record)" v-permissions="['admin.adminUsersControllerUpdate']"><icon-edit></icon-edit></a-link>
								<a-popconfirm content="该操作不可恢复，确认删除?" type="error" @ok="deleteRow(record.id)" >
									<a-link status="danger" v-permissions="['admin.adminUsersControllerRemove']"><icon-delete></icon-delete></a-link>
								</a-popconfirm>
							</a-space>
						</template>
					</a-table-column>
			</template>
		</TableView>

	</Wapper>

	<a-modal v-model:visible="form.visible" :title="form.id?'编辑用户':'新增用户'" :on-before-ok="submit" @close="onFormModalClose">
		<a-form :model="form.data" ref="formRef">
			<a-form-item label="用户名" field="username" :rules="[{ required: true, message: '请输入用户名' }]">
				<a-input :disabled="!!form.id" v-model="form.data.username" placeholder="请输入用户名"></a-input>
			</a-form-item>
			<a-form-item label="密码" field="password" :rules="[{ required: !form.id, message: '请输入密码' }]">
				<a-input-password v-model="form.data.password" placeholder="请输入密码"></a-input-password>
			</a-form-item>
			<a-form-item label="昵称" field="nickname" :rules="[{ required: true, message: '请输入昵称' }]">
				<a-input v-model="form.data.nickname" placeholder="请输入昵称"></a-input>
			</a-form-item>
			<a-form-item label="所属角色" field="roles" :rules="[{ required: true, message: '请选择所属角色' }]">
				<a-select v-model="form.data.roles" placeholder="请选择所属角色" multiple>
					<a-option v-for="item in roles" :key="item.id" :value="item.id" :label="item.name"></a-option>
				</a-select>
			</a-form-item>
			<a-form-item label="是否启用" field="status" >
				<a-switch checked-value="0" unchecked-value="1" v-model="form.data.status"></a-switch>
			</a-form-item>
		</a-form>
	</a-modal>
</template>
<script setup lang="ts">
import { onMounted, reactive, ref, useTemplateRef } from 'vue';
import {api} from '@/api';
import { AdminRoleDto, AdminUserDto } from '@/api/api';
import TableView from '@/components/table-view/index.vue';
import dayjs from 'dayjs';
import { Form } from '@arco-design/web-vue';

const queryFilter =reactive({
	keyword:""
})
const roles=ref<AdminRoleDto[]>([])
onMounted(()=>{
	api.admin.adminRolesControllerFindAll({pageSize:9999}).then(res=>{
		roles.value=res.data.data!.list
	})
})

const toolbarRef = useTemplateRef<InstanceType<typeof TableView>>("toolbarRef")
const formRef=useTemplateRef<InstanceType<typeof Form>>("formRef")
const form=reactive<any>({
	visible:false,
	id:"",
	data:{
		nickname:"",
		username:"",
		password:"",
		roles:[],
		status:"0"
	}
})
const submit=async ()=>{
	let err=await formRef.value?.validate()
	if(err){
		return false
	}
	if(form.id){
		api.admin.adminUsersControllerUpdate(form.id,form.data).then(res=>{
			form.id=""
			form.visible=false
			toolbarRef.value?.fetchData()
		})
	}else{
		api.admin.adminUsersControllerCreate(form.data).then(res=>{
			form.visible=false
			toolbarRef.value?.fetchData()
		})
	}
}

const onFormModalClose=()=>{
	formRef.value?.resetFields()
	form.id=""
}

const openEdit=(item:AdminUserDto)=>{
	form.id=item.id
	form.data.nickname=item.nickname
	form.data.username=item.username
	form.data.password=""
	form.data.roles=item.roles.map(item=>item.id)
	form.data.status=item.status
	form.visible=true
}

const deleteRow=(id:string)=>{
	api.admin.adminUsersControllerRemove(id).then(res=>{
		toolbarRef.value?.fetchData()
	})
}
</script>
<style lang="scss" scoped>

</style>
