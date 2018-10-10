'use strict';

const sitemap = require('./_sitemap'),
  controller = require('../services/sitemaps'),
  { Readable, Writable } = require('stream');

jest.mock('../services/sitemaps');

describe('routes/_sitemap', () => {
  describe('routes', () => {
    test('should pass get list props correctly to controller', () => {
      const data = {
          command: 'SELECT',
          rowCount: 3,
          oid: null,
          rows:
            [{
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
            }]
        },
        req = {
          uri: 'http://local.nymag.com/_sitemap',
          query: ''
        },
        stream = new Readable({
          objectMode: true,
          read() {
            const item = data.rows.pop();

            if (!item) {
              return this.push(null);
            }
            this.push(item);
          },
        });

      class mockResponse extends Writable {
        write(chunk, enc, next) {
          console.log(chunk.toString());
          next();
        }
      };

      mockResponse.prototype.type = jest.fn();
      mockResponse.prototype.write = jest.fn();

      let res = new mockResponse();

      controller.getPublishedPages.mockImplementation(() => stream);

      sitemap.route.getList(req, res);
      expect(res.type.mock.calls.length).toBe(1);
      expect(res.write.mock.calls.length).toBe(1);
      expect(controller.getPublishedPages.mock.calls.length).toBe(1);
      expect(controller.getPublishedPages.mock.calls[0][0]).toBe(req);
    });

    test('should set the sitemap middlewares to the router', () => {
      const router = {
        all: jest.fn(),
        get: jest.fn()
      };

      sitemap(router);

      expect(router.all.mock.calls.length).toBe(1);
      expect(router.get.mock.calls.length).toBe(1);
    });
  });
});
