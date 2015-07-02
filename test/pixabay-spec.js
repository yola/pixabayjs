'use strict';

var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
var pixabay = require('../src/index');
var ResultList = require('../src/result-list');

var expect = chai.expect;
chai.use(chaiAsPromised);

var username = 'username';
var key = 'key';

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
      expect(client._auth.username).to.equal(username);
      expect(client._auth.key).to.equal(key);
    });
  });

  describe('resultList', function() {
    var search = ['dogs', 'puppies'];

    it('returns a ResultList', function() {
      expect(client.resultList(search)).to.be.instanceof(ResultList);
    });
  });
});
