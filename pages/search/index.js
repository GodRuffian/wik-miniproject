import {HOST, HOST_DEV} from '../../config/config'
import wxParse from '../../utils/html2json.js'

Page({
    data: {
        search: [],
        historySearch: [],
        flag: false
    },
    _search: function (event) {
        console.log(event)
        var that = this
        var keyword = event.detail.value
        console.log(keyword)
        var search = wx.getStorageSync('search')
        if (search.length > 10) {
            search.pop()
            search.unshift({keyword: keyword})
        } else if (search.length == 0) {
            search = new Array()
            search.unshift({keyword: keyword})
        } else {
            search.unshift({keyword: keyword})
        }
        wx.setStorage({
            key: 'search',
            data: search
        })
        this._getSearchResult(that, keyword)
        // this.onLoad()
    },
    _getSearchResult: function (that, keyword) {
        wx.request({
            url: HOST_DEV+'search?q='+keyword,
            acceptType: 'json',
            success: function (res) {
                // console.log(res)
                if (res.data.errorcode === '0') {
                    var data = res.data.data;
                    // console.log(res)
                    for (var i = 0; i < data.length; i++) {
                        // data[i].question.content = wxParse.wxParse('content1', 'html', data[i].question.content, that)
                        data[i].question.content = wxParse.html2json(data[i].question.content, 'content')
                        if (data[i].answer.body) {
                            data[i].answer.body = wxParse.html2json(data[i].answer.body, 'body')
                        }
                    }
                    console.log(data)
                    that.setData({search: data, flag: false})
                }
            }
        })
    },
    _searchCancle: function () {
        wx.navigateBack({
            delta: 1
            // url: "/pages/index/index"
        })
    },
    onLoad: function () {
        var search = wx.getStorageSync('search')
        this.setData({historySearch: search})
    },

    _bindfocus: function (event) {
        this.onLoad()
        this.setData({flag: true})
    },
    _delSearch: function (event) {
        var value = event.currentTarget.dataset.value
        var searchs = wx.getStorageSync('search')
        for (var i=0; i< searchs.length; i++) {
            if (searchs[i].keyword == value) {
                searchs.splice(i, 1)
            }
        }
        wx.setStorage({key: 'search', data: searchs})
        this.onLoad()
    },
    _flushSearch: function (event) {
        wx.removeStorageSync('search')
        this.onLoad()
    },
    _historySearchTap: function (event) {
        var keyword = event.currentTarget.dataset.keyword
        this._getSearchResult(this, keyword)
        this.setData({flag: true})
    },
    _toQuestionOrAnswer: function (event) {
        var questionId = event.currentTarget.dataset.qid
        var answerId = event.currentTarget.dataset.aid
        console.log(questionId)
        // console.log(answerId === undefined)
        if (answerId !== '' && answerId !== undefined) {
            wx.navigateTo({
                url: '/pages/answer/index?id='+answerId
            })

        } else {
            wx.navigateTo({
                url: '/pages/question/index?id='+questionId
            })
        }
    }
})