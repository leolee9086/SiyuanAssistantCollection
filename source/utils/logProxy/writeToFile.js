import fs from '../../polyfills/fs.js';
import { plugin } from '../../asyncModules.js';
import { chunk } from './index.js';

const writeToFile = async () => {
  let currentHour = new Date().toISOString().slice(0, 13);
  let filename = '/temp/cclog/' + plugin.name + '_' + currentHour + '.txt';
  let filecontent = (await fs.readFile(filename)) || '';
  filecontent += chunk.join('\n');
  await fs.writeFile(filename, filecontent);
  chunk = []; // 清空缓存
};
