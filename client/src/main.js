// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import './plugins/axios'
import App from './App'
import router from './router'
import Buefy from 'buefy'
import { sync } from 'vuex-router-sync'
import 'buefy/dist/buefy.css'
import store from '@/store/store'
import VueCountdown from '@chenfengyuan/vue-countdown';

Vue.config.productionTip = false
Vue.use(Buefy)

sync(store, router)

Vue.component(VueCountdown.name, VueCountdown);

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})



