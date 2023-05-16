const actions = {
    getWebSocket: async ({ commit, state, dispatch }, payload) => {
        state.global_websocket.websocket = new WebSocket("ws://127.0.0.1:12212/printer")
        state.global_websocket.websocket.onopen = () => {
            commit('setWebSocket', {...state.global_websocket, connected: true, websocket_status: 'Connected'})
        }
        state.global_websocket.websocket.onclose = () => {
            commit('setWebSocket', {...state.global_websocket, connected: false, websocket_status: 'Disconnected'})
            dispatch('reconnectWebSocket')
        }
    },
    reconnectWebSocket: async ({ commit, state, dispatch }, payload) => {
        dispatch('getWebSocket');
    },
}

export default actions;