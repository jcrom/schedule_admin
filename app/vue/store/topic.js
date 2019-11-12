import axios from 'axios';

export default {
  namespaced: true,
  state: {
    getTopicData: {},
  },
  mutations: {
    getTopicData: (state, { getTopicData = {} }) => {
      const s = state;
      s.getTopicData = getTopicData;
    },
  },
  actions: {
    //  getTopicData({ commit }, { contentId }) {
    //   return axios.get('/msite/match/getTopicData.htm', {
    //     params: {
    //       contentId,
    //     },
    //     proxy: {
    //       host: '127.0.0.1',
    //       port: 7001,
    //     },
    //   }).then(({ data }) => {
    //     commit('getTopicData', { getTopicData: data.data });
    //   });
    // },
    getTopicData({ commit }, { specialId }) {
      return axios.get('/msite/match/getNewTopicData.htm', {
        params: {
          specialId,
        },
        proxy: {
          host: '127.0.0.1',
          port: 7001,
        },
      }).then(({ data }) => {
        commit('getTopicData', { getTopicData: data.data });
      });
    },
  },
  get: {},
};
