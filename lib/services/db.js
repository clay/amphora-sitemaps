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
 * Selects an published articles from the database.
 * @param {String} uri
 * @param {Object} params
 * @return {Promise}
 */
function selectPublishedArticles(uri, params) {
  const site = allSites.getSiteFromPrefix(uri.replace('sitemap', '')),
    year = params.year,
    isvalidYear = year.match(DATE_RE);

  let yearCondition = '';

  if (year && isvalidYear) {
    yearCondition = `AND components.article.data->>'canonicalUrl' LIKE '%${site.prefix}/${year}%'`;
  }

  return db.raw(`SELECT components.article.data->>'canonicalUrl' as loc, components.article.data->>'date' as lastmod FROM components.article, public.uris WHERE components.article.data->>'canonicalUrl' LIKE '%'||public.uris.url AND components.article.id LIKE '%@published' AND components.article.id LIKE '${site.prefix}/_components%' ${yearCondition}`);
}

module.exports = init;
module.exports.selectPublishedArticles = selectPublishedArticles;
