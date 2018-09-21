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
        token: null
    },
    onLoad: function () {
        this._getQuestions()
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
        this.setData({isRegisted: false})
        // 用户没有注册成功需授权
        if (!this._isAuth()) {
            wx.login({
                success: function (res) {
                    // 发送 res.code 到后台换取 openId, sessionKey, unionId
                    var code = res.code
                    wx.request({
                        url: HOST+'register',
                        method: 'POST',
                        data: {
                            code: code
                        },
                        acceptType: 'json',
                        success: function (res) {
                            if (res.data.errorcode == '0') {
                                wx.setStorage({key:'token', data: res.data.data.token})
                                // wx.setStorage({key: 'auth', data: res.data.data.auth})
                                wx.setStorage({key: 'temp_user', data: false})
                            }
                        }
                    })
                }
            })
            // 获取用户信息
            wx.getSetting({
                success: function(res) {
                    if (res.authSetting['scope.userInfo']) {
                        // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
                        wx.getUserInfo({
                            success: function(res) {
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
            url: HOST + 'index',
            dataType: 'json',
            success: function (res) {
                // var data = JSON.parse(res)
                if (res.data.errorcode === '0') {
                    that.setData({lists: res.data.data})
                }
            }
        })
    },
    _getUserInfoCallback: function (res) {
        console.log(res.detail.userInfo)
        // App.globalData.userInfo = res.detail.userInfo
        this.setData({isRegisted: false})
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
    onPullDownRefresh: function() {
        wx.showNavigationBarLoading() //在标题栏中显示加载
    },
    //事件处理函数
    // bindViewTap: function () {
    //     wx.navigateTo({
    //         url: '../logs/logs'
    //     })
    // },


    getUserInfo: function (e) {
        // console.log(e)
        app.globalData.userInfo = e.detail.userInfo
        this.setData({
            userInfo: e.detail.userInfo,
            hasUserInfo: true
        })
    },


})
