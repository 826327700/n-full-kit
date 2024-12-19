<template>
	<Wapper>
		<TableView :request-fn="api.admin.adminRolesControllerFindAll" :query-filter="queryFilter" ref="toolbarRef">
			<template #toolbar="{ fetchData }">
				<a-form :model="queryFilter" layout="inline" class="no-margin">
					<a-form-item field="keyword" label="关键词">
						<a-input v-model="queryFilter.keyword" placeholder="请输入关键词搜索" style="width: 300px;" />
					</a-form-item>
					<a-form-item>
						<a-space>
							<a-button type="primary" @click="fetchData" v-permissions="['admin.adminRolesControllerFindAll']">
								<template #icon>
									<icon-search />
								</template>
								搜索
							</a-button>
							<a-button status="success" @click="form.visible = true" v-permissions="['admin.adminRolesControllerCreate']">
								<template #icon>
									<icon-plus />
								</template>
								新增
							</a-button>
							<a-button status="warning" @click="updateMenu" v-permissions="['admin.adminRolesControllerUpdateAllMenus']">
								<template #icon>
									<icon-sync />
								</template>
								更新菜单
							</a-button>
						</a-space>
					</a-form-item>
				</a-form>
			</template>
			<template #columns>
				<a-table-column title="角色名称" data-index="name"></a-table-column>
				<a-table-column title="角色描述" data-index="description" align="center"></a-table-column>
				<a-table-column title="可见菜单" data-index="menus" align="center">
					<template #cell="{ record }">
						<a-link>{{ record.menus.length }}</a-link>
					</template>
				</a-table-column>
				<a-table-column title="绑定权限" data-index="permissions">
					<template #cell="{ record }">
						<a-link>{{ record.permissions.length }}</a-link>
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
							<a-link type="primary" @click="openEdit(record)" v-permissions="['admin.adminRolesControllerUpdate']"><icon-edit></icon-edit></a-link>
							<a-popconfirm content="该操作不可恢复，确认删除?" type="error" @ok="deleteRow(record._id)">
								<a-link status="danger" v-permissions="['admin.adminRolesControllerRemove']"><icon-delete></icon-delete></a-link>
							</a-popconfirm>
						</a-space>
					</template>
				</a-table-column>
			</template>
		</TableView>
	</Wapper>

	<a-modal width="800px" v-model:visible="form.visible" :title="form.id ? '编辑角色' : '新增角色'" :on-before-ok="submit"
		@close="onFormModalClose">
		<a-form :model="form.data" ref="formRef" auto-label-width>
			<a-form-item label="角色名称" field="name" :rules="[{ required: true, message: '请输入角色名称' }]">
				<a-input v-model="form.data.name" placeholder="请输入角色名称"></a-input>
			</a-form-item>
			<a-form-item label="角色描述" field="description" >
				<a-input v-model="form.data.description" placeholder="请输入角色描述，可选"></a-input>
			</a-form-item>

			<a-form-item label="是否启用" field="status">
				<a-switch checked-value="0" unchecked-value="1" v-model="form.data.status"></a-switch>
			</a-form-item>
			<a-row :gutter="16">
				<a-col :span="12">
					<a-form-item label="可见菜单">
						<div style="width:100%;max-height: 600px;overflow-y: auto;">
							<a-tree :checkable="true" v-model:checked-keys="form.data.menus"
							@check="onMenusCheck"
								:check-strictly="false" :default-expand-all="true" checked-strategy="all" :data="menusTree" />
						</div>
					</a-form-item>
				</a-col>
				<a-col :span="12">
					<a-form-item label="拥有权限">
						<div style="width:100%;max-height: 600px;overflow-y: auto;">
							<a-tree :checkable="true" v-model:checked-keys="form.data.permissions"
								:check-strictly="false" :default-expand-all="true" checked-strategy="all" :data="permissionsTree" />
						</div>
					</a-form-item>
				</a-col>
			</a-row>
		</a-form>
	</a-modal>
</template>
<script setup lang="ts">
import { api } from '@/api';
import { AdminMenuItem, AdminPermissionItemDto, AdminRoleDto, CreateAdminRoleDto } from '@/api/api';
import TableView from '@/components/table-view/index.vue';
import { router } from '@/routes';
import { Form, Message } from '@arco-design/web-vue';
import dayjs from 'dayjs';
import { onMounted, reactive, ref, useTemplateRef } from 'vue';
import { RouteRecordRaw } from 'vue-router';

const queryFilter = reactive({
	keyword: ''
})
const toolbarRef = useTemplateRef<InstanceType<typeof TableView>>("toolbarRef")
const formRef = useTemplateRef<InstanceType<typeof Form>>("formRef")
const form = reactive<{
	visible: boolean,
	id: string
	data: CreateAdminRoleDto
}>({
	visible: false,
	id: "",
	data: {
		name: "",
		description: "",
		permissions: [],
		menus: [],
		status: "0"
	}
})
let menusFlat:AdminMenuItem[] = []
let menusTree = ref<TreeItem[]>([])
let permissionsFlat:AdminPermissionItemDto[] = []
let permissionsTree = ref<TreeItem[]>([])
onMounted(() => {
	api.admin.adminRolesControllerFindAllPermissions().then(res => {
		permissionsFlat=res.data.data
		permissionsTree.value = buildPermissionsTree(res.data.data)
	})
	refreshMenus()
})

type TreeItem = {
	title: string;
	key: string;
	children: Array<{
		title: string;
		key: string;
	}>;
	[x:string]:any
};
const buildPermissionsTree = (data: AdminPermissionItemDto[]) => {
	const groupedMap = new Map<string, TreeItem>();
	data.forEach(item => {
		const groupKey = item.group;
		const groupDescription = item.groupDescription;

		if (!groupedMap.has(groupDescription)) {
			groupedMap.set(groupDescription, {
				title: groupDescription,
				key: groupKey,
				children: []
			});
		}
		const groupItem = groupedMap.get(groupDescription);
		if (groupItem) {
			groupItem.children.push({
				title: item.description,
				key: item.key
			});
		}
	});
	return Array.from(groupedMap.values());
}

const buildMenusTree = (routes: Route[]): TreeItem[] => {
	const map: { [key: string]: TreeItem } = {};
	const tree: TreeItem[] = [];

	// 将所有路由项加入到 map 中
	routes.forEach(route => {
		map[route.name] = { title:route.title,key:route.name,permissions:route.permissions, children: [] };
	});

	// 将每个路由项根据 parentName 组织成树结构
	routes.forEach(route => {
		if (route.parentName === '') {
			// 如果 parentName 为空，则是根节点，直接加入 tree
			tree.push(map[route.name]);
		} else {
			// 如果 parentName 不为空，找到父节点并加入 children
			const parent = map[route.parentName];
			if (parent) {
				parent.children?.push(map[route.name]);
			}
		}
	});

	return tree;
}

const onMenusCheck=(keys:any[])=>{
	let permissions:string[]=[]
	keys.forEach(key=>{
		let menu=menusFlat.find(item=>item.name==key)
		permissions.push(...menu?.permissions||[])
	})
	form.data.permissions=permissions
}

const submit = async () => {
	let err = await formRef.value?.validate()
	if (err) {
		return false
	}
	if (form.id) {
		await api.admin.adminRolesControllerUpdate(form.id, form.data).then(res => {
			form.id = ""
			form.visible = false
			toolbarRef.value?.fetchData()
		})
	} else {
		await api.admin.adminRolesControllerCreate(form.data).then(res => {
			form.visible = false
			toolbarRef.value?.fetchData()
		})
	}
	return true
}

const onFormModalClose = () => {
	formRef.value?.resetFields()
	form.id = ""
}

const openEdit=(item:AdminRoleDto)=>{
	form.id=item._id
	form.data.name=item.name
	form.data.description=item.description
	form.data.menus=item.menus
	form.data.permissions=item.permissions
	form.data.status=item.status
	form.visible=true

	onMenusCheck(form.data.menus)
}

const deleteRow=(id:string)=>{
	api.admin.adminRolesControllerRemove(id).then(res=>{
		toolbarRef.value?.fetchData()
	})
}

const updateMenu = () => {
	let rootRoutes = router.getRoutes().find((item: any) => item.name === 'root')!.children
	let flatMenus: any[] = []
	const flat = (routes: RouteRecordRaw[], parentName?: string) => {
		for (const route of routes) {
			if (route.children && route.children.length > 0) {
				flatMenus.push({
					name: route.name,
					path: route.path,
					title: route.meta?.title || '',
					permissions: [],
					parentName: parentName
				})
				flat(route.children, route.name as string)
			} else {
				flatMenus.push({
					name: route.name,
					path: route.path,
					title: route.meta?.title || '',
					permissions: route.meta?.permissions || [],
					parentName: parentName
				})
			}
		}
	}
	flat(rootRoutes, '')
	api.admin.adminRolesControllerUpdateAllMenus({menus:flatMenus}).then(res=>{
		Message.success('更新成功')
		refreshMenus()
	})
}
const refreshMenus = () => {
	api.admin.adminRolesControllerFindAllMenus().then(res => {
		menusFlat=res.data.data
		menusTree.value=buildMenusTree(res.data.data as unknown as Route[])
	})
}

type Route = {
	name: string;
	path: string;
	title: string;
	permissions: string[];
	parentName: string;
	children?: Route[];
};

</script>
<style lang="scss" scoped></style>
