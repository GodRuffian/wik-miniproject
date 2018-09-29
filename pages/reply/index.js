import {HOST} from '../../config/config'
import {intervalToNow} from '../../utils/util'

Page({
    data: {
        comment: {},
        replys: [],
        unvoteIcon: '/assets/images/icon_dianzan_nor@2x.png',
        voteIcon: '/assets/images/icon_dianzan_press@2x.png',
        token: wx.getStorageSync('token')
    },
    onLoad: function (options) {
        var commentId = options.id
        console.log(commentId)
        // commentId = 129;
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
                    var data = res.data.data
                    data.created_at = intervalToNow(data.created_at)
                    that.setData({comment: data})
                }
            }
        })
    },
    _getCommentReplys: function (commentId) {
        var that = this
        wx.request({
            url: HOST+'comment/'+commentId+'/replys',
            data: {token: this.data.token},
            acceptType: 'json',
            success: function (res) {
                if (res.data.errorcode === '0') {
                    var data = res.data.data
                    for (var i = 0; i < data.length; i++) {
                        data[i].created_at = intervalToNow(data[i].created_at)
                    }
                    that.setData({replys: data})
                }
            }
        })
    },
    _vote: function (event) {
        var isTempUser = wx.getStorageSync('temp_user')
        if (isTempUser) {
            wx.showToast({
                title: '请授权后操作'
            })
            return;
        }
        var commentId = event.currentTarget.dataset.id

        for (var i = 0; i < this.data.replys.length; i++) {
            if (this.data.replys[i].id === commentId) {
                var comment  = this.data.replys[i]
                var is_vote = comment.is_vote
                if (this.data.replys[i].is_vote) {
                    var key = this.data.replys[i].is_vote
                    this.setData({
                        ['replys['+i+'].is_vote']: false,
                        ['replys['+i+'].agree_count']: this.data.replys[i].agree_count -1,
                    })
                } else {
                    this.setData({
                        ['replys['+i+'].is_vote']: true,
                        ['replys['+i+'].agree_count']: this.data.replys[i].agree_count +1
                    })
                }
            }
        }

        wx.request({
            url: HOST+'comment/reply/'+commentId+'/vote',
            method: 'POST',
            data: {token: this.data.token},
            acceptType: 'json',
            success: function (res) {
            },
            fail: function () {
            }
        })
    }
})