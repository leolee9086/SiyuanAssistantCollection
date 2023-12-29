import cheerio from "../../../../static/cheerio.js";
import { got } from "../runtime.js";
export const getReposFromURL =async (url,topic,adapter='pre')=>{
    if(adapter==='pre'){
        return await getReposFromURLPreElements(url,topic)
    }
}
const getReposFromURLPreElements= async (url, topic) => {
    const response = await got(url);
    const $ = cheerio.load(response.body);
    const scripts = $('pre').toArray();
    const repos = [];
    scripts.forEach(script => {
        const code = $(script).text();
        const match = code.match(new RegExp(`\/\/@sacPackages:\\{topic:"${topic}"\\}`));
        if (match) {
            const jsonStr = code.replace(new RegExp(`\/\/@sacPackages:\\{topic:"${topic}"\\}`), '');
            const repo = JSON.parse(jsonStr);
            repos.push(repo);
        }
    });
    return repos;
}