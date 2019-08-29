import Vue from 'vue'
import Router from 'vue-router'

import Test from '@/components/test'
import TestPage from '@/pages/testPage'
Vue.use(Router)

const router = new Router({
  routes: [{
    path: '/test',
    name: 'test',
    component: Test
  }, {
    path: '/testPage',
    name: 'testPage',
    component: TestPage
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
