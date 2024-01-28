import sql from "../../../utils/sqlBrick/index.js";
console.log(sql.In)
export function 选择id数组(id数组=[], 需要的属性序列=[], 数量限制=64){
    let 属性序列 = 需要的属性序列.join(', ')||"*";
    let selectStmt = sql.select(属性序列)
      .from('blocks')
      .where(sql.in("id",id数组))
      .orderBy('updated desc')
      .limit(数量限制);
  
    return selectStmt
}
console.log(await 选择id数组('20230326040618-9ymgfwv').execWorker())