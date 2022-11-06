const { SuccessModel, ErrorModel } = require('../../src/model/responseModel');
const mapper = require('../../src/utils/mapper');
const author = require('../controllers/author');

module.exports = (req, res) => {
  const { isGet,isPut,isPost,body} = req;

  if (mapper(isPut, '/author/signup')) {
    return author.register(body.username, body.address, body.birthday, body.pwd)
  }

  if (mapper(isPost, '/author/login/nostate')) {
    return author.loginByUid(body.uid, body.pwd)
  }

  if (mapper(isGet, '/author/login/usetoken')) {
    return author.loginByToken(req.headers.authorization)
  }

  return Promise.reject(new ErrorModel());
}