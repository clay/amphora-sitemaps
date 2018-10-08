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
function onInit(router, storage, _, sites) {
  return db(storage, sites)
    .then(() => routes(router));
}

module.exports = onInit;
