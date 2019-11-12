import axios from 'axios';

export default {
  namespaced: true,
  state: {
    videoDetail: {},
  },
  mutations: {
    videoDetail: (state, { videoDetail }) => {
      const s = state;
      s.videoDetail = videoDetail;
    },
  },
  actions: {
    videoDetail({ commit }, { videoId }) {
      return axios.get('/msite/match/getVideoData.htm', {
        params: {
          videoId,
        },
        proxy: {
          host: '127.0.0.1',
          port: 7001,
        },
      }).then(({ data }) => {
        commit('videoDetail', { videoDetail: data.data });
      });
    },
  },
};
