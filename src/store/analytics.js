import axios from "axios";
export default {
    namespaced: true,
    state:{
        analytics: {},
        total_property: {},
        properties : {}
    },
    getters:{
        analytics: (state) => state.analytics,
        total_property: (state) => state.total_property
    },
    mutations:{
        fetchAnalytics(state, data) {
            state.analytics = data.data.analytics;
            state.total_property = data.data.total_property;
        },
        fetchProperties(state, data){
            state.properties = data.data;
        }
    },
    actions:{
        getPropertiesAnalytics({ commit }, url) {
            axios.get(url)
            .then(response => {
                commit('fetchAnalytics', response.data)
            })
        },
        getProperties({ commit }, url) {
            axios.get(url)
            .then(response => {
                commit('fetchProperties', response.data)
            })
        },
    }
}