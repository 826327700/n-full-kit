import { Command, CommandRunner } from "nest-commander";
import { execSync } from 'child_process';
import * as inquirer from 'inquirer';
import * as path from 'path';
import * as fs from 'fs';
import * as chalk from 'chalk';
import * as ora from 'ora';
import { downloadTemplate } from "./common";

@Command({ name: 'inject', description: 'Pop up some docker-compose/swarm configurations file / 弹出一些docker-compose/swarm配置' })
export class InjectCommand extends CommandRunner {

    private repositoryUrl="https://gitee.com/crazybaozi/n-full-kit.git"

    async run(passedParams: string[], options?: Record<string, any>): Promise<void> {
        
        // 获取当前工作目录
        const currentDir = process.cwd();

        // 交互式选择项目类型
        const answers = await inquirer.prompt([
            {
                type: 'list',
                name: 'docker',
                message: 'Please select the configuration you want to pop up / 请选择想要弹出的配置',
                choices: [
                    { name: 'MongoDB', value: 'mongodb' },
                    { name: 'MySQL', value: 'mysql' },
                    { name: 'Redis', value: 'redis' },
                    { name: 'Traefik suite - (traefik+grafana+prometheus+consul+loki+promtail)', value: 'traefik' },
                ],
            },
        ])

        if(answers.docker&&answers.docker!=='traefik'){
            let typeAnswers = await inquirer.prompt([
                {
                    type: 'list',
                    name: 'type',
                    message: 'Please select a docker run mode / 请选择docker运行模式',
                    choices: ['docker-compose', 'docker-swarm'],
                },
            ]);

            //从git仓库拉取模板文件的raw
            let yml=await fetch(`https://gitee.com/crazybaozi/n-full-kit/raw/master/docker/${answers.docker}/${typeAnswers.type}.yml`)
            .then(res => res.text())
            .then(text => {
                return text
            })

            //写入文件
            let ymlPath=path.join(currentDir, typeAnswers.type+'.yml')
            fs.writeFileSync(ymlPath, yml);

            console.log(chalk.green(`\nconfiguration file inject in ${ymlPath}`));
            if(typeAnswers.type==='docker-compose'){
                console.log(chalk.green(`\nYou can use 'docker-compose up -d' to start the service`));
            }
            if(typeAnswers.type==='docker-swarm'){
                console.log(chalk.green(`\nYou can use 'docker stack deploy -c ${typeAnswers.type}.yml <stack-name>' to start the service`));
            }
        }

        if(answers.docker&&answers.docker=='traefik'){
            const targetDir='docker/traefik'
            const newProjectName='traefik-suite'
            await downloadTemplate(this.repositoryUrl,targetDir,newProjectName)
            // 打印成功消息
            console.log(`\n`)
            console.log(chalk.green(`\nTemplate downloaded successfully to ./${newProjectName}`));
            console.log(chalk.green(`\nTo get started, navigate to the project directory:`));
            console.log(chalk.blue(`cd ${newProjectName}`));
            console.log(chalk.blue(`docker-swarm: run 'docker stack deploy -c docker-compose.yml traefik'`));
            console.log(chalk.blue(`docker-compose: run 'docker-compose up -d'`));
        }
    }

}