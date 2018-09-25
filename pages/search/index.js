import {HOST, HOST_DEV} from '../../config/config'

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
        wx.request({
            url: HOST_DEV+'search?q='+keyword,
            acceptType: 'json',
            success: function (res) {
                console.log(res)
                if (res.data.errorcode === '0') {
                    console.log(res)
                    that.setData({search: res.data.data, flag: false})
                }
            }
        })
        // this.onLoad()
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
    }
})