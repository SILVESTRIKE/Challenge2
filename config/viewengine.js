const express = require('express');
const path = require('path');

const viewEngine = (app) => {
  app.set('view engine', 'ejs');
  app.set('views', path.join('./', 'views'));
  app.use(express.static(path.join('./', 'public')));
}
module.exports = viewEngine;