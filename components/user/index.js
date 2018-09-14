Component({
    data: {
        imageMode: 'aspectFit'
    },
    properties: {
        user: {
            type: Object,
            value: null
        },
        customUsername: {
            type: Boolean,
            value: true
        }
    },
    methods: {

    },
    lifetimes: {
        ready: function () {

        }
    }
})