import axios from "axios";

export default {
    namespaced: true,
    state:{
        all_main_properties: {}
    },
    getters:{
        main_properties: (state) => state.all_main_properties 
    },
    actions:{
        async fetchMainProperties({commit}) {
            const data = await axios.post('http://localhost:1000/api/client/all-main-properties', {client_request:true});
            commit('setMainProperty', data.data.data.original.data)
        }
    },
    mutations:{
        setMainProperty: (state, data) => {
            state.all_main_properties = data;
        }
    },
}