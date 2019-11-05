'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  // const { router, controller } = app;
  
  require('./router/pub')(app);
  require('./router/msite')(app);
};
