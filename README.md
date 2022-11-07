## 介绍

后端服务器框架。twserver的目标是为前端人员提供一个开箱即用的临时服务器框架。只需简单设置路由、编写业务，就可以为自己的前端项目提供临时的后端接口和数据库支持。

- 路由支持：多路由模块、动态路由、路由拦截。
- 请求与响应：自动处理多种请求和响应格式。
- 数据库：进一步封装和简化了mysql和mongodb的查询方法。

仓库地址：https://github.com/tangqiang0605/tws

TODO:使用session和redishttps://blog.csdn.net/weixin_43422861/article/details/125687491
嵌套路由
路由doc生成：方式，参数，描述，

## 安装

`npm i twserver -D`

## 启动服务器

1. 安装完成后，你可以在已有项目根目录下的node_modules文件夹中找到twserver文件夹。如果找不到，或者没有node_modules目录，使用`npm init -y`初始化package.json，并使用命令`npm i twserver -D`重新安装twserver。
2. 将其移动到根目录中（与node_modules同级）。或直接在控制台输入命令`move node_modules\twserver .\`。
3. 输入命令`cd  twserver`进入文件夹中
4. 输入命令`npm run tws`启动服务器

注意：如果需要使用控制台执行其他命令，你可以使用Ctrl+C关闭服务器，或者新建一个终端。关闭服务器后控制台的如果当前路径仍位于twserver文件夹中，输入命令`cd  ..`可以返回到项目根目录中。

## 项目目录

在twserver项目下，有两个重要的文件夹：

- src：存放创建服务器代码的地方。
- workplace：工作区。编写服务器业务代码的地方。

你只需要在workplace中编写业务代码即可。如果你需要对服务器进行配置，也只需要修改workplace下configs文件夹里面的内容。

twserver会尽可能地在configs中提供你可能需要的配置选项。

你无需考虑src里面的代码。在src中，twserver根据配置文件构建了服务器，并自动导入路由模块并执行，自动连接数据库，自动处理请求和响应的参数并绑定到req和res的属性上。

## 工作区

需要你写代码的地方都在twserver目录下的workplace中。

包括三个文件夹。分别是configs、controllers、routers。

- configs：配置服务器、数据库、路由的地方。
- controllers：编写crud等业务代码的地方。
- routers：编写路由，调用业务的地方。
- init：在服务器启动前执行的任务。比如在服务器启动前使用mock生成假数据存入数据库中。

你可以在routes和controllers文件夹下删除或新增任意多个路由和业务处理模块。以满足你的业务需求。

## 配置服务器

在configs文件夹下包含两个配置文件：

- config.js：包含mysql数据库的配置、mongodb数据库的配置、twserver服务器的配置、路由配置。
- noPage.js：这里可以自定义网站的404错误页面。

## 业务代码

你可以在controllers下新建任意多的业务模块，最后记得导出，以供路由调用。

建议：如果你对数据库进行操作，可以把返回的结果封装为promise并返回。当然你也可以直接返回结果，然后在路由调用时再对该结果进行处理。

## 路由模块

路由就是url地址和业务的映射：当请求到对应的url时，调用对应的业务代码。

你可以在routes文件夹下删除或新增任意多个路由模块。

这是一个普通的路由：

``` js
const { bloghandler } = require('../controllers/blogHandler');
const mapper = require('../../src/utils/mapper');

const handleBlogRoute = (req, res) => {

  const { path, query, body, isGet, isPost } = req;
    
  if (mapper(isGet, '/api/:id/:author')) {
    const { params } = req;
    return Promise.resolve(params);
  }
  return Promise.reject(404);
}

module.exports = handleBlogRoute;
```

下面将采用渐进式的方式介绍路由的使用：

新建路由：在workpalce/routers下新建JavaScript文件，名字任意。例如：routeDemo。我们称每一个routers下的JavaScript文件为路由模块。

注册路由：你需要在configs/config.js中注册你新创建的路由模块。在routes数组中添加模块的名字（文件名）。

``` js
const ROUTER_CONFIG = {
  // 注册路由
  brpath:'../workplace/routers',
  beforeroute: [],

  routespath:'../workplace/routers',
  routes: ['routeDemo'],

  arpath: '../workplace/routers',
  afterroute: []
}
```

定义函数：在路由模块中定义函数：该函数接收来自服务器的两个参数request和response，然后将该方法通过exports暴露出去。注意，请将函数直接暴露出去而不是暴露一个包含该函数的对象或数组。如果你需要暴露多个方法，你可以新建一个路由模块，或者，导出一个对象(你只需要保证函数的返回类型为promise)

``` javascript
module.exports = {
	myroute1,
    myroute2,
    myroute3
}
```

假设你在controllers/blogHandler.js中已经编写完成你的业务代码（先忽略业务的实现细节），下面我们将它和路由联系起来。

``` js
const { bloghandler } = require('../controllers/blogHandler');

const myRoute (req, res) {
  if (req.method === 'GET' && req.path === '/api/getdetail')) {
    // return的值必须是一个promise
    return bloghandler
      .getDetail(query.id)
      .then(res => res.length ? res : '该用户不存在');
  }
}
module.exports = myRoute;
```

以上，我们完成了一个简单的路由。你可以根据需要添加多个if语句来匹配不同的url。

我们还可以对if语句进行简化、对req中的常用属性进行解构赋值（设为const，只读），当if语句增多时，这两行代码可以有效地提高我们的开发效率：

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

第四行代码，我们通过析构赋值取出了req其中有用的变量：

- path：url的相对路径
- query：一个包含get参数的普通对象
- boyd：一个包含post参数的普通对象
- isGet：如果是get请求，返回1，否则，返回0
- isPost：如果是post请求，返回1，否则，返回0

另外，还有一个有用的属性：params，这是一个包含动态路由匹配结果的对象，我们将在下文的动态路由中讲到。

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

实际上，twserver已经为我们提供了一个mapper方法，该方法可以替代我们自己写的mapper，而且还支持动态路由。

```js
const mapper = require('../../src/utils/mapper');

if (mapper(isGet, '/api/:id/:author')) {
    // 动态路由是在mapper方法里处理的，所以只有在调用mapper方法后，才能在req里找到parmas。
    const { params } = req;
    return Promise.resolve(params);
}
```

我们只需要导入mapper，就可以实现动态路由的处理：在调用mapper后，可以从req中读取到params对象，以属性的形式存储了动态路由的匹配结果。

总结：

- 创建路由文件
- 注册路由
- 路由模块
  - 导出一个特殊的函数（接受参数为req和res，返回值为promise类型）
  - 导入controllers
  - 导入mapper
  - 编写if语句调用mapper，然后执行对应controllers的方法
- 启动服务器

## 路由拦截

当你需要使用路由拦截（路由守卫）时，你可以添加一个普通的路由模块，然后将它放在routes数组的第一个，只需要根据条件返回不同的promise即可，其实就已经实现了路由拦截。

除此之外，twserver提供了真实的路由守卫，你可以在configs文件中的beforeroute数组中注册全局路由守卫并使用路由守卫，路由守卫的用法和路由模块类似，你需要确保返回值不为空且是promise类型。此外你还可以使用全局后置路由守卫。唯一与普通路由模块不同的是，在路由守卫中，你只能导出一个函数，所以，当你有多个函数需要导出使用时，应该拆分成多个路由守卫，每个路由守卫只导出一个函数。（后续可能会支持一个路由守卫导出多个中间件，但也可能不会，一个合理的实践是，一个路由守卫导出一个函数而不是多个函数）

``` js
const ROUTER_CONFIG = {
  // 注册路由
  brpath:'../workplace/routers',
  beforeroutes: ['myBr'],

  routespath:'../workplace/routers',
  routes: ['routeDemo1','routeDemo2'],

  arpath: '../workplace/routers',
  afterroutes: ['myAr'],

  logwhenrunning: true
}
```

你还可以在routes中配置局部路由守卫。

``` js
const ROUTER_CONFIG = {
  // 注册路由
  brpath:'../workplace/routers',
  beforeroutes: ['myBr'],

  routespath:'../workplace/routers',
  routes: [
      'routeDemo1',
      {
          beforeroutes:['myBr2'],
          routes:['routeDemo2','routeDemo3']
          afterroutes:['myAr2']
      }
  ],

  arpath: '../workplace/routers',
  afterroutes: ['myAr'],

  logwhenrunning: true
}
```

## 使用数据库

twserve提供了两种数据库的使用方法，以简化业务的增删查改，只需最多四行代码就可以实现crud以及方便的异常处理：

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

导入模块时，会根据配置文件自动连接数据库。如果数据库查询失败，请确保数据库服务是否在运行中以及配置文件的内容是否正确。

导入模块后即可执行查询操作。

twserver提供了查询方法execSQL，返回一个promise。对于mysql，我们还自动处理了连接池。

对于execSQL不支持的功能，你可以参照方法二使用npm上mysql、mongoose提供的方法。

