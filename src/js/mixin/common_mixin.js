import lf from 'lf'

export default {
  data () {
    return {
      isIx: false
    }
  },
  methods: {
    getIsIphonex  () {
      var u = navigator.userAgent
      var isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)
      if (isIOS) {
        if (screen.height == 812 && screen.width == 375) {
          return true
        }
        else {
          return false
        }
      }
    }
  },
  beforeMount () {
    this.isIx = this.getIsIphonex()
  }
}
