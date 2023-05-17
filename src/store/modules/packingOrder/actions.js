import http from "../../../services/http";
import Vue from 'vue';

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

    // weigh scale
    // fetching product
    fetchRenderProduct: async ({ state, commit }, payload) => {
        let {
            packing_id,
            product_id,
            pack_type
        } = payload.data

        try {
            const response = await http.get('/packing_order/pack/' + packing_id, {
                params: {
                    item_id: product_id,
                    pack_type: pack_type
                }
            });
            if (response.data.data) {
                commit("setWeighScaleData", {
                    ...state.weigh_scale,
                    product: response.data.data,
                    actualData: response.data.data.actual_total_pack,
                    expectedData: response.data.data.expected_total_pack,
                    tolerance: response.data.data.pack_type,
                })
                if (state.weigh_scale.actualData === state.weigh_scale.expectedData) {
                    commit("setWeighScaleData", {
                        ...state.weigh_scale,
                        finished: true,
                    })
                }
                const res = await http.get('/configuration/v1/app', {
                    params: {
                        orderby: '-id'
                    }
                }, true)
                if (res.data.data) {
                    let data = res.data.data
                    for (let i = 0; i < data.length; i++) {
                        let temp = data[i]
                        if(temp.attribute === 'percentage_kg_picking_tolerance'){
                            let temp_tolerance = temp.value
                            let pct = (temp_tolerance / 100) * state.weigh_scale.tolerance
                            commit("setWeighScaleData", {
                                ...state.weigh_scale,
                                aboveTolerance: state.weigh_scale.tolerance + pct,
                                belowTolerance: state.weigh_scale.tolerance - pct,
                            })
                        }
                    }
                }
            }
        } catch {
            console.error(error)
        }
    },
    // fetch print label
    packingLabelPrint: async ({ state, commit }, payload) => {
        let {
            packing_id,
            product_id,
            pack_type
        } = payload
        console.log(packing_id, product_id, pack_type, 'data masuk')
        // commit("setWeighScaleData", {
        //     ...state.weigh_scale,
        //     loading: true
        // })
        
        // try {
        //     const response = await http.get('/packing_order/pack/print/' + )
        // } catch {
        //     console.error(error)
        // }
    },
    // submit data to websocket
    submitDataWebSocket: async ({ commit, state, dispatch, rootState }, payload) => {
        var webSocketState = rootState.webSocketWeighScale.global_websocket
        if (Array.isArray(payload)) {
            payload.forEach(element => {
                webSocketState.websocket.send(JSON.stringify(element))
            });
        } else {
            webSocketState.websocket.send(JSON.stringify(payload))
        }
    },
    // update Weigh Scale
    fetchWeighScale: async ({ state, commit, dispatch, rootState }, payload) => {
        commit("setWeighScaleData", {
            ...state.weigh_scale,
            loading: true
        })

        let {
            packing_id,
            product_id,
            pack_type
        } = payload

        try {
            const response = await http.put('/packing_order/pack/update/' + packing_id ,{
                item_id: product_id,
                pack_type: pack_type,
                type_print: 1
            })
            if (response.data.data) {
                if (state.weigh_scale.product.actual_total_pack >= state.weigh_scale.product.expected_total_pack) {
                    commit("setWeighScaleData", {
                        ...state.weigh_scale,
                        fulfill: true,
                    })
                } else {
                    const res = await http.put('/packing_order/pack/print/' + packing_id, {
                        item_id: product_id,
                        pack_type: pack_type,
                        type_print: 1,
                        weight_scale: parseFloat(state.weigh_scale.search)
                    })
                    if (res.data.data) {
                        if (state.weigh_scale.connected == true) {
                            dispatch('submitDataWebSocket', ({
                                'type': 'LABEL',
                                'url': res.data.data.link_print
                            }))
                        } else {
                            alert('Automatic print is disconnected. Please try to reconnect the whb.exe or contact admin, press OK to manually print the Label');
                            window.open(res.data.data.link_print, '_blank');
                        }
                        commit("setWeighScaleData", {
                            ...state.weigh_scale,
                            packing_code: res.data.data.code,
                            actualData: res.data.data.actual_total_pack,
                            expectedData: res.data.data.expected_total_pack,
                            loading: false,
                            alert: true,
                            caution: true,
                            manual: false,
                        })
                        if (state.weigh_scale.packing_code === '') {
                            commit("setWeighScaleData", {
                                ...state.weigh_scale,
                                packing_code: ''
                            })
                        }
                        if (state.weigh_scale.actualData === state.weigh_scale.expectedData) {
                            commit("setWeighScaleData", {
                                ...state.weigh_scale,
                                finished: true,
                            })
                        }
                    }
                }
            }
        } catch {
            commit("setWeighScaleData", {
                ...state.weigh_scale,
                loading: false,
                fulfill: true
            })
        }
    },
    // dispose packing
    fetchDisposePacking: async ({ state, commit, dispatch }, payload) => {
        commit("setWeighScaleData", {
            ...state.weigh_scale,
            loadingDispose: true
        })

        let {
            packing_id,
            product_id,
            pack_type
        } = payload

        try {
            const response = await http.delete('/packing_order/pack/dispose/' + packing_id ,{
                data: {
                    item_id: product_id,
                    pack_type: pack_type
                }
            })
            if (response.data.data) {
                commit("setWeighScaleData", {
                    ...state.weigh_scale,
                    packing_code: response.data.data.code_print,
                    alert: false,
                    actualData: response.data.data.actual_total_pack,
                    expectedData: response.data.data.expected_total_pack,
                    loadingDispose: false,
                    dispose: false
                })
                Vue.$toast.open({
                    position: 'top-right',
                    message: 'Success to dispose ' + state.weigh_scale.packing_code,
                    type: 'success',
                });
                if (state.weigh_scale.actualData !== state.weigh_scale.expectedData) {
                    commit("setWeighScaleData", {
                        ...state.weigh_scale,
                        finished: false,
                    })
                }
            }
        } catch (error) {
            console.log(error)
        }
    }
}

export default actions;

