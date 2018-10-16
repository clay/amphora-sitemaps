'use strict';

const responses = require('../services/responses'),
  controller = require('../controllers/sitemap'),
  route = {
    getList: function (req, res) {
      // set response type
      res.type('text/xml');
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
