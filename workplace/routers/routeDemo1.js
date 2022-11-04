// controllers的使用、路由模块的导出、mapper处理请求

const { bloghandler } = require('../controllers/blogHandler');
const mapper = require('../../src/utils/mapper');

const handleBlogRoute = (req, res) => {
  // 注意：params只有在调用mapper方法后才有值
  const { path, query, body, isGet, isPost,params} = req;

  // 处理GET请求
  if (mapper(isGet, '/api/getdetail')) {
    // 在getDetail中使用了twserver框架提供的mysql查询方法（推荐）。
    return bloghandler
      .getDetail(query.id)
      .then(res => res.length ? res : '该用户不存在');
  }
  if (mapper(isGet, '/api/getdetail2')) {
    // 在getDetail2中使用了mysql提供的查询方法。
    return bloghandler.getDetail2(query.id).then(res => res.length ? res : '该用户不存在').catch(err => err);
  }

  // 处理POST请求
  if (mapper(isPost, '/api/new')) {
    return bloghandler
      .insertData({ title: body.title, context: body.context, author: body.author })
      .then(res => res);
  }

  // 处理动态路由
  // 只要前面的路由匹配到了，后面的路由就不会执行。
  // 所以，最佳实践是，把动态路由写在静态路由后面。
  if (mapper(isGet, '/api/:id')) {
    // 动态路由是在mapper方法里处理的，所以只有在调用mapper方法后，才能在req里找到parmas。
    const { params } = req;
    return Promise.resolve(params);
  }

  // 如果都没有匹配成功，返回404
  return Promise.reject(404);
}

module.exports = handleBlogRoute;