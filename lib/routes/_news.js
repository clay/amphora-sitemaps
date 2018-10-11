'use strict';

const responses = require('../services/responses'),
  controller = require('../controllers/news'),
  handlers = {
    getPublishedContent: options => {
      return (req, res) => {
        // set response type
        res.type('text/xml');
        // We need to add in the xml version as first line
        res.write('<?xml version="1.0" encoding="UTF-8"?>');
        // stream from the db
        controller.getPublishedContent(req, options).pipe(res);
      };
    },
  };

function routes(router, options) {
  router.all('/', responses.allow({ allow: ['get'] }));
  router.get('/', handlers.getPublishedContent(options));
}

module.exports = routes;

// For testing
module.exports.route = handlers;
