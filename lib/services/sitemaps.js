'use strict';

const _ = require('highland'),
  db = require('./db'),
  xml = require('xml'),
  { setup, logError } = require('./logger'),
  log = setup({ file: __filename }),
  errorLogger = logError(log);

/**
 * Create an object for get converted to xml
 * @param {array} data
 * @return {Object}
 */
function formatJson(data) {
  return {
    _declaration: {
      _attributes: {
        version: '1.0',
        encoding: 'UTF-8'
      }
    },
    urlset: {
      _attributes: {
        xmlns: 'http://www.sitemaps.org/schemas/sitemap/0.9'
      },
      url: data
    }
  };
}

/**
 * Gets the published pages of a site.
 * @param {string} uri
 * @return {Promise<T | void>}
 */
function getPublishedPages({ uri, query }) {
  const elem = xml.element({ _attr: { xmlns: 'http://www.sitemaps.org/schemas/sitemap/0.9' } }),
    stream =  xml({ urlset: elem }, { stream: true });

  _(db.selectPublishedPages(uri, query))
    .map(item => {
      var arr = [];

      for (const key in item) {
        if (item.hasOwnProperty(key)) {
          arr.push({ [key]: item[key] });
        }
      }

      elem.push({ url: arr });
    })
    .errors(errorLogger)
    .done(() => {
      elem.close();
    });

  return stream;
}

module.exports.getPublishedPages = getPublishedPages;
module.exports.formatJson = formatJson;
