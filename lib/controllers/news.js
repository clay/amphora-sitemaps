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
  const elem = xml.element({
      _attr: {
        xmlns: 'http://www.sitemaps.org/schemas/sitemap/0.9',
        'xmlns:news': 'http://www.google.com/schemas/sitemap-news/0.9'
      }
    }),
    stream = xml({ urlset: elem }, { stream: true });

  h(db.selectPublishedContent(uri, component))
    .map(item => {
      const url =
      {
        loc: '',
        'news:news': {
          'news:publication': {
            'news:name': '',
          },
          'news:publication_date': '2008-12-23',
          'news:title': 'Companies A, B in Merger Talks'
        }
      };

      // for (const key in item) {
      //   if (item.hasOwnProperty(key)) {
      //     arr.push({ [key]: item[key] });
      //   }
      // }

      elem.push({ url: url });
    })
    .errors(errorLogger)
    .done(() => {
      elem.close();
    });

  return stream;
}

module.exports.getPublishedContent = getPublishedContent;
// {
//   loc: '',
//     'news:news': {
//     'news:publication': {
//       'news:name': '',
//     },
//     "news:publication_date": "2008-12-23",
//       "news:title": "Companies A, B in Merger Talks"
//   }
// }

// loc = pages.meta ->> 'url'
// news: news
// news: publication
// news: name = pages.meta ->> 'title'
// news: publication_date = componentTable.data ->> 'date'
// news: title = pages.meta ->> 'title'