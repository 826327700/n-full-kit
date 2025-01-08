import * as ts from 'typescript';
const fs = require('fs');
const path = require('path');

export class SearchClass {
	depsLogs={}

	searchClass(pattern:string) {
		let dir="./src/main"
		let that = this
		function searchFiles(dir, pattern) {
			const files = fs.readdirSync(dir);
			for (const file of files) {
				const filePath = path.join(dir, file);
				const stat = fs.statSync(filePath);

				if (stat.isDirectory()) {
					searchFiles(filePath, pattern);
				} else if (stat.isFile() && file.endsWith('.ts')) {
					let content = fs.readFileSync(filePath, 'utf-8');
					that.getDepsAndPath(content, pattern,filePath)
				}
			}
		}
		searchFiles(dir, pattern)
		return this.depsLogs
	}

	getDepsAndPath(code: string, findName: string,filePath:string) {
		// 解析代码
		let sourceFile = ts.createSourceFile('file.ts', code, ts.ScriptTarget.ESNext, true);
		// 遍历 AST，找到所有的 class 和 interface
		ts.forEachChild(sourceFile, node => {
			if (ts.isClassDeclaration(node) || ts.isInterfaceDeclaration(node) || ts.isEnumDeclaration(node)||ts.isTypeAliasDeclaration(node)) {
				if (node?.name?.text == findName) {
					if(this.depsLogs[filePath]){
						this.depsLogs[filePath].push(findName)
					}else{
						this.depsLogs[filePath]=[findName]
					}
				}
			}
		});
	}

	getMemberTypeFromAST(code) {
		let importClass :any[]= []
		const sourceFile = ts.createSourceFile(
			'file.ts', // 文件名
			code,      // 文件内容
			ts.ScriptTarget.Latest, // 目标 ECMAScript 版本
			true       // 是否设置为严格模式
		);
		// 遍历 AST（抽象语法树）
		ts.forEachChild(sourceFile, (node) => {
			if (ts.isClassDeclaration(node) || ts.isInterfaceDeclaration(node) || ts.isEnumDeclaration(node)) {
				node.members.forEach((member) => {
					let propertyName = member.name.getText(sourceFile);
					let propertyType = member.type?.getText(sourceFile);
					if (propertyType == undefined) {
						// console.log(`属性名undefined: ${propertyName}`);
						propertyType = propertyName
					} else {
						propertyType = propertyType.replace("[]", "")
						if (propertyType != "string" && propertyType != "number" && propertyType != "string | number" && propertyType != "boolean" && propertyType != "Date" && propertyType != "any" && !propertyType.startsWith("{")) {
							importClass.push(propertyType)
						}
						if (propertyType.startsWith("{")) {
							let childDeps = this.getMemberTypeFromAST('interface Child ' + propertyType)
							importClass.push(...childDeps)
						}
					}
				});
			}
		});
		return importClass
	}
}
