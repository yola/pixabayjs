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
var proxyURL = '/pixabay/api';

var mockResponse = function(targetURL) {
  mockagent.target(superagent);

  mockagent.get(targetURL, function(res) {
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

describe('pixabayjs', function() {
  this.timeout(30000);
  var client;

  beforeEach(function() {
    client = Object.create(pixabay);
  });

  afterEach(function() {
    client = null;
  });

  describe('authenticate', function() {
    it('sets the client\'s username and key', function() {
      client.authenticate(username, key);
      expect(client.username).to.equal(username);
      expect(client.key).to.equal(key);
    });
  });

  describe('defaults', function() {
    it('sets default query parameters for the client', function() {
      var defaults = {safesearch: 'true'};
      client.defaults(defaults);
      expect(client.defaults).to.eql(defaults);
    });
  });

  describe('requestFactory', function() {
    var requestFactory;
    var resultList;
    var query;

    before(function() {
      mockResponse(proxyURL);
      query = {
        order: 'lastest'
      };

      client = Object.create(pixabay);
      client.authenticate(username, key);

      requestFactory = client.requestFactory({url: proxyURL});

      resultList = requestFactory
        .query(query)
        .search(['dogs', 'puppies'])
        .resultList();
    });

    after(function() {
      mockagent.releaseTarget();
    });

    it('returns a ResultList when calling `resultList`', function() {
      expect(resultList).to.be.instanceof(ResultList);
    });

    it('returns results when calling `get`', function(done) {
      var results = Object.create(requestFactory);

      results
        .get()
        .then(function(res) {
          expect(res.hits).to.have.length(20);
        })
        .done(notify(done));
    });
  });

  describe('ResultList', function() {
    var requestFactory = {};
    var resultList;
    var query;

    before(function() {
      mockResponse(pixabayUrl);

      query = {
        order: 'lastest'
      };

      client = Object.create(pixabay);
      client.authenticate(username, key);

      requestFactory = client.requestFactory();

      resultList = requestFactory
        .query(query)
        .search(['dogs', 'puppies'])
        .resultList();
    });

    after(function() {
      mockagent.releaseTarget();
    });

    describe('initial request for page 1', function() {
      var response = {};

      before(function(done) {
        resultList
          .next()
          .then(wrap(response, 'data'))
          .done(notify(done));
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
    });

    describe('prev() on page 1', function() {
      it('throws an error when there is no previous page', function() {
        var test = function() {
          resultList.prev();
        };

        expect(test).to.throw('There is no previous page');
      });
    });

    describe('next() on page 1', function() {
      var response = {};

      before(function(done) {
        resultList
          .next()
          .then(wrap(response, 'data'))
          .done(notify(done));
      });

      it('receives the next set of hits', function() {
        expect(response.data.hits).to.be.length(5);
        expect(response.data.page).to.equal(2);
      });
    });

    describe('prev() on page 2', function() {
      var response = {};
      var _get;

      before(function(done) {
        _get = sinon.spy(ResultList.prototype, '_get');

        resultList
          .prev()
          .then(wrap(response, 'data'))
          .done(notify(done));
      });

      after(function() {
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
        _get = sinon.spy(ResultList.prototype, '_get');
        resultList
          .next()
          .then(wrap(response, 'data'))
          .done(notify(done));
      });

      after(function() {
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
        resultList
          .next()
          .then(wrap(response, 'data'))
          .done(notify(done));
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
    });
  });
});
