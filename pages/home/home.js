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
            let questionList = that.transferOptions(res.data.questions)
            wx.setStorageSync('question', questionList)
            //导航到答题页面
            let str = that.data.result+ ''
            //提取测试名称
            str = str.replace(/[0-9]/g,'')
            console.log(str)
            wx.navigateTo({
            url: '../test/test?testInfo='+ str
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
  },

  //将服务器中的选项数据整合进一个字典，方便test页面渲染
  transferOptions: function(questionList){
    let optNames = ['ChoiceA', 'ChoiceB', 'ChoiceC', 'ChoiceD', 'ChoiceE', 'ChoiceF']
    let alg = ['A', 'B', 'C', 'D', 'E', 'F']

     for(let i=0; i < questionList.length; i++){
      let option = {}
      for(let each in optNames){
        var temp = questionList[i][optNames[each]]
        if(temp){
          option[alg[each]] = temp
        }
      }
      questionList[i]['option'] = option
    }
    console.log(questionList)
    return questionList
  }
})