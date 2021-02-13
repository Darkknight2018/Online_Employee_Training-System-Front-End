var app = getApp()

Page({
  data: {
    StaffId: '',
    password: '',
  },

  //获取输入的ID
  idInput: function (e) {
    var that = this
    that.setData({
      StaffId: e.detail.value
    })
    wx.setStorageSync('staffId',that.data.StaffId)
  },

  // 获取输入的密码
  passwordInput: function (e) {
    this.setData({
      password: e.detail.value
    })
  },

  // 登录
  login: function () {
    var i = 0;
    var a = 0;
    var that = this

    //若输入为空，则给出提示
    if (that.data.password.length < 1 || that.data.StaffId.length < 1) {
      wx.showModal({
        title: '错误信息',
        content: '请输入用户名和密码',
        showCancel: false
      });
      return false;
    }
    
    //将输入的信息发送给服务器验证
    wx.request({
      url: app.globalData.ipAddr + 'login',
      data: {
        StaffId: that.data.StaffId,
        password: that.data.password
      },
      method: 'POST',
      header: {
        'content-type': 'application/json'
      },
      success: function(res){
        if(res.data.code == 1){
          wx.switchTab({
            url: '../home/home'
          })}
        if(res.data.code == -1){
          wx.showToast({
            title: '账号或密码有错误',
            icon: 'none',
            duration: 2000
          })
        }
      },
      fail: function(){
        wx.showToast({
          title: '登录失败',
          icon: 'none',
          duration: 2000
        })
      }
    });
  }
})