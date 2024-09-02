import Vue from 'vue';
import Vuex from 'vuex';


import layout from './layout';
import auth from './auth';
import modules_data from './moudlesdata';
import client from './client';
import analytics from './analytics';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    layout,
    auth,
    modules_data,client,
    analytics
  },
});
