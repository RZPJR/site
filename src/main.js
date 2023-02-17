import "./set-public-path";
import Vue from "vue";
import singleSpaVue from "single-spa-vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import Http from "./services/http";
import vuetify from "./plugins/vuetify";
import VueToast from 'vue-toast-notification';
import 'vue-toast-notification/dist/theme-sugar.css';
import '@mdi/font/css/materialdesignicons.css'
import { Components } from "@vue-mf/global";
import Vuetify from "vuetify/lib";

Vue.use(require('vue-moment'));
Vue.use(VueToast);
Vue.use(Vuetify);
Vue.config.productionTip = false;

Vue.mixin({
  components: Components,
});

const vueLifecycles = singleSpaVue({
  Vue,
  appOptions: {
    created: () => Http.init(),
    render: h => h(App),
    vuetify,
    router,
    store
  }
});

export const bootstrap = vueLifecycles.bootstrap;
export const mount = vueLifecycles.mount;
export const unmount = vueLifecycles.unmount;
