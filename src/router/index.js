import Vue from 'vue'
import Router from 'vue-router'

import Test from '@/components/test'
Vue.use(Router)

const router = new Router({
  routes: [{
    path: '/test',
    name: 'test',
    component: Test
  }
  ]
})
router.beforeEach((to, from, next) => {
  if (to.meta && to.meta.title) {
    document.title = to.meta.title
  } else {
    document.title = 'WTS'
  }
  next()
})
export default router
