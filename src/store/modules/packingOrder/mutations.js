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
    setWarehouseFilterList: function(state, payload){
      state.packing_order_list.filter.SelectWarehouse = payload;
      return state;
    },
    // #endregion Readlist Packing Order

    // #region Detail Packing Order
    setWeighScale: function(state, payload) {
      state.packing_order_detail.WeighScale = payload
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
      state.pack_list.filter.SelectWarehouse = payload;
      return state;
    },
    // #endregion Readlist Pack List
};

export default mutations;
