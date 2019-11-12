'use strict';
// const URI = require('urijs');
const { EGG_SERVER_ENV } = process.env;
const isProd = EGG_SERVER_ENV && EGG_SERVER_ENV !== 'local';
const { createBundleRenderer } = require('vue-server-renderer');

const obj = {
  createBundleRenderer,
  asyncRender(params = {}, ...rest) {
    const p = params;
    return new Promise((resolve, reject) => {
      rest.push((err, html) => {
        if (err) {
          reject(err);
        } else {
          resolve(html);
        }
      });
      // 如果是从ctx生成的渲染器，则可以对数据进行默认填充
      const { ctx } = this;
      if (ctx) {
        const { url, SSRSetStoreData } = params;
        if (!url) {
          p.url = ctx.req.url;
        }
        p.SSRSetStoreData = Object.assign({
          pageUrl: ctx.href,
          pageRefer: ctx.header.referer,
        }, SSRSetStoreData);
      }
      this.render.renderToString.apply(null, [ p, ...rest ]);
    });
  },
};

module.exports = app => {
  console.log("isProd:", isProd);
  
  const vueConfig = app.config.vue;
  console.log("vueConfig:", vueConfig);
  
  obj.render = createBundleRenderer( vueConfig.renderOptions);
  return obj;
};
