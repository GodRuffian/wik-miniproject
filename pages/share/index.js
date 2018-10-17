import {HOST} from '../../config/config'

Page({
    data: {
        url: ''
    },
    onLoad: function (options) {
        var type = options.type
        var id = options.id
        // id = 45
        // type = 'answer'
        var url =  HOST+'poster?id='+id+'&type='+type
        this.setData({url: url})
    }
})