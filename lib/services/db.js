'use strict';

const YEAR_REGEX = /[0-9]{4}/;

let db;

/**
 * Sets the db instance to be used.
 * @param {Object} dbImpl
 */
function setDb(dbImpl) {
  module.exports.db = db = dbImpl;
}

/**
 * Initializes DB service.
 * @param {Object} storage
 * @param {Object} sites
 * @return {Promise}
 */
function init(storage, sites) {
  setDb(storage);
  return Promise.resolve();
}

/**
* Selects published pages from the database.
* @param {String} uri
* @param {Object} params.year
* @return {Promise}
*/
function selectPublishedPages(uri, { year = '' }) {
  if (year && !year.match(YEAR_REGEX)) {
    return Promise.resolve({ rows: [] });
  }

  const site = uri.replace('/_sitemap','');

  let sql = `
        SELECT pages.meta->>'url' AS loc, pages.meta->>'firstPublishTime' AS lastmod
        FROM public.uris AS uris, public.pages AS pages
        WHERE pages.meta->>'url' LIKE '%'||uris.url
        AND uris.data LIKE ?||'/_pages%'
      `,
    params = [site];

  if (year) {
    sql += ' AND pages.meta->>\'firstPublishTime\' LIKE ?||\'%\''; // Applying year filter
    params.push(year);
  }

  sql += ';'; // Closing query

  return db.raw(sql, params);
}


module.exports = init;
module.exports.selectPublishedPages = selectPublishedPages;
