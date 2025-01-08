import { Command, CommandRunner } from "nest-commander";
import { execSync } from 'child_process';
import * as inquirer from 'inquirer';
import * as path from 'path';
import * as fs from 'fs';
import * as chalk from 'chalk'; 
import * as ora from 'ora';
import { downloadTemplate } from "./common";

@Command({ name: 'create', description: 'Create a new project from a template / 从模板创建一个新项目' })
export class CreateCommand extends CommandRunner {
	private templateMap=new Map([
		["NestJS+Mysql","backend/nestjs-starter-mysql"],
		["NestJS+Mongo","backend/nestjs-starter-mongo"],
		["Vue3+Arco Design Admin","frontend/arco-admin-starter"],
		["Vue3+Arco Design Admin pure","frontend/arco-admin-starter-pure"],
		["Flutter+GetX","frontend/flutter_starter"],
		["Uniapp+NutUI","frontend/uniapp-nutui-starter"],
		["Electron+Vue+Nest","frontend/electron-vue-starter"],
	])

	private successTip=new Map<string,any>([
		["NestJS+Mysql",[
			chalk.blue(`npm install or yarn install`),
			chalk.blue(`npm run start:dev`),
		]],
		["NestJS+Mongo",[
			chalk.blue(`npm install or yarn install`),
			chalk.blue(`npm run start:dev`),
		]],
		["Vue3+Arco Design Admin",[
			chalk.blue(`npm install or yarn install`),
			chalk.blue(`npm run dev`),
		]],
		["Vue3+Arco Design Admin pure",[
			chalk.blue(`npm install or yarn install`),
			chalk.blue(`npm run dev`),
		]],
		["Flutter+GetX",[
			chalk.blue(`flutter pub get`)
		]],
		["Uniapp+NutUI",[
			chalk.blue(`npm install or yarn install`),
			chalk.blue(`npm run dev:mp-weixin`),
		]],
		["Electron+Vue+Nest",[
			chalk.blue(`npm install or yarn install`),
			chalk.blue(`npm run dev`),
		]],
	])

	private repositoryUrl="https://gitee.com/crazybaozi/n-full-kit.git"


	constructor(

	) {
		super()
	}

	async run(passedParam: string[], options?: any,): Promise<void> {
		const currentDir = process.cwd();

		// 交互式选择项目类型
		const answers = await inquirer.prompt([
			{
				type: 'list',
				name: 'type',
				message: 'Please select the project type / 请选择项目类型',
				choices: [
					{ name: 'backend / 后端', value: 'backend' },
					{ name: 'frontend / 前端', value: 'frontend' },
				],
			},
		])
		let frameworkAnswer;
		if (answers.type === 'backend') {
			frameworkAnswer = await inquirer.prompt([
				{
					type: 'list',
					name: 'template',
					message: 'Please select a backend template / 请选择项目模板',
					choices: ['NestJS+Mysql', 'NestJS+Mongo'],
				},
			]);
		} else if (answers.type === 'frontend') {
			frameworkAnswer = await inquirer.prompt([
				{
					type: 'list',
					name: 'template',
					message: 'Please select a frontend template / 请选择项目模板',
					choices: ['Vue3+Arco Design Admin','Vue3+Arco Design Admin pure','Flutter+GetX','Uniapp+NutUI'],
				},
			]);
		}
		if(frameworkAnswer){
			// 获取项目名称
			const projectNameAnswer = await inquirer.prompt([
				{
				  type: 'input',
				  name: 'projectName',
				  message: 'Please enter the project name:',
				  validate: (input) => input ? true : 'Project name cannot be empty.',
				},
			  ]);
			if(projectNameAnswer){
				if(frameworkAnswer.template.startsWith("Flutter")&&projectNameAnswer.projectName.indexOf("-")>-1){
					console.log(chalk.red(`\nFlutter project name cannot contain '-'`));
					return
				}
				await this.cloenTemplate(frameworkAnswer.template,projectNameAnswer.projectName)
			}
		}
    }

    public async cloenTemplate(template: string,newProjectName:string) {
		
		const targetDir=this.templateMap.get(template)
		// 从this.repositoryUrl下载目标目录到当前目录
		if(targetDir){
			try {
				await downloadTemplate(this.repositoryUrl,targetDir,newProjectName)
				// 打印成功消息
				console.log(`\n`)
				console.log(chalk.green(`\nTemplate downloaded successfully to ./${newProjectName}`));
				console.log(chalk.green(`\nTo get started, navigate to the project directory:`));
				console.log(chalk.blue(`cd ${newProjectName}`));
				console.log(chalk.green(`Then run the following command to install dependencies:`));
				this.successTip.get(template).forEach((tip:string)=>{
					console.log(tip);
				})
			} catch (error) {
				
			}
		}
	}
}