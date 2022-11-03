const noPage = require('../../workplace/configs/noPage');
const endHandler = require('./endHandler');
let store=require('../store/index')
module.exports = (err, isLast) => {
  
  if ((err === 404||err==='404') && isLast) {
    noPage(store.res);
  }
  else {
    endHandler(err);
  }

}