
import * as path from "path";
import { Project, Type, VariableDeclarationKind } from "ts-morph"

export class AutoBinding {
	project: Project
	constructor() {
		this.project = new Project({ tsConfigFilePath: "./tsconfig.node.json" })
		const map = this.scanController()
		this.generateApi(map)
	}

	scanController() {
		const sourceFiles = this.project.getSourceFiles()
		let controllerMap = {}
		let importMap = {}
		for (const sourceFile of sourceFiles) {
			sourceFile.getClasses().forEach(cls => {
				let controllerDeco = cls.getDecorator("Controller")
				if (!controllerDeco) return
				controllerMap[cls.getName()!] = {
					jsDocs: cls.getJsDocs(),
					methods: []
				}
				//@ts-ignore
				let controllerPath = controllerDeco.getArguments()[0].getLiteralValue()
				cls.getMethods().forEach(method => {
					let decorator = method.getDecorator("BindIpcHandle")||method.getDecorator("BindIpcOn")
					if (decorator) {
						//@ts-ignore
						let key = decorator.getArguments()[0].getProperty("key").getInitializer().getLiteralValue()
						//@ts-ignore
						let desc = decorator.getArguments()[0].getProperty("description").getInitializer().getLiteralValue()
						let ipcType=decorator.getName()=="BindIpcHandle"?"invoke":"send"
						method.getParameters().forEach(param => {
							param.getDecorators().forEach((decorator) => {
								if (decorator.getName() == "Payload") {
									let paramsTypeInfo = this.parseTypeInfo(param.getType())
									let returnTypeInfo = this.parseTypeInfo(method.getReturnType())
									const addToImportMap = (typeInfo) => {
										if (typeInfo.typeCategory === "Reference") {
											if (!importMap[typeInfo.referencePath!]) {
												importMap[typeInfo.referencePath!] = new Set();
											}
											importMap[typeInfo.referencePath!].add(typeInfo.typeName);
										}
									};
									addToImportMap(paramsTypeInfo);
									addToImportMap(returnTypeInfo);
									controllerMap[cls.getName()!].methods.push({
										invokeType:ipcType,
										invokeKey: [controllerPath.replace(/\//g, ''), key.replace(/\//g, '')].join("/"),
										methodName: method.getName(),
										methodDesc: desc,
										paramsName: param.getName(),
										paramsType: paramsTypeInfo.typeName,
										paramsIsArray: paramsTypeInfo.isArray,
										returnType: returnTypeInfo.typeName,
										returnIsArray: returnTypeInfo.isArray,
										returnPromise: returnTypeInfo.isPromise
									})
								}
							})
						})
					}
				})
			})
		}
		return {controllerMap,importMap}
	}

	parseTypeInfo(type: Type) {
		// 检查基础类型
		function isBasicType(type: Type): boolean {
			return type.isString() || type.isNumber() || type.isBoolean() || type.isNull() || type.isUndefined();
		}

		// 检查引用类型
		function isReferenceType(type: Type): boolean {
			return type.isObject() && !type.getText().startsWith("{");
		}
		let symbol = type.getSymbol();
		let isPromise = type.getSymbol()?.getName() === "Promise"

		// 检查是否为 Promise 类型
		if(isPromise){
			type=type.getTypeArguments()[0]
			symbol=type.getSymbol()
		}

		let isArray=type.isArray()
		if(isArray){
			type=type.getArrayElementType()!
			symbol=type.getSymbol()
		}

		// 检查是否为基础类型
		if (isBasicType(type)) {
			return {
				typeCategory: "Basic",
				typeName: type.getText(),
				isArray,
				isPromise
			};
		}

		// 检查是否为引用类型
		if (isReferenceType(type)) {
			const declaration = symbol?.getDeclarations()?.[0];
			const rootPath=this.project.getRootDirectories()[0].getPath()
			const referencePath = path.relative(path.join(rootPath,'src','preload'),declaration!.getSourceFile().getFilePath())
			return {
				typeCategory: "Reference",
				typeName: symbol?.getName(),
				referencePath,
				isArray,
				isPromise
			};
		}



		// 检查是否为匿名类型
		if (type.isObject() && type.getText().startsWith("{")) {
			return {
				typeCategory: "Anonymous",
				typeName: type.getText(),
				isArray,
				isPromise
			};
		}

		return {
			typeCategory: "Unknown",
			typeName: type.getText(),
			isPromise
		};
	}

	generateApi({controllerMap,importMap}) {
		let apiSourceFile = this.project.createSourceFile("src/preload/api.ts", undefined, { overwrite: true })
		apiSourceFile.addImportDeclaration({
			moduleSpecifier: "electron",
			namedImports: ["ipcRenderer"]
		})
		Object.keys(importMap).forEach(key => {
			apiSourceFile.addImportDeclaration({
				moduleSpecifier: key.replace(/\\/g, '/').replace(".ts", ""),
				namedImports: Array.from(importMap[key])
			})
		})

		// 辅助函数：生成 controller 的代码
		function generateControllerCode(controllerName, methods) {
			let controllerCode = `  ${controllerName}: {\n`;

			methods.forEach(method => {
				let returnType=method.invokeType=='invoke'?`${method.returnPromise ? `Promise<${method.returnType}${method.returnIsArray?'[]':''}>` : `${method.returnType}${method.returnIsArray?'[]':''}`}`:'void'
				controllerCode += `${method.methodName}: (${method.paramsName}: ${method.paramsType}${method.paramsIsArray?'[]':''}): ${returnType} => ipcRenderer.${method.invokeType}('${method.invokeKey}', ${method.paramsName}),\n`;
			});

			controllerCode += `  },\n`;
			return controllerCode;
		}

		apiSourceFile.addVariableStatement({
			isExported: true,
			declarationKind: VariableDeclarationKind.Const,
			declarations: [{
				name: "api",
				initializer: writer => {
					writer.write("{");
					// 使用循环动态生成多个 Controller
					Object.keys(controllerMap).forEach(controller => {
						writer.write(generateControllerCode(controller, controllerMap[controller].methods));
					})
					writer.write("}");
				}
			}]
		})
		apiSourceFile.formatText();
		apiSourceFile.saveSync()

		let apiTypeSourceFile=this.project.createSourceFile("src/preload/api.d.ts",undefined,{overwrite:true})
		Object.keys(importMap).forEach(key => {
			apiTypeSourceFile.addImportDeclaration({
				moduleSpecifier: key.replace(/\\/g, '/').replace(".ts", ""),
				namedImports: Array.from(importMap[key])
			})
		})

		apiTypeSourceFile.addInterface({
			name: "ApiInterface",
			isExported: true,
			properties: Object.keys(controllerMap).map(controller => {
				const methods = controllerMap[controller].methods.map(method => {
					let returnType=method.invokeType=='invoke'?`${method.returnPromise ? `Promise<${method.returnType}${method.returnIsArray?'[]':''}>` : `${method.returnType}${method.returnIsArray?'[]':''}`}`:'void'
					return `${method.methodDesc?'\n/** '+method.methodDesc+' */\n':''} ${method.methodName}: (${method.paramsName}: ${method.paramsType}${method.paramsIsArray?'[]':''}) => ${returnType}`;
				}).join("; \n");
				return {
					name: controller,
					docs: controllerMap[controller].jsDocs.map(jsDoc => jsDoc.getStructure()),
					type: `{${methods}}`
				}
			})
		})

		apiTypeSourceFile.formatText();
		apiTypeSourceFile.saveSync()
	}
}
new AutoBinding()
