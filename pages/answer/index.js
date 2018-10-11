// import config from '/config/config.js'
import {HOST} from '../../config/config.js'
var wxParse = require('../../utils/wxParse.js')
import {intervalToNow} from '../../utils/util'
Page({
    data: {
        agree_count: '',
        comments_count: '',
        content: '',
        created_at: '',
        id: null,
        question_id: '',
        title: '',
        is_vote: '',
        is_thank: '',
        user: null,

        showShareModal: false,
        token: '',

        is_unvote: '',
        vote_center_status: '', // 点赞中间状态
        unvote_center_status: '', // 取消点赞中间状态
        voteIcon: '/assets/images/Triangle_kaopu_pressCopy2@2x.png',
        isvoteIcon: '/assets/images/Triangle_kaopu_press@2x.png',
        unvoteIcon: '/assets/images/Triangle_chedan_nor@2x.png',
        isunvoteIcon: '/assets/images/Triangle_chedan_press@2x.png',
        thank: false,
        thankIcon: '/assets/images/icon_appreciate_press@2x.png',
        unthankIcon: '/assets/images/icon_appreciate_nor@2x.png',
        isIphoneX: false
    },
    onLoad: function (options) {
        var that = this
        this.setData({token: wx.getStorageSync('token')})
        var id = options.id
        // var id = 45
        this._getAnswer(id, wxParse)
        // iPhone X 适配
        wx.getSystemInfo({
            success: function (res) {
                // console.log(res.model)
                var model = res.model;
                if (model.search('iPhone10,2') > 0 || model.search('iPhone11,2') > 0) {
                    that.setData({isIphoneX: true})
                }
            }
        })
    },

    _getAnswer: function(answerId, wxParse) {
        var that = this
        wx.request({
            url: HOST+'v2/answers/'+answerId,
            data: {token: that.data.token},
            acceptType: 'json',
            success: function (res) {
                if (res.data.errorcode === '0') {
                    var data = res.data.data
                    that.setData({
                        agree_count: data.agree_count,
                        comments_count: data.comments_count,
                        content: data.content,
                        created_at: intervalToNow(data.created_at),
                        id: data.id,
                        question_id: data.question_id,
                        title: data.title,
                        user: data.user,
                        is_vote: data.is_vote,
                        is_thank: data.is_thank,
                    })
                    var isvote = data.is_vote ? true : false
                    if (isvote) {
                        that.setData({is_unvote: false})
                    }
                    that.setData({vote_center_status: isvote})
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
        wx.navigateTo({
            url: '/pages/comment/index?id='+answerId
        })
    },
    _myModal: function (event) {
        this.onShareAppMessage()
        /*var currentStatus = event.currentTarget.dataset.status;
        if (currentStatus === 'open') {
            this.setData({showShareModal: true})
        } else if (currentStatus === 'close') {
            this.setData({showShareModal: false})
        }*/
    },
    onShareAppMessage: function () {
        return {
            title: this.data.title,
            desc: '',
            path: '/pages/answer/index?id='+this.data.id
        }
    },
    _wxShare: function (event) {
        this.onShareAppMessage()
    },
    _shareCircleFriend: function (event) {
        wx.showToast({
            title: '程序员溜了'
        })
        return
    },
    _vote: function (event) {
        var isTempUser = wx.getStorageSync('temp_user')
        if (isTempUser) {
            wx.showToast({
                title: '请授权后操作'
            })
            return;
        }
        var isVote = event.currentTarget.dataset.isvote
        var answerId = event.currentTarget.dataset.id
        if (!isVote) {
            this.setData({
                is_vote: true,
                agree_count: this.data.agree_count + 1,
                vote_center_status: true
            })
            if (this.data.unvote_center_status) {
                this.setData({
                    is_unvote: false,
                    unvote_center_status: false
                })
            }
        } else {
            this.setData({
                is_vote: false,
                agree_count: this.data.agree_count - 1,
                vote_center_status: false
            })
        }
        this._apiVote(answerId)
    },
    _unvote: function (event) {
        var isTempUser = wx.getStorageSync('temp_user')
        if (isTempUser) {
            wx.showToast({
                title: '请授权后操作'
            })
            return;
        }
        var isVote = event.currentTarget.dataset.isvote
        var answerId = event.currentTarget.dataset.id;
        if (isVote) {
            this.setData({
                is_unvote: false,

            })
        } else {
            this.setData({
                is_unvote: true,
                unvote_center_status: true
            })
            if (this.data.vote_center_status) {
                this.setData({
                    is_vote: false,
                    agree_count: (this.data.agree_count > 0) ? this.data.agree_count -1 : 0,
                })
                this._apiVote(answerId)
            }
        }
    },
    _thank: function (event) {
        var isTempUser = wx.getStorageSync('temp_user')
        if (isTempUser) {
            wx.showToast({
                title: '请授权后操作'
            })
            return;
        }
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
            data: {token: this.data.token},
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
            data: {token: this.data.token},
            method: 'POST',
            success: function (res) {
            }
        })
    }
})