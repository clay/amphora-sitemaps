'use strict';

const responses = require('../services/responses'),
  controller = require('../controllers/sitemap'),
  route = {
    getList: function (req, res) {
      // set response type
      res.type('text/xml');
      // We need to add in the xml version as first line
      res.write('<?xml version="1.0" encoding="UTF-8"?>');
      // stream from the db
      controller.getPublishedPages(req).pipe(res);
    },
  };

function routes(router) {
  router.all('/', responses.allow({ allow: ['get'] }));
  router.get('/', route.getList);
}

module.exports = routes;
module.exports.route = route;
