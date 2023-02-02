const mutations = {
  // #region Readlist Application
    setApplicationList: function(state, payload) {
      state.applicationList.data = payload;
      return state;
    },
    setPreloadApplicationList: function(state, payload) {
      state.applicationList.isLoading = payload;
      return state;
    },
    setGlossaryFilterList: function(state, payload){
      state.applicationList.filter.glossary = payload;
      return state;
    },
    // #endregion Readlist Application

    // #region Update Application
    setUpdateApplicationForm: function(state, payload){
      state.updateApplication.form = payload
      return state;
    }
    // #endregion Update Application
};

export default mutations;
