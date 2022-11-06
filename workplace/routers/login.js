const { SuccessModel, ErrorModel } = require('../../src/model/responseModel');
const mapper = require('../../src/utils/mapper');
const author = require('../controllers/author');

module.exports = (req, res) => {
  const { isPut,isPost,body} = req;

  if (mapper(isPut, '/author/signup')) {
    return author.register(body.username, body.address, body.birthday, body.pwd)
      .then(res => new SuccessModel(200,res))
      .catch(err => new ErrorModel(500,err));
  }

  if (mapper(isPost, '/author/login')) {
    return author.loginByUid(body.uid, body.pwd)
      .then(res => new SuccessModel(200,res))
      .then(err => new ErrorModel(500,err));
  }

  return Promise.reject(new ErrorModel());
}