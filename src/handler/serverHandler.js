const handleRoute = require('../../workplace/routers/index');
const noPage = require('../../workplace/configs/noPage');
const resHandler = require('./resHandler')
const reqHandler = require('./reqHandler');
const resEnd = require('./endHandler')
const path = require('path');
const routePath = (routeName) => path.join(__dirname, '../../workplace/routers/', routeName);
const { TWSERVER_CONFIG } = require('../../workplace/configs/config');

const serverHandler = async (req, res) => {
  // 数据处理
  await resHandler(res);
  await reqHandler(req);
  // 路由前置守卫
  // await beforeRoute(req,res);
  // 路由匹配
  // 路由一 
  // await handleRoute(req, res).then(result => resEnd(res, result))
  // .catch(err => err.data === 404 ? noPage(res) : console.log(err));

  // 可以照例引入路由二

  let routes = TWSERVER_CONFIG.routes || [];
  // 这里只允许一个路由js包含一个方法,也就是export只能导出一个方法而不能有多个.
  // 后期将支持一个路由js中写多个方法并以数组或对象的形式导出,允许导出时多层嵌套(需要一个递归函数来实现)
  for (let i = 0; i < routes.length; i++) {
    await require(routePath(routes[i]))(req, res)
      .then(result => resEnd(res, result))
      .catch(err => err.data === 404 ? noPage(res) : console.log(err));
  }

  // 路由后置守卫
  // await afterRoute(req, res);
}

module.exports = serverHandler;
