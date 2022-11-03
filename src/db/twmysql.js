const mysql = require('mysql');
const { MYSQL_CONFIG } = require('../../workplace/configs/config');
const pool = mysql.createPool(MYSQL_CONFIG);

pool.execSQL = function (sql) {
  const promise = new Promise(function (resolve, reject) {
    pool.getConnection(function (err, connection) {

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

module.exports = pool;