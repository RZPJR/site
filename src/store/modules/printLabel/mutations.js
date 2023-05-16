const mutations = {
  //set for get websocket value
  setErrorSO: function(state, payload) {
    state.print_label.errorSO = payload;
    return state;
  },
  // set for loading page
  setLoadingLabel: function(state, payload) {
    state.print_label.loading = payload;
    return state;
  },
  // set search to null
  setSearch: function(state, payload) {
    state.print_label.search = payload;
    return state;
  }
};

export default mutations;
