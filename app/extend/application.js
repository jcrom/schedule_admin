
'use strict';

module.exports = {
  get vue() {
    return require('./app.vue.js')(this);
  },
};

