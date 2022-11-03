const store = require('../store/index');

function endHandler(result) {
  const { res } = store;
  switch (res._headers['content-type']) {
    case 'application/json':
      res.end(JSON.stringify(result))
      break;
    case 'text/html;charset=utf-8':
      res.end(result);
      break;
    default:
      // console.log('endHandler.js:' + res._headers['content-type'] + ' is not matched');
      break;
  }
}
module.exports = endHandler;