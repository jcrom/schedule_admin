import Vue from 'vue';
import Vuex from 'vuex';

// import bannerInfo from './banner';
import SSRSetStoreData from './SSRSetStoreData';

Vue.use(Vuex);

export default function createStore() {
  return new Vuex.Store({
    modules: {
      // bannerInfo,
      SSRSetStoreData,
    },
  });
}
