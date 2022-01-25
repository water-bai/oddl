import ora from 'ora';
import chalk from 'chalk';
import { downLoadTemplate, copyDirector, removeDirector } from './utils/index';
import { initProjectName } from './config/constants';

const { existsSync } = require('fs');


const init = async (type, projectName) => {

  if(existsSync(projectName)) {
    console.log(chalk.red(`已存在名为${projectName}的项目！`));
    return;
  }

  const spinner = ora('正在初始化项目模版').start();
  
  downLoadTemplate(`template-${type}`, initProjectName, () => spinner.stop()).then(res => {
    console.log('init', res);
    // 拷贝文件
    copyDirector(`${initProjectName}/template-${type}`, `${projectName}`);
    removeDirector(`${initProjectName}`);

    console.log(chalk.green('\n项目初始化成功'));

  }).catch(err => {
    console.log(...err);
  }).finally(() => {
    spinner.stop();
  });
}

module.exports = init