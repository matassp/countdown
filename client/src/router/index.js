import Vue from 'vue'
import Router from 'vue-router'
import Landing from '@/components/Landing.1'
import Register from '@/components/Register2'
import Login from '@/components/Login'
import MyList from '@/components/MyList'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Landing',
      component: Landing
    }, {
      path: '/register',
      name: 'Register',
      component: Register
    }, {
      path: '/login',
      name: 'Login',
      component: Login
    }, {
      path: '/my-list',
      name: 'MyList',
      component: MyList
    }
  ]
})
