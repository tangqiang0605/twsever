const mysql = require('../../src/db/twmysql')

const author = {
  register: function (username, address, birthday, pwd) {
    return mysql.execSQL(`insert into author(username,address,birthday,pwd) values('${username}','${address}','${birthday}','${pwd}')`);
  },
  loginByUsername: function (username, pwd) {
    return mysql.execSQL(`select * from author where username='${username}' and pwd='${pwd}'`)
  },
  loginByUid: function (uid, pwd) {
    return mysql.execSQL(`select * from author where uid='${uid}' and pwd='${pwd}'`)
  },
  update: function (uid, username, address, birthday, pwd) {
    return mysql.execSQL(`update author set username='${username}',address='${address}',birthday='${birthday}',pwd='${pwd}' where uid=${uid};`);
  },
  delete: function (uid) {
    return mysql.execSQL(`delete from author where uid=${uid}`);
  },
  findByUid: function (uid) {
    return mysql.execSQL(`select * from author where uid=${uid}`);
  },
  findAll: function () {
    return mysql.execSQL('select * from author');
  }
}

module.exports = author;