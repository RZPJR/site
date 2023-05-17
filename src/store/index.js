import Vue from "vue";
import Vuex from "vuex";

import packingOrder from "./modules/packingOrder";
import checkerWeighScale from "./modules/checkerWeighScale";
import printLabel from "./modules/printLabel";

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    packingOrder,
    checkerWeighScale,
    printLabel
  }
});
