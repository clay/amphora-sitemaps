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
function getPublishedContent({ uri }, options) {
  const elem = xml.element({
      _attr: {
        xmlns: 'http://www.sitemaps.org/schemas/sitemap/0.9',
        'xmlns:news': 'http://www.google.com/schemas/sitemap-news/0.9'
      }
    }),
    stream = xml({ urlset: elem }, { stream: true }),
    site = uri.replace('/_news', '');

  h(db.selectPublishedContent(site, options))
    .filter(content => options.componentFilter(content.data))
    .map(({ data, title }) => {
      return options.getKeywords(data)
        .then((keywords) => {
          return { data, title, keywords };
        });
    })
    .flatMap(h)
    .map(({ data, title , keywords}) => {
      const { date, canonicalUrl } = data;

      elem.push({
        url: [
          { loc: canonicalUrl },
          { 'news:news': [
            { 'news:publication': [
              { 'news:name': site },
              { 'news:language': 'en' }
            ] },
            { 'news:publication_date': date },
            { 'news:title': title },
            { 'news:language': 'en' },
            { 'news:keywords': keywords }
          ] }
        ]
      });
    })
    .errors(errorLogger)
    .done(() => {
      elem.close();
    });

  return stream;
}

module.exports.getPublishedContent = getPublishedContent;
