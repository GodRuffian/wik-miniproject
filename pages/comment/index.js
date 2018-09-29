import {intervalToNow} from '../../utils/util'
import {HOST} from '../../config/config'

Page({
    data: {
        comments: [],
        unvoteIcon: '/assets/images/icon_dianzan_nor@2x.png',
        voteIcon: '/assets/images/icon_dianzan_press@2x.png'
    },
    onLoad: function (options) {
        var id = options.id
        // id = 45
        this._getComments(id)
    },
    _getComments: function (answerId) {
        var that = this
        wx.request({
            url: HOST+'answer/'+answerId+'/comments',
            data: {
                token: this._getToken()
            },
            acceptType: 'json',
            success: function (res) {
                if (res.data.errorcode === '0') {
                    for (var i = 0; i < res.data.data.length; i++) {
                        res.data.data[i].created_at = intervalToNow(res.data.data[i].created_at)
                    }
                    that.setData({comments: res.data.data})
                }
            },
            fail: function () {
            }
        })
    },
    _toReply: function (event) {
        var commentId = event.currentTarget.dataset.id
        wx.navigateTo({
            url: '/pages/reply/index?id='+commentId
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
        var voteArr = wx.getStorageSync('commentVote');
        if (voteArr.length > 0) {
            voteArr.push(commentId);
            wx.setStorage({key:'commentVote', data: voteArr});
        } else {
            var commentIds = new Array()
            commentIds.push(commentId);
            wx.setStorage({key:'commentVote', data: commentIds});
        }

        for (var i = 0; i < this.data.comments.length; i++) {
            if (this.data.comments[i].id === commentId) {
                var comment  = this.data.comments[i]
                var is_vote = comment.is_vote
                if (this.data.comments[i].is_vote) {
                    var key = this.data.comments[i].is_vote
                    this.setData({
                        ['comments['+i+'].is_vote']: false,
                        ['comments['+i+'].agree_count']: this.data.comments[i].agree_count -1,
                    })
                } else {
                    this.setData({
                        ['comments['+i+'].is_vote']: true,
                            ['comments['+i+'].agree_count']: this.data.comments[i].agree_count +1
                    })
                }
                wx.request({
                    url: HOST+'comment/'+commentId+'/vote',
                    data: {
                        token: this._getToken()
                    },
                    method: 'POST',
                    success: function (res) {

                    }
                })
            }
        }
    },
    _getToken: function () {
        return wx.getStorageSync('token')
    }
})