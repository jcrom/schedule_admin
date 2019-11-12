import 'babel-polyfill';
import Vue from 'vue';
import VueResource from 'vue-resource';
// import VueLazyload from 'vue-lazyload';
// import layer from 'vue-layer';
import { sync } from './vendors/vuex-router-sync';
import './assets/styles/common.less';
import './assets/styles/pc.less';
import App from './App.vue';
import createStore from './store';
import createRouter from './router';
import components from './components/';
// import appJSSDK from './vendors/appJSSDK';
// import wxJSSDK from './vendors/wxJSSDK';
// import authPromiseFile from './vendors/authPromiseFile';
// import axios from 'axios';

// import titleMixin from './util/title';
// import * as filters from './util/filters';

// mixin for handling title
// Vue.mixin(titleMixin);

// register global utility filters.
// Object.keys(filters).forEach(key => {
  // Vue.filter(key, filters[key]);
// });

Vue.use(VueResource);
// Vue.use(VueLazyload, {
//   error: '/static/images/loading.png',
//   loading: '/static/images/loading.png',
//   attempt: 1,
//   filter: {
//     progressive(listener) {
//       const lis = listener;
//       const widthPx = 5 * lis.el.parentNode.parentNode.clientWidth;
//       const heightPx = 5 * lis.el.parentNode.parentNode.clientHeight;
//       const size = `${widthPx}w_${heightPx}h_80q`;
//       if (lis.el.getAttribute('format') === 'true') { // 需要格式化的img
//         if (lis.src.indexOf('?') > -1) {
//           lis.src += `&format=${size}`;
//         } else {
//           lis.src += `?format=${size}`;
//         }
//       }
//       let lsrc = lis.src || '';
//       lsrc = lsrc.replace(/v.img/, 'v-img');
//       if (/(http:)|(https:)/g.test(lsrc)) {
//         lis.src = lsrc.replace(/(http:)|(https:)/g, '');
//       }
//     },
//   },
// });
// Vue.directive('mysrc', {
//   bind(el, binding) {
//     let val = binding.value || '';
//     val = val.replace(/v.img/, 'v-img');
//     if (/(http:)|(https:)/g.test(val)) {
//       const deleteHttpSrc = val.replace(/(http:)|(https:)/g, '');
//       el.setAttribute('src', deleteHttpSrc);
//     } else {
//       el.setAttribute('src', val);
//     }
//   },
//   update(el, binding) {
//     const val = binding.value || '';
//     if (/(http:)|(https:)/g.test(val)) {
//       const deleteHttpSrc = val.replace(/(http:)|(https:)/g, '');
//       el.setAttribute('src', deleteHttpSrc);
//     } else {
//       el.setAttribute('src', val);
//     }
//   },
// });

// if (!IsServer) {
//   // 纯前端vue插件在此处加载use

//   Vue.prototype.$layer = layer(Vue);
//   const VueAwesomeSwiper = require('vue-awesome-swiper/ssr');
//   Vue.use(VueAwesomeSwiper);
//   const VueTouch = require('vue-touch');
//   Vue.use(VueTouch);
//   Vue.use(appJSSDK);
//   Vue.use(wxJSSDK);
//   Vue.use(authPromiseFile);
// }

// Expose a factory function that creates a fresh set of store, router,
// app instances on each call (which is called for each SSR request)
export function createApp() {
  // create store and router instances
  const store = createStore();
  const router = createRouter();

  // sync the router with the vuex store.
  // this registers `store.state.route`
  sync(store, router);

  // create the app instance.
  // here we inject the router, store and ssr context to all child components,
  // making them available everywhere as `this.$router` and `this.$store`

  Object.keys(components).forEach((key) => {
    Vue.component(key, components[key]);
  });

  const app = new Vue({
    router,
    store,
    render: h => h(App),
  });


  // expose the app, the router and the store.
  // note we are not mounting the app here, since bootstrapping will be
  // different depending on whether we are in a browser or on the server.
  return {
    app,
    router,
    store,
  };
}
