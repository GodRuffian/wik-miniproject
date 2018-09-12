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
        questions: [
            {
                'title': '你打款收款还是发货客服哈萨克粉红色开发和考核方式',
                'username': 'guagua',
                'headurl': 'http://pcimage.collegewiki.com.cn/webpc/question/2GXJ1V1507735124.png',
                'cover': 'http://abroadimg.collegedaily.com.cn/abroadimg/answer/TIZFK1508185317.jpeg'
            },
            {
                'title': '啊哈哈',
                'username': 'guagua',
                'headurl': 'http://pcimage.collegewiki.com.cn/webpc/question/2GXJ1V1507735124.png',
                'cover': 'http://abroadimg.collegedaily.com.cn/abroadimg/answer/TIZFK1508185317.jpeg'
            },
            {
                'title': '啊哈哈',
                'username': 'guagua',
                'headurl': 'http://pcimage.collegewiki.com.cn/webpc/question/2GXJ1V1507735124.png',
                'cover': 'http://abroadimg.collegedaily.com.cn/abroadimg/answer/TIZFK1508185317.jpeg'
            },
            {
                'title': '啊哈哈',
                'username': 'guagua',
                'headurl': 'http://pcimage.collegewiki.com.cn/webpc/question/2GXJ1V1507735124.png',
                'cover': 'http://abroadimg.collegedaily.com.cn/abroadimg/answer/TIZFK1508185317.jpeg'
            }
        ]
    },
    onLoad: function () {
        if (app.globalData.userInfo) {
            this.setData({
                userInfo: app.globalData.userInfo,
                hasUserInfo: true
            })
        } else if (this.data.canIUse) {
            // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
            // 所以此处加入 callback 以防止这种情况
            app.userInfoReadyCallback = res => {
                this.setData({
                    userInfo: res.userInfo,
                    hasUserInfo: true
                })
            }
        } else {
            // 在没有 open-type=getUserInfo 版本的兼容处理
            wx.getUserInfo({
                success: res => {
                app.globalData.userInfo = res.userInfo
            this.setData({
                userInfo: res.userInfo,
                hasUserInfo: true
            })
        }
        })
        }
        this._getQuestions()
    },
    _getQuestions: function () {
        wx.request({
            url: HOST + 'index',
            // method: 'GET',
            success: function (res) {
                console.log(res)
            }

        })
    },
    toAnswer: function () {
        wx.navigateTo({
            url: '/pages/answer/index'
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
        console.log(e)
        app.globalData.userInfo = e.detail.userInfo
        this.setData({
            userInfo: e.detail.userInfo,
            hasUserInfo: true
        })
    },


})
