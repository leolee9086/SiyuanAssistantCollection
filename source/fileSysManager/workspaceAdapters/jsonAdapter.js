import { fileChunkAdapter } from "./fileChunkAdapter.js";
export default class JsonSyAdapter extends fileChunkAdapter{
    constructor(文件保存地址) {
        super(文件保存地址,JSON.stringify,JSON.parse)
    }
}
