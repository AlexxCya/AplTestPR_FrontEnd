import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'

Vue.prototype.$apiURI = "http://localhost:51345";
Vue.config.productionTip = false

new Vue({
  vuetify,
  render: h => h(App)
}).$mount('#app')
