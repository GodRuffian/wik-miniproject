// var wxParse = require('../../utils/wxParse.js')
var wxParse = require('../../utils/html2json.js')
import {HOST} from '../../config/config'
import { formatTime, removeHTMLTag, getFirstImage, intervalToNow } from '../../utils/util'

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
    },
    showdescButton: false
  },
  properties: {

  },
  onLoad: function (options) {
    var id = options.id
    this._getQuestionDetail(id, wxParse)
  },
  _getQuestionDetail: function (id, wxParse) {
    var that = this
    // var HOST = that.globalData.config
    wx.request({
      url: HOST + 'questions/' + id,
      acceptType: 'json',
      success: function (res) {
        if (res.data.errorcode === '0') {

          var question = res.data.data.question;
          question.descLength = question.desc.length
          if (question.descLength > 50) {
              question.desc = removeHTMLTag(question.desc)
              question.descSub = question.desc.substr(0, 60) + '...'
            that.setData({ showdescButton: true })
          }

          var answers = res.data.data.answer;
          for (let i = 0; i < answers.length; i++) {
            answers[i].cover = getFirstImage(answers[i].content)
            answers[i].content = removeHTMLTag(answers[i].content)
              answers[i].created_at = intervalToNow(answers[i].created_at)

          }
          that.setData({ question: question })
          that.setData({ answers: answers })

        }
      }
    })
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
      }
    }
  },
    _shareCircleFriend: function (event) {
        wx.showToast({
            title: '程序员溜了'
        })
        return
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
  },
  _showDesc: function (event) {
    this.setData({
      showdescButton: false
    })
  },
  _toAnswer: function (event) {
    var answerId = event.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/answer/index?id=' + answerId
    })
  }
})