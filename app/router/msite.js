'use strict';

module.exports = app => {
  const { home } = app.controller;
  app.get('/msite/home.htm', home.mainPage);
};
