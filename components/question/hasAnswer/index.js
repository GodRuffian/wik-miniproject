/** 有回答 **/
const HOST = ''
Component({
    data: {
        question: {
            count: -1
        }
    },
    properties: {
        answers: {
            type: Object,
            value: {}
        }
    },
    methods: {

    },
    ready: function () {
        // console.log('is he')
        wx.request({
            url: '',
        })
    }
})