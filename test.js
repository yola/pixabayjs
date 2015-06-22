'use strict';

var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
var fill = require('lodash.fill');
var mockagent = require('mockagent');
var pixabay = require('./src/index');
var promiseHelpers = require('promisehelpers');
var querystring = require('querystring');
var superagent = require('superagent');
var url = require('url');

var notify = promiseHelpers.notify;

var expect = chai.expect;
chai.use(chaiAsPromised);
chai.should();

var username = 'username';
var key = 'key';

var pixabayUrl = 'https://pixabay.com/api/';

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

  describe('request', function() {
    var request = {};
    var query;

    before(function(done) {
      mockagent.target(superagent);

      mockagent.url(pixabayUrl, function(res) {
        var query = url.parse(this.url).query;
        var queryParams = querystring.parse(query);

        var firstPage = queryParams.page !== '2';
        var emptyArr =  firstPage ? new Array(20) : new Array(5);
        fill(emptyArr, 1);

        var hits = emptyArr.map(function(v, i) {
          var offset = firstPage ? 0 : 20;
          return offset + i + 1;
        });


        var response = {
          status: 200,
          body: {
            totalHits: 25,
            hits: hits
          }
        };

        return response;
      });

      query = {
        order: 'lastest'
      };

      client = Object.create(pixabay);
      client.authenticate(username, key);

      request = client
        .request();


      request.query(query)
        .search(['dog', 'puppy'])
        .get()
        .done(notify(done));
    });

    after(function() {
      mockagent.releaseTarget();
    });

    it('hits the api', function() {
      expect(request.response.status).to.equal(200);
    });

    it('receives hits', function() {
      expect(request.data.totalHits).to.equal(25);
      expect(request.hits).to.be.length(20);
    });

      expect(request.data.request.qs).to.eql(queries);
    });

    it('receives hits', function() {
      expect(request.data.body.totalHits).to.be.at.least(1);
    });
  });
});
