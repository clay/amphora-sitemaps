'use strict';

const clayLog = require('clay-log'),
  pkg = require('../../package.json');

let amphoraSitemapsLogInstance;

/**
 * Initializes the logger.
 */
function init() {
  if (amphoraSitemapsLogInstance) {
    return;
  }

  // Initialize the logger
  clayLog.init({
    name: 'amphora-sitemaps',
    meta: {
      amphoraVersion: pkg.version
    }
  });

  // Store the log instance
  amphoraSitemapsLogInstance = clayLog.getLogger();
}

/**
 * Returns a child logger with the passed meta.
 * @param {Object} meta
 * @return {Object}
 */
function setup(meta = {}) {
  return clayLog.meta(meta, amphoraSitemapsLogInstance);
}

/**
 * Gets a function ready for log errors.
 * @param {Function} log
 * @return {Function}
 */
function logError(log) {
  return (err) => {
    log('error', err.message, { stack: err.stack });
  };
}

// Initialize immediately on require of file
init();

module.exports.init = init;
module.exports.setup = setup;
module.exports.setLogger = (logger) => amphoraSitemapsLogInstance = logger;
module.exports.getLogger = () => amphoraSitemapsLogInstance;
module.exports.logError = logError;
