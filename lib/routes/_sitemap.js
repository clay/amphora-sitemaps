'use strict';

const responses = require('../services/responses'),
  controller = require('../services/sitemaps'),
  route = {
    getList: function (req, res) {
      return responses.expectXML(() => controller.getPublishedPages(req), res);
    },
  };

function routes(router) {
  router.all('/', responses.allow({ allow: ['get'] }));
  router.get('/', route.getList);
}

module.exports = routes;
module.exports.route = route;
