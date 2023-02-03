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
};

export default mutations;
