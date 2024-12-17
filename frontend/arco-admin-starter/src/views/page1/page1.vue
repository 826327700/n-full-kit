<template>
	<Wapper>
		<a-form layout="inline" class="no-margin">
			<a-form-item field="keyword" label="关键词">
				<a-input placeholder="请输入关键词搜索" style="width: 300px;"/>
			</a-form-item>
			<a-form-item>
				<a-button type="primary">搜索</a-button>
			</a-form-item>
		</a-form>
		<a-divider />
		<div class="table-box">
			<a-table :columns="columns" :data="data" :scroll="{ x: '120%', y: '100%', minWidth: '100%' }" stripe
				table-layout-fixed />
		</div>
	</Wapper>
</template>

<script setup lang="ts">
import Wapper from '@/components/frame/wapper.vue';
import { reactive, ref } from 'vue'
const columns = [
	{
		title: 'Name',
		dataIndex: 'name',
	},
	{
		title: 'Salary',
		dataIndex: 'salary',
	},
	{
		title: 'Address',
		dataIndex: 'address',
		width: '300px'
	},
	{
		title: 'Email',
		dataIndex: 'email',
	},
	{
		title: 'Name',
		dataIndex: 'name',
	},
	{
		title: 'Salary',
		dataIndex: 'salary',
	},
	{
		title: 'Address',
		dataIndex: 'address',
	},
	{
		title: 'Email',
		dataIndex: 'email',
	},
	{
		title: 'Name',
		dataIndex: 'name',
	},
	{
		title: 'Salary',
		dataIndex: 'salary',
	},
	{
		title: 'Address',
		dataIndex: 'address',
	},
	{
		title: 'Email',
		dataIndex: 'email',
		width: 200,
		fixed: 'right'
	},
];
const data = reactive([{
	key: '1',
	name: 'Jane Doe',
	salary: 23000,
	address: '32 Park Road, London',
	email: 'jane.doe@example.com'
}, {
	key: '2',
	name: 'Alisa Ross',
	salary: 25000,
	address: '35 Park Road, London',
	email: 'alisa.ross@example.com'
}, {
	key: '3',
	name: 'Kevin Sandra',
	salary: 22000,
	address: '31 Park Road, London',
	email: 'kevin.sandra@example.com'
}, {
	key: '4',
	name: 'Ed Hellen',
	salary: 17000,
	address: '42 Park Road, London',
	email: 'ed.hellen@example.com'
}, {
	key: '5',
	name: 'William Smith',
	salary: 27000,
	address: '62 Park Road, London',
	email: 'william.smith@example.com'
}, {
	key: '1',
	name: 'Jane Doe',
	salary: 23000,
	address: '32 Park Road, London',
	email: 'jane.doe@example.com'
}, {
	key: '2',
	name: 'Alisa Ross',
	salary: 25000,
	address: '35 Park Road, London',
	email: 'alisa.ross@example.com'
}, {
	key: '3',
	name: 'Kevin Sandra',
	salary: 22000,
	address: '31 Park Road, London',
	email: 'kevin.sandra@example.com'
}, {
	key: '4',
	name: 'Ed Hellen',
	salary: 17000,
	address: '42 Park Road, London',
	email: 'ed.hellen@example.com'
}, {
	key: '5',
	name: 'William Smith',
	salary: 27000,
	address: '62 Park Road, London',
	email: 'william.smith@example.com'
}, {
	key: '1',
	name: 'Jane Doe',
	salary: 23000,
	address: '32 Park Road, London',
	email: 'jane.doe@example.com'
}, {
	key: '2',
	name: 'Alisa Ross',
	salary: 25000,
	address: '35 Park Road, London',
	email: 'alisa.ross@example.com'
}, {
	key: '3',
	name: 'Kevin Sandra',
	salary: 22000,
	address: '31 Park Road, London',
	email: 'kevin.sandra@example.com'
}, {
	key: '4',
	name: 'Ed Hellen',
	salary: 17000,
	address: '42 Park Road, London',
	email: 'ed.hellen@example.com'
}, {
	key: '5',
	name: 'William Smith',
	salary: 27000,
	address: '62 Park Road, London',
	email: 'william.smith@example.com'
}]);
const currentChange = (val: number) => {
	console.log('current-change', val)
}
const sizeChange = (val: number) => {
	console.log('size-change', val)
}

</script>
<style scoped lang="scss">
.table-box {
	flex: 1;
	height: 0;
	width: 100%;
}
</style>