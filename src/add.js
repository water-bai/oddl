
import inquirer from 'inquirer';
import chalk from 'chalk';
import ora from 'ora';
import { downLoadTemplate, copyDirector, removeDirector, readJSON } from './utils';
import { RE_NAME, initProjectName } from './config/constants';

const { readFileSync, writeFileSync, existsSync } = require('fs')

const questions = [
  {
    name: 'type',
    type: 'list',
    message: '请选择需要新增的类型',
    choices: [
      {
        name: '组件',
        value: 'component',
      },
      {
        name: '页面',
        value: 'page',
      },
    ]
  },
  {
    name: 'name',
    type: 'input',
    message: '请输入组件名称(首字母需大写)',
    when: (answer) => {
      return answer.type === 'component'
    },
    validate: (name) => {
      return validateName(name);
    }
  },
  {
    name: 'name',
    type: 'input',
    message: '请输入页面名称(首字母需大写)',
    when: (answer) => {
      return answer.type === 'page'
    },
    validate: (name) => {
      return validateName(name);
    }
  },
]

// 验证文件名的合法性
const validateName = (name) => {
  if(RE_NAME.test(name)) {
    return true;
  } else {
    console.log(chalk.red(`\n文件名仅支持大小写字母及数字，且首字母需大写`));
    return false;
  }
}

// 新增组件
const addComponent = (answer) => {
  const { name } = answer;
  const packagePath = `${process.cwd()}/package.json`;

  if(!existsSync(packagePath)){
    console.log(chalk.red('\n无法找到package.json文件'));
    removeDirector(initProjectName);
    return;
  }

  const packageJson = readJSON(packagePath);
  const packageName = packageJson.name;
  
  // 修改组件模版
  let fileTsx = readFileSync(`${initProjectName}/template-component/component/index.tsx`).toString();
  fileTsx = fileTsx.replace(/FileName/ig, name);
  writeFileSync(`${initProjectName}/template-component/component/index.tsx`, fileTsx, 'utf-8');
  // 修改组件demo模版
  let demoMd = readFileSync(`${initProjectName}/template-component/demo/usage.md`).toString();
  demoMd = demoMd.replace(/FileName/ig, name);
  demoMd = demoMd.replace(/packageName/ig, packageName);
  writeFileSync(`${initProjectName}/template-component/demo/usage.md`, demoMd, 'utf-8');
  // 透出组件
  if(!existsSync(`${process.cwd()}/src/index.ts`)){
    console.log(chalk.red(`\n不存在文件路径：${process.cwd()}/src/index.ts`));
    removeDirector(initProjectName);
    return;
  }
  let exportFile = readFileSync(`${process.cwd()}/src/index.ts`).toString();
  exportFile += `\nexport { default as ${name} } from './components/${name}';`
  writeFileSync(`${process.cwd()}/src/index.ts`, exportFile, 'utf-8');
  
  // 拷贝模版
  copyDirector(`${initProjectName}/template-component/component`, `src/components/${name}`);
  copyDirector(`${initProjectName}/template-component/demo`, `demo/${name}`);

  // 删除downLoad的工程
  removeDirector(initProjectName);
}

// 新增页面
const addPage = (answer) => {
  const { name } = answer;
  let fileTsx = readFileSync(`${initProjectName}/template-page/index.tsx`).toString();
  fileTsx = fileTsx.replace(/FileName/ig, name);
  writeFileSync(`${initProjectName}/template-page/index.tsx`, fileTsx, 'utf-8')
  copyDirector(`${initProjectName}/template-page`, `src/pages/${name}`);
  removeDirector(initProjectName);
}

const add = () => {
  inquirer.prompt(questions).then(answer => {
    const { type } = answer;
    const spinner = ora(`正在新增模版${type === 'component' ? '组件' : '页面'}`).start();
    downLoadTemplate(`template-${type}`).then(() => {
      type === 'component' ? addComponent(answer) : addPage(answer)
    }).finally(() => {
      spinner.stop();
    })
  })
}

module.exports = add;