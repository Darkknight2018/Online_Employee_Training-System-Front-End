const util = require('../../utils/util.js')
var app = getApp();

Page({
  data: {
    index: 0,  // 题目序列
    chooseValue: [], // 选择的答案序列
    totalScore: 100, // 总分
    bottonText: "下一题", //按钮上的文字
    wrong: 0, // 错误的题目数量
    wrongList: [], // 错误的题目集合-按乱序后的顺序
    wrongListSort: [], // 错误的题目集合-按原数据库中的顺序
  },
  onLoad: function (options) {
    console.log(options);
    wx.setNavigationBarTitle({ title: options.testInfo }) // 动态设置导航条标题
    
    var n
    var questionList = wx.getStorageSync('question')
    var optNames = ['ChoiceA', 'ChoiceB', 'ChoiceC', 'ChoiceD', 'ChoiceE', 'ChoiceF']
    var alg = ['A', 'B', 'C', 'D', 'E', 'F']
    var num = questionList.length; //题目数量
    
    //将服务器中的选项数据转换为合适的格式
    for(let i=0; i < questionList.length; i++){
      var option = {}
      for(let each in optNames){
        var temp = questionList[i][optNames[each]]
        if(temp){
          option[alg[each]] = temp
        }
      }
      questionList[i]['option'] = option
    }
    
    this.setData({
      questionList: questionList, //测试题目
      testInfo: options.testInfo, // 测试名称
      testDate: new Date().getTime() //测试日期
    })

    let count = this.generateArray(0, num); // 生成题序 
    this.setData({
      shuffleIndex: this.shuffle(count) // 生成随机题序,并截取10道题 
    })
    console.log(this.data.shuffleIndex)
  },
  
  //数组乱序/洗牌 （Knuth-Durstenfeld Shuffle 换牌算法）
  shuffle: function (arr) {
    let i = arr.length;
    while (i) {
      let j = Math.floor(Math.random() * i--); //i--的含义是，引用的时候是原值，引用完成后再执行-操作
      [arr[j], arr[i]] = [arr[i], arr[j]];
    }
    return arr;
  },
  
  //单选事件
  radioChange: function(e){
    console.log('checkbox发生change事件，携带value值为：', e.detail.value)
    this.data.chooseValue[this.data.index] = e.detail.value;
    console.log(this.data.chooseValue);
  },
 
  //多选事件
  checkboxChange:function(e){
    console.log(e.detail)
    console.log('checkbox发生change事件，携带value值为：', e.detail.value)
    this.data.chooseValue[this.data.index] = e.detail.value.sort();
    console.log(this.data.chooseValue);
  },
  
  //退出答题 按钮
  outTest: function(){
    wx.showModal({
      title: '提示',
      content: '你真的要退出答题吗？',
      success(res) {
        if (res.confirm) {
          console.log('用户点击确定')
          wx.switchTab({
            url: '../home/home'
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },

  //下一题/提交 按钮
  nextSubmit: function(){
    // 如果没有选择
    if (this.data.chooseValue[this.data.index] == undefined || this.data.chooseValue[this.data.index].length == 0) {  
      wx.showToast({
        title: '请选择至少一个答案!',
        icon: 'none',
        duration: 2000,
        success: function(){
          return;
        }
      })
      return;
    }

    // 判断答案是否正确
    this.chooseError();

    // 判断是不是最后一题
    if (this.data.index < this.data.shuffleIndex.length - 1) {
      // 不是，则渲染下一题：改变index，使视图层重新渲染
      this.setData({
        index: this.data.index + 1
      })
    } else {
      //是，则将错题号和正确答案一并传入到后面的页面中
      var time = util.formatTime(new Date())
      let date = JSON.stringify(time)
      let wrongList = JSON.stringify(this.data.wrongList);
      let wrongListSort = JSON.stringify(this.data.wrongListSort);
      let chooseValue = JSON.stringify(this.data.chooseValue);
      wx.navigateTo({
        url: '../results/results?totalScore=' + this.data.totalScore + 
        '&wrongList=' + wrongList + '&chooseValue=' + chooseValue + 
        '&wrongListSort=' + wrongListSort + '&testInfo=' + this.data.testInfo +
        '&date=' + date 
      })
     }
  },

  //错题处理
  chooseError: function(){
    var trueValue = this.data.questionList[this.data.shuffleIndex[this.data.index]]['Answer']; 
    var chooseVal = this.data.chooseValue[this.data.index];
    console.log('选择了' + chooseVal + '答案是' + trueValue);
    if (chooseVal.toString() != trueValue.toString()) {
      console.log('错了');
      this.data.wrong++;
      this.data.wrongListSort.push(this.data.index);
      this.data.wrongList.push(this.data.shuffleIndex[this.data.index]);
      this.data.totalScore = this.data.totalScore - this.data.questionList[this.data.shuffleIndex[this.data.index]]['Weights']
    }
  },

  /**
     * 生成一个从 start 到 end 的连续数组
     * @param start
     * @param end
     */
  generateArray: function(start, end) {
    return Array.from(new Array(end).keys())
  }
})