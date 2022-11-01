const { SuccessModel, ErrorModel } = require("../../src/model/responseModel");
const { bloghandler } = require('../controllers/blogHandler');

const handleBlogRoute = (req, res) => {

  const mapper = (way, url) => way && url === path;
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

  if (mapper(isGet,'/api/getdetail')) {
    return bloghandler
      .getDetail(query.id)
      .then(res => res.length ? new SuccessModel(res) : new ErrorModel('该用户不存在'));
  }

  if (mapper(isPost, '/api/new')) {
    return bloghandler
      .insertData({ title: body.title, context: body.context, author: body.author })
      .then(res => new SuccessModel(res));
  }

  return Promise.reject(new ErrorModel(404));
}

module.exports = handleBlogRoute;