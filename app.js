//app.js
// 导入数据
const ipAddr = 'http://localhost:1486/'
App({
  //设置服务器地址为全局变量
  globalData: {
    ipAddr: ipAddr,
  }
})