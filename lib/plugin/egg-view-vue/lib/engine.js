'use strict';

const Vue = require('vue');
const vueServerRenderer = require('vue-server-renderer');

class Engine {
  constructor(app) {
    this.app = app;
    this.config = app.config.vue;
    this.vueServerRenderer = vueServerRenderer;
    this.renderer = this.vueServerRenderer.createRenderer();
    this.renderOptions = this.config.renderOptions;
  }

  createBundleRenderer(bundle = this.config.bundle, renderOptions) {
    this.renderOptions.clientManifest = this.config.clientManifest;
    const bundleRenderer = this.vueServerRenderer.createBundleRenderer(bundle, Object.assign({}, this.renderOptions, renderOptions));
    return bundleRenderer;
  }

  renderBundle(context, options) {
    context = context || /* istanbul ignore next */ {};
    options = options || /* istanbul ignore next */ {};

    return new Promise((resolve, reject) => {
      this.createBundleRenderer(options.renderOptions).renderToString(context, (err, html) => {
        if (err) {
          reject(err);
        } else {
          resolve(html);
        }
      });
    });
  }

  renderString(tpl, locals, options) {
    const vConfig = Object.assign({ template: tpl, data: locals }, options);
    const vm = new Vue(vConfig);
    return new Promise((resolve, reject) => {
      this.renderer.renderToString(vm, (err, html) => {
        if (err) {
          reject(err);
        } else {
          resolve(html);
        }
      });
    });
  }
}

module.exports = Engine;
