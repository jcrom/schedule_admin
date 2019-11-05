'use strict';

module.exports = {
  get vue() {
    const vue = require('./app.vue.js')(this.app);
    const ctxVue = Object.create(vue);
    ctxVue.ctx = this;
    return ctxVue;
  },
  error({ message, code = 500 }) {
    const error = new Error();
    if (message) {
      error.message = message;
    } else {
      if (code >= 500) {
        error.message = '不是每一次的努力加载都会成功';
      } else if (code === 410) {
        error.message = '匆匆下架，来不及说一声再见';
      } else {
        error.message = '对不起，页面好像被踢飞了…';
      }
    }
    error.code = code;
    throw error;
  },
};
