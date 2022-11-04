const path = require('path');

const resHandler = require('./resHandler')
const reqHandler = require('./reqHandler');
const endHandler = require('./endHandler')
const routeError = require('./routeError');

const { ROUTER_CONFIG } = require('../../workplace/configs/config');
const store = require('../store/index');

const typeOf = require('../utils/typeOf');
const { type } = require('os');

const routePath = (routeName) => path.join(__dirname, '../' + ROUTER_CONFIG.routespath + '/', routeName);
const brPath = (routeName) => path.join(__dirname, '../' + ROUTER_CONFIG.brpath + '/', routeName);
const arPath = (routeName) => path.join(__dirname, '../' + ROUTER_CONFIG.arpath + '/', routeName);

async function handleRoute(curRoute) {
  if (ROUTER_CONFIG.logwhenrunning || false) console.log('route:', curRoute, 'is running');
  let route = require(routePath(curRoute));
  if (typeOf(route) === 'Object') {
    Object.keys(route).forEach(
      async function (val) {
        await route[`${val}`](req, res)
          .then(result => endHandler(result))
          .catch(err => routeError(err, i === routes.length || store.ismapper))
      })
  } else {
    await require(routePath(curRoute))(req, res)
      .then(result => endHandler(result))
      .catch(err => routeError(err, i === routes.length - 1 || store.ismapper));
  }
}


const serverHandler = async function (req, res) {
  // 数据处理
  await resHandler(res);
  await reqHandler(req);
  store.req = req;
  store.res = res;

  // 全局路由前置守卫
  let isStop = false;
  let beforeroutes = ROUTER_CONFIG.beforeroute || [];
  for (let i = 0; i < beforeroutes.length; i++) {
    await require(brPath(routes[i]))(req, res)
      .then(result => result)
      .catch(err => isStop = true);
    if (isStop) {
      return;
    }
  }


  let routes = ROUTER_CONFIG.routes || [];
  store.ismapper = false;
  isStop = false;
  for (let i = 0; i < routes.length && (!store.ismapper); i++) {

    let curRoute = routes[i];
    if (typeOf(curRoute) === 'Object') {
      // 在配置文件中使用{beforeroute:,route:,afterroute:}格式配置路由
      if (!curRoute.route) {
        // 局部前置路由守卫
        if (curRoute.beforeroute) {
          await (brPath(curRoute.beforeroute))(req, res).then(result => result).catch(err => isStop = true);
          if (isStop) return;
        }
        // 局部路由
        if (typeOf(curRoute.route) === 'Array') {
          curRoute.route.forEach(async function (val) {
            // 执行路由模块
            handleRoute(val);
          })
        } else if (typeOf(curRoute.route) === 'String') {
          // 执行路由模块
          handleRoute(curRoute.route);
        } else {
          console.error('路由配置错误：只支持Array类型和String类型的值，不接受'
            + typeOf(curRoute.route) + '类型的值！');
        }
        // 局部后置路由
        if (curRoute.afterroute) {
          await arPath(curRoute.afterroute)(req, res);
        }

      } else {
        console.error('路由配置错误：局部路由配置必须包含至少一个route');
      }

    } else if (typeOf(curRoute) === 'Function') {
      // 执行路由模块
      handleRoute(curRoute);
    } else {
      console.error('路由模块错误：导出的类型必须是函数或者对象')
    }
  }

  // 路由后置守卫
  let afterroutes = ROUTER_CONFIG.afterroute || [];
  for (let i = 0; i < afterroutes.length; i++) {
    await require(arPath(routes[i]))(req, res);
  }
}

module.exports = serverHandler;
