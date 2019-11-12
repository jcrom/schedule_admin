export default {
  namespaced: true,
  state: {
    SSRSetStoreData: {},
  },
  mutations: {
    SSRSetStoreData(state, { SSRSetStoreData = {} }) {
      const s = state;
      s.SSRSetStoreData = SSRSetStoreData;
    },
  },
};
