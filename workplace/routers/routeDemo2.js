// 响应规范化。
// 你可以使用框架提供的SuccessModel和ErrorModel来规范接口的返回格式。
// 只需要导入该模块并在原来的基础上使用它们的构造函数即可。
// 代码量虽然增多，但是带来了更规范的返回格式：一个对象（不会一下子返回一个数组或对象，又或是一个普通类型）。
const { SuccessModel, ErrorModel } = require("../../src/model/responseModel");
const { bloghandler } = require('../controllers/blogHandler');
const mapper = require('../../src/utils/mapper');

const handleBlogRoute = (req, res) => {

  const { query, isGet } = req;

  if (mapper(isGet, '/api/get/detail')) {
    return bloghandler
    .getDetail(query.id)
      .then(res => res.length ? new SuccessModel(res) : new ErrorModel('该用户不存在'))
      .catch(err=>err);
    // .then(res => res.length ? res : '该用户不存在');
  }
  
  return Promise.reject(new ErrorModel(404));
  // return Promise.reject(404);
}

module.exports = handleBlogRoute;