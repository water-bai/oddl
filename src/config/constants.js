import { version } from '../../package.json';
// 模版下载地址
export const gitConfig = {
    user: 'baikaishui01',
    repos: 'templates'
}

// 初始化工程名
export const initProjectName = 'oddl_init_templates'

// oddl cli version
export const VERSION =  version;

// 校验正则
export const RE_NAME = /^[A-Z]+[a-zA-Z0-9]{1,}$/