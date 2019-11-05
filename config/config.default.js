/* eslint valid-jsdoc: "off" */

'use strict';

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
const path = require('path');
module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = exports = {};
  const template = fs.readFileSync(path.resolve(__dirname, `../app/vue/index${appInfo.env === 'prd' ? '.prd' : ''}.html`), 'utf-8');
  
  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1572944399366_9641';
  config.logger = {
    // level: 'DEBUG',
    consoleLevel: 'DEBUG',
  };
  // add your middleware config here
  config.middleware = [
    'midErrorHandle',
    'midCacheSet',
    'midGzip'
  ];
  config.static = {
    prefix: '/public/',
    dir: path.join(appInfo.baseDir, 'app/public'),
    // support lazy load
    gzip: true,
    dynamic: true,
    preload: false,
    buffer: false,
    maxFiles: 1000,
  };
  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
  };
  // vue
  config.vue = {

    renderOptions: {
      template,
      runInNewContext: false,
      basedir: path.resolve(__dirname, '../app/public/javascripts'),
      shouldPrefetch: () => false,
    },
  };
  return {
    ...config,
    ...userConfig,
  };
};
