import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const router = new VueRouter({
  routes: [
    {
      path: '/', redirect: '/expert'
    },
    {
      path: '/expert',
      name: '专家列表',
      component: () => import('@/views/expert/expert'),
      meta: { title: '专家列表', icon: 'expert', affix: true }
    },
    {
      path: '/detail',
      name: '详情',
      component: () => import('@/views/details/details'),
      meta: { title: '详情', icon: 'expert', affix: true }
    }
  ]
})

export default router