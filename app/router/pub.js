'use strict';

module.exports = app => {
    const { home } = app.controller;
    // app.router.get('/demo/helloArt', pub.toutiao.helloArt);
    // app.router.get('/demo/testArt', pub.test.getKnockoutData);
    // app.router.get('/', pub.pcindex.start); //首页
    app.router.get('/', home.index);

};
