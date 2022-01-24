import downFromGit from 'download-git-repo';
import fsSync from 'fs-sync';
import { gitConfig, initProjectName } from '../config/constants';

// github拉取初始化模版
export const downLoadTemplate = (templateName, projectName = initProjectName) => {

  const api = `${gitConfig.user}/${gitConfig.repos || templateName}`

  return new Promise((resolve, reject) => {
    downFromGit(api, projectName, (err) => {
      if(err) {
        reject({
          success: false,
          message: err
        });
      }
      resolve({
        success: true,
        message: err
      });
    })
  })
}

// 文件夹拷贝
export const copyDirector = (src, dest) => {
  fsSync.copy(src, dest);
}

// 移除文件夹
export const removeDirector = (src) => {
  fsSync.remove(src);
}

