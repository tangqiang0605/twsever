## 介绍
后端服务器框架。twserver的目标是为前端人员提供一个开箱即用的临时服务器框架。只需简单设置路由、编写业务，就可以为自己的前端项目提供临时的后端接口和数据库支持。

## 更新

- 更加完善的说明文档

- 支持多个路由模块
- 支持
- 自动处理json格式的请求
- 自动处理x-www-form-urlencoded格式的请求
- 封装了mysql查询方法
- 封装了mongodb

## 安装
`npm i twserver -D`

## 快速上手

1. 启动服务器。

   依次执行三条命令：`move node_modules\twserver .\`，`cd  twserver`，`npm run tws`。

2. 配置服务器。

   根据需要，修改twserver/workplace/configs/config.js中的服务器配置、数据库配置。

3. 编写路由。

   1. 在twserver/workplace/routers下新建JavaScript文件
   2. 注册路由：将文件名写入到config.js服务器配置的routes数组中。
   3. 该文件必须暴露一个接收request和response为参数，返回值为promise的函数。
   4. 在函数中写if条件判断request.path是不是请求的url地址，并进行响应。

4. 编写业务代码。

## 启动服务器
1. 安装完成后，你可以在已有项目根目录下的node_modules文件夹中找到twserver文件夹，将其移动到根目录中（与node_modules同级）。(或直接在控制台输入命令`move node_modules\twserver .\`)。
2. 输入命令`cd  twserver`进入文件夹中
3. 输入命令`npm run tws`启动服务器
4. 如果需要使用控制台执行其他命令，你可以使用Ctrl+C关闭服务器，或者新建一个终端。注意，关闭服务器后控制台的当前路径仍位于twserver文件夹中，输入命令`cd  ..`可以返回到项目根目录中。

## 工作区

需要你写代码的地方都在twserver目录下的workplace中。

包括三个文件夹。分别是configs、controllers、routers。

- configs：配置服务器、数据库的地方。
- controllers：编写crud等业务代码的地方。
- routers：配置路由，调用controller的地方。

你可以在routes和controllers文件夹下删除或新增任意多个路由和业务处理模块。以满足你的业务需求。

## 使用路由
路由就是url地址和函数的映射：当请求到对应的url时，执行对应的函数。

你可以定义映射的规则：在router下新建文件，并编写简单的代码描述这一规则。当符合对应的url时，调用controller文件夹下对应的处理方法。

你可以在route文件夹下删除或新增任意多个路由模块。

新建路由：在workpalce/routers下新建JavaScript文件，名字任意。例如：index.js。我们称每一个routers下的JavaScript文件为路由模块。

注册路由：你需要在configs/config.js中注册你新创建的路由模块。

``` js
const TWSERVER_CONFIG = {
  returnform: 'json',
  port: 5000,
  // 你需要做的就是在routes数组中将新建路由模块的文件名写上去  
  routes:['index']
}
```

定义函数：在路由模块中定义函数，该函数接收来自服务器的两个参数request和response，然后将该方法通过exports暴露出去。注意，请将函数直接暴露出去而不是暴露一个包含该函数的对象。如果你需要暴露多个方法，这是不允许的，你只能新建另一个路由模块，即，一个路由模块只能暴露一个函数。

``` js
const myRoute ( req , res ) {

}
module.exports = myRoute;
```

假设你在controllers/blogHandler.js中已经编写完成你的业务代码，下面我们将它和路由联系起来。

``` js
const { bloghandler } = require('../controllers/blogHandler');

const myRoute (req, res) {
  if (req.method === 'GET' && req.path === '/api/getdetail')) {
    // 暴露的函数return的值必须是一个promise
    return bloghandler
      .getDetail(query.id)
      .then(res => res.length ? res : '该用户不存在');
  }
}
module.exports = myRoute;
```

在项目的router/index.js中，你可以看到这两行有用的代码。它们可以帮助你简化代码（当我们写了很多url匹配规则时，这将非常有用）。

``` js
  const mapper = (way, url) => way && url === path;
  const { path, query, body, isGet, isPost } = req;
```

 简化上面的代码：

``` js
const { bloghandler } = require('../controllers/blogHandler');

const myRoute (req, res) {
  const mapper = (way, url) => way && url === path;
  const { path, query, body, isGet, isPost } = req;
  if (mapper(isGet, '/api/getdetail')) {
    return bloghandler
      .getDetail(query.id)
      .then(res => res.length ? res : '该用户不存在');
  }
}
module.exports = myRoute;
```

第四行，我们通过析构赋值取出了req其中有用的变量：

- path：url的相对路径
- query：一个包含get参数的普通对象
- boyd：一个包含post参数的普通对象
- isGet：如果是get请求，返回1，否则，返回0
- isPost：如果是post请求，返回1，否则，返回0

下面是一个路由模块的示例，该路由包含了两个api接口：

``` js
const { SuccessModel, ErrorModel } = require("../../src/model/responseModel");
const { bloghandler } = require('../controllers/blogHandler');

const handleBlogRoute = (req, res) => {

  const mapper = (way, url) => way && url === path;
  const { path, query, body, isGet, isPost } = req;

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
```

你可能注意到了第一行代码（导入响应模型）。这是为了规范响应的数据。你也可以不使用它。你只需要保证return的值必须是一个promise（你可以使用async修饰暴露的函数，以确保返回值一定是一个promise）。

## 配置服务器

你可以在config.js中配置服务器和数据库的相关信息。

你可以在noPage.js中配置404空白页的内容。

## 业务模块

你可以在controllers文件夹下自由地编写业务代码。然后通过routers中的文件导入使用即可。

twserve提供了两种数据库的使用方法，以简化业务的增删查改，只需最多四行代码就可以实现crud以及方便的异常处理（多亏了promise）：

1. mongodb数据库

```js
// 配置数据库(在config文件中)

// 导入模块
const mongodb = require('../../src/db/twmysql')

// 连接collection
const tempusers = mongodb.useCol('tempusers', { username: String, pwd: String });
const users = mongodb.useCol('users', { username: String, pwd: String });

// 执行sql查询
// 方式一:使用twserver模块提供的方法:返回一个promise
tempusers.execSQL('insert', { username: 'aaa', pwd: 'temp' }).then(result => console.log(result));
users.execSQL('insert', { username: 'zzzz', pwd: 'aaaa' }).then(result => console.log(result));
// 方式二:使用mongoose模块提供的方法:返回一个promise
users.model.create({ username: 'zzzz', pwd: 'aaaa' }).then(result => console.log(result));

```

2. mysql数据库

``` js
// 配置数据库(在config文件中)

// 导入模块
const msyql = require('../../src/db/twmysql');

// 执行sql查询
// 方式一:使用twserver模块提供的方法:返回一个promise
msyql.execSQL('select * from blogs').then(result => console.log(result));
// 方式二:使用mysql模块提供的方法
msyql.query('select * from blogs', (err, res) => console.log(res));

```