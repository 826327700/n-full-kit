import { onMounted, onUnmounted, onBeforeMount, onBeforeUnmount, onBeforeUpdate, onUpdated, onActivated, onDeactivated, onErrorCaptured } from 'vue'

export class ViewController {
	constructor(){
		// 挂载阶段
		onBeforeMount(this.onBeforeMount.bind(this))
		onMounted(this.onMounted.bind(this))

		// 更新阶段
		onBeforeUpdate(this.onBeforeUpdate.bind(this))
		onUpdated(this.onUpdated.bind(this))

		// 卸载阶段
		onBeforeUnmount(this.onBeforeUnmount.bind(this))
		onUnmounted(this.onUnmounted.bind(this))

		// keep-alive 相关
		onActivated(this.onActivated.bind(this))
		onDeactivated(this.onDeactivated.bind(this))

		// 错误处理
		onErrorCaptured(this.onErrorCaptured.bind(this))
	}

	// 挂载阶段
	protected onBeforeMount(): void {}
	protected onMounted(): void {}

	// 更新阶段
	protected onBeforeUpdate(): void {}
	protected onUpdated(): void {}

	// 卸载阶段
	protected onBeforeUnmount(): void {}
	protected onUnmounted(): void {}

	// keep-alive 相关
	protected onActivated(): void {}
	protected onDeactivated(): void {}

	// 错误处理
	protected onErrorCaptured(err: unknown, instance: unknown, info: string): boolean | void {}
}
