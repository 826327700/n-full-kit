import { defineStore, type _GettersTree } from 'pinia'

/**TestState模型 */
export interface TestState{
	/**数量 */
	counter: number
}
/**TestGetters模型 */
export interface AppGetters extends _GettersTree<TestState> {
	/**获取双倍数量 */
	doubleCount(state:TestState): number
}

export const useTestStore = defineStore('test', {
	state: ():TestState => ({
	 	counter: 0,
	}),
	getters:{
		doubleCount(state) {
			return state.counter * 2
		}
	} as AppGetters,
	actions: {
		/**增加 */
		add(num: number) {
			this.counter+=num
		},
		/**随机数字 */
		randomizeCounter() {
			this.counter = Math.round(100 * Math.random())
		},
	},
})
