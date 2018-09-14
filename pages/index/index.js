//index.js
//获取应用实例
// import { HOST } from '../../config/config.js'
const HOST = 'http://local.collegewiki.com/api/miniprogram/'
const app = getApp()

Page({
    data: {
        userInfo: {},
        hasUserInfo: false,
        canIUse: wx.canIUse('button.open-type.getUserInfo'),
        lists: []
    },
    onLoad: function () {
        this._getQuestions()
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
