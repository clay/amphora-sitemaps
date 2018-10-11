'use strict';

const db = require('./db'),
  routes = require('./routes');

/**
 * Sets up the plugin with some options
 *
 * @param {Object} options
 * @returns {Function}
 */
function setup(options) {
  // Initializes plugin
  return (router, storage) => {
    return db(storage)
      .then(() => routes(router, options));
  };
}

module.exports = setup;
