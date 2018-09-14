const HOST = 'http://local.collegewiki.com/api/miniprogram/'

Page({
    data: {
        questionDetail: {},
        answers: []
    },
    properties: {

    },
    onLoad: function (options) {
        var id = options.id
        console.log(id+'###')
        this._getQuestionDetail(id)
    },
    _getQuestionDetail: function (id) {
        var that = this
        // var HOST = that.globalData.config
        wx.request({
            url: HOST+'questions/'+id,
            acceptType: 'json',
            success: function (res) {
                console.log(res)
                if (res.data.errorcode === '0') {
                    that.setData({questionDetail: res.data.data})
                }
            }
        })
    }
})