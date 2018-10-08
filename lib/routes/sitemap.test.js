'use strict';

const sitemap = require('./sitemap'),
  controller = require('../services/sitemaps');

jest.mock('../services/sitemaps');

describe('routes/sitemap', () => {
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
          uri: 'http://local.nymag.com/sitemap',
          query: ''
        },
        res = {
          status: jest.fn(),
          json: jest.fn(),
          send: jest.fn()
        };

      controller.getPublishedPages.mockResolvedValue(Promise.resolve(data));

      return sitemap.route.getList(req, res).then(() => {
        expect(controller.getPublishedPages.mock.calls.length).toBe(1);
        expect(controller.getPublishedPages.mock.calls[0][0]).toBe(req);
      });
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
