'use strict';

module.exports = options => {
  return async function gzip(ctx, next) {
    await next();
    try {
      // console.log("this.request url:", ctx.request.url, "this.status:",  ctx.status)
      if (ctx.status === 404 && !ctx.body) {
        ctx.redirect('/');
      }
    } catch (error) {
      console.error("error:", error)
    }

  };
};
