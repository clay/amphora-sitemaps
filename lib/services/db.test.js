'use strict';

const db = require('./db'),
  fakeDbImpl = {
    raw: jest.fn().mockResolvedValue({})
  },
  fakeSites = {
    getSiteFromPrefix: () =>'localhost.nymag.com/'
  },
  uri = 'http://localhost.nymag.com/sitemap',
  query = { year: '2012' };

beforeAll(() => {
  db(fakeDbImpl, fakeSites);
});

describe('selectPublishedPages', () => {
  test('it calls raw once and pass the parameter as the second arg to raw', () => {
    return db.selectPublishedPages(uri, {}).then(() => {
      expect(db.db.raw.mock.calls.length).toBe(1);
    });
  });

  test('it calls raw once and pass the parameter as the second arg to raw even with the second param filled', () => {
    return db.selectPublishedPages(uri, query).then(() => {
      expect(db.db.raw.mock.calls.length).toBe(1);
    });
  });

  test('it should returns an empty object when date is not valid', () => {
    return db.selectPublishedPages(uri, { year: 'test' }).then((data) => {
      expect(data).toEqual({ rows: [] });
    });
  });
});
