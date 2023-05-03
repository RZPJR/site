import http from "../../../services/http";

const actions = {
    fetchPackingOrderList: async ({ state, commit }, payload) => {
        commit("setPreloadPackingOrderList", true)
        commit("setPackingOrderList", [])
        try {
            let search = state.packing_order_list.filter.search
            let warehouse = !state.packing_order_list.filter.select_warehouse ? '' : state.packing_order_list.filter.select_warehouse
            let status = state.packing_order_list.filter.statuses === 999 ? '' : state.packing_order_list.filter.statuses
            let delivery_date_from = ''
            let delivery_date_to = ''
            if (state.packing_order_list.filter.delivery_date.value.length > 0) {
                if (state.packing_order_list.filter.delivery_date.value.length == 1) {
                delivery_date_from = state.packing_order_list.filter.delivery_date.value[0]
                } else {
                    let date = state.packing_order_list.filter.delivery_date.value[0]
                    let date2 = state.packing_order_list.filter.delivery_date.value[1]
                    if (date > date2) {
                        delivery_date_from = date2
                        delivery_date_to = date
                    } else {
                        delivery_date_from = date
                        delivery_date_to = date2
                    }
                }
            }
            const response = await http.get('/packing_order', {params: {
                per_page:100,
                order_by:'-id',
                search: search,
                site_id: warehouse,
                status: status,
                delivery_date_from: delivery_date_from,
                delivery_date_to: delivery_date_to
            }});
            commit("setPackingOrderList", response.data.data)
            if(response.data.data == null){
                commit("setPackingOrderList", [])
            }
            commit("setPreloadPackingOrderList", false)
        } catch (error) {
            console.error(error)
            commit("setPreloadPackingOrderList", false)
        }
    },

    // Detail Packing Order
    fetchPackingOrderDetail: async ({ commit, dispatch}, payload) => {
        try {
            const response = await http.get("/packing_order/"+payload.id)
            if(response.data.data) {
                commit("setPackingOrderDetail", response.data.data)
            }
        } catch (error) {
            console.error(error)
        }
    },

    // Create Packing Order
    createPackingOrder: async ({ commit, state, dispatch }, payload) => {
        commit("setFormPackingOrderCreate", {
            delivery_date:new Date(Date.now() + ( 3600 * 1000 * 7)).toISOString().substr(0, 10),
            site_id:"",
            region_id:"",
            note:"",
        }); 
    },

    fetchPackList: async ({ state, commit }, payload) => {
        commit("setPreloadPackList", true)
        commit("setPackList", [])
        try {
            let search = state.pack_list.filter.search
            let site = !state.pack_list.filter.select_warehouse ? '' : state.pack_list.filter.select_warehouse
            let item = !state.pack_list.filter.select_product ? '' : state.pack_list.filter.select_product
            let packing_date_from = ''
            let packing_date_to = ''
            if (state.pack_list.filter.packing_date.value.length > 0) {
                if (state.pack_list.filter.packing_date.value.length == 1) {
                packing_date_from = state.pack_list.filter.packing_date.value[0]
                packing_date_to = state.pack_list.filter.packing_date.value[0]
                } else {
                    let date = state.pack_list.filter.packing_date.value[0]
                    let date2 = state.pack_list.filter.packing_date.value[1]
                    if (date > date2) {
                        packing_date_from = date2
                        packing_date_to = date
                    } else {
                        packing_date_from = date
                        packing_date_to = date2
                    }
                }
            }
            const response = await http.get('/packing_order/pack', {params: {
                per_page:100,
                search: search,
                site_id: site,
                item_id: item,
                packing_date_from: packing_date_from,
                packing_date_to: packing_date_to
            }});
            commit("setPackList", response.data.data)
            if(response.data.data == null){
                commit("setPackList", [])
            }
            commit("setPreloadPackList", false)
        } catch (error) {
            console.error(error)
            commit("setPreloadPackList", false)
        }
    },

    // #Weigh Scale
    // fetch Stable Time from Config APP
    fetchStableTime: async ({ commit, state }, payload) => {
        try {
            const response = await http.get('/configuration/v1/app', {
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
                            commit('setPrintSetting', {...state.weigh_scale.printSetting, stable_weighing_time_second: temp_stable})
                        }
                    }
                }
            }
        } catch (error) {
            console.error(error)
        }
    },
    // fetch packing detail
    fetchPackDetail: async ({ commit, state, dispatch }, payload) => {
        try {
            const response = await http.get('/packing_order/pack/' + payload.data.packing_id, {
                params: {
                    item_id: payload.data.product_id,
                    pack_type: payload.data.pack_type,
                }
            });
            if(response.data.data){
                commit('setData', 
                    {...state.weigh_scale.data,
                        product: response.data.data,
                        actual_total_pack: response.data.data.actual_total_pack,
                        expected_total_pack: response.data.data.expected_total_pack,
                        tolerance: response.data.data.pack_type
                    }
                );
                if (state.weigh_scale.data.product.actual_total_pack === state.weigh_scale.data.product.expected_total_pack) {
                    commit('setPrintSetting', {...state.weigh_scale.printSetting, finished: true})
                }
                const res = await http.get('/configuration/v1/app', {
                    params: {
                        orderby: '-id',
                    }
                }, true);
                if(res.data.data){
                    let data = res.data.data
                    for (let i = 0; i < data.length; i++) {
                        let temp = data[i]
                        if (temp.attribute === "percentage_packing_tolerance") {
                            let temp_tolerance = temp.value
                            let pct = (temp_tolerance / 100) * state.weigh_scale.data.tolerance
                            commit('setData', {
                                ...state.weigh_scale.data, 
                                aboveTolerance: state.weigh_scale.data.tolerance + pct, 
                                belowTolerance: state.weigh_scale.data.tolerance - pct
                            })
                        }
                    }
                }
            }
        } catch (error) {
            console.log(error)
        }
    },
    // weigh scale
    fetchWeighScale: async ({ commit, state, dispatch }, payload) => {
        commit('setFilterSetting', {...state.weigh_scale.filterSetting, loading: true})
        try {
            const response = await http.put("/site/v1/packing_order/pack/update/" + payload.data.packing_id, {
                item_id: payload.data.product_id,
                pack_type: payload.data.pack_type,
                type_print: 1
            })
            .then(response => {
                // CREATE NEW STATE AND MUTATION SUBMIT DATA WEBSOCKET
                if (state.weigh_scale.webSocketSetting.connectedPrint) {
                    // this.submitDataToWebSocket({
                    //     'type' : 'LABEL',
                    //     'url' : response.data.data.link_print,
                    // })
                    commit('setDataWebSocket', {
                        'type' : 'LABEL',
                        'url' : response.data.data.link_print,
                    })
                } else {
                    alert('Automatic print is disconnected. Please try to reconnect the whb.exe or contact admin, press OK to manually print the Label');
                    window.open(response.data.data.link_print, '_blank');
                }
                commit('setFilterSetting', {...state.weigh_scale.filterSetting, packing_code: response.data.data.code})
                if (state.weigh_scale.filter.packing_code === '') {
                    commit('setFilterSetting', {...state.weigh_scale.filterSetting, packing_code: ''})
                }
                commit('setData', 
                    {
                        ...state.weigh_scale.data, 
                        product: {
                            actual_total_pack: response.data.data.actual_total_pack,
                            expected_total_pack: response.data.data.expected_total_pack,
                        }
                    }
                )
                commit('setPrintSetting', {...state.weigh_scale.printSetting, manual: false})
                commit('setFilterSetting', {...state.weigh_scale.filterSetting, loading: false, alert: true, caution: true})
                if (state.weigh_scale.data.product.actual_total_pack === state.weigh_scale.data.product.expected_total_pack) {
                    commit('setPrintSetting', {...state.weigh_scale.printSetting, finished: true})
                }
            })
        } catch (error) {
            commit('setFilterSetting', {...state.weigh_scale.filterSetting, loading: false, fulfill: true})
        }
    },
}

export default actions;

