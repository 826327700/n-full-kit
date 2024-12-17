<template>
	<a-card :bordered="false" class="no-padding aside flex-column">
		<div class="logo" v-if="!menuCollapsed">
			<div class="logo-inner"></div>
		</div>
		<div class="menus">
			<a-menu :style="{ width: '220px', height: '100%' }" v-model:selectedKeys="state.selectedKeys"
				v-model:openKeys="state.openKeys" show-collapse-button breakpoint="xl" v-model:collapsed="menuCollapsed"
				@menuItemClick="onClickMenuItem">
				<template v-for="item in menus">
					<template v-if="!item.meta?.hideInMenu">
						<a-sub-menu v-if="item.children && item.children.length > 0" :key="(item.name as string)">
							<template #title>
								<span>
									<component v-if="item.meta?.icon" :is="item.meta.icon" size="16"
										style="margin-right: 12px;"></component>
									<span>{{ item.label }}</span>
								</span>
							</template>
							<template v-for="(child) in item.children">
								<a-menu-item v-if="!child.meta?.hideInMenu" :key="(child.name as string)">
									<component v-if="child.meta?.icon" :is="child.meta?.icon" size="16"
										style="margin-right: 12px;"></component>
									<span v-else style="width: 14px;display: inline-block;"></span>
									<span>{{ child.label }}</span>
								</a-menu-item>
							</template>
						</a-sub-menu>
						<template v-else>
							<a-menu-item :key="(item.name as string)">
								<component v-if="item.meta?.icon" :is="item.meta.icon" size="16"
									style="margin-right: 12px;"></component>
								<span>{{ item.label }}</span>
							</a-menu-item>
						</template>
					</template>
				</template>
			</a-menu>
		</div>
	</a-card>
</template>

<script setup lang="ts">
import { router } from '@/routes';
import { computed, reactive, watch } from 'vue';
import { RouteRecordName } from 'vue-router';
import { menuCollapsed } from './frame';

interface MenuItem {
	label: string;
	path: string;
	name: string;
	meta?: {
		icon?: string;
		hideInMenu?: boolean;
	};
	children: MenuItem[];
}
const state: {
	selectedKeys: RouteRecordName[],
	openKeys: RouteRecordName[],
} = reactive({
	selectedKeys: [],
	openKeys: [],
});

watch(() => router.currentRoute.value, (newVal) => {
	state.selectedKeys = [newVal.name as RouteRecordName]
	state.openKeys = newVal.matched.map((item) => item.name!);
}, { immediate: true })

const menus = computed(() => {
	let rootRoutes = router.getRoutes().find((item: any) => item.name === 'root')?.children
	let arr: (MenuItem | undefined)[] = []
	let res: MenuItem[] = []
	const createMenu = (item: any) => {
		if (item.meta?.hideInMenu) {
			return
		}
		return {
			name: item.name,
			label: item.meta?.title,
			meta: item.meta,
			path: item.path,
			children: item.children ? item.children.map((child: any) => createMenu(child)).filter((item: any) => item) : []
		} as MenuItem
	}
	if (!rootRoutes) return res
	for (const route of rootRoutes) {
		arr.push(createMenu(route))
	}
	res = arr.filter((item: any) => item) as MenuItem[]
	return res
})

const onClickMenuItem = (key: string) => {
	router.push({ name: key })
}
</script>
<style scoped lang="scss">
.aside {
	height: 100%;
	display: flex;
	flex-direction: column;
	overflow: hidden;

	.logo {
		box-sizing: border-box;
		height: 62px;
		padding: 10px 16px;

		.logo-inner {
			height: 100%;
			width: 100%;
			background-color: #f5f5f5;
			transition: background-color 0.3s ease-in-out;
		}
	}

	.menus {
		flex: 1;
		overflow-y: auto;
		overflow-x: hidden;

	}
}
</style>