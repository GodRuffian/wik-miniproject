const HOST = 'http://local.collegewiki.com/api/miniprogram/'


Page({
    data: {
        comments: [
            /*{'content': '不排除高级外星文明的联络方式，并非我们人类所熟知的以电磁波为载体，所以我们无法有效的检测到他们的联络信息。',
                'count': '132','created_at': '2018-09-18 12:12:23','id':11,
                'user': {
                    'username': '呱呱',
                    'headurl': 'http://pcimage.collegewiki.com.cn/webpc/question/OX7QV91520413295.png'
                }
            },
            {'content': '不排除高级外星文明的联络方式，并非我们人类所熟知的以电磁波为载体，以我们无法有效的检测到他们的联以我们无法有效的检测到他们的联所以我们无法有效的检测到他们的联络信息。',
                'count': '132','created_at': '2018-09-18 12:12:23','id':11,
                'user': {
                    'username': '呱呱',
                    'headurl': 'http://pcimage.collegewiki.com.cn/webpc/question/OX7QV91520413295.png'
                }
            },
            {'content': '不排除高级外星文明的联络方式，并非我们人类所熟知的以电磁波为载体，所以我们无法有效的检测到他们的联络信息。',
                'count': '132','created_at': '2018-09-18 12:12:23','id':11,
                'user': {
                    'username': '呱呱',
                    'headurl': 'http://pcimage.collegewiki.com.cn/webpc/question/OX7QV91520413295.png'
                }
            },
            {'content': '不排除高级外星文明的联络方式，并非我们人类所熟知的以电磁波为载体，所以我们无法有效的检测到他们的联络信息。',
                'count': '132','created_at': '2018-09-18 12:12:23','id':11,
                'user': {
                    'username': '呱呱',
                    'headurl': 'http://pcimage.collegewiki.com.cn/webpc/question/OX7QV91520413295.png'
                }
            },
            {'content': '不排除高级外星文明的联络方式，并非我们人类所熟知的以电磁波为载体，所以我们无法有效的检测到他们的联络信息。',
                'count': '132','created_at': '2018-09-18 12:12:23','id':11,
                'user': {
                    'username': '呱呱',
                    'headurl': 'http://pcimage.collegewiki.com.cn/webpc/question/OX7QV91520413295.png'
                }
            }*/
        ],
        unvoteIcon: '/assets/images/icon_dianzan_nor@2x.png',
        voteIcon: '/assets/images/icon_dianzan_press@2x.png'
    },
    onLoad: function (options) {
        console.log(options)
        var id = options.id
        var id = 950;
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
                // console.log(res)
                if (res.data.errorcode === '0') {
                    that.setData({comments: res.data.data})
                }
            }
        })
    },
    _toReply: function (event) {
        var commentId = event.currentTarget.id
        wx.navigateTo({
            url: '/pages/reply/index?id='+commentId
        })
    },
    _vote: function (event) {
        // console.log('is hrere')
        var commentId = event.currentTarget.dataset.id
        // console.log(this.data.comments)
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
                // console.log(comment.is_vote)
                var is_vote = comment.is_vote
                // console.log(is_vote+'~~!!!')
                if (this.data.comments[i].is_vote) {
                    var key = this.data.comments[i].is_vote
                    //['msg[' + i + '].is_say_yes']
                    this.setData({
                        ['comments['+i+'].is_vote']: false,
                    })
                } else {
                    console.log('21313')
                    this.setData({
                        ['comments['+i+'].is_vote']: true
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
        // console.log(this.data.comments)

    },
    _getToken: function () {
        return wx.getStorageSync('token')
    }
})