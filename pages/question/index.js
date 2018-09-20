const HOST = 'http://local.collegewiki.com/api/miniprogram/'

Page({
  data: {
    question: {},
    answers: [],
    showShareModal: false,
    dialogConfig: {
      type: '',           //设置弹窗显示类型 ->默认：0 （0表示信息框，1表示页面层）
      title: '',          //标题
      content: '',        //内容
      style: '',          //自定弹窗样式
      skin: '',           //自定弹窗显示风格 ->目前支持配置 toast(仿微信toast风格) footer(底部对话框风格)、msg(普通提示)
      icon: '',           //弹窗小图标(success | loading)
      shade: true,        //是否显示遮罩层
      shadeClose: true,   //是否点击遮罩时关闭层
      anim: 'scaleIn',    //scaleIn：缩放打开(默认)  fadeIn：渐变打开  fadeInUpBig：由上向下打开 fadeInDownBig：由下向上打开  rollIn：左侧翻转打开  shake：震动  footer：底部向上弹出
      time: 0,            //设置弹窗自动关闭秒数
      btns: null          //不设置则不显示按钮。如果只需要一个按钮，则btn: '按钮'，如果有两个，则：btn: ['按钮一', '按钮二']
    }
  },
  properties: {

  },
  onLoad: function (options) {
    var id = options.id
    // console.log(id+'###')
    this._getQuestionDetail(id)
  },
  _getQuestionDetail: function (id) {
    var that = this
    // var HOST = that.globalData.config
    var id = 42;
    wx.request({
      url: HOST + 'questions/' + id,
      acceptType: 'json',
      success: function (res) {
        // console.log(res)
        if (res.data.errorcode === '0') {
          console.log(res.data.data)
          that.setData({ question: res.data.data.question })
          that.setData({ answers: res.data.data.answer })
        }
      }
    })
    // console.log(this.data.questionDetail)
  },
  _toIndex: function () {
    wx.navigateTo({
      url: "/pages/index/index"
    })
  },
  _toShare: function () {

  },
  onShareAppMessage: function (res) {
    var id = 42;
    return {
      title: 'test',
      path: '/pages/question/index?id=' + id,
      success: function (res) {
        console.log('share success...')
      }
    }
  },
  _showCopyModal: function (event) {
    var id = event.currentTarget.id + 19911005
    var url = 'https://www.collegewiki.com.cn/question/' + id
    wx.setClipboardData({
      data: url,
      fail: function () {
        console.log('问题设置剪贴板内容失败')
      },
      success: function () {
      }
    })
    var config = {
      title: "请通过浏览器打开APP",
      content: '链接已复制，请粘贴到浏览器中打开留学维基进行提问',
      showCancel: false,
      confirmColor: '#02BB00'
    }
    wx.showModal(config)
  },
  _myModal: function (event) {
    var currentStatus = event.currentTarget.dataset.status;
    if (currentStatus === 'open') {
      this.setData({ showShareModal: true })
    } else if (currentStatus === 'close') {
      this.setData({ showShareModal: false })
    }
  }
})