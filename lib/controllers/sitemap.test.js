'use strict';

const sitemaps = require('./sitemap'),
  h = require('highland'),
  db = require('../services/db'),
  data = [{
    loc: 'http://localhost.nymag.com/',
    lastmod: '2018-10-01T15:45:44.494Z'
  },
  {
    loc: 'http://localhost.nymag.com/test1.html',
    lastmod: '2018-10-01T15:28:33.894Z'
  },
  {
    loc: 'http://localhost.nymag.com/test2.html',
    lastmod: '2018-10-04T14:19:52.262Z'
  }];

jest.mock('./db');

describe('sitemaps', () => {
  test('It should call the db function correctly', () => {
    const req = {
        uri: 'http://local.nymag.com/_sitemap',
        query: ''
      },
      isIncludedInArray = function (arr, str) {

        let isIncluded = false;

        arr.forEach(element => {
          if (element.includes(str)) isIncluded = true;
        });

        return isIncluded;
      },
      xmlHeader = 'xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"';

    db.selectPublishedPages.mockImplementation(() => h(data));

    return h(sitemaps.getPublishedPages(req))
      .collect()
      .toPromise(Promise)
      .then(response => {
        expect(db.selectPublishedPages.mock.calls.length).toBe(1);
        expect(db.selectPublishedPages.mock.calls[0][0]).toBe(req.uri);
        expect(response[0]).toContain(xmlHeader);
        data.forEach(urlData => {
          expect(isIncludedInArray(response, urlData.loc)).toBeTruthy();
          expect(isIncludedInArray(response, urlData.lastmod)).toBeTruthy();
        });
      });
  });
});
