'use strict';

var _ = require('lodash');
var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
var config = require('./config.json');
var pixabay = require('./src/index');
var promiseHelpers = require('promisehelpers');

var notify = promiseHelpers.notify;
var wrap = promiseHelpers.wrap;

var expect = chai.expect;
chai.use(chaiAsPromised);
chai.should();

var username = config.pixabay.username;
var key = config.pixabay.api_key;

describe('pixabayjs', function() {
  this.timeout(30000);
  var client;

  beforeEach(function() {
    client = Object.create(pixabay);
  });

  afterEach(function() {
    client = null;
  });

  describe('authorize', function() {
    it('sets the client\'s username and key', function() {
      client.authorize(username, key);
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
      query = {
        q: 'dog'
      };

      client = Object.create(pixabay);
      client.authorize(username, key);

      client
        .request()
        .query(query)
        .get()
        .then(wrap(request, 'data'))
        .done(notify(done));
    });

    it('hits the api', function() {
      expect(request.data.status).to.equal(200);
    });

    it('sends the query parameters', function() {
      var queries = _.assign(query, {username: username, key: key});
      expect(request.data.request.qs).to.eql(queries);
    });

    it('receives hits', function() {
      expect(request.data.body.totalHits).to.be.at.least(1);
    });
  });
});
