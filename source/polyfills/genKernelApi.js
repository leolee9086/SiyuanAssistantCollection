import kernelApiDefine from "./kernelApiDefine.js";
const metaURL = import.meta.url;
//从GitHub获取后端插件内容

let goFileURL =
 metaURL.replace("genKernelApi.js", "") + "router.go";
let goContent = await (await fetch(goFileURL)).text();
let goLines = goContent.split("\n");
let funStartIndex = goLines.findIndex((item) => {
  return item.startsWith("func ServeAPI");
});
let pre = `export class  kernelApiList{
    constructor(option={
        思源伺服ip:globalThis.location.hostname,
        思源伺服端口:'',
        思源伺服协议:"http",
		apitoken:""
		
    }){
    let 思源伺服ip =  option.思源伺服ip||option.siYuanIp||'127.0.0.1'
    let 思源伺服端口 =  option.思源伺服端口||option.siYuanPort||''
    let 思源伺服协议 =  option.思源伺服协议||option.siYuanScheme||"http"
	this.apitoken =  option.apitoken||""
    this.思源伺服地址 = 思源伺服协议+ "://"+思源伺服ip+":"+思源伺服端口
	if(option.siYuanServiceURL){this.思源伺服地址=option.siYuanServiceURL}
	if(option.思源伺服地址){this.思源伺服地址=option.思源伺服地址}`;
let after = `
async set(方法, 路径, 英文名, 中文名) {
  this[英文名] = this.生成方法(方法, 路径).bind(this);
  this[英文名]["raw"] = this.生成方法(方法, 路径, true).bind(this);
  this[英文名]["sync"] = this.生成同步方法(方法, 路径, true).bind(this);
  中文名 ? (this[中文名] = this[英文名]) : null;
  this[路径] = this[英文名];
}
async set(方法, 路径, 英文名, 中文名) {
	this[英文名] = this.生成方法(方法, 路径).bind(this);
	this[英文名]["raw"] = this.生成方法(方法, 路径, true).bind(this);
	this[英文名]["sync"] = this.生成同步方法(方法, 路径, true).bind(this);
	中文名 ? (this[中文名] = this[英文名]) : null;
	this[路径] = this[英文名];
  }
  生成同步方法(方法, 路径, flag) {
	return (data) => {
	  const xhr = new XMLHttpRequest();
	  xhr.open(方法, this.思源伺服地址 + 路径, false);
	  xhr.setRequestHeader("Content-Type", "application/json");
	  xhr.send(JSON.stringify(data));
	  return JSON.parse(xhr.responseText)["data"];
	};
  }
  生成方法(方法,路径,flag){
    return async function(data,apitoken="",callback){
        let resData  = null
        if (data instanceof FormData) {
            data = data;
        } else {
            data = JSON.stringify(data);
        }   
        let head =   {
            'Authorization': 'Token '+ this.apitoken,

            'user-agent': 'Mozilla Mobile/4.0 MDN Example',
        }
        if (!this.apitoken){
            head={
                'user-agent': 'Mozilla Mobile/4.0 MDN Example',

            }
        }  
        await fetch(this.思源伺服地址+路径,{
            body: data,
            method:方法,
            headers:head,
        }).then(function(response){resData= response.json()})
        let realData = await resData
        if(!flag){
        if(callback){callback(realData.data?realData.data:null)}
        return realData.data?realData.data:null    
        }
        else{
            if(callback){callback(realData?realData:null)}
            return realData?realData:null    
        }
    }
}
}

export default new kernelApiList({        
思源伺服ip:globalThis.location.hostname,
思源伺服端口:globalThis.location.port,
思源伺服协议:"http",
apitoken:""
})

// 从思源的后端接口文件计算而来
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU Affero General Public License for more details.
//
// You should have received a copy of the GNU Affero General Public License
// along with this program.  If not, see <https://www.gnu.org/licenses/>.
`;
let preLines = pre.toString().split("\n");
let 初始定义序列 =[]
goLines.forEach((line, index) => {
  if (index <= funStartIndex) {
    line = preLines[index] || "";
    goLines[index] = line;
  } else {
    if (line && line.indexOf("ginServer.Handle") > 0) {
      line = line.split("//")[0];
    }
    line = line
      .replace("ginServer.Handle", "this.set")
      .replace("model.CheckAuth,", "")
      .replace("model.CheckReadonly,", "")
      .replace("model.", "");
    let functionName = line.split(",").pop().replace(")", "").trim();
    if (line && line.indexOf("this.set") > 0) {
      if (!kernelApiDefine[functionName]) {
        let 初始定义 = line
          .replace("\t", "")
          .replace("this.set", "")
          .replace("(", "")
          .replace(")", "")
          .replace(/\'/g, "")
          .replace(/\"/g, "")
          .split(",")
          .map((item) => {
            return item.trim();
          });
          初始定义序列.push(初始定义)
        console.warn(
          functionName,
          "未定义,初始定义应当为:",
          初始定义
        );
        line = line.replace(
          functionName + ")",
          `"${functionName}")//仅生成函数,尚未定义`
        );
      } else if (!kernelApiDefine[functionName].中文名) {
        console.warn(functionName, "缺少中文名");
        line = line.replace(functionName + ")", `"${functionName}")`);
      } else {
        line = line.replace(
          functionName + ")",
          `"${functionName}","${kernelApiDefine[functionName].中文名}")`
        );
      }
    }
    goLines[index] = line;
  }
});
console.warn('以下接口未定义:',初始定义序列)
let jsContent = goLines.join("\n") + after;
let blob = new Blob([jsContent], { type: "application/javascript" });
let moduleURL = URL.createObjectURL(blob);
let _module ={default:''}
try{
 _module = await import(moduleURL);
}catch(e){
console.warn("生成的内容似乎有点问题",e)
}
let kernelApi = _module['default'];
import fs from  './fs.js'
await fs.writeFile('/data'+import.meta.url.replace(globalThis.location.origin,'').replace("genKernelApi.js", "") + "kernelApi.js",jsContent)
export default kernelApi;
