'use strict';

var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
var pixabay = require('../src/index');
var ResultList = require('../src/result-list');

var expect = chai.expect;
chai.use(chaiAsPromised);

var username = 'username';
var key = 'key';

var pixabayUrl = 'https://pixabay.com/api';

describe('Pixabayjs', function() {
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

  describe('makeConfig', function() {
    var config = {
      username: username,
      key: key,
      search: ['dogs', 'puppies'],
      page: 1,
      url: pixabayUrl,
      safesearch: true
    };

    beforeEach(function() {
      client.authenticate(username, key);
    });

    it('returns a config object', function() {
      var search = ['dogs', 'puppies'];
      var options = {
        safesearch: true
      };

      expect(client.makeConfig(search, options)).to.eql(config);
    });
  });

  xdescribe('resultList', function() {
    var config;
    beforeEach(function() {
      client.authenticate(username, key);

      config = client.makeConfig();
    });

    afterEach(function() {
      config = null;
    });

    it('returns a ResultList', function() {
      expect(client.resultList(config)).to.be.instanceof(ResultList);
    });
  });
});
