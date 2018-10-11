'use strict';

const h = require('highland'),
  db = require('../services/db'),
  xml = require('xml'),
  { setup, logError } = require('../services/logger'),
  log = setup({ file: __filename }),
  errorLogger = logError(log);

/**
 * Gets the published pages of a site.
 * @param {string} uri
 * @param {object} options
 * @return {Promise<T | void>}
 */
function getPublishedContent({ uri }, { component }) {
  const elem = xml.element({ _attr: { xmlns: 'http://www.sitemaps.org/schemas/sitemap/0.9' } }),
    stream = xml({ urlset: elem }, { stream: true });

  h(db.selectPublishedContent(uri, component))
    .map(item => {
      const arr = [];

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

module.exports.getPublishedContent = getPublishedContent;
