const { TWSERVER_CONFIG } = require('../../workplace/configs/config');
// const store = require('../store');

module.exports = async function (res) {
  // if (!store.ismapper) {

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('access-control-allow-methods', 'GET,POST');
    res.setHeader('access-control-allow-credential', true);
    TWSERVER_CONFIG.returnform = TWSERVER_CONFIG.returnform || 'json';
    switch (TWSERVER_CONFIG.returnform) {
      case 'json':
      case 'api':
        // 返回json格式,用于接口式服务器
        res.setHeader('Content-Type', 'application/json');
        break;
      case 'html':
      case 'static':
      case 'ssr':
        // 返回html内容,用于静态服务器或ssr
        res.setHeader('Content-Type', 'text/html;charset=utf-8');
        break;
      default:
        // console.log('no match returnform');
        break;
    }
  // }
};