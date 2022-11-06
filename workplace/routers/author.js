const { ErrorModel, SuccessModel } = require("../../src/model/responseModel");
const mapper = require("../../src/utils/mapper");
const author = require("../controllers/author");

module.exports = (req, res) => {
  const { isPost, isGet,isDelete} = req;

  if (mapper(isPost, '/author')) {
    return author.update(body.username, body.address, body.birthday, body.pwd)
      .then(res => new SuccessModel(200,res))
      .catch(err => new ErrorModel(500,err));
  }

  if (mapper(isGet, '/author/all')) {
    return author.findAll()
      .then(res => new SuccessModel(200, { total: res.length, data: res }))
      .catch(err => new ErrorModel(500,err));
  }

  if (mapper(isDelete, '/author/:uid')) {
    return author.delete(req.params.uid)
      .then(res => new SuccessModel(200,res))
      .catch(err => new ErrorModel(500,err));
  }

  if (mapper(isGet, '/author/:uid')) {
    return author.findByUid(req.params.uid)
      .then(res => new SuccessModel(200,res))
      .catch(err => new ErrorModel(500,err));
  }

  return Promise.reject(new ErrorModel());
}