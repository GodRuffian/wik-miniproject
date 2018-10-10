// var wxParse = require('../../utils/wxParse.js')
var wxParse = require('../../utils/html2json.js')
import {HOST} from '../../config/config'
import { formatTime, removeHTMLTag, getFirstImage, intervalToNow } from '../../utils/util'

Page({
  data: {
    question: {},
    answers: [],
    showShareModal: false,
    showdescButton: false
  },
  properties: {

  },
  onLoad: function (options) {
    var id = options.id
      // id = 609;
    this._getQuestionDetail(id, wxParse)
  },
  _getQuestionDetail: function (id, wxParse) {
    var that = this
    wx.request({
      url: HOST + 'v2/questions/' + id,
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
    wx.reLaunch({
      url: "/pages/index/index"
    })
  },
  _toShare: function () {

  },
  onShareAppMessage: function (res) {
    // var id = 42;
    return {
      title: this.data.question.content,
      path: '/pages/question/index?id=' + this.data.question.id,
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
    this.onShareAppMessage()
    /*var currentStatus = event.currentTarget.dataset.status;
    if (currentStatus === 'open') {
      this.setData({ showShareModal: true })
    } else if (currentStatus === 'close') {
      this.setData({ showShareModal: false })
    }*/
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