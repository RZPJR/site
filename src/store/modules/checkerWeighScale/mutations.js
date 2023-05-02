const mutations = {
  // Set for get Stable Time from Configuration
  setCheckStableTime: function(state, payload) {
    state.checker_weigh_scale.printSetting.stable_weighing_time_second = payload;
    return state;
  },
  // Set for get Weigh port from localstorage
  setWeighPort: function(state, payload) {
    localStorage.setItem('weigh_port', payload);
    state.checker_weigh_scale.printSetting.modelWeigh = payload;
    return state;
  },
  // Set for get Ip Address port from localstorage
  setIpAddress: function(state, payload) {
    localStorage.setItem('ip_port', payload);
    state.checker_weigh_scale.printSetting.ipAddress = payload;
    return state;
  },
  // set print setting
  setPrintSetting: function(state, payload) {
    state.checker_weigh_scale.printSetting = payload;
    return state;
  },
  // set filter setting
  setFilterSetting: function(state, payload) {
    // state.checker_weigh_scale.filter = { ...state.checker_weigh_scale.filter, ...payload }; 
    state.checker_weigh_scale.filter = payload;
    return state;
  },
  // set websocket setting
  setWebsocketSetting: function(state, payload) {
    state.checker_weigh_scale.websocketSetting = payload;
    return state;
  },
  // set Loading
  setLoading: function(state, payload) {
    state.checker_weigh_scale.filter.loading = payload;
    return state;
  },
  // set Scanned
  setScanned: function(state, payload) {
    state.checker_weigh_scale.filter.scanned = payload;
    return state;
  },
  // set data
  setData: function(state, payload) {
    state.checker_weigh_scale.data = payload;
    return state;
  },
};

export default mutations;
