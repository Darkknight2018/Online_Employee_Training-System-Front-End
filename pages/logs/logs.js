//logs.js
const util = require('../../utils/util.js')
var app = getApp()

Page({
  data: {
    logs: [],
  },

  onLoad: function(){
    var staffId = wx.getStorageSync('staffId')
    var that = this

    //获取该员工的历史成绩
    wx.request({
      url: app.globalData.ipAddr + 'history',
      data: {
        staffId: staffId
      },
      method: 'POST',
      header: {
        'content-type': 'application/json' // 默认值
        },
        success: function(res){
          console.log(res.data.score)
          that.setData({
            logs: res.data.score
          })
        }
    });
  },
})
