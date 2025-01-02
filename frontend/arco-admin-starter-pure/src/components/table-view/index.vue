<template>
	<slot name="toolbar" :fetchData="fetchData"></slot>
	<a-divider />
	<div class="table-box">
		<a-table :data="data" :loading="loading" :scroll="{ x: '100%', y: '100%', minWidth: '800px' }" stripe
			table-layout-fixed :pagination="{
				current: page,
				pageSize: pageSize,
				total: total
			}" @page-change="onPageChange" @page-size-change="onPageSizeChange">
			<template #columns>
				<slot name="columns"></slot>
			</template>
		</a-table>
	</div>
</template>
<script setup lang="ts">
import { usePaginatedQuery } from '@/common/hooks/query-list';
import { Reactive, reactive } from 'vue';

const props = defineProps<{
	requestFn: (query: any) => Promise<any>,
	queryFilter:Reactive<any>
}>()
const {
	data,
	page,
	pageSize,
	total,
	loading,
	onPageChange,
	onPageSizeChange,
	fetchData
}=usePaginatedQuery<any>(props.requestFn,props.queryFilter)

defineExpose({
	fetchData
})
</script>
<style lang="scss" scoped></style>
