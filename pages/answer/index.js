// import config from '/config/config.js'
const HOST = 'http://local.collegewiki.com/api/miniprogram/'

Page({
    data: {
        answer: {},
        showShareModal: false
    },
    onLoad: function (options) {
        var id = options.id
        this._getAnswer(id)
        // var version = wx.getSystemInfoSync()
        // console.log(version)
    },

    _getAnswer: function(answerId) {
        var that = this
        wx.request({
            url: HOST+'answers/'+answerId,
            acceptType: 'json',
            success: function (res) {
                if (res.data.errorcode === '0') {
                    that.setData({answer: res.data.data})
                }
            }
        })
    },
    _questionDetail: function (event) {
        var id = event.currentTarget.id
        console.log(id+'!!!')
        wx.navigateTo({
            url: "/pages/question/index?id="+id
        })
    },
    _toComment: function (event) {
        var answerId = event.currentTarget.id;
        // console.log(event);return
        wx.navigateTo({
            url: '/pages/comment/index?id='+answerId
        })
    },
    _myModal: function (event) {
        var currentStatus = event.currentTarget.dataset.status;
        if (currentStatus === 'open') {
            this.setData({showShareModal: true})
        } else if (currentStatus === 'close') {
            this.setData({showShareModal: false})
        }
    }

})