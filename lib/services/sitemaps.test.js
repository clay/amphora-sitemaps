'use strict';

const sitemaps = require('./sitemaps'),
  { Readable } = require('stream'),
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
  test('It should call the db function correctly', () => {
    const req = {
        uri: 'http://local.nymag.com/_sitemap',
        query: ''
      },
      stream = new Readable({
        objectMode: true,
        read() {
          const item = data.pop();

          if (!item) {
            return this.push(null);
          }
          this.push(item);
        },
      });

    db.selectPublishedPages.mockImplementation(() => stream);

    sitemaps.getPublishedPages(req);
    expect(db.selectPublishedPages.mock.calls.length).toBe(1);
    expect(db.selectPublishedPages.mock.calls[0][0]).toBe(req.uri);
  });
});
