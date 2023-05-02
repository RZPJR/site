import http from "../../../services/http";

const actions = {
    fetchStableTime: async ({ commit, state }, payload) => {
        try {
            const response = await http.get("/configuration/v1/app", {
                params: {
                    page: 1,
                    per_page: 100,
                    status: 1,
                    order_by: '-id',
                    attribute: payload.type
                }
            }, true)
            if(response.data.data) {
                let data = response.data.data
                for (let i = 0; i < data.length; i++) {
                    if (payload.type === "stable_weighing_time_second") {
                        if(data[i].attribute === payload.type){
                            let temp_stable = data[i].value
                            commit('setPrintSetting', {...state.checker_weigh_scale.printSetting, stable_weighing_time_second: temp_stable})
                        }
                    }
                }
            }
        } catch (error) {
            console.error(error)
        }
    },
    fetchProductDetail: async ({ commit, state, dispatch }, payload) => {
        const {id} = payload
        // commit('setLoading', true)
        // commit('setScanned', false)
        commit('setFilterSetting', {
            ...state.checker_weigh_scale.filter, 
            loading: true,
            scanned: false,
        })
        try {
            const response = await http.get('/checker_weight_scale/' + id);
            if(response.data.data){
                // commit('setLoading', false)
                // commit('setScanned', true)
                commit('setFilterSetting', {
                    ...state.checker_weigh_scale.filter, 
                    loading: false,
                    scanned: true,
                    search_prd: ''
                })
                commit('setData', {...state.checker_weigh_scale.data, product: response.data.data})
                // dispatch('fetchStableTime', {'type': 'percentage_kg_picking_tolerance'}) DONOT REMOVE, KEEP FOR REFERENCE
            }
        } catch (error) {
            commit('setFilterSetting', {
                ...state.checker_weigh_scale.filter, 
                loading: false,
            })
            commit('setFilterSetting', {search_prd: ''})
        }
    },

}

export default actions;

