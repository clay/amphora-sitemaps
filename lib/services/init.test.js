'use strict';

const init = require('./init'),
  db = require('./db'),
  routes = require('./routes'),
  router = {},
  storage = {},
  options = {};

jest.mock('./db');
jest.mock('./routes');

db.mockResolvedValue(Promise.resolve());

describe.only('init', () => {
  describe.only('onInit', () => {
    test('it sets up the storage, the routes for the plugin and start listening for sitemaps pages', () => {
      const controler = init(options),
        initializedPlugin = controler(router, storage);

      expect(db.mock.calls.length).toBe(1);
      expect(db.mock.calls[0][0]).toEqual(storage);
      return initializedPlugin.then(() => {
        expect(routes.mock.calls.length).toBe(1);
        expect(routes.mock.calls[0][0]).toEqual(router);
      });
    });
  });
});
