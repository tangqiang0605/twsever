const mongoose = require('mongoose');
const { MONGODB_CONFIG } = require('../../workplace/config/config')

mongoose
  .connect(`mongodb://${MONGODB_CONFIG.host}:${MONGODB_CONFIG.port}/${MONGODB_CONFIG.database}`, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => { console.log(`db:mongodb数据库${MONGODB_CONFIG.database}连接成功`); })
  .catch(err => { console.log(`db:mongodb数据库${MONGODB_CONFIG.database}连接成功:${err}`); });

function useCol(collectionName, schemaObj) {
  const colObj = {};
  colObj.model = mongoose.model(collectionName, new mongoose.Schema(schemaObj));
  colObj.execSQL = function () {
    const method = arguments[0];
    let result = {};
    switch (method) {
      case 'insert':
      case 'create':
        result = this.model.create(arguments[1]);
        break;
      case 'updateOne':
        result = this.model.updateOne(arguments[1], arguments[2]);
        break;
      case 'update':
      case 'updateMany':
        result = this.model.updateMany(arguments[1], arguments[2]);
        break;
      case 'delete':
      case 'deleteMany':
        result = this.model.deleteMany(arguments[1], arguments[2]);
        break;
      case 'select':
      case 'find':
        result = this.model.find(arguments[1]);
        break;
      default:
        result = Promise.reject('db:mongodb:execSQL:参数一:执行方式不存在');
        break;
    }
    return result;
  }
  return colObj;
}

module.exports = {
  useCol
}
