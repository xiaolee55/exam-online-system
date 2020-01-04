import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import App from './App'
import router from './router'
import axios from 'axios';
import vueAxios from 'vue-axios'; 

Vue.use(ElementUI)
Vue.use(vueAxios,axios);
Vue.config.productionTip = false

let vm = new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>',
})