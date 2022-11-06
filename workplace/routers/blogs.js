const { ErrorModel } = require("../../src/model/responseModel");
const mapper = require("../../src/utils/mapper");
const blogs = require("../controllers/blogs");

module.exports = (req, res) => {
  const { isPost, isGet, isPut, isDelete, body } = req;

  if (mapper(isPut, '/blogs')) {
    return blogs.insert(body.uid, body.title, body.date, body.context);
  }

  if (mapper(isPost, '/blogs')) {
    return blogs.updateByBid(body.bid, body.uid, body.title, body.date, body.context);
  }

  if (mapper(isDelete, '/blogs/:bid')) {
    return blogs.delete(req.params.bid);
  }

  if (mapper(isGet, '/blogs/all')) {
    return blogs.findAll();
  }

  if (mapper(isGet, '/blogs/:bid')) {
    return blogs.findByBid(req.params.bid);
  }

  return Promise.reject(new ErrorModel());
}