<template>
	<Wapper>
		<a-form :model="queryFilter" layout="inline" class="no-margin">
			<a-form-item field="keyword" label="关键词">
				<a-input v-model="queryFilter.keyword" placeholder="请输入关键词搜索" style="width: 300px;"/>
			</a-form-item>
			<a-form-item>
				<a-button type="primary" @click="fetchData">搜索</a-button>
			</a-form-item>
		</a-form>
		<a-divider />
		<div class="table-box">
			<a-table
			:data="data"
			:loading="loading"
			:scroll="{ x: '100%', y: '100%', minWidth: '800px' }" stripe table-layout-fixed
			:pagination="{
				current: page,
				pageSize: pageSize,
				total: total
			}"
			@page-change="onPageChange"
			@page-size-change="onPageSizeChange"
			>
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
							<a-tag v-else color="red">禁用</a-tag>
						</template>
					</a-table-column>
					<a-table-column title="创建时间" data-index="createdAt">
						<template #cell="{ record }">
							{{ dayjs(record.createdAt).format('YYYY-MM-DD HH:mm:ss') }}
						</template>
					</a-table-column>
				</template>
			</a-table>
		</div>
	</Wapper>
</template>
<script setup lang="ts">
import { reactive } from 'vue';
import { usePaginatedQuery } from '@/common/hooks/query-list';
import {api} from '@/api';
import { AdminUserDto } from '@/api/api';
import dayjs from 'dayjs';

const queryFilter =reactive({
	keyword:""
})
const {data,page,pageSize,total,loading,onPageChange,onPageSizeChange,fetchData}
=usePaginatedQuery<AdminUserDto>(api.admin.adminUsersControllerFindAll,queryFilter)
</script>
<style lang="scss" scoped>

</style>
