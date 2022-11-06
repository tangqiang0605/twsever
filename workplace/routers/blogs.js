const { ErrorModel, SuccessModel } = require("../../src/model/responseModel");
const mapper = require("../../src/utils/mapper");
const blogs = require("../controllers/blogs");

module.exports = (req, res) => {
  const { isPost, isGet, isPut,isDelete,body} = req;

  if (mapper(isPut, '/blogs')) {
    return blogs.insert(body.uid, body.title, body.date, body.context);
  }

  if (mapper(isPost, '/blogs')) {
    return blogs.updateByBid(body.bid, body.uid, body.title, body.date, body.context);
  }

  if (mapper(isDelete, '/blogs/:bid')) {
    return blogs.delete(req.params.bid)
      .then(res => new SuccessModel(200,res))
      .catch(err => new ErrorModel(500,err));
  }

  if (mapper(isGet, '/blogs/all')) {
    return blogs.findAll()
      .then(res => new SuccessModel(200,{ total:res.length,data:res }))
      .catch(err => new ErrorModel(500,err));
  }

  if (mapper(isGet, '/blogs/:bid')) {
    return blogs.findByBid(req.params.bid)
      .then(res => new SuccessModel(200,res))
      .catch(err => new ErrorModel(500,err));
  }

  return Promise.reject(new ErrorModel());
}