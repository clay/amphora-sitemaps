'use strict';

const express = require('express'),
  files = require('amphora-fs'),
  path = require('path'),
  bodyParser = require('body-parser'),
  jsonBodyParser = bodyParser.json({ strict: true, type: 'text/xml', limit: '50mb' });

/**
* Set up sitemaping routes for all sites. eg. nymag.com/_sitemap
* @param {object} router
* @param {object} options
*/
function setupRoutes(router, options) {
  const routesPath = 'routes';

  // load all controller routers
  files.getFiles([__dirname, '..', routesPath].join(path.sep)).filter((filename) => {
    const pathRouter = express.Router(),
      name = removeExtension(filename),
      route = files.tryRequire([__dirname, '..', routesPath, name].join(path.sep));

    pathRouter.use(jsonBodyParser);

    route(pathRouter, options[name]);
    router.use(`/${name}`, pathRouter);
  });
}

/**
* Remove extension from route / path.
* @param {string} path
* @returns {string}
*/
function removeExtension(path) {
  const endSlash = path.lastIndexOf('/'),
    leadingDot = endSlash > -1 ? path.indexOf('.', endSlash) : path.indexOf('.');

  return leadingDot > -1 ? path.substr(0, leadingDot) : path;
}

module.exports = setupRoutes;
module.exports.removeExtension = removeExtension;
module.exports.setupRoutes = setupRoutes;
module.exports.jsonBodyParser = jsonBodyParser;
