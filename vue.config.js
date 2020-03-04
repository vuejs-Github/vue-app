
module.exports = {
  lintOnSave: false,
  devServer: {
    // open: true,
    proxy: {
      "/api": {
        target: 'http://localhost:3011', // 模拟数据
        pathRewrite: {
          "^/api": ""
        },
        changeOrigin: true
      }
    }
  }
}