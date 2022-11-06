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

    // console.log(req.headers['content-type']);
    switch (req.headers['content-type']) {
      case 'application/json':
        req.on('end', () => postData ? resolve(JSON.parse(postData)) : resolve({}));
        break;
      case 'application/x-www-form-urlencoded':
        // console.log(USP2Obj(new URLSearchParams(postData)));
        req.on('end', () => resolve(USP2Obj(new URLSearchParams(postData))));
        break;
      case 'text/plain':
      case 'multipart/form-data':
      // var form = new multiparty.Form();

      // form.parse(req, function (err, fields, files) {
      //   res.writeHead(200, { 'content-type': 'text/plain' });
      //   res.write('received upload:\n\n');
      //   res.end(util.inspect({ fields: fields, files: files }));
      // });
      default:
        resolve({});
    }
    // if (req.headers['content-type'] === 'application/json') {
    //   req.on('end', () => postData ? resolve(JSON.parse(postData)) : resolve({}));
    // } else if (req.headers['content-type'] === 'application/x-www-form-urlencoded') {
    //   req.on('end', () => resolve(USP2Obj(new URLSearchParams(postData))));
    // } else {
    //   resolve({});
    // }
  })

  return promise;
}

module.exports = async function (req) {
  req.path = req.url.split('?')[0];
  req.query = querystring.parse(req.url.split('?')[1]);
  req.isGet = req.method === 'GET' ? 1 : 0;
  req.isPost = req.method === 'POST' ? 1 : 0;
  req.isPut = req.method === 'PUT' ? 1 : 0;
  req.isDelete = req.method === 'DELETE' ? 1 : 0;
  req.body = req.isPost || req.isPut ? await getPostData(req) : {};
}