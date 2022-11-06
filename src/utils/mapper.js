const store = require('../store/index');
// 不理解这里解构出来的为什么不能用
// 因为require只生效一次？不是。反正解构赋值就是用不了。我不理解。
// const {req}= require('../store/index');
module.exports = function (way, url) {
  
  // console.log(url);

  if (store.ismapper) {
    return false;
  }

  if (!way) {
    return false;
  }

  // 普通路由
  let { path } = store.req;
  if (url === path) {
    store.ismapper = true;
    return true;
    // 普通路由永远优先于动态路由
  }


  // 动态路由
  url = url.split('/:');

  if (url.length > 1) {
    // console.log(true);
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
      // console.log(params);
      store.ismapper = true;
      return true;
    }
    return false;
  }

  return false;
}