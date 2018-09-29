const HOST = 'http://local.collegewiki.com/api/miniprogram/'

Page({
    data: {
        answer: {},
        screenWidth: null,
        screenHeight: null,
        backImgWidth: null,
        backImgHeight:null
    },
    onLoad: function (options) {
        wx.showToast({
            title: '程序员留了'
        })
        return;
        var answerId = options.id
        answerId  = 45
        var that = this
        // 获取用户信息
        const userInfo = wx.getStorageSync('userInfo')
        console.log(userInfo)
        var userHeadurl = userInfo.avatarUrl;
        var username = userInfo.nickName;
        // 获取回答数据
        this._getAnswer(answerId)
        // 获取设备信息
        wx.getSystemInfo({
            success: function (res) {
                that.data.screenWidth = res.screenWidth * 0.93
                that.data.screenHeight = res.screenHeight

                // that.data.screenWidth = res.windowWidth
                // that.data.screenWidth = res.windowHeight
                console.log(res.windowWidth)
                console.log(res.windowHeight)
                console.log(res.pixelRatio +'..px')
            }
        })
        // const query = wx.createSelectorQuery().select('#share-content')
        // html2canvas(query, {
        //     onrendered: function (canvas) {
        //         canvas.toDataURL("/assets/temp");
        //     }
        // })
        // console.log(this.screenWidth)
        // console.log(this.screenHeight)
        // 获取背景图片
        /* var userImg = wx.getImageInfo({
             src: userHeadurl,
             success: function (res) {
                 that.backImgWidth = res.width
                 that.screenHeight = res.height
             }
         })*/
        var ctx = wx.createCanvasContext('shareCircleFriend')
        ctx.setFillStyle('white')
        // ctx.setStrokeStyle('red')
        const centerLine = this.data.screenWidth / 2
        // ctx.moveTo(centerLine, 20)
        // ctx.lineTo(centerLine, 500)
        // ctx.stroke()
        // 绘制背景图片
        var height = 0;
        ctx.save()
        ctx.drawImage('/assets/images/bg@2x.png', 0, 0, this.data.screenWidth, 182)
        // 绘制头像圆
        ctx.beginPath()
        ctx.arc(centerLine, 60, 35, 0, 2*Math.PI)
        // ctx.stroke()
        ctx.clip()
        // 绘制用户头像
        height += 70
        ctx.drawImage(userHeadurl, centerLine - 35, 25, height, height)
        ctx.restore()
        ctx.setFontSize(15)
        ctx.setTextAlign('center')
        height += 45
        ctx.fillText(username, centerLine, height)
        height += 10 + 15
        ctx.fillText('分享了回答', centerLine, height)
        // 绘制逗号
        height += 15 + 25+10
        ctx.drawImage('/assets/images/img_douhao@2x.png', 15, height, 23, 20)
        // 绘制问题标题
        ctx.setFontSize(20)
        ctx.setFillStyle("#333333")
        // ctx.setTextAlign('left')
        var title = '马上就出发去纽约大学读本科了,我听说出国在外很多法律上的问题常常带来极大的困扰，有什么好办法解决吗有什么好办法解决吗?'
        height += 20+20;
        var lineHeight = 28;
        var end = Math.floor(this.data.screenWidth / 20) // 计算每一行最大容纳字数
        var count = Math.ceil(title.length / end) // 根据标题，行数计算循环次数

        // try {
            for (var i = 0; i < count; i++) {
                var start = (i >= 1) ? i * end : 0
               /* if (i !== count) {
                    var strTemp = title.substr(start, end - 1)
                } else if (i !== count) {
                    var strTemp = title.substr(start + 1, end - 1)
                } else {
                  /!*  if (title.substr(start + 1, end) == '') {
                        break
                    } else {*!/
                        var strTemp = title.substr(start + 1, end)
                    // }
                }*/
               if (i !== count) {
                   var strTemp = title.substr(start, end - 1)
               } else {
                   var strTemp = title.substr(start-1, end)
               }
                ctx.fillText(strTemp, centerLine+10, height, 315)
                height += lineHeight
            }
        // } catch (err) {
        //     console.log(err)
        // }

        // 绘制回答内容
        ctx.setFontSize(15)
        ctx.setFillStyle('#666666')
        height = +25
        lineHeight = 21
        var content = '我推荐NYIS的Plus 91套餐 ，这个险种是专门为留学生开发的，完全符合美国的奥巴马保健法，在提供法律有保障的保险的同时为留学生提供各种免费的法律咨询服务，它...'
        end = Math.floor(this.data.screenWidth / 15) // 计算每一行最大容纳字数
        count = 2
        for (var i = 0; i <= count; i++) {
            var start = (i >= 1) ? i * end : 0
            if (i !== count) {
                var strTemp = content.substr(start, end - 2)
            } else {
                var strTemp = content.substr(start - 2 , end -2)
            }
            ctx.fillText(strTemp,centerLine, height, this.data.screenWidth)
            height += lineHeight
        }

        var center = centerLine - 50
        // 绘制二维码
        height += 10
        ctx.drawImage('/assets/images/img_code@2x.png', center, height, 100, 100, 0, 0,0,0)
        ctx.setFontSize(12)
        height += 20 + 100
        ctx.fillText('长按识别二维码', centerLine, height, 84)
        // 绘制横线
        ctx.setFillStyle('#F0F0F0')
        height += 30
        ctx.beginPath()
        ctx.moveTo(centerLine-36-50, height-6) // 起始坐标
        ctx.lineTo(centerLine-36-10, height-6) // 终止坐标
        ctx.strokeStyle = 'RGBA(240, 240, 240, 1)'
        ctx.stroke()
        ctx.fillText('留学维基精选', centerLine, height, 72)
        ctx.beginPath()
        ctx.moveTo(centerLine+36+10, height-6) // 起始坐标
        ctx.lineTo(centerLine+36+50, height-6) // 终止坐标
        ctx.strokeStyle = 'RGBA(240, 240, 240, 1)'
        ctx.stroke()
        ctx.draw()

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
})