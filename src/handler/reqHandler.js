const querystring = require('querystring');

const USP2Obj = (USP) => {
  let obj = {};
  USP.forEach((value, key) => obj[key] = value);
  return obj;
}

const getPostData = (req) => {
  const promise = new Promise(resolve => {
    let postData = '';
    req.on('data', chunk => postData += chunk.toString());

    if (req.headers['content-type'] === 'application/json') {
      req.on('end', () => postData ? resolve(JSON.parse(postData)) : resolve({}));
    } else if (req.headers['content-type'] === 'application/x-www-form-urlencoded') {
      req.on('end', () => resolve(USP2Obj(new URLSearchParams(postData))));
    } else {
      resolve({});
    }
  })

  return promise;
}

module.exports = async function (req) {
  req.path = req.url.split('?')[0];
  req.query = querystring.parse(req.url.split('?')[1]);
  req.isGet = req.method === 'GET' ? 1 : 0;
  req.isPost = req.method === 'POST' ? 1 : 0;
  req.body = req.isPost ? await getPostData(req) : {};
}