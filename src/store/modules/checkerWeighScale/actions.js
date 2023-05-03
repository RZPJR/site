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
        commit('setLoading', true)
        commit('setScanned', false)
        try {
            const response = await http.get('/checker_weight_scale/' + id);
            if(response.data.data){
                commit('setFilterSetting', {...state.checker_weigh_scale.filter, search_prd: ''})
                commit('setData', {...state.checker_weigh_scale.data, product: response.data.data})
                const res = await http.get('/configuration/v1/app', {
                    params: {
                        orderby: '-id'
                    }
                }, true)
                if(res.data.data){
                    commit('setLoading', false)
                    commit('setScanned', true)
                    let data = res.data.data
                    for (let i = 0; i < data.length; i++) {
                        let temp = data[i]
                        if(temp.attribute === 'percentage_kg_picking_tolerance'){
                            let temp_tolerance = temp.value
                            let moq = state.checker_weigh_scale.data.product.order_min_qty
                            let pct1 = (temp_tolerance / 100) * moq
                            let pct2 = (temp_tolerance / 100) * state.checker_weigh_scale.data.product.order_qty
                            commit('setData', {
                                ...state.checker_weigh_scale.data,
                                tolerance1: state.checker_weigh_scale.data.product.order_qty + pct1,
                                tolerance2: state.checker_weigh_scale.data.product.order_qty + pct2
                            })
                        }
                    }
                }
            }
        } catch (error) {
            commit('setLoading', false)
            commit('setFilterSetting', {...state.checker_weigh_scale.filter, search_prd: ''})
        }
    },
    updateProduct: async ({ commit, state, dispatch }, payload) => {
        const {id, data} = payload
        commit('setLoading', true)
        try {
            const response = await http.put('/checker_weight_scale/' + id, {
                check_qty: parseFloat(data)
            });
            if(response.data.data){
                commit('setLoading', false)
                commit('setFilterSetting', {
                    ...state.checker_weigh_scale.filter,
                    alert: true,
                    finished: true,
                    caution: true,
                })
            }
        } catch (error) {
            commit('setLoading', false)
        }
    },
}

export default actions;

