'use strict';

const Controller = require('egg').Controller;

class HomeController extends Controller {
  async index() {
    const { ctx } = this;
    ctx.body = 'hi, egg';
  }

  async mainPage() {
    const { ctx } = this;

    // console.log('\n\n\n\n\nEGG路由：\n', ctx.params, '\n\n\n\n\n\n');
    const decodeContentId = ctx.params[ '1' ];
    // const data = yield ctx.service.msite.match.getNewTopicData(decodeContentId);
    // if (!data.channelName && !data.channelLogo && !data.channelDes) ctx.error({ code: 410 });

    // const pageTitle = data.channelName;
    ctx.body = await ctx.vue.asyncRender({
      title: "123",
    });

    // 设置缓存
    ctx.response.set('Cache-Control', 'max-age=60');
  }
}

module.exports = HomeController;
