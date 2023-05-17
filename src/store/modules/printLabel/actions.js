import http from "../../../services/http";
import axios from 'axios';

const api = axios.create({
    baseURL: 'https://apidev.edenfarm.tech/v1',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2ODQzNzg5MjAsImlhdCI6MTY4NDExOTEyMCwiaWQiOjE1MjZ9.MwFJHGdfzeYqSm7ukCyoMpwK6TleowThnPL_1dyQkWY'
    }
});

const actions = {
    printLabel: async ({ commit, state, dispatch, rootState }, payload) => {
        var valueFilterType = localStorage.getItem('filter_type');
        var webSocketState = rootState.webSocket.global_websocket
        commit('setLoadingLabel', true)
        let { val } = payload
        let code = ''
        let typePrint = ''
        if (val.startsWith('PL-') && valueFilterType == 'label_picking') {
            code = 'pickinglist.code:' + val
            typePrint = 'picking_list'
        } else {
            code = 'salesorder.code:' + val
            typePrint = valueFilterType
        }
        try {
            const response = await api.get('/warehouse/picking_order/assign/print?', {
                params: {
                    conditions: code,
                    type_print: typePrint
                }
            });
            if(response.data){
                let data = response.data.data
                if (valueFilterType == 'sj') {
                    if (webSocketState.connected == true) {
                        dispatch('submitDataWebSocket', ({
                            'type': 'INVOICE',
                            'qty' : 3,
                            'url': response.data.file
                        }))
                    } else {
                        alert('Automatic print is disconnected. Please try to reconnect the whb.exe or contact admin, press OK to manually print the Surat Jalan');
                        window.open(response.data.file, '_blank');
                    }
                    commit('setSearch', '')
                    commit('setLoadingLabel', false)
                } else {
                    if (val.startsWith('PL-')) {
                        if (webSocketState.connected == true) {
                            dispatch('submitDataWebSocket', ({
                                'type': 'LABEL',
                                'url': response.data.file
                            }))
                        } else {
                            alert('Automatic print is disconnected. Please try to reconnect the whb.exe or contact admin, press OK to manually print the Label');
                            window.open(response.data.file, '_blank');
                        }
                        commit('setSearch', '')
                        commit('setLoadingLabel', false)
                    } else {
                        if (webSocketState.connected == true) {
                            dispatch('submitDataWebSocket', ({
                                'type': 'LABEL',
                                'url': data.link_print
                            }))
                        } else {
                            alert('Automatic print is disconnected. Please try to reconnect the whb.exe or contact admin, press OK to manually print the Label');
                            window.open(data.link_print, '_blank');
                        }
                        commit('setSearch', '')
                        commit('setLoadingLabel', false)
                    }
                }
            }
        } catch (error) {
            commit('setLoadingLabel', false)
            commit('setErrorSO', true)
            commit('setSearch', '')
            val = ''
            setTimeout(function(){
                window.location.reload()
            }, 2000)
        }
    }
}

export default actions;