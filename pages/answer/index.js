// import config from '/config/config.js'
import {HOST} from '../../config/config.js'
var wxParse = require('../../utils/wxParse.js')
import {intervalToNow} from '../../utils/util'
Page({
    data: {
            agree_count: '',
            comments_count: '',
            comment: '',
            content: '',
            created_at: '',
            id: null,
            question_id: '',
            title: '',
            is_vote: '',
            is_thank: '',
        user: null,

        showShareModal: false,
        voteIcon: '/assets/images/Triangle_kaopu_pressCopy2@2x.png',
        unvoteIcon: '/assets/images/Triangle_chedan_nor@2x.png',
        thank: false,
        thankIcon: '/assets/images/icon_appreciate_press@2x.png',
        unthankIcon: '/assets/images/icon_appreciate_nor@2x.png',
    },
    onLoad: function (options) {
        var id = options.id
        var id = 45
        this._getAnswer(id, wxParse)
        // console.log(formatTime.formatTime)
        // console.log(version)
    },

    _getAnswer: function(answerId, wxParse) {
        var that = this
        wx.request({
            url: HOST+'answers/'+answerId,
            acceptType: 'json',
            success: function (res) {
                if (res.data.errorcode === '0') {
                    var data = res.data.data
                    console.log(data)
                    // console.log('@@'+data.content)
                    that.setData({
                        agree_count: data.agree_count,
                        comments_count: data.comments_count,
                        comment: data.comment,
                        content: data.content,
                        created_at: intervalToNow(data.created_at),
                        id: data.id,
                        question_id: data.question_id,
                        title: data.title,
                        user: data.user,
                        is_vote: data.is_vote,
                        is_thank: data.is_thank
                    })
                    wxParse.wxParse('content', 'html', data.content, that, 15)
                }
            },
            fail: function () {
                
            }
        })
    },
    _toQuestion: function (event) {
        var id = event.currentTarget.id
        wx.navigateTo({
            url: "/pages/question/index?id="+id
        })
    },
    _toComment: function (event) {
        var answerId = event.currentTarget.dataset.id;
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
    },
    onShareAppMessage: function () {
        return {
            title: this.data.answer.title,
            desc: '',
            path: '/pages/answer/index?id='+this.data.answer.id
        }
    },
    _wxShare: function (event) {
        this.onShareAppMessage()
        // wx.hideShareMenu()
    },
    _shareCircleFriend: function (event) {
        console.log('2313')
    },
    _vote: function (event) {
        console.log(event)
        var isVote = event.currentTarget.dataset.isvote
        var answerId = event.currentTarget.dataset.id
        if (!isVote) {
            this.setData({
                is_vote: true,
                agree_count: this.data.agree_count + 1,
                voteIcon: '/assets/images/Triangle_kaopu_press@2x.png',
                unvoteIcon: '/assets/images/Triangle_chedan_nor@2x.png',
            })
            this._apiVote(answerId)
        } else {
            /*wx.showToast({
                title: '已点赞'
            })*/
        }
    },
    _unvote: function (event) {
        var isVote = event.currentTarget.dataset.isvote
        var answerId = event.currentTarget.dataset.id;
        var count = (this.data.agree_count !== '' || this.data.agree_count !== 0) ? this.data.agree_count -1 : 0
        if (isVote) {
            this.setData({
                is_vote: false,
                agree_count: count,
                unvoteIcon: '/assets/images/Triangle_chedan_press@2x.png',
                voteIcon: '/assets/images/Triangle_kaopu_pressCopy2@2x.png'
            })
            this._apiThank(answerId)
        } else {
        }
    },
    _thank: function (event) {
        var thank = event.currentTarget.dataset.thank
        var answerId = event.currentTarget.dataset.id
        this._apiThank(answerId)
        if (thank) {
            this.setData({
                is_thank: false,
                thankIcon: '/assets/images/icon_appreciate_nor@2x.png',
            })
        } else {
            this.setData({
                is_thank: true,
                thankIcon: '/assets/images/icon_appreciate_press@2x.png',
            })
        }
    },
    // 回答点赞
    _apiVote: function (answerId) {
        if (answerId == '') {
            return
        }
        wx.request({
            url: HOST+'answer/'+answerId+'/vote',
            method: 'POST',
            data: {
                token: wx.getStorageSync('token')
            },
            success: function (res) {
            },
            fail: function () {

            }
        })
    },
    // 感谢
    _apiThank: function (answerId) {
        wx.request({
            url: HOST+'answer/'+answerId+'/thank',
            method: 'POST',
            success: function (res) {
            }
        })
    }
})