Page({
    data: {
        search: [
            {'title': '大会的哈达拉的拉拉队进垃圾堆机阿来得及拉来得及的路径ad骄傲了', 'content': '开始发货哈烽火芳菲换话费卡发货发货发开发好看哈佛付款后发放括号'}
        ],
        historySearch: [
            {'keyword': '哈哈'},
            {'keyword': 'dhkadh '},
            {'keyword': '哈哈'},
            {'keyword': 'dhkadh '},
            {'keyword': '哈哈'},
            {'keyword': 'dhkadh '},
            {'keyword': '哈哈'},
            {'keyword': 'dhkadh '},
            {'keyword': '哈哈'},
            {'keyword': 'dhkadh '}
        ]
    },
    _searchCancle: function () {
        wx.navigateBack({
            delta: 1
            // url: "/pages/index/index"
        })
    },
    onLoad: function () {
        // wx.navigateTo({
        //     url: "/pages/search/index"
        // })
    }
})