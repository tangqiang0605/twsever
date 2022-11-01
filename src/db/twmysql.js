const mysql = require('mysql');
const { MYSQL_CONFIG } = require('../../workplace/configs/config');
const connection = mysql.createPool(MYSQL_CONFIG);

connection.execSQL = function (sql) {
  const promise = new Promise((resolve, reject) => {
    connection.query(sql, (err, result) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(result);
    })
  });
  return promise;
}

module.exports = connection;