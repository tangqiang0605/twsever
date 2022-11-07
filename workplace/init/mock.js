const mysql = require("../../src/db/twmysql")
const Mock = require('mockjs')

// 示例：启动服务器前使用mockjs生成假数据存入数据库
module.exports = async () => {
  const { uid, title, date, context } = Mock.mock({
    uid: 1,
    title: '@title()',
    date: "@now('yyyy-MM-dd HH:mm:ss')",
    context: '@cparagraph()'
  });
  const result = await mysql.execSQL(`insert into blogs(uid,title,date,context) values(${uid},'${title}','${date}','${context}')`);
  console.log('插入值：', result);
}