import http from "../../../services/http";

const actions = {
    fetchApplicationList: async ({ state, commit }, payload) => {
        commit("setPreloadApplicationList", true)
        commit("setApplicationList", [])
        try {
            let glossary = !state.applicationList.filter.glossary ? '' : state.applicationList.filter.glossary
            const response = await http.get('/app', {params: {
                per_page:100,
                application: glossary
            }});
            commit("setApplicationList", response.data.data)
            if(response.data.data == null){
                commit("setApplicationList", [])
            }
            commit("setPreloadApplicationList", false)
        } catch (error) {
            console.log(error)
            commit("setPreloadApplicationList", false)
        }
    },

    fetchUpdateApplicationDetail: async ({ commit, dispatch}, payload) => {
        try {
            const response = await http.get("/app/"+payload.id)
            if(response.data.data) {
                let items = response.data.data
                commit("setUpdateApplicationForm",{
                    application: items.application,
                    field: items.field,
                    value: items.value,
                })
            }
        } catch (error) {
            console.log(error)
        }
    }
}

export default actions;

