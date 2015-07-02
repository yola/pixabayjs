'use strict';

var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
var mockagent = require('mockagent');
var pixabay = require('../src/index');
var promiseHelpers = require('promisehelpers');
var range = require('lodash.range');
var ResultList = require('../src/result-list');
var sinon = require('sinon');
var sinonChai = require('sinon-chai');
var superagent = require('superagent');
var url = require('url');

var notify = promiseHelpers.notify;
var wrap = promiseHelpers.wrap;

var expect = chai.expect;
chai.use(chaiAsPromised);
chai.use(sinonChai);

var username = 'username';
var key = 'key';

var pixabayUrl = 'https://pixabay.com/api';

pixabay.authenticate(username, key);

var mockResponse = function() {
  mockagent.target(superagent);

  mockagent.get(pixabayUrl, function(res) {
    var query = url.parse(this.url, true).query;

    var hits = [];

    if (query.page === '1') {
      hits = range(0, 20);
    } else if (query.page === '2') {
      hits = range(20, 25);
    }

    var noError = !!hits.length;

    var error =  'ERROR: "page"/"per_page" is out of valid range.';

    var response = {
      totalHits: noError ? 25 : undefined,
      hits: noError ? hits : undefined,
      error: noError ? null : error
    };

    res.xhr = {
      status: noError ? 200 : 400,
      responseText: JSON.stringify(noError ? response : error)
    };

    return res;
  });
};

describe('ResultList', function() {
  var baseConfig = {
    search: ['dogs', 'puppies'],
    url: pixabayUrl,
    safesearch: true
  };

  var noop = function(res) {
    return res;
  };

  var resultList;
  var cbSuccess = sinon.spy(noop);
  var cbFailure = sinon.spy(noop);

  before(function() {
    mockResponse(pixabayUrl);
  });

  after(function() {
    mockagent.releaseTarget();
  });

  describe('initial request for page 1', function() {
    var response = {};

    before(function(done) {
      var config = Object.create(baseConfig);

      resultList = pixabay.resultList(config, cbSuccess, cbFailure);
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
    var response = {};

    before(function(done) {
      var config = Object.create(baseConfig);

      resultList = pixabay.resultList(config, cbSuccess, cbFailure);
      resultList
        .next()
        .then(wrap(response, 'data'))
        .done(notify(done));
    });

    after(function() {
      resultList = null;
    });

    it('throws an error when there is no previous page', function() {
      var test = function() {
        resultList.previous();
      };

      expect(test).to.throw('There is no previous page');
    });
  });

  describe('next() on page 1', function() {
    var response = {};

    before(function(done) {
      var config = Object.create(baseConfig);

      resultList = pixabay.resultList(config, cbSuccess, cbFailure);
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
    var response = {};
    var _get;

    before(function(done) {
      var config = Object.create(baseConfig);

      resultList = pixabay.resultList(config, cbSuccess, cbFailure);
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
    var response = {};
    var _get;

    before(function(done) {
      var config = Object.create(baseConfig);

      resultList = pixabay.resultList(config, cbSuccess, cbFailure);
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
    var response = {};

    before(function(done) {
      var config = Object.create(baseConfig);

      resultList = pixabay.resultList(config, cbSuccess, cbFailure);
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
      var errorRgx = /ERROR: "page"\/"per_page" is out of valid range\./;
      expect(response.data.error).to.match(errorRgx);
    });

    it('called the failure callback', function() {
      expect(cbFailure).to.be.called;
    });
  });
});
