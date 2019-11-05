'use strict';

class View {
  constructor(ctx) {
    this.app = ctx.app;
  }

  render(bundle, locals, options) {
    return this.app.vue.renderBundle(bundle, { state: locals }, options || /* istanbul ignore next */ {});
  }

  renderString(tpl, locals) {
    return this.app.vue.renderString(tpl, locals);
  }
}

module.exports = View;
