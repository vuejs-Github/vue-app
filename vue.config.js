const path = require('path')
const resolve = dir => path.join(__dirname, dir)

module.exports = {
  // baseUrl: './',
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
  devServer: {
    disableHostCheck: true,
  },
  // 全局注入通用样式
  css: {
    loaderOptions: {

    }
  }
}
