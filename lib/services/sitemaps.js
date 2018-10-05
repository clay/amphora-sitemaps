'use strict';

const db = require('./db'),
  convert = require('xml-js'),
  { getPrefix } = require('clayutils'),
  options = {compact: true, ignoreComment: true, spaces: 4},
  {setup, logError} = require('./logger');

var log = setup({ file: __filename }),
  errorLogger = logError(log);

function formatJson(data) {
  let formatedData = {
      _declaration: {
        _attributes: {
            version: "1.0",
            encoding: "UTF-8"
        }
      },
      urlset: {
        _attributes: {
            xmlns: "http://www.sitemaps.org/schemas/sitemap/0.9"
        }, 
        url: data 
      } 
    };
  return formatedData;
}

/**
 * Gets the get published pages of a site.
 * @param {string} uri
 * @return {Promise<T | void>}
 */
function getPages({ uri, query }) {
  const prefix = getPrefix(uri);

  return db.selectPublishedPages(prefix, query)
    .then((data) => convert.json2xml(formatJson(data.rows), options))
    .catch(errorLogger);
}

module.exports.getPages = getPages;
