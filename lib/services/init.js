'use strict';

const db = require('./db'),
  { getPrefix } = require('clayutils'),
  routes = require('./routes');

/**
 * Initializes plugin.
 * @param {Object} router
 * @param {Object} storage
 * @return {Promise}
 */
function onInit(router, storage, _, sites) {
    return db(storage, sites)
    .then(() => routes(router));
}

module.exports = onInit;
