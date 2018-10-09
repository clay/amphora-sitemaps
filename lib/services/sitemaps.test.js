'use strict';

const sitemaps = require('./sitemaps'),
  db = require('./db'),
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
  const expectedData = {
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

  test('It should return an xml string ', () => {
    const req = {
        uri: 'http://local.nymag.com/_sitemap',
        query: ''
      },
      expectedXml = '<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<urlset xmlns=\"http://www.sitemaps.org/schemas/sitemap/0.9\">\n    <url/>\n</urlset>';

    db.selectPublishedPages.mockResolvedValue(Promise.resolve(data));

    return sitemaps.getPublishedPages(req).then(result => {
      expect(db.selectPublishedPages.mock.calls.length).toBe(1);
      expect(db.selectPublishedPages.mock.calls[0][0]).toBe(req.uri);
      expect(result).toEqual(expectedXml);
    });
  });
});
