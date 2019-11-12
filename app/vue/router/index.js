import Vue from 'vue';
import Router from 'vue-router';
import msite from './msite';


Vue.use(Router);
export default function createRouter() {
  return new Router({
    mode: 'history',
    routes: [
      ...msite,
    ],
  });
}
