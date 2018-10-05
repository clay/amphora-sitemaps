'use strict';

const responses = require('../services/responses'),
  controller = require('../services/sitemaps'),
  route = {
    getList(req, res) {
      return responses.expectXML(() => controller.getArticles(req), res);
    },
  };

function routes(router) {
  router.all('/', responses.allow({ allow: ['get'] }));
  router.get('/', route.getList);
}

module.exports = routes;
module.exports.route = route;
