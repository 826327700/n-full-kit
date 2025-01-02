import * as path from 'path';
import * as fs from 'fs';
import { execSync } from 'child_process';
import * as ora from 'ora';

export function downloadTemplate(repoUrl:string,template: string, newProjectName: string) {
    const tempDir = path.join(process.cwd(), '.temp-clone'); // 临时克隆目录
    const targetDir = path.join(process.cwd(), path.basename(template)); // 最终目标目录
    const finalDir = path.join(process.cwd(), newProjectName); // 重命名后的最终目录
    const spinner = ora('downloading template...').start();
    try {

        // 克隆仓库到临时目录，但不立即检出文件
        execSync(`git clone --no-checkout ${repoUrl} ${tempDir}`, { stdio: 'ignore' });

        // 进入临时目录
        process.chdir(tempDir);

        // 启用 sparseCheckout
        execSync('git config core.sparseCheckout true', { stdio: 'ignore' });

        // 配置 sparse-checkout 文件，指定只检出模板目录
        execSync(`echo "${template}/" > .git/info/sparse-checkout`, { stdio: 'ignore' });

        // 检出指定模板目录
        execSync('git checkout master', { stdio: 'ignore' });

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
            // console.warn(`No package.json found in ${finalDir}`);
        }

    } catch (error: any) {
        console.error(`Failed to download ${template}:`, error.message);
        throw error;
    } finally {
        spinner.stop();
        spinner.clear();
        // 清理临时克隆目录
        process.chdir(process.cwd()); // 确保退出临时目录
        fs.rmSync(tempDir, { recursive: true, force: true });
    }
}