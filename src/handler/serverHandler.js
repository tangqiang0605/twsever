const path = require('path');

const resHandler = require('./resHandler')
const reqHandler = require('./reqHandler');
const endHandler = require('./endHandler')
const routeError = require('./routeError');

const { ROUTER_CONFIG } = require('../../workplace/configs/config');
const store = require('../store/index');

const routePath = (routeName) => path.join(__dirname, '../' + ROUTER_CONFIG.routespath + '/', routeName);
const brPath = (routeName) => path.join(__dirname, '../' + ROUTER_CONFIG.brpath + '/', routeName);
const arPath = (routeName) => path.join(__dirname, '../' + ROUTER_CONFIG.arpath + '/', routeName);

const serverHandler = async (req, res) => {
  // 数据处理
  await resHandler(res);
  await reqHandler(req);
  store.req = req;
  store.res = res;

  // 路由前置守卫
  // let beforeroutes = ROUTER_CONFIG.beforeroute || [];
  // for (let i = 0; i < beforeroutes.length; i++) {
  //   await require(brPath(routes[i]))(req, res)
  //     .then(result => endHandler(result))
  //     .catch(err => routeError(err, i === routes.length - 1));
  // }

  let routes = ROUTER_CONFIG.routes || [];
  store.ismapper = false;
  // 这里只允许一个路由js包含一个方法,也就是export只能导出一个方法而不能有多个.
  // 后期将支持一个路由js中写多个方法并以数组或对象的形式导出,允许导出时多层嵌套(需要一个递归函数来实现)
  for (let i = 0; i < routes.length&&(!store.ismapper); i++) {
    if (ROUTER_CONFIG.logwhenrunning || false) console.log('route:', routes[i], 'is running');
    await require(routePath(routes[i]))(req, res)
      .then(result => endHandler(result))
      .catch(err => routeError(err, i === routes.length - 1||store.ismapper));
  }

  // 路由后置守卫
  // let afterroutes = ROUTER_CONFIG.afterroute || [];
  // for (let i = 0; i < afterroutes.length; i++) {
  //   await require(arPath(routes[i]))(req, res)
  //     .then(result => endHandler(result))
  //     .catch(err => routeError(err, i === routes.length - 1));
  // }
}

module.exports = serverHandler;
