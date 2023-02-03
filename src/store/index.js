import Vue from "vue";
import Vuex from "vuex";

import packingOrder from "./modules/packingOrder";

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    packingOrder
  }
});
