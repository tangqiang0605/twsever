const MYSQL_CONFIG = {
  host: 'localhost',
  user: 'root',
  password: '1234',
  port: 3306,
  database: 'db4tws'
};

const MONGODB_CONFIG = {
  host: 'localhost',
  port: 27017,
  database: 'tempdb'
}

const TWSERVER_CONFIG = {
  // returnform:调用接口后返回内容的格式
  // 设置为json,调用接口后返回的是json格式,适合api服务器/前后端分离项目
  // 设置为html,调用接口后返回的是html页面,适合静态服务器/服务端渲染项目
  returnform: 'json',
  // 后端服务器端口
  port: 5000,
}

const ROUTER_CONFIG = {
  // 注册路由
  brpath:'../workplace/routers',
  beforeroutes: [],

  routespath:'../workplace/routers',
  // routes: ['routeDemo1','routeDemo2'],
  routes:['author','login','blogs'],

  arpath: '../workplace/routers',
  afterroutes: [],

  logwhenrunning: true
}

module.exports = {
  MYSQL_CONFIG,
  MONGODB_CONFIG,
  TWSERVER_CONFIG,
  ROUTER_CONFIG
}