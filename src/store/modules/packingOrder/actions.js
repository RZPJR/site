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
        commit("setPreloadPackingOrderDetail", true)
        try {
            const response = await http.get("/packing_order/"+payload.id)
            if(response.data.data) {
                commit("setPackingOrderDetail", response.data.data);
                // METHOD FOR GROUPING ITEM PACK 
                let data = response.data.data.packing_recommendation
                let groupedData = data.reduce((result, current) => {
                    const item = current.item;
                    const itemId = current.item_id;
                    const itemPack = current.item_pack;
                    if (result[itemId]) {
                        result[itemId].item_pack.push(...itemPack);
                    } else {
                        result[itemId] = {
                            item_id: itemId,
                            item: item,
                            item_pack: [...itemPack]
                        };
                    }
                    return result;
                }, {});
                let groupedArray = Object.values(groupedData);
                // CALCULATE FOR PERCENTAGE
                groupedArray.forEach((item) => {
                    let totalExpected = 0;
                    let totalActual = 0;
                    item.item_pack.forEach((pack) => {
                        totalExpected += pack.expected_total_pack;
                        totalActual += pack.actual_total_pack;
                    });
                    item.total_progress_pct = totalActual !== 0 ? (totalActual / totalExpected) * 100 : 0;
                });
                commit("setItemPacking", groupedArray);
                commit("setPreloadPackingOrderDetail", false)
            }
        } catch (error) {
            console.error(error)
            commit("setPreloadPackingOrderDetail", false)
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
}

export default actions;

