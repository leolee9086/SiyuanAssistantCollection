import JSZip from '../../../static/jszip.js'
import pako from '../../../static/pako.js';
import untar from '../../../static/js-untar.js';

export function convertTgzToZip(tgzArrayBuffer) {
  console.log(tgzArrayBuffer)
  return new Promise((resolve, reject) => {
    // 使用pako解压tgz文件
    let gunzip = new pako.Inflate({ to: 'Uint8Array' });
    gunzip.push(new Uint8Array(tgzArrayBuffer), true);
    if (gunzip.err) {
      reject(`Error while decompressing: ${gunzip.err}`);
    }

    // 解压后的tar文件内容
    console.log(gunzip)
    let tarContent = gunzip.result.buffer;
    untar(tarContent).then(files => {
      // 创建一个新的JSZip对象
      let zip = new JSZip();

      // 将每个文件添加到zip
      files.forEach(file => {
        zip.file(file.name, file.buffer);
      });

      // 生成zip文件的ArrayBuffer
      zip.generateAsync({ type: "arraybuffer" }).then(function (content) {
        // 这里的content就是一个内容为zip文件的ArrayBuffer对象
        resolve(content);
      });
    }).catch(err => {
      reject(`Error while untarring: ${err}`);
    });

  });
}