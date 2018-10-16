'use strict';

const YEAR_REGEX = /[0-9]{4}/,
  initialSql = `
  SELECT pages.meta->>'url' AS loc, pages.meta->>'firstPublishTime' AS lastmod
  FROM public.uris AS uris, public.pages AS pages
  WHERE pages.meta->>'url' LIKE '%'||uris.url
  AND uris.data LIKE ?||'/_pages%'`;

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
function init(storage) {
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

  const site = uri.replace('/_sitemap', '');

  let sql = initialSql,
    params = [site];

  if (year) {
    sql += ' AND pages.meta->>\'firstPublishTime\' LIKE ?||\'%\''; // Applying year filter
    params.push(year);
  }

  sql += ';'; // Closing query

  return db.raw(sql, params);
}

function selectPublishedContent(site, options) {
  const componentSql = options.components.map(component => {
    return `(SELECT  pages.meta ->> 'title' as title, componentTable.data as data, componentTable.data->> 'date' as pubDate
      FROM components."${component}" as componentTable, public.pages as pages, public.uris as uris
      WHERE pages.meta->>'url' = componentTable.data->>'canonicalUrl'
      AND pages.id = uris.data
      AND (componentTable.data->>'date')::date between (now() - interval '2 days') AND now()
      AND componentTable.id like '${site}'||'/_components%')`
  });
  let sql = componentSql.join(' UNION ');

  sql += ` ORDER BY (pubDate) desc
    LIMIT 1000;`;

  return db.raw(sql);
}

module.exports = init;
module.exports.selectPublishedPages = selectPublishedPages;
module.exports.selectPublishedContent = selectPublishedContent;
