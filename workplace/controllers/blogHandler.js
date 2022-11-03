const mysql = require('../../src/db/twmysql')

// 创建一个对象用于处理对应的sql查询
// 编写对象的方法：从接收的参数来处理字符串sql，执行查询
// 最后记得exports暴露对象并在routes/index.js中解构导入

const bloghandler = {
  // 使用mysql库提供的查询方法。
  // 该方法没有返回promise，所以我们手动用promise将其结果封装。
  getDetail2: function (id) {
    return new Promise((resolve, reject) => {
      mysql.query(`select * from blogs where id=${id}`, (err, res) => {
        if (err) {
          // 请不要在箭头函数里throw err
          reject(err);
        }
        resolve(res);
      })
    });
  },
  // 使用twserver提供的方法。
  // 该方法使用了自动回收的数据池。并放回一个promise。
  getDetail: (id) => {
    return mysql.execSQL(`select * from blogs where id=${id}`);
  },
  insertData: (passage) => {
    const sql = `insert into blogs(title,author,context) values ('${passage.title}','${passage.author}','${passage.context}')`;
    return mysql.execSQL(sql);
  }
}

module.exports = {
  bloghandler
}