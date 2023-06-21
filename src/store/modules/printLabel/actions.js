import http from "../../../services/http";

const actions = {
    // getting websocket Configuration
    getWebSocketPrintLabel: async ({ commit, state, dispatch }, payload) => {
        state.print_label.websocket_setting.websocket = new WebSocket("ws://127.0.0.1:12212/printer")
        state.print_label.websocket_setting.websocket.onopen = () => {
            commit('setWebSocketSetting', {...state.print_label.websocket_setting, connected: true, websocket_status: 'Connected'})
        }
        state.print_label.websocket_setting.websocket.onclose = () => {
            commit('setWebSocketSetting', {...state.print_label.websocket_setting, connected: false, websocket_status: 'Disconnected'})
            dispatch('reconnectWebSocket')
        }
    },
    // reconnecting to websocket if disconnected
    reconnectWebSocket: async ({ commit, state, dispatch }, payload) => {
        dispatch('getWebSocketPrintLabel');
    },
    // printLabel Method
    printLabel: async ({ commit, state, dispatch, rootState }, payload) => {
        var valueFilterType = localStorage.getItem('filter_type');
        commit('setLoadingLabel', true)
        let { val } = payload
        try {
            if (valueFilterType == 'label_picking') {
                const response = await http.get('/print_label', {
                    params: {
                        condition: val,
                        type_print: 'picking_list'
                    }
                });
                if(response.data){
                    let data = response.data.data
                    if (state.print_label.websocket_setting.connected == true) {
                        dispatch('submitDataWebSocketPrintLabel', ({
                            'type': 'LABEL',
                            'url': data.data
                        }))
                    } else {
                        alert('Automatic print is disconnected. Please try to reconnect the whb.exe or contact admin, press OK to manually print the Label');
                        window.open(data.data, '_blank');
                    }
                    commit('setSearch', '')
                    commit('setLoadingLabel', false)
                }
            } else if (valueFilterType == 'sj') {
                const response = await http.get('/print_label/delivery', {
                    params: {
                        condition: val,
                        type_print: 'sj'
                    }
                });
                if(response.data){
                    let data = response.data.data
                    if (state.print_label.websocket_setting.connected == true) {
                        dispatch('submitDataWebSocketPrintLabel', ({
                            'type': 'INVOICE',
                            'qty' : 3,
                            'url': data.data
                        }))
                    } else {
                        alert('Automatic print is disconnected. Please try to reconnect the whb.exe or contact admin, press OK to manually print the Label');
                        window.open(data.data, '_blank');
                    }
                    commit('setSearch', '')
                    commit('setLoadingLabel', false)
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
    },
    // submit data to websocket to print label
    submitDataWebSocketPrintLabel: async ({ commit, state, dispatch }, payload) => {
        if (Array.isArray(payload)) {
            payload.forEach(element => {
                state.print_label.websocket_setting.websocket.send(JSON.stringify(element))
            });
        } else {
            state.print_label.websocket_setting.websocket.send(JSON.stringify(payload))
        }
    },
}

export default actions;