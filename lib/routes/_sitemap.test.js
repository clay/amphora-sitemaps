'use strict';

const sitemap = require('./_sitemap'),
  controller = require('../services/sitemaps'),
  h =  require('highland');

jest.mock('../services/sitemaps');

describe('routes/_sitemap', () => {
  describe('routes', () => {
    test('should pass get list props correctly to controller', () => {
      const req = {
        uri: 'http://local.nymag.com/_sitemap',
        query: ''
      };

      let res = h();

      res.type = jest.fn();
      res.write = jest.fn();

      controller.getPublishedPages.mockImplementation(() => h());
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
