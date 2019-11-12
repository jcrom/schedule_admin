'use strict';

module.exports = app => {
  const { home } = app.controller;
  app.get('/schedule/home.html', home.mainPage);
};
