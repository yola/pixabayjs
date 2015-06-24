'use strict';

var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
var mockagent = require('mockagent');
var pixabay = require('../src/index');
var promiseHelpers = require('promisehelpers');
var range = require('lodash.range');
var superagent = require('superagent');
var url = require('url');

var notify = promiseHelpers.notify;
var wrap = promiseHelpers.wrap;

var expect = chai.expect;
chai.use(chaiAsPromised);
chai.should();

var username = 'username';
var key = 'key';

var pixabayUrl = 'https://pixabay.com/api';

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
    var response1 = {};
    var response2 = {};
    var response3 = {};
    var requestFactory = {};
    var listFactory = {};
    var query;

    before(function(done) {
      mockResponse();

      query = {
        order: 'lastest'
      };

      client = Object.create(pixabay);
      client.authenticate(username, key);

      requestFactory = client.requestFactory();

      listFactory = requestFactory
        .query(query)
        .search(['dogs', 'puppies'])
        .listFactory();

      listFactory
        .next()
        .then(wrap(response1, 'data'))
        .done(notify(done));
    });

    after(function() {
     mockagent.releaseTarget();
    });

    describe('first request', function() {
      it('receives hits', function() {
        expect(response1.data.totalHits).to.equal(25);
        expect(response1.data.hits).to.be.length(20);
        expect(response1.data.page).to.be.equal(1);
        expect(response1.data.error).to.be.null;
      });
    });

    describe('second request', function() {
      before(function(done) {
        listFactory
          .next()
          .then(wrap(response2, 'data'))
          .done(notify(done));
      });

      it('receives the next set of hits', function() {
        expect(response2.data.hits).to.be.length(5);
        expect(response2.data.page).to.be.equal(2);
      });
    });

    describe('third request', function() {
      before(function(done) {
        listFactory
          .next()
          .then(wrap(response3, 'data'))
          .done(notify(done));
      });

      it('returns an empty array of hits', function() {
        var errorRgx = /ERROR: "page"\/"per_page" is out of valid range\./;
        expect(response3.data.hits).to.be.empty;
        expect(response3.data.error).to.match(errorRgx);
      });
    });
  });
});