const path = require('path')
const resolve = dir => path.join(__dirname, dir)

module.exports = {
  publicPath: './',//根路径
  outputDir: 'dist',//构建输出目录
  assetsDir:'assets',//静态资源目录(js,css,img,fonts)
  lintOnSave:false,//是否开启eslint保存检测，有效值：true||false||error
  runtimeCompiler: true,
  // 配置路径别名
  chainWebpack: config => {
    config.resolve.alias
      .set('@', resolve('src'))
  },
  // 传递第三方插件选项
  pluginOptions: {
    
  },
  devServer: {
    open: false,//启动项目自动打开浏览器
    host: 'localhost',
    port: 8091,//端口号
    https: true,
    hotOnly: false,//webpack已经配置了
    proxy: {
      //配置跨域
      // '/api': {
      //   target: 'http//localhost:5000/api',
      //   ws: true,
      //   changOrigin: true,
      //   pathRewrite: {
      //     '^/api': ''
      //   }
      // }
    },
    disableHostCheck: true,
  },
  // 全局注入通用样式
  css: {
    loaderOptions: {

    }
  }
}
