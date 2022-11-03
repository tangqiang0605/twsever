const { bloghandler } = require('../controllers/blogHandler');
const mapper = require('../../src/utils/mapper');

const handleBlogRoute = (req, res) => {

  const { path, query, body, isGet, isPost } = req;
  // 接口实例。我们只需要确认请求方式、请求的地址、引用我们的handler函数，以及成功或失败的回调即可。
  // if (映射关系) {
  //   查询语句的参数处理（一般不需要处理或者处理数据为空的情况）get的参数对象为query，post的参数对象为body。
  //   return handler函数(查询语句的参数).then(res => {
  //     res：查询结果
  //     根据查询结果返回SuccessModel或ErrorModel
  //     接受两个参数data和message
  //   })
  // }

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
  if (mapper(isGet, '/api/:id/:author')) {
    // 动态路由是在mapper方法里处理的，所以只有在调用mapper方法后，才能在req里找到parmas。
    const { params } = req;
    return Promise.resolve(params);
  }

  return Promise.reject(404);
}

module.exports = handleBlogRoute;