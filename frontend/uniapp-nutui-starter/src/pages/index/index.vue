<template>
	<view class="content">
		<image class="logo" src="/static/logo.png" />
		<view class="text-area">
			<text class="title">{{ testStore.counter }}</text>
		</view>
		<nut-button type="primary" @click="testStore.randomizeCounter">
			随机数字
		</nut-button>
		<nut-button type="primary" @click="networkRequest">
			网络请求
		</nut-button>
	</view>
</template>

<script setup lang="ts">
import { useTestStore } from '@/store/test'
import { api } from '@/api'
const testStore = useTestStore()
const networkRequest = async () => {
	api.app.errorExampleControllerTestHttpError()
}
</script>

<style>
.content {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
}

.logo {
	height: 200rpx;
	width: 200rpx;
	margin-top: 200rpx;
	margin-left: auto;
	margin-right: auto;
	margin-bottom: 50rpx;
}

.text-area {
	display: flex;
	justify-content: center;
}

.title {
	font-size: 36rpx;
	color: #8f8f94;
}
</style>
