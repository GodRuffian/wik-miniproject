Component({
    data: {
        imageMode: 'aspectFit'
    },
    properties: {
      question: {
        type: Object,
          value: null
      }
    },
    methods: {

    },
    ready() {
        // console.log('is he')
        console.log(this.properties.question)
    }
})