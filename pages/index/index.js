//index.js
//获取应用实例
import { HOST, APP_DOWNLOAD} from '../../config/config.js'
const app = getApp()

Page({
  data: {
      // canIUse: wx.canIUse('button.open-type.getUserInfo'),
      lists: [],
      userinfo: {},
      // refresh: false,
      hasUserInfo: false,
      page: 0,
      limit: 20,
      showGuidIcon: true
  },
  onLoad: function () {
    this._getAnswers()
    this.data.page++
      var showIndexGuidIcon = wx.getStorageSync('showIndexGuidIcon')
      if (showIndexGuidIcon) {
        this.setData({showGuidIcon: false})
      }
  },
  _regist: function () {
    var that = this
    this.setData({ isRegisted: false })

  },
    _getAnswers: function () {
    var that = this
    wx.request({
      url: HOST + "index?page=" + that.data.page + "&limit=" + that.data.limit,
      dataType: 'json',
      success: function (res) {
        if (res.data.errorcode === '0') {
          that.setData({ lists: res.data.data })
        }
      }
    })
  },
  _toSearch: function () {
    wx.navigateTo({
      url: '/pages/search/index'
    })
  },
  _getUserInfo: function (res) {
      this.setData({showGuidIcon: false})
      wx.setStorage({key: 'showIndexGuidIcon', data: true})

      this.setData({ hasUserInfo: true })
      var token = wx.getStorageSync('token')
      var userInfo = res.detail.userInfo
      if (typeof userInfo === 'undefined') {
          wx.setStorage({key: 'userInfo', data: ''})
          wx.setStorage({key: 'temp_user', data: true})
          wx.setStorage({key: 'token', data: ''})
          return
      }
      var json = {}
      json.code = res.code
      json.iv =  ''
      json.encryptedData = ''
      json.token = token
      this.setData({
        userInfo: userInfo,
      })
      wx.login({
          success: function (res) {
              // 发送 res.code 到后台换取 openId, sessionKey, unionId
              json.code = res.code
              // 获取用户信息
              wx.getSetting({
                  success: function (res) {
                      if (res.authSetting['scope.userInfo']) {
                          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
                          wx.getUserInfo({
                              success: function (res) {
                                  json.iv = res.iv
                                  json.encryptedData = res.encryptedData
                                  wx.request({
                                      url: HOST + 'v2/register',
                                      method: 'POST',
                                      data: json,
                                      acceptType: 'json',
                                      success: function (res) {
                                          if (res.data.errorcode == '0') {
                                              var token = res.data.data.token
                                              if (token) {
                                                  wx.setStorage({key: 'temp_user', data: false})
                                                  wx.setStorage({key: 'token', data: token})
                                              }
                                          } else {
                                              // wx.setStorageSync('token', '')
                                              wx.setStorage({key: 'token', data: ''})
                                              // wx.setStorageSync('temp_user', true)
                                              wx.setStorage({key: 'temp_user', data: true})
                                          }
                                      }
                                  })
                              }
                          })
                      }
                  }
              })

          }
      })
      wx.setStorageSync('userInfo', userInfo)
  },
  onPullDownRefresh: function () {
    /*var that = this
      // var page = this.data.page
      console.log(this.data.page)
    setTimeout(function () {
        wx.request({
            url: HOST + 'index?page=0' + '&limit=' + that.data.limit,
            acceptType: 'json',
            success: function (res) {
                var data = res.data.data
                that.setData({lists: data})
            }
        })
    }, 300)*/
    // // 数据成功后，停止下拉刷新
    wx.stopPullDownRefresh()
  },
  onReachBottom: function () {
      var that = this
      that.data.page += 1
      setTimeout(function () {
          var lists = that.data.lists
          wx.request({
              url: HOST + 'index?page=' + that.data.page + '&limit=' + that.data.limit,
              acceptType: 'json',
              success: function (res) {
                  var data = res.data.data
                  if (data.length > 0) {
                      var tempArr = lists.concat(data)
                      that.setData({lists: tempArr})
                  } else {
                      that.setData({page: that.data.page -1})
                      wx.showToast({
                          title: '暂无数据'
                      })
                  }
              }
          })
      }, 300)
  },
    _showQuestionToast: function () {
        wx.setClipboardData({
            data: APP_DOWNLOAD,
            fail: function () {
            },
            success: function () {
            }
        })
        wx.showModal({
            title: '请通过浏览器打开APP',
            content: '已为你复制了链接，黏贴在浏览器中下载留学维基APP吧',
            showCancel: false,
            success: function (res) {

            }
        })
    }

})

