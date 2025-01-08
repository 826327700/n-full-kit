
<template>
	<div class="hello-world">
		<Versions></Versions>
		{{state.text}}
		<button @click="open" style="margin-top: 20px;">与主进程通信</button>
	</div>
</template>
<script setup lang="ts">
import { reactive } from 'vue';

import Versions from './components/Versions.vue'

const state=reactive({
	text:""
})
const open=async ()=>{
	state.text=await window.api.TestController.test({name:"N-Full-Kit"})
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
