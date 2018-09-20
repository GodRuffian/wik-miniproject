// import config from '/config/config.js'
const HOST = 'http://local.collegewiki.com/api/miniprogram/'

Page({
    data: {
            agree_count: '',
            comments_count: '',
            comment: '',
            content: '',
            created_at: '',
            id: null,
            question_id: null,
            title: '',
        user: null,

        showShareModal: false,
        isVote: false,
        voteIcon: '/assets/images/Triangle_kaopu_pressCopy2@2x.png',
        unvoteIcon: '/assets/images/Triangle_chedan_nor@2x.png',
        thank: false,
        thankIcon: '/assets/images/icon_appreciate_nor@2x.png'
    },
    onLoad: function (options) {
        var id = options.id
        var id = 45
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
                    var data = res.data.data
                    that.setData({
                        agree_count: data.agree_count,
                        comments_count: data.comments_count,
                        comment: data.comment,
                        content: data.content,
                        created_at: data.created_at,
                        id: data.id,
                        question_id: data.question_id,
                        title: data.title,
                        user: data.user
                    })
                }
            }
        })
    },
    _questionDetail: function (event) {
        var id = event.currentTarget.id
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
        if (!isVote) {
            this.setData({
                isVote: true,
                agree_count: this.data.agree_count + 1,
                voteIcon: '/assets/images/Triangle_kaopu_press@2x.png',
                unvoteIcon: '/assets/images/Triangle_chedan_nor@2x.png',
            })

        } else {
            /*wx.showToast({
                title: '已点赞'
            })*/
        }
    },
    _unvote: function (event) {
        var isVote = event.currentTarget.dataset.isvote
        var count = (this.data.agree_count !== '' || this.data.agree_count !== 0) ? this.data.agree_count -1 : 0
        if (isVote) {
            this.setData({
                isVote: false,
                agree_count: count,
                unvoteIcon: '/assets/images/Triangle_chedan_press@2x.png',
                voteIcon: '/assets/images/Triangle_kaopu_pressCopy2@2x.png'
            })
        } else {
        }
    },
    _thank: function (event) {
        var thank = event.currentTarget.dataset.thank
        if (thank) {
            this.setData({
                thank: false,
                thankIcon: '/assets/images/icon_appreciate_nor@2x.png',
            })
        } else {
            this.setData({
                thank: true,
                thankIcon: '/assets/images/icon_appreciate_press@2x.png',
            })
        }
    }
})