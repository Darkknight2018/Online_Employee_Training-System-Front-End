//获取应用实例  
var app = getApp()

Page({
  data: {
    result:"",
    scansrc:"../../image/scancode.png"
  },

  click: function () {
    var that = this
    
    //扫码获取试题名称
    wx.scanCode({
      success: function(res) {
        wx.showToast({
          title: '成功',
          icon: 'success',
          duration: 2000
        });
        that.setData({
          result: res.result
        })
        console.log(that.data.result)
    
        //从服务器获取试题
        wx.request({
          url: app.globalData.ipAddr + 'questions',
          data: {
            testInfo: that.data.result
          },
          method: 'POST',
          header: {
          'content-type': 'application/json'
          },
          //将试题暂存到本地
          success: function(res){       
            wx.setStorageSync('question',res.data.questions)
            //导航到答题页面
            var str = that.data.result+ ''
            wx.navigateTo({
            url: '../test/test?testInfo='+ str.substring(1,)
          });
        },
      });
      },
      fail: function() {
        wx.showToast({
          title: '识别失败，请重新扫描二维码',
          icon: 'none',
          duration: 2000
        })
      },
    })
  }
})