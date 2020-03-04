/**
 * 模拟后台服务器
 */
const koa = require('koa');
const compress = require('koa-compress');
const bodyParser = require('koa-bodyparser');
const router = require('./routes');
const serve = require('koa-static');
const app = koa();
const path = require('path');

app.use(compress());
app.use(serve(path.join(__dirname, 'www')));
app.use(bodyParser());

const ALLOW_ORIGIN = [
  // 域名白名单
  'http://0.0.0.0:8888',
  'http://127.0.0.1:8888',
  'http://localhost:8888',
  'http://localhost:8080',
  'http://localhost:8889'
];
function isOriginAllowed(origin, allowedOrigin) {
  if (Array.isArray(allowedOrigin)) {
    for (var i = 0; i < allowedOrigin.length; ++i) {
      if (isOriginAllowed(origin, allowedOrigin[i])) {
        return true;
      }
    }
    return false;
  } else if (allowedOrigin) {
    return origin === allowedOrigin;
  } else if (allowedOrigin instanceof RegExp) {
    return allowedOrigin.test(origin);
  } else {
    return !!allowedOrigin;
  }
}
// x-response-time
app.use(function*(next) {
  let reqOrigin = this.request.headers.origin;
  if (true) {
    // if (isOriginAllowed(reqOrigin, ALLOW_ORIGIN)) {
    console.log(this.request.originalUrl);
    const start = new Date();
    this.set({
      'Access-Control-Allow-Origin': reqOrigin,
      'Access-Control-Allow-Credentials': true,
      'Access-Control-Allow-Methods': 'GET, POST, PUT,DELETE',
      'Access-Control-Allow-Headers':
        ' Origin, X-Requested-With,Authorization,Content-Type, Accept'
    });
    try {
      yield next;
      yield sleep(1);
      const ms = new Date() - start;
      this.set({
        'X-Response-Time': ms + 'ms'
      });
    } catch (err) {
      console.log('捕获了程序的异常', new Date(), err);
    }
  }
});

// 延迟指定时间返回
const sleep = function(time) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve();
    }, time * 1000);
  });
};
app.use(function*(next) {
  // 模拟权限认证失败 if (this.request.headers['authorization'] === '' && this.method !==
  // 'OPTIONS' && this.url !== '/api/login') {   this.body = {     code: 201,
  // msg: '登录失效'   } }
  yield next;
  if (this.body) {
    this.body = this.body;
  }
});
// 配置路由
app.use(router.routes());
app.use(router.allowedMethods());
app.listen(3011, () => {
  console.log('start mock server');
});
