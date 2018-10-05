'use strict';

const DATE_RE = /[0-9]{4}/;

let db,
  allSites;

/**
 * Sets the db instance to be used.
 * @param {Object} dbImpl
 */
function setDb(dbImpl) {
  module.exports.db = db = dbImpl;
}

/**
 * Initializes the plugin.
 * @param {Object} storage
 * @return {Promise}
 */
function init(storage, sites) {
  setDb(storage);
  allSites = sites;
  return Promise.resolve();
}

/**
 * Selects an published pages from the database.
 * @param {String} uri
 * @param {Object} params.year
 * @return {Promise}
 */
function selectPublishedPages(uri, { year = '' }) {
  const site = allSites.getSiteFromPrefix(uri.replace('sitemap', '')),
    isvalidYear = year.match(DATE_RE),
    yearFilter = `AND public.pages.meta->>'firstPublishTime' like '${year}%'`,
    yearCondition = isvalidYear ? yearFilter : '';

  if (year && !yearCondition) return Promise.resolve({rows:[]});

  return db.raw(`SELECT public.pages.meta->>'url' as loc, public.pages.meta->>'firstPublishTime' as lastmod
    FROM public.uris, public.pages
    WHERE public.pages.meta->>'url' LIKE '%'||public.uris.url
    AND public.uris.data LIKE '${site.prefix}/_pages%'
    ${yearCondition};`);
}

module.exports = init;
module.exports.selectPublishedPages = selectPublishedPages;
