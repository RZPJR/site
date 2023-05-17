const mutations = {
  //set for get websocket value
  setWebSocket: function(state, payload) {
    state.global_websocket = payload;
    return state;
  },
};

export default mutations;
