import Vue from 'vue';
// import VueAwesomeSwiper from 'vue-awesome-swiper';
import { createApp } from './app';

// Vue.use(VueAwesomeSwiper);

// a global mixin that calls `asyncData` when a route component's params change
Vue.mixin({
  beforeRouteUpdate(to, from, next) {
    const { asyncData , asyncDataClientNoDo } = this.$options;
    if (asyncData && !asyncDataClientNoDo) {
      asyncData({
        store: this.$store,
        route: to,
      }).then(next).catch(next);
    } else {
      next();
    }
  },
});

const { app, router, store } = createApp();
// const { app, router } = createApp();

// prime the store with server-initialized state.
// the state is determined during SSR and inlined in the page markup.
const INITIAL_STATE = '__INITIAL_STATE__';
if (window[INITIAL_STATE]) {
  store.replaceState(window[INITIAL_STATE]);
}

// wait until router has resolved all async before hooks
// and async components...
router.onReady(() => {
  // Add router hook for handling asyncData.
  // Doing it after initial route is resolved so that we don't double-fetch
  // the data that we already have. Using router.beforeResolve() so that all
  // async components are resolved.
  router.beforeResolve((to, from, next) => {
    const matched = router.getMatchedComponents(to);
    const prevMatched = router.getMatchedComponents(from);
    let diffed = false;
    const activated = matched.filter((c, i) => diffed || (diffed = (prevMatched[i] !== c)));
    const asyncDataHooks = activated.map(c => c.asyncData).filter(_ => _);
    if (!asyncDataHooks.length) {
      return next();
    }

    return Promise.all(asyncDataHooks.map(hook => hook({ })))
      .then(() => {
        next();
      })
      .catch(next);
  });

  // actually mount to DOM
  app.$mount('#app');
});

// service worker
if (location.protocol && navigator.serviceWorker === 'https:') {
  navigator.serviceWorker.register('/service-worker.js');
}
