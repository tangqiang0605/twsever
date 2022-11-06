const mysql = require('../../src/db/twmysql');
const jwt = require('jsonwebtoken');
const { TWSERVER_CONFIG } = require('../configs/config');
const { SuccessModel, ErrorModel } = require('../../src/model/responseModel');

const author = {

  register: function (username, address, birthday, pwd) {
    return mysql
      .execSQL(`insert into author(username,address,birthday,pwd) values('${username}','${address}','${birthday}','${pwd}')`)
      .then(res => {

        if (TWSERVER_CONFIG.token) {
          const token = jwt.sign(`{"uid":${res.insertId},"pwd":"${pwd}"}`, TWSERVER_CONFIG.tokenscrect);
          res = { token, data: res };
        }

        return res
      })
      .then(res => new SuccessModel(200, res))
      .catch(err => new ErrorModel(500, err));
  },

  loginByUsername: function (username, pwd) {
    return mysql.execSQL(`select * from author where username='${username}' and pwd='${pwd}'`)
  },

  loginByUid: function (uid, pwd) {
    return mysql.execSQL(`select * from author where uid='${uid}' and pwd='${pwd}'`)
      .then(res => new SuccessModel(200, res))
      .catch(err => new ErrorModel(500, err));
  },

  loginByToken: function (token) {
    let user = jwt.verify(token, TWSERVER_CONFIG.tokenscrect);
    return this.loginByUid(user.uid, user.pwd)
      .then(res => new SuccessModel(200, `welcome,${res[0].username}`))
      .catch(err => new ErrorModel(500, err));
  },

  update: function (uid, username, address, birthday, pwd) {
    return mysql.execSQL(`update author set username='${username}',address='${address}',birthday='${birthday}',pwd='${pwd}' where uid=${uid};`)
      .then(res => new SuccessModel(200, res))
      .catch(err => new ErrorModel(500, err));
  },

  delete: function (uid) {
    return mysql.execSQL(`delete from author where uid=${uid}`)
      .then(res => new SuccessModel(200, res))
      .catch(err => new ErrorModel(500, err));
  },

  findByUid: function (uid) {
    return mysql.execSQL(`select * from author where uid=${uid}`)
      .then(res => new SuccessModel(200, res))
      .catch(err => new ErrorModel(500, err));
  },

  findAll: function () {
    return mysql.execSQL('select * from author')
      .then(res => new SuccessModel(200, { total: res.length, data: res }))
      .catch(err => new ErrorModel(500, err));
  }

}

module.exports = author;