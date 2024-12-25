import { Command, CommandRunner } from "nest-commander";
import { execSync } from 'child_process';
import * as inquirer from 'inquirer';
import * as path from 'path';
import * as fs from 'fs';
import * as chalk from 'chalk'; 
import * as ora from 'ora';

@Command({ name: 'create', description: 'A parameter parse' })
export class BasicCommand extends CommandRunner {
    private templateMap=new Map([
		["NestJS+Mysql","backend/nestjs-starter-mysql"],
		["NestJS+Mongo","backend/nestjs-starter-mongo"],
		["Vue3+Arco Design Admin","frontend/arco-admin-starter"],
	])
	private repositoryUrl="https://gitee.com/crazybaozi/n-full-kit.git"


    constructor(

    ) {
        super()
    }

    async run(passedParam: string[], options?: any,): Promise<void> {
        console.log('run', passedParam, options)
        // 获取当前工作目录
		const currentDir = process.cwd();
		console.log('Current working directory:', currentDir);
		// 交互式选择项目类型
		const answers = await inquirer.prompt([
			{
				type: 'list',
				name: 'type',
				message: 'Please select the project type:',
				choices: ['backend', 'frontend'],
			},
		])
		let frameworkAnswer;
		if (answers.type === 'backend') {
			frameworkAnswer = await inquirer.prompt([
				{
					type: 'list',
					name: 'template',
					message: 'Please select a backend template:',
					choices: ['NestJS+Mysql', 'NestJS+Mongo'],
				},
			]);
		} else if (answers.type === 'frontend') {
			frameworkAnswer = await inquirer.prompt([
				{
					type: 'list',
					name: 'template',
					message: 'Please select a frontend template:',
					choices: ['Vue3+Arco Design Admin',],
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
				this.cloenTemplate(frameworkAnswer.template,projectNameAnswer.projectName)
			}
		}
    }

    public cloenTemplate(template: string,newProjectName:string) {
		
		const targetDir=this.templateMap.get(template)
		// 从this.repositoryUrl下载目标目录到当前目录
		if(targetDir){
			this.downloadTemplate(targetDir,newProjectName)
		}
	}

	public async downloadTemplate(template:string,newProjectName:string){ 
		const repoUrl = this.repositoryUrl;
		const tempDir = path.join(process.cwd(), '.temp-clone'); // 临时克隆目录
    	const targetDir = path.join(process.cwd(), path.basename(template)); // 最终目标目录
		const finalDir = path.join(process.cwd(), newProjectName); // 重命名后的最终目录
		const spinner = ora('downloading template...').start();
		try {

			// 克隆仓库到临时目录，但不立即检出文件
			execSync(`git clone --no-checkout ${repoUrl} ${tempDir}`,{ stdio: 'ignore' });

			// 进入临时目录
			process.chdir(tempDir);
	
			// 启用 sparseCheckout
			execSync('git config core.sparseCheckout true',{ stdio: 'ignore' });
	
			// 配置 sparse-checkout 文件，指定只检出模板目录
			execSync(`echo "${template}/" > .git/info/sparse-checkout`,{ stdio: 'ignore' });
	
			// 检出指定模板目录
			execSync('git checkout master',{ stdio: 'ignore' });
	
			// 移动检出的模板目录到目标目录
			fs.renameSync(path.join(tempDir, template), targetDir);
	
			// 重命名目标目录
			fs.renameSync(targetDir, finalDir);
	
			// 修改 package.json
			const packageJsonPath = path.join(finalDir, 'package.json');
			if (fs.existsSync(packageJsonPath)) {
				const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
				packageJson.name = newProjectName; // 修改 name 字段
				fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2), 'utf8');
			} else {
				console.warn(`No package.json found in ${finalDir}`);
			}
			// 打印成功消息
			console.log(`\n`)
			console.log(chalk.green(`\nTemplate downloaded successfully to ./${newProjectName}`));
			console.log(chalk.green(`\nTo get started, navigate to the project directory:`));
			console.log(chalk.blue(`cd ${newProjectName}`));
			console.log(chalk.green(`Then run the following command to install dependencies:`));
			console.log(chalk.blue(`npm install or yarn install`));
			console.log(chalk.blue(`npm run start:dev`));
		} catch (error:any) {
			console.error(`Failed to download ${template}:`, error.message);
		} finally {
			spinner.stop();
			spinner.clear();
			// 清理临时克隆目录
			process.chdir(process.cwd()); // 确保退出临时目录
			fs.rmSync(tempDir, { recursive: true, force: true });
		}
	}
}