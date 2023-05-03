const mutations = {
  // #region Readlist Packing Order
    setPackingOrderList: function(state, payload) {
      state.packing_order_list.data = payload;
      return state;
    },
    setPreloadPackingOrderList: function(state, payload) {
      state.packing_order_list.isLoading = payload;
      return state;
    },
    setWarehousePackingOrderList: function(state, payload){
      state.packing_order_list.filter.select_warehouse = payload;
      return state;
    },
    // #endregion Readlist Packing Order

    // #region Detail Packing Order
    setWeighScale: function(state, payload) {
      state.packing_order_detail.weigh_scale = payload
      return state;
    },
    setPackingOrderDetail: function(state, payload) {
      state.packing_order_detail.data = payload;
      return state;
    },
    // #endregion Detail Packing Order

    // Packing Order Create 
    setFormPackingOrderCreate: function(state, payload) {
      state.packing_order_create.form = payload;
      return state;
    },

    // #region Readlist Pack List
    setPackList: function(state, payload) {
      state.pack_list.data = payload;
      return state;
    },
    setPreloadPackList: function(state, payload) {
      state.pack_list.isLoading = payload;
      return state;
    },
    setWarehouseFilterList: function(state, payload){
      state.pack_list.filter.select_warehouse = payload;
      return state;
    },
    setItemFilterList: function(state, payload){
      state.pack_list.filter.select_product = payload;
      return state;
    },
    // #endregion Readlist Pack List

    // #weigh scale
    // Set for get Stable Time from Configuration
    setCheckStableTime: function(state, payload) {
        state.weigh_scale.printSetting.stable_weighing_time_second = payload;
        return state;
    },
    // Set for get Weigh port from localstorage
    setWeighPort: function(state, payload) {
        localStorage.setItem('weigh_port', payload);
        state.weigh_scale.printSetting.modelWeigh = payload;
        return state;
    },
    // Set for get Ip Address port from localstorage
    setIpAddress: function(state, payload) {
        localStorage.setItem('ip_port', payload);
        state.weigh_scale.printSetting.ipAddress = payload;
        return state;
    },
    // Set for get Time from localstorage
    setTime: function(state, payload) {
        localStorage.setItem('time', payload);
        state.weigh_scale.printSetting.modelTime = payload;
        return state;
    },
    // set print setting
    setPrintSetting: function(state, payload) {
        state.weigh_scale.printSetting = payload;
        return state;
    },
    // set filter setting
    setFilterSetting: function(state, payload) {
        state.weigh_scale.filter = payload;
        return state;
    },
    // set websocket setting
    setWebsocketSetting: function(state, payload) {
        state.weigh_scale.websocketSetting = payload;
        return state;
    },
    // set Loading
    setLoading: function(state, payload) {
        state.weigh_scale.filter.loading = payload;
        return state;
    },
    // set Scanned
    setScanned: function(state, payload) {
        state.weigh_scale.filter.scanned = payload;
        return state;
    },
    // set data
    setData: function(state, payload) {
        state.weigh_scale.data = payload;
        return state;
    },
    // set for data websocket
    setDataWebSocket: function(state, payload) {
        state.weigh_scale.websocketSetting.websocketPrint = payload;
        return state;
    },
    // set for connected print
    setConnectedPrint: function(state, payload) {
        state.weigh_scale.websocketSetting.connectedPrint = payload;
        return state;
    },
    // #end weigh scale
};

export default mutations;
