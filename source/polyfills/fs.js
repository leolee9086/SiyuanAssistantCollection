import mimes from "./mimeDb.js";
import path from "./path.js";
import kernelApi from "./kernelApi.js";
export let readFile = async (file) => {
  let res = await fetch("/api/file/getFile", {
    method: "POST",
    body: JSON.stringify({
      path: file,
    }),
  });
  if (res.status !== 200&&res.status !== 202) {
    console.error(`${file}读取错误`);
  }
  if (res.status === 202) {
    console.error(`${file}不存在,内容为undefined`);
    return
  }
  let mime = await res.headers.get("Content-Type");
  if (isText(mime)) {
    return await res.text();
  } else {
    let buf = await res.arrayBuffer();
    return buf;
  }
};
export function readFileSync(file) {
  let xhr = new XMLHttpRequest();
  xhr.open("POST", "/api/file/getFile", false); // false means synchronous
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.send(JSON.stringify({ path: file }));

  if (xhr.status !== 200 && xhr.status !== 202) {
    console.error(`${file}读取错误`);
    return;
  }
  if (xhr.status === 202) {
    console.error(`${file}不存在,内容为undefined`);
    return;
  }

  let mime = xhr.getResponseHeader("Content-Type");
  if (isText(mime)) {
    return xhr.responseText;
  } else {
    // For binary files, you might need to handle the response differently
    return xhr.response;
  }
}
let mimetype = {};
Object.getOwnPropertyNames(mimes).forEach((type) => {
  let extensions = mimes[type]["extensions"];
  if (extensions) {
    extensions.forEach((extension) => {
      mimetype[extension] = type;
    });
  }
});
export let writeFile = async (path,content,flag) => {
  if (!flag) {
    let extension = path.split(".").pop();
    let blob = new Blob([content], {
      type: mimetype[extension] || "text/plain",
    });
    let file = new File([blob], path.split("/").pop(), {
      lastModified: Date.now(),
    });
    return await writeFileDirectly( path,file);
  } else {
    return await writeFileDirectly(path,content);
  }
};
export let writeFileDirectly = async ( path,file) => {
  let data = new FormData();
  data.append("path", path);
  data.append("file", file);
  data.append("isDir", false);
  data.append("modTime", Date.now());
  let res = await fetch("/api/file/putFile", {
    method: "POST",
    body: data,
  });
  return await res.json();
};
export let readDir = async (path) => {
  let res = await fetch("/api/file/readDir", {
    method: "POST",
    body: JSON.stringify({
      path: path,
    }),
  });
  if (res.status !== 200) {
    if (res.status === 202) {
      console.error(`${path}不存在`);
    }
    console.error(`${path}读取错误`);
  }
  let { data } = await res.json();
  return data;
};
export let exists = async (name) => {
  try {
    let parentDir = path.dirname(name);
    if (parentDir !== '') {
      let files = await readDir(parentDir);
      let result = files.find((file) => {
        return path.join(parentDir, file.name) == name||path.join(parentDir, file.name)+'/' == name;
      });
      return result || undefined;
    } else {
      console.warn(`无效的路径: ${name}`);
      return undefined;
    }
  } catch (e) {
    console.warn(`工作空间内容读取错误: ${e}`);
    return undefined;
  }
};
export let mkdir = async (path) => {
  let data = new FormData();
  data.append("path", path);
  data.append("file", "");
  data.append("isDir", true);
  data.append("modTime", Date.now());
  let res = await fetch("/api/file/putFile", {
    method: "POST",
    body: data,
  });
  return await res.json();
};

export function isText(mime) {
  if (mime && mime.startsWith("text")) {
    return true;
  }
  if (mime == "application/json") {
    return true;
  }
  if (mime == "application/x-javascript") {
    return true;
  } else return false;
}
export let  removeFile=async(path)=>{
  await kernelApi.removeFile({path:path})
}
export let copyFile=async(path1,path2)=>{
  let content= await readFile(path1)
  await writeFile(path2,content);

}
export let initFile = async (path, data) => {
  if (!(await exists(path))) {
    if (data === undefined) {
      await writeFile(path,"", );
    } else {
      await writeFile(path,data);
    }
  }
};

let fs = {
  readFileSync,
  readFile,
  writeFile,
  readDir,
  exists,
  mkdir,
  removeFile,
  copyFile,
  initFile
};

export default fs;
