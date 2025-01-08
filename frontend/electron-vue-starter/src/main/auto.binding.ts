import { Inject, Module, OnModuleInit } from "@nestjs/common";
import { DiscoveryService, ModulesContainer, Reflector } from '@nestjs/core';
import * as ts from 'typescript';
import { is } from "@electron-toolkit/utils";
import { METHOD_METADATA, PATH_METADATA } from "@nestjs/common/constants";
import { DecoratorConstant } from "./decorators/bind-renderer-method";
import { SearchClass } from './utils/search-class';
import fs from 'fs';

@Module({
	providers: [
		DiscoveryService
	]
})
export class AutoBinding implements OnModuleInit{
	constructor(
		private readonly discoveryService: DiscoveryService,
		private readonly modulesContainer: ModulesContainer,
		@Inject(Reflector) private readonly reflector: Reflector,
	){}

	onModuleInit() {
		if(is.dev){
			this.bindHandle("AppModule");
		}
	}

	bindHandle(module:string){
		let allModules = [...this.modulesContainer.values()]
		let targetModule = allModules.find(item => item.name == module)
		// let targetModuleArr = [targetModule,...targetModule.imports]
		let targetModuleArr = [targetModule]
		let flatTargetModuleArr = []
		for (let i = 0; i < targetModuleArr.length; i++) {
			let moduleItem = targetModuleArr[i];
			flatTargetModuleArr.push(moduleItem)
			flatTargetModuleArr.push([...moduleItem.imports])
		}
		flatTargetModuleArr = flatTargetModuleArr.flat()
		// console.log(flatTargetModuleArr.map(item=>item.name))
		let controllers = this.discoveryService.getControllers({}, flatTargetModuleArr);
		// console.log(controllers.map(item=>item.name))

		let depsLogs={}
		let controllerLogs={}

		for (let i = 0; i < controllers.length; i++) {
			let controller = controllers[i];
			let controllerPath = Reflect.getMetadata(PATH_METADATA, controller.instance.constructor)
			const methods = Object.getOwnPropertyNames(Object.getPrototypeOf(controller.instance));
			for (const methodName of methods) {
				if(methodName!="constructor"){
					const method = controller.instance[methodName];
					if(typeof method=="function"){
						let shouldBindIpc = this.reflector.get<string>(DecoratorConstant.bind_ipc, method);
						if(shouldBindIpc){
							controllerPath=controllerPath=="/"?"":controllerPath
							let exportRendererName = [controllerPath,shouldBindIpc].filter(item=>item!="").join("/");
							let bindType = this.reflector.get<string>(DecoratorConstant.bind_ipc_type, method);
							let description = this.reflector.get<string>(DecoratorConstant.method_description, method);
							let paramsInterfaceName = this.reflector.get<string>(DecoratorConstant.params_interface_name, method);
							let returnInterfaceName = this.reflector.get<string>(DecoratorConstant.return_interface_name, method);
							let paramsInterfaceArr=paramsInterfaceName.replace("[]","").split(',')
							let deps2=new SearchClass().searchClass(returnInterfaceName.replace("[]",""))
							let methodInfo={
								bindType,
								description,
								methodName,
								exportRendererName,
								paramsInterfaceName,
								returnInterfaceName,
							}
							if(controllerLogs[controller.name]){
								controllerLogs[controller.name].push(methodInfo)
							}else{
								controllerLogs[controller.name]=[methodInfo]
							}
							for (let index = 0; index < paramsInterfaceArr.length; index++) {
								let str = paramsInterfaceArr[index];
								let interfaceName=str
								if(str.includes(":")){
									interfaceName=str.split(":")[1]
								}
								let deps=new SearchClass().searchClass(interfaceName)
								for (const key in deps) {
									if(depsLogs[key]){
										depsLogs[key].push(...deps[key])
									}else{
										depsLogs[key]=deps[key]
									}
								}

							}
							for (const key in deps2) {
								if(depsLogs[key]){
									depsLogs[key].push(...deps2[key])
								}else{
									depsLogs[key]=deps2[key]
								}
							}
						}
					}
				}
			}
		}

		if(is.dev){
			this.updatePreloadFile(depsLogs,controllerLogs)
			this.updatePreloadTypes(depsLogs,controllerLogs)
		}
	}

	updatePreloadFile(depsLogs,controllerLogs){
		let content=`
		import { ipcRenderer } from "electron";
		#importRows#
		export const exportApi = {
			#methodsRows#
		}
		`;
		let importSection=''
		for (const key in depsLogs) {
			let pathStr=key.replace(/\\/g, '/').replace("src/","../")
			pathStr=pathStr.substring(0, pathStr.lastIndexOf("."));
			importSection+=`import { ${[...new Set(depsLogs[key])].join(',')} } from "${pathStr}";\n`
		}
		let methodsSection=''
		const generateParamsText=(str)=>{
			if(str.includes(":")){
				return str
			}else{
				return "params:"+str
			}
		}
		const generateParamsText2=(str)=>{
			if(str.includes(":")){
				return str.split(":")[0]
			}else{
				return "params"
			}
		}
		for (const key in controllerLogs) {
			methodsSection+=`${key}: {
				${controllerLogs[key].map(item=>{
					let reutrnString=`Promise<${item.returnInterfaceName}>`
					if(item.bindType=="send"){
						reutrnString='void'
					}

					if(item.paramsInterfaceName=="null"){
						return `${item.methodName}:():${reutrnString}=>ipcRenderer.${item.bindType}('${item.exportRendererName}')\n`
					}else{
						let paramsInterfaceArr=[]
						if(item.paramsInterfaceName.includes(",")){
							paramsInterfaceArr=item.paramsInterfaceName.split(",")
						}else{
							paramsInterfaceArr=[item.paramsInterfaceName]
						}
						return `${item.methodName}:(${
							paramsInterfaceArr.length>1?paramsInterfaceArr.map((item,index)=>generateParamsText(item)).join(','):generateParamsText(paramsInterfaceArr[0])
						}):${reutrnString}=>ipcRenderer.${item.bindType}('${item.exportRendererName}',${paramsInterfaceArr.map((item,index)=>generateParamsText2(item)).join(',')})\n`
					}
				}).join(',')}
			},\n`
		}

		content=content.replace("#importRows#",importSection)
		content=content.replace("#methodsRows#",methodsSection)
		// 格式化代码
		let resFile = ts.createSourceFile(
			'format.ts',
			content,
			ts.ScriptTarget.Latest,
			true
		);
		let compilerOptions = ts.getDefaultCompilerOptions();
		compilerOptions.indentSize = 4;
		compilerOptions.tabSize = 4;
		let printer = ts.createPrinter({ newLine: ts.NewLineKind.LineFeed, ...compilerOptions })
		let formattedCode = printer.printFile(resFile);
		fs.writeFileSync("./src/preload/export.ts",formattedCode)
	}

	updatePreloadTypes(depsLogs,controllerLogs){
		let content=`
		#importRows#
		export interface ExportInterface {
			#methodsRows#
		}
		`;
		let importSection=''
		for (const key in depsLogs) {
			let pathStr=key.replace(/\\/g, '/').replace("src/","../")
			pathStr=pathStr.substring(0, pathStr.lastIndexOf("."));
			importSection+=`import { ${[...new Set(depsLogs[key])].join(',')} } from "${pathStr}";\n`
		}
		let methodsSection=''
		const generateParamsText=(str)=>{
			if(str.includes(":")){
				return str
			}else{
				return "params:"+str
			}
		}
		for (const key in controllerLogs) {
			methodsSection+=`${key}: {
				${controllerLogs[key].map(item=>{
					let desc=``
					if(item.description){
						desc=`\n/**${item.description}*/\n`
					}
					if(item.paramsInterfaceName=="null"){
						return `${desc}${item.methodName}:()=>Promise<${item.returnInterfaceName}>\n`
					}else{
						let paramsInterfaceArr=[]
						if(item.paramsInterfaceName.includes(",")){
							paramsInterfaceArr=item.paramsInterfaceName.split(",")
						}else{
							paramsInterfaceArr=[item.paramsInterfaceName]
						}
						return `${desc}${item.methodName}:(${
							paramsInterfaceArr.length>1?paramsInterfaceArr.map((item,index)=>generateParamsText(item)).join(','):generateParamsText(paramsInterfaceArr[0])
						})=>Promise<${item.returnInterfaceName}>\n`
					}
				}).join(',')}
			},\n`
		}
		content=content.replace("#importRows#",importSection)
		content=content.replace("#methodsRows#",methodsSection)
		// 格式化代码
		let resFile = ts.createSourceFile(
			'format.ts',
			content,
			ts.ScriptTarget.Latest,
			true
		);
		let compilerOptions = ts.getDefaultCompilerOptions();
		compilerOptions.indentSize = 4;
		compilerOptions.tabSize = 4;
		let printer = ts.createPrinter({ newLine: ts.NewLineKind.LineFeed, ...compilerOptions })
		let formattedCode = printer.printFile(resFile);
		fs.writeFileSync("./src/preload/export.d.ts",formattedCode)
	}
}
