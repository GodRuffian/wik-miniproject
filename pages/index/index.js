//index.js
//获取应用实例
// import { HOST } from '../../config/config.js'
const HOST = 'http://local.collegewiki.com/api/miniprogram/'
const app = getApp()

Page({
  data: {
    userinfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    lists: [],
    isRegisted: true,
    token: null,
    page: 0,
    limit: 20,
    refresh: false,
    hideHeader: true,
    loadMoreData: ''
  },
  onLoad: function () {
    this._getQuestions()
    this.data.page++
    this._regist()
  },
  _isAuth: function () {

    var auth = wx.getStorageSync('temp_user')
    if (!auth) {
      return true
    }
    return false
  },
  _regist: function () {
    var that = this
    this.setData({ isRegisted: false })
    // 用户没有注册成功需授权
    if (!this._isAuth()) {
      wx.login({
        success: function (res) {
          // 发送 res.code 到后台换取 openId, sessionKey, unionId
          var code = res.code
          wx.request({
            url: HOST + 'register',
            method: 'POST',
            data: {
              code: code
            },
            acceptType: 'json',
            success: function (res) {
              if (res.data.errorcode == '0') {
                wx.setStorage({ key: 'token', data: res.data.data.token })
                // wx.setStorage({key: 'auth', data: res.data.data.auth})
                wx.setStorage({ key: 'temp_user', data: false })
              }
            }
          })
        }
      })
      // 获取用户信息
      wx.getSetting({
        success: function (res) {
          if (res.authSetting['scope.userInfo']) {
            // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
            wx.getUserInfo({
              success: function (res) {
                // 可以将 res 发送给后台解码出 unionId
                // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
                // 所以此处加入 callback 以防止这种情况
                if (this.userInfoReadyCallback) {
                  this.userInfoReadyCallback(res)
                }
              }
            })
          }
        }
      })
    } else {
      return
    }
  },
  _getQuestions: function () {
    var that = this
    wx.request({
      url: HOST + "index?page=" + that.data.page + "&limit=" + that.data.limit,
      dataType: 'json',
      success: function (res) {
        // var data = JSON.parse(res)
        if (res.data.errorcode === '0') {
          that.setData({ lists: res.data.data })
        }
      }
    })
  },
  _getUserInfoCallback: function (res) {
    console.log(res.detail.userInfo)
    // App.globalData.userInfo = res.detail.userInfo
    this.setData({ isRegisted: false })
    wx.setStorage({
      key: 'userInfo',
      data: res.detail.userInfo,
      success: function () {
        console.log('本地存储用户信息成功')
      },
      fail: function () {
        console.log('本地存储用户信息失败')
      }
    })
  },
  _toSearch: function () {
    wx.navigateTo({
      url: '/pages/search/index'
    })
  },
  _getUserInfo: function (res) {
    console.log(res)
    var userInfo = res.detail.userInfo
    this.setData({
      userInfo: userInfo,
      hasUserInfo: true
    })
      wx.setStorage({key: 'userInfo', data: userInfo})
  },
  onPullDownRefresh: function () {
    var that = this
    setTimeout(function () {
        that.setData({refresh: true})
        wx.request({
            url: HOST + '/index?page=0' + '&limit=' + that.data.limit,
            acceptType: 'json',
            success: function (res) {
                var data = res.data.data
                that.setData({lists: data})
            }
        })
    }, 300)
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
  }

})

