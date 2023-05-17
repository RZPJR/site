const actions = {
    getWebSocketWeighScale: async ({ commit, state, dispatch, rootState }, payload, callback) => {
        let val = localStorage.getItem('weigh_port')
        let ip = localStorage.getItem('ip_port')
        let time = localStorage.getItem('time')
        state.global_websocket.websocket = new WebSocket(`wss://${ip}:12212/serial/`+ val)
        state.global_websocket.websocket.onopen = () => {
            if (payload.type == 'checker_weigh_scale') {
                commit('setWebsocketSetting', {...rootState.checkerWeighScale.checker_weigh_scale.websocketSetting, connected: true})
                commit('setPrintSetting', {...rootState.checkerWeighScale.checker_weigh_scale.printSetting, ipAddress: ip, modelWeigh: val})
            } else {
                commit('setWeighScaleData', 
                    {...rootState.packingOrder.weigh_scale,
                        connected: true,
                        portIp: ip,
                        modelWeigh: val,
                        modelTime: time
                    }
                )
            }
        }
        state.global_websocket.websocket.onclose = () => {
            if (payload.type == 'checker_weigh_scale') {
                commit('setWebsocketSetting', {...rootState.checkerWeighScale.checker_weigh_scale.websocketSetting, connected: false})
                commit('setFilterSetting', {...rootState.checkerWeighScale.checker_weigh_scale.filter, message: 'error2'})
                dispatch('reconnectWebSocket')
            } else {
                commit('setWeighScaleData', 
                    {...rootState.packingOrder.weigh_scale,
                        connected: false,
                        message: 'error2'
                    }
                )
                dispatch('reconnectWebSocket')
            }
        }
        state.global_websocket.websocket.onmessage = (evt) => {
            if (typeof payload.callback === 'function') {
                payload.callback(evt); // Invoke the callback with the received message
            }
        }
    },
    reconnectWebSocket: async ({ commit, state, dispatch }, payload) => {
        dispatch('getWebSocket');
    },
}

export default actions;