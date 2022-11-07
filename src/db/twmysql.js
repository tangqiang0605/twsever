const sqlmy = require('mysql');
const { MYSQL_CONFIG } = require('../../workplace/configs/config');
const mysql = sqlmy.createPool(MYSQL_CONFIG);

mysql.execSQL = function (sql) {
  const promise = new Promise(function (resolve, reject) {
    mysql.getConnection(function (err, connection) {

      connection.query(sql, (err, result) => {
        connection.release();
        if (err) {
          reject(err);
        }
        resolve(result);
      });
    })

  });
  return promise;
}

module.exports = mysql;