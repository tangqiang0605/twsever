const store = require('../store/index');
// 不理解这里解构出来的为什么不能用
// 因为require只生效一次？不是。反正解构赋值就是用不了。我不理解。
// const {req}= require('../store/index');
module.exports = function (way, url) {

  let { path,method} = store.req;

  // 普通路由
  if (way && url === path) {
    return true;
  }
  
  // 动态路由
  url = url.split('/:');

  if (url.length>1) {
    path = path.split('/').splice(1);
    
    let [preurl, ...keys] = url;
    let [prepath, ...values] = path;
    prepath = '/' + prepath;

    if (preurl === prepath && keys.length === values.length) {
      let params = {};
      for (let i = 0; i < keys.length; i++) {
        params[keys[i]] = values[i];
      }
      store.req.params = params;
      return true;
    } 
    return false;
  }

  return false;
}