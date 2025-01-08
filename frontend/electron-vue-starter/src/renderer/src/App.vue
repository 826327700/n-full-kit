
<template>
	<div class="hello-world">
		{{state.text}}
		<button @click="test" style="margin: 20px 0;">与主进程通信(invoke)</button>
		<button @click="test2" style="margin: 20px 0;">与主进程通信(send)</button>
		<Versions></Versions>
	</div>
</template>
<script setup lang="ts">
import { reactive } from 'vue';

import Versions from './components/Versions.vue'

const state=reactive({
	text:""
})
const test=async ()=>{
	state.text=await window.api.TestController.test({name:"N-Full-Kit"})
}
const test2=async()=>{
	window.api.TestController.test2({name:"N-Full-Kit"})
}
</script>
<style lang="scss" scoped>
.hello-world{
	width: 100%;
	height: 100vh;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
}
</style>
<style lang="less">
@import './assets/css/styles.less';
</style>
