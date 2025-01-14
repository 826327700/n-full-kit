# 主进程相关

## 1. 架构概述
主进程采用NestJS框架，借助`@doubleshot/nest-electron`库使用微服务架构，通过Electron IPC与渲染进程通信。   
选用NestJS的理由：
- 模块化架构：便于功能解耦和扩展
- 依赖注入：简化服务管理和测试
- 强大的中间件支持：易于实现日志、异常处理等横切关注点
- TypeScript原生支持：提供更好的类型安全和开发体验
- 丰富的生态系统：可复用大量NestJS生态中的模块和工具

## 2. 进程间通信
传统的electron`主进程`与`渲染进程`通信步骤：
1. 在主进程定义`ipcMain.handle('a', b)`
   - `a`指代`通信key`
   - `b`指代`实际处理方法`
2. 在`preload`预加载脚本中声明`c: () => ipcRenderer.invoke('a')`
   - `c`指代`声明一个给渲染进程调用的方法名`
3. 在`渲染进程`中调用`window.xxx.c`
   - `xxx`指代预加载脚本中的接口组名   

`ipcMain.on`同理。   
示例代码如下：
::: code-group
```ts [主进程 index.ts]
//...
ipcMain.handle('a', ()=>console.log('call main process a'))
//...
```
```ts [预加载 preload.ts]
//...
contextBridge.exposeInMainWorld('electronAPI', {
  c: () => ipcRenderer.invoke('a')
})
//...
```
```ts [渲染进程 App.vue]
//...
window.electronAPI.c()
//...
```
:::

本模板`主进程`与`渲染进程`通信步骤：
1. 正常使用`NestJS`的`controller`，在`controller`的方法上使用`@BindIpcHandle`或`@BindIpcOn`装饰器
2. 运行`npm run preload`生成`preload`预加载脚本
3. 在`渲染进程`中调用`window.api.[controller].[method]`
   - `[controller]`是主进程中对应的`controller`类名
   - `[method]`是主进程中对应的`controller`下的方法名

示例代码如下：
::: code-group
```ts{8,13} [主进程 test.controller.ts]
//...
@Controller('/test')
export class TestController {
	constructor(
		private readonly testService:TestService
	){}

	@BindIpcHandle({key:"test1",description:"测试接口1"})
	test(@Payload() params: TestDto,@Ctx() { ipcEvt }: IpcContext){
		return this.testService.test(params)
	}

	@BindIpcOn({key:"test2",description:"测试接口2"})
	test2(@Payload() params: TestDto,@Ctx() { ipcEvt }: IpcContext){
		return this.testService.test2(params)
	}
}
```
```ts [预加载 preload/api.ts]
//...
//以下代码由npm run preload自动生成
export const api = {
    TestController: {
        test: (params: TestDto): Promise<string> => ipcRenderer.invoke('test/test1', params),
        test2: (params: TestDto): void => ipcRenderer.send('test/test2', params),
    },
};
```
```ts [渲染进程 App.vue]
//...
window.api.TestController.test()
//...
```
:::
**优势：**   
- 正常书写符合`NestJS`规范的代码，按模块区分，易于维护
- 节省手工书写`preload`预加载脚本的步骤
- 精确生成包括描述、传入参数、返回参数的TS类型，使得在渲染进程调用时直接有相应的提示

## 3. 异常处理
全局异常处理机制：
- 使用AllExceptionsFilter捕获所有异常
- 记录未捕获异常
- 记录未处理的Promise拒绝

## 4. 日志系统
日志配置：
- 日志级别：error
- 日志存储路径：~/Library/Application Support/{appName}/logs/main.log
- 支持开发环境调试日志


