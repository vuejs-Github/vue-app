import Vue from 'vue'
import VueRouter from 'vue-router'

import app from '@/App'

Vue.use(VueRouter)

const router =  new VueRouter({
    routes: [
        {
            path: '/',
            component: () => import('@/App.vue'),
            name: '首页',
            children: [
              {
                path: '/',
                component: () => import('@/views/expert/expert'),
                name: '专家列表',
                meta: { title: '专家列表', icon: 'expert', affix: true }
              },
              {
                path: '/detail',
                component: () => import('@/views/details/details'),
                name: '详情',
                meta: { title: '详情', icon: 'expert', affix: true }
              }
            ]
        }
    ]
})

export default router