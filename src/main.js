// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import flex from './js/flex/flexible.js'
import _ from 'lodash'
import lf from 'lf'

import Cube from 'cube-ui'
import wx from 'weixin-js-sdk'
import Vant from 'vant'
import 'vant/lib/index.css'
import 'swiper/dist/css/swiper.css'

Vue.use(flex)
Vue.use(Cube)
Vue.use(lf)
Vue.use(wx)
Vue.use(Vant)
Vue.prototype._ = _
Vue.config.productionTip = false
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: {
    App
  },
  template: '<App/>'
})
