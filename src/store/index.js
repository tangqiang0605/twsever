const store = {};
// 可以设置为空对象，因为在路由匹配时这个对象会被重写。
// 但是这里仍然写清楚是为了开发中引用store.req会有代码提示。
store.req = { path: '', query: {}, body: {}, params: {}, isGet: false, isPost: false,method:'NULL'};
store.res = {};

module.exports = store;