const HOST = 'http://local.collegewiki.com/api/miniprogram/'

Page({
    data: {
        comment: {},
        replys: []
    },
    onLoad: function (options) {
        // console.log(options);return;
        var commentId = options.id
        this._getComment(commentId)
        this._getCommentReplys(commentId)
    },
    _getComment: function (commentId) {
        var that = this
        wx.request({
            url: HOST+'comment/'+commentId,
            acceptType: 'json',
            success: function (res) {
                if (res.data.errorcode === '0') {
                    that.setData({comment: res.data.data})
                }
            }
        })
    },
    _getCommentReplys: function (commentId) {
        var that = this
        wx.request({
            url: HOST+'comment/'+commentId+'/replys',
            acceptType: 'json',
            success: function (res) {
                if (res.data.errorcode === '0') {
                    that.setData({replys: res.data.data})
                }
            }
        })
    }
})