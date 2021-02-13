var app = getApp();

Page({
  data: {
    totalScore: null, // 分数
    wrongList: [], // 错误的题数-乱序
    wrongListSort: [],  // 错误的题数-正序
    chooseValue: [], // 选择的答案
    remark: ["好极了！你很棒棒哦","哎哟不错哦","别灰心，继续努力哦！"], // 评语
    modalShow: false
  },

  onLoad: function (options) {
    console.log(options);
    wx.setNavigationBarTitle({ title: options.testInfo}) // 动态设置导航条标题
    let wrongList = JSON.parse(options.wrongList);
    let wrongListSort = JSON.parse(options.wrongListSort);
    let chooseValue = JSON.parse(options.chooseValue);
    let date = JSON.parse(options.date);
    
    this.setData({
      totalScore: options.totalScore != ""?options.totalScore:"无",
      wrongList: wrongList,
      wrongListSort: wrongListSort,
      chooseValue: chooseValue,
      date: date, //测试日期
      testInfo: options.testInfo  // 测试名称
    })
    console.log(this.data.chooseValue);

    var that = this
    var staffId = wx.getStorageSync('staffId')
    
    //上传员工ID与考试信息至服务器
    wx.request({
      url: app.globalData.ipAddr + 'submit',
      data: {
        staffId: staffId,
        testInfo: that.data.testInfo,
        totalScore: that.data.totalScore,
      },
      method: 'POST',
      header: {
      'content-type': 'application/json'
      },
    });
  },
  // 查看错题
  toView: function(){
    // 显示弹窗
    this.setData({
      modalShow: true
    })
  },
  // 返回首页
  toIndex: function(){
    wx.switchTab({
      url: '../home/home'
    })
  }
})