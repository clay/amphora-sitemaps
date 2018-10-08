'use strict';

const bluebird = require('bluebird'),
  _includes = require('lodash/includes');

/**
 * Handles errors in the standard/generic way
 * @param {Object} res
 * @returns {Function}
 */
function handleError(res) {
  return ({ code, stack }) => {
    if (code) {
      res.status(code).send(stack);
    } else {
      res.send(stack);
    }
  };
}

/**
 * Sends whatever is default for this type of data with this status code.
 * @param {number} code
 * @param {Object} res
 * @returns {function}
 */
function sendDefaultErrorCode(code, res) {
  return () => {
    res.sendStatus(code);
  };
}

/**
 * Sends some json error.
 * @param {number} code
 * @param {string} message
 * @param {Object} res
 * @param {Object} extras
 * @returns {function}
 */
function sendJSONErrorCode(code, message, res, extras) {
  return () => {
    res.json(Object.assign({ message, code }, extras));
  };
}

/**
 * Sends default response for code.
 * @param {number} code
 * @param {string} message
 * @param {Object} res
 * @param {Object} [extras]
 */
function sendDefaultResponseForCode(code, message, res, extras) {
  res.status(code).format({
    json: sendJSONErrorCode(code, message, res, extras),
    default: sendDefaultErrorCode(code, res)
  });
}

/**
 * Responds with XML and capture
 * Captures and hides appropriate errors.
 * These return XML always, because these endpoints are XML-only.
 * @param {Function} fn
 * @param {Object} res
 * @returns {Promise}
 */
function expectXML(fn, res) {
  return bluebird.try(fn)
    .then((result) => res.format({ 'text/xml': () => res.send(result) }))
    .catch(handleError(res));
}

/**
 * Creates a method validation middleware.
 * @param {{allow: [String]}} options
 * @returns {Function}
 */
function allow(options) {
  const allowed = options.allow;

  return (req, res, next) => {
    let message, code,
      method = req.method;

    if (_includes(allowed, method.toLowerCase())) {
      next();
    } else {
      code = 405;
      message = `Method ${method} not allowed`;
      res.set('Allow', allowed.join(', ').toUpperCase());
      sendDefaultResponseForCode(code, message, res, options);
    }
  };
}

/**
 * Creates an accept validation middleware.
 * @param {{accept: [string]}} options
 * @returns {Function}
 */
function accept(options) {
  const acceptableTypes = options.accept;

  return (req, res, next) => {
    let message, code,
      matchedType = req.accepts(acceptableTypes);

    if (matchedType) {
      next();
    } else {
      code = 406;
      message = `${req.get('Accept')} not acceptable`;
      res.set('Accept', acceptableTypes.join(', ').toLowerCase());
      sendDefaultResponseForCode(code, message, res, options);
    }
  };
}

module.exports.expectXML = expectXML;
module.exports.allow = allow;
module.exports.accept = accept;
module.exports.handleError = handleError;
module.exports.sendDefaultErrorCode = sendDefaultErrorCode;
module.exports.sendJSONErrorCode = sendJSONErrorCode;
