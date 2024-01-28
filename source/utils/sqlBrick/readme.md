## 感谢
https://github.com/CSNW/sql-bricks-sqlite/blob/master/sqlite.js

https://csnw.github.io/sql-bricks/

## 在思源中的使用

```js
    let sql =(await import('./sql.js'))['default']
    console.log(await sql.select().from('blocks').where({type: 'd'}).post()
```

或者

```js
    import sql from './sqlbrick/sql.js'
    console.log(await sql.select().from('blocks').where({type: 'd'}).post()
```
## 更多使用方法

只是在sql-bricks-sqlite的基础上加上了跟思源的api接口对接的post方法,其他使用方式参考原始库的文档https://csnw.github.io/sql-bricks/