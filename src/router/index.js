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
        }
    ]
})

export default router