const router = require('koa-router')()
const url = require('../../api/url')
const risk = require('./risk')
/**
 * 统一删除前缀webUrl适配mock
 */
Object.getOwnPropertyNames(url).forEach(item => {
  if (url[item].indexOf('http') > -1) {
    const arr = url[item].split('/')
    url[item] = '/' + arr.splice(3, arr.length).join('/')
  }
})

router.get(url.test, function () {
  this.body = risk.risk
})

module.exports = router
