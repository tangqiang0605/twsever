const path = require('path');

const resHandler = require('./resHandler')
const reqHandler = require('./reqHandler');
const endHandler = require('./endHandler')
const routeError = require('./routeError');

const { ROUTER_CONFIG } = require('../../workplace/configs/config');
const store = require('../store/index');

const typeOf = require('../utils/typeOf');
// const { type } = require('os');

const routePath = (routeName) => path.join(__dirname, '../' + ROUTER_CONFIG.routespath + '/', routeName);
const brPath = (routeName) => path.join(__dirname, '../' + ROUTER_CONFIG.brpath + '/', routeName);
const arPath = (routeName) => path.join(__dirname, '../' + ROUTER_CONFIG.arpath + '/', routeName);

async function handleRoute(curRoute, isLast) {
  const req = store.req;
  const res = store.res;
  if (ROUTER_CONFIG.logwhenrunning || false) console.log('route:', curRoute, 'ran');
  let route = require(routePath(curRoute));
  if (typeOf(route) === 'Object') {
    let keys = Object.keys(route);
    for (let i = 0; i < keys.length; i++) {
      let val = keys[i];
      if (!store.ismapper) {
        await route[`${val}`](req, res)
          .then(result => endHandler(result))
          .catch(err => {
            routeError(err, i === keys.length - 1&&isLast)
          })
      }
    }
  } else if (typeOf(route) === 'Function') {
    await require(routePath(curRoute))(req, res)
      .then(result => endHandler(result))
      .catch(err => {
        // console.log(err,isLast);
        routeError(err, isLast);
      });
  } else {
    console.err('路由模块错误：导出的类型必须是函数或者对象，而不是' + typeOf(curRoute));
  }
}


const serverHandler = async function (req, res) {
  // 数据处理
  store.ismapper = false;
  await resHandler(res);
  await reqHandler(req);
  store.req = req;
  store.res = res;

  // 全局路由前置守卫
  let isStop = false;
  let beforeroutes = ROUTER_CONFIG.beforeroutes || [];
  for (let i = 0; i < beforeroutes.length; i++) {
    await require(brPath(beforeroutes[i]))(req, res)
      .then(result => result)
      .catch(err => isStop = true);
    if (isStop) {
      return;
    }
  }


  let routes = ROUTER_CONFIG.routes || [];
  isStop = false;
  for (let i = 0; i < routes.length && (!store.ismapper); i++) {
    let curRoute = routes[i];
    let isLast = (i === routes.length - 1);

    if (typeOf(curRoute) === 'String') {
      // 执行路由模块
      handleRoute(curRoute, isLast);
    } else if (typeOf(curRoute) === 'Object') {
      // console.log(curRoute.routes);
      // 在配置文件中使用{beforeroute:,route:,afterroute:}格式配置路由
      if (curRoute.routes) {
        // 局部前置路由守卫
        if (curRoute.beforeroutes) {
          await (brPath(curRoute.beforeroutes))(req, res).then(result => result).catch(err => isStop = true);
          if (isStop) { return; }
        }

        // 局部路由
        if (typeOf(curRoute.routes) === 'Array') {
          const routes = curRoute.routes;
          let val;
          for (let j = 0; j < routes.length; j++){
            val = routes[j];
            // 执行路由模块
            handleRoute(val, (j===routes.length-1)&&isLast);
          }
        } else if (typeOf(curRoute.routes) === 'String') {
          // 执行路由模块
          handleRoute(curRoute.routes, isLast);
        } else {
          console.error('路由配置错误：只支持Array类型和String类型的值，不接受'
            + typeOf(curRoute.routes) + '类型的值！');
        }

        // 局部后置路由
        if (curRoute.afterroutes) {
          curRoute.afterroutes.forEach(async function (val) {
            await arPath(curRoute.afterroutes)(req, res);
          })
        }

      } else {
        console.error('路由配置错误：局部路由配置必须包含至少一个route');
      }

    } else {
      console.error('路由配置错误：只支持Object类型和String类型的值，不接受'
        + typeOf(curRoute.route) + '类型的值！');
    }
  }

  // 路由后置守卫
  let afterroutes = ROUTER_CONFIG.afterroutes || [];
  for (let i = 0; i < afterroutes.length; i++) {
    await require(arPath(afterroutes[i]))(req, res);
  }
}

module.exports = serverHandler;
