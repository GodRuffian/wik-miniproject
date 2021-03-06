import {HOST, HOST_DEV} from '../../config/config'
import wxParse from '../../utils/html2json.js'

Page({
    data: {
        search: [],
        historySearch: [],
        flag: false,
        showHistoryFlag: true
    },
    _search: function (event) {
        var that = this
        var keyword = event.detail.value
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
        if (keyword && keyword.length > 0) {
            wx.setStorage({
                key: 'search',
                data: search
            })
        }
        this._getSearchResult(that, keyword)
    },
    _getSearchResult: function (that, keyword) {
        wx.request({
            url: HOST+'search?q='+keyword,
            acceptType: 'json',
            success: function (res) {
                // console.log(res)
                if (res.data.errorcode === '0') {
                    var data = res.data.data;
                    for (var i = 0; i < data.length; i++) {
                        data[i].question.content = wxParse.html2json(data[i].question.content, 'content')
                        if (data[i].answer.body) {
                            data[i].answer.body = wxParse.html2json(data[i].answer.body, 'body')
                        }
                    }
                    that.setData({search: data, flag: false})
                }
            }
        })
    },
    _searchCancle: function () {
        wx.navigateBack({
            delta: 1
        })
    },
    onLoad: function () {
        var search = wx.getStorageSync('search')
        console.log(search)
        this.setData({historySearch: search})
    },

    _bindfocus: function (event) {
        this.onLoad()
        this.setData({flag: true})
        this.setData({showHistoryFlag: true})
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
        this.setData({showHistoryFlag: false})
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