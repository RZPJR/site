import http from "../../../services/http";
import axios from "axios";

const actions = {
    fetchStableTime: async ({ commit, state }, payload) => {
        let API_URL = process.env.VUE_APP_API_URL_BASE;
        try {
            const response = await axios.get(API_URL + "/configuration/v1/app", {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("bearer")}`
                },
                params: {
                    page: 1,
                    per_page: 100,
                    status: 1,
                    order_by: '-id',
                    attribute: payload.type
                }
            })
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
        commit('setLoading', true)
        commit('setScanned', false)
        try {
            const response = await http.get('/checker_weight_scale/' + id);
            if(response.data.data){
                commit('setLoading', false)
                commit('setScanned', true)
                commit('setFilterSetting', {search_prd: ''})
                commit('setData', {...state.checker_weigh_scale.data, product: response.data.data})
                // dispatch('fetchStableTime', {'type': 'percentage_kg_picking_tolerance'}) DONOT REMOVE, KEEP FOR REFERENCE
            }
        } catch (error) {
            commit('setLoading', false)
            commit('setFilterSetting', {search_prd: ''})
        }
    },

}

export default actions;

