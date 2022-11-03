const MYSQL_CONFIG = {
  host: 'localhost',
  user: 'root',
  password: '1234',
  port: 3306,
  database: 'test4tws'
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
  // 注册路由
  routes:['routeDemo1']
}

module.exports = {
  MYSQL_CONFIG,
  MONGODB_CONFIG,
  TWSERVER_CONFIG,
}