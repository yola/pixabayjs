'use strict';

import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import mockagent from 'mockagent';
import range from 'lodash.range';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import superagent from 'superagent';
import url from 'url';

import ResultList from '../src/result-list';


const {expect} = chai;
const {notify, wrap} = require('promisehelpers');


chai.use(chaiAsPromised);
chai.use(sinonChai);

const pixabayUrl = 'https://pixabay.com/api';

const mockResponse = function() {
  mockagent.target(superagent);

  mockagent.get(pixabayUrl, function(res) {
    const query = url.parse(this.url, true).query;

    let hits = [];

    if (query.page === '1') {
      hits = range(0, 20);
    } else if (query.page === '2') {
      hits = range(20, 25);
    }

    const noError = !!hits.length;

    const error =  'ERROR: "page"/"per_page" is out of valid range.';

    const response = {
      totalHits: noError ? 25 : undefined,
      hits: noError ? hits : undefined,
      error: noError ? null : error
    };

    res.xhr = {
      status: noError ? 200 : 400,
      responseText: noError ? JSON.stringify(response) : error
    };

    return res;
  });
};

describe('ResultList', function() {
  const baseConfig = {
    page: 1,
    per_page: 20,
    safesearch: true,
    url: 'https://pixabay.com/api'
  };

  const search = ['dogs', 'puppies'];

  const noop = function(res) {
    return res;
  };

  const cbSuccess = sinon.spy(noop);
  const cbFailure = sinon.spy(noop);
  let resultList;

  before(function() {
    mockResponse(pixabayUrl);
  });

  after(function() {
    mockagent.releaseTarget();
  });

  describe('initial request for page 1', function() {
    const response = {};

    before(function(done) {
      const config = Object.create(baseConfig);
      resultList = new ResultList(search, config, cbSuccess, cbFailure);
      resultList
        .next()
        .then(wrap(response, 'data'))
        .done(notify(done));
    });

    after(function() {
      resultList = null;
    });

    it('receives the first page', function() {
      expect(response.data.page).to.equal(1);
    });

    it('receives the hits', function() {
      expect(response.data.hits).to.be.length(20);
    });

    it('receives the totalHits', function() {
      expect(response.data.totalHits).to.equal(25);
    });

    it('receives the totalPages', function() {
      expect(response.data.totalPages).to.equal(2);
    });

    it('receives a null error', function() {
      expect(response.data.error).to.be.null;
    });

    it('called the success callback', function() {
      expect(cbSuccess).to.be.called;
    });
  });

  describe('previous() on page 1', function() {
    const response = {};

    before(function(done) {
      const config = Object.create(baseConfig);

      resultList = new ResultList(search, config, cbSuccess, cbFailure);
      resultList
        .next()
        .then(wrap(response, 'data'))
        .done(notify(done));
    });

    after(function() {
      resultList = null;
    });

    it('throws an error when there is no previous page', function() {
      const test = () => resultList.previous();

      expect(test).to.throw('There is no previous page');
    });
  });

  describe('next() on page 1', function() {
    const response = {};

    before(function(done) {
      const config = Object.create(baseConfig);

      resultList = new ResultList(search, config, cbSuccess, cbFailure);
      resultList.next();
      resultList
        .next()
        .then(wrap(response, 'data'))
        .done(notify(done));
    });

    after(function() {
      resultList = null;
    });

    it('receives the next set of hits', function() {
      expect(response.data.hits).to.be.length(5);
      expect(response.data.page).to.equal(2);
    });
  });

  describe('previous() on page 2', function() {
    const response = {};
    let _get;

    before(function(done) {
      const config = Object.create(baseConfig);

      resultList = new ResultList(search, config, cbSuccess, cbFailure);
      resultList.next();
      resultList.next();

      _get = sinon.spy(ResultList.prototype, '_get');

      resultList
        .previous()
        .then(wrap(response, 'data'))
        .done(notify(done));
    });

    after(function() {
      resultList = null;
      _get.restore();
    });

    it('receives the page 1 response', function() {
      expect(response.data.page).to.equal(1);
    });

    it('did not make a request', function() {
      expect(_get).to.not.be.called;
    });
  });

  describe('second next() on page 1', function() {
    const response = {};
    let _get;

    before(function(done) {
      const config = Object.create(baseConfig);

      resultList = new ResultList(search, config, cbSuccess, cbFailure);
      resultList.next();
      resultList.next();
      resultList.previous();

      _get = sinon.spy(ResultList.prototype, '_get');

      resultList
        .next()
        .then(wrap(response, 'data'))
        .done(notify(done));
    });

    after(function() {
      resultList = null;
      _get.restore();
    });

    it('receives the page 2 response', function() {
      expect(response.data.page).to.equal(2);
    });

    it('does not make a request', function() {
      expect(_get).to.not.be.called;
    });
  });

  describe('next() on page 2', function() {
    const response = {};

    before(function(done) {
      const config = Object.create(baseConfig);

      resultList = new ResultList(search, config, cbSuccess, cbFailure);
      resultList.next();
      resultList.next();
      resultList
        .next()
        .then(wrap(response, 'data'))
        .done(notify(done));
    });

    after(function() {
      resultList = null;
    });

    it('reports the page requested', function() {
      expect(response.data.page).to.equal(3);
    });

    it('returns an empty array of hits', function() {
      expect(response.data.hits).to.be.empty;
    });

    it('returns an error', function() {
      const errorRgx = /ERROR: "page"\/"per_page" is out of valid range\./;
      expect(response.data.error).to.match(errorRgx);
    });

    it('called the failure callback', function() {
      expect(cbFailure).to.be.called;
    });
  });
});
