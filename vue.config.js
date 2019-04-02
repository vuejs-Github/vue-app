const path = require('path')
const resolve = dir => path.join(__dirname, dir)
const fs = require('fs')

module.exports = {
  baseUrl: './',
  runtimeCompiler: true,
  // 配置路径别名
  chainWebpack: config => {
    config.resolve.alias
      .set('@', resolve('src'))
      .set('api', resolve('api/'))
  },
  // 传递第三方插件选项
  pluginOptions: {
    
  },
  // 全局注入通用样式
  css: {
    loaderOptions: {

    }
  }
}
