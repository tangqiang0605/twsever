const { ErrorModel } = require("../../src/model/responseModel");
const mapper = require("../../src/utils/mapper");
const author = require("../controllers/author");

module.exports = (req, res) => {
  const { isPost, isGet, isDelete } = req;

  if (mapper(isPost, '/author')) {
    return author.update(body.username, body.address, body.birthday, body.pwd);
  }

  if (mapper(isGet, '/author/all')) {
    return author.findAll();
  }

  if (mapper(isDelete, '/author/:uid')) {
    return author.delete(req.params.uid);
  }

  if (mapper(isGet, '/author/:uid')) {
    return author.findByUid(req.params.uid);
  }

  return Promise.reject(new ErrorModel());
}