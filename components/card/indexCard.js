Component({
    data: {
        imageMode: 'aspectFit'
    },
    properties: {
      item: {
        type: Object,
          value: null
      }
    },
    ready: function (options) {

    },
    methods : {
        _handleTap: function (event) {
            var id = event.currentTarget.id;
            wx.navigateTo({
                url: '/pages/answer/index?id='+id
            })
        }
    }
})