'use strict';

const responses = require('../services/responses'),
  controller = require('../services/sitemaps'),
  route = {
    getList: function (req, res) {
      res.type('text/xml');
      res.write('<?xml version="1.0" encoding="UTF-8"?>')

      controller.getPublishedPages(req).pipe(res)
    },
  };

function routes(router) {
  router.all('/', responses.allow({ allow: ['get'] }));
  router.get('/', route.getList);
}

module.exports = routes;
module.exports.route = route;
