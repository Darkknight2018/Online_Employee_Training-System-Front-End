var app = getApp()

Page({
  data: {
    StaffId: '',
    password: '',
    index: '0',
    selectArray:[{
      "index": "1",
      "value": "是"
    },
    {
      "index": "0",
      "value": "否"
    },
  ]
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

  //选择登录的身份
  select: function(e) {
    console.log(e.detail.index)
    this.setData({
      index: e.detail.index
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
        password: that.data.password,
        IfAdmin: this.data.index
      },
      method: 'POST',
      header: {
        'content-type': 'application/json'
      },
      success: function(res){
        if(res.data.code == 1){
          wx.switchTab({
            url: '../home/home'
          })
        }
        else if(res.data.code == 2){
          wx.navigateTo({
            url: '../qrcode/qrcode'
          })
        }
        else{
          wx.showModal({
            title: res.data.msg,
            icon: 'none',
            duration: 2000
          })
        }
      },
      fail: function(){
        wx.showModal({
          title: '服务器连接失败',
          icon: 'none',
          duration: 2000
        })
      }
    });
  }
})