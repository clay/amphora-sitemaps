'use strict';

const db = require('./db'),
  routes = require('./routes');

/**
 * Initializes plugin.
 * @param {Object} router
 * @param {Object} storage
 * @param {Object} _
 * @param {Object} sites
 * @return {Promise}
 */
function onInit(router, storage) {
  return db(storage)
    .then(() => routes(router));
}

module.exports = onInit;
