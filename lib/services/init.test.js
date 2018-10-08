'use strict';

const init = require('./init'),
  db = require('./db'),
  routes = require('./routes'),
  router = {},
  storage = {},
  sites = {};

jest.mock('./db');
jest.mock('./routes');

db.mockResolvedValue(Promise.resolve());

describe('init', () => {
  describe('onInit', () => {
    test('it sets up the storage, the routes for the plugin and start listening for sitemaps pages', () => {
      return init(router, storage, {}, sites).then(() => {
        expect(db.mock.calls.length).toBe(1);
        expect(db.mock.calls[0][0]).toEqual(storage);
        expect(routes.mock.calls.length).toBe(1);
        expect(routes.mock.calls[0][0]).toEqual(router);
      });
    });
  });
});
