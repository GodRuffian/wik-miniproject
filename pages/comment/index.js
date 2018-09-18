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
        ]
    },
    onLoad: function (options) {
        console.log(options)
        var id = options.id
        // var id = 950;
        this._getComments(id)
    },
    _getComments: function (answerId) {
        var that = this
        wx.request({
            url: HOST+'answer/'+answerId+'/comments',
            acceptType: 'json',
            success: function (res) {
                console.log(res)
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
    }
})