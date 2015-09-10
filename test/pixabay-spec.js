'use strict';

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const pixabay = require('../src/index');
const ResultList = require('../src/result-list');
const {expect} = chai;

chai.use(chaiAsPromised);

const username = 'username';
const key = 'key';

describe('Pixabayjs', function() {
  this.timeout(30000);
  let client;

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
    const search = ['dogs', 'puppies'];

    it('returns a ResultList', function() {
      expect(client.resultList(search)).to.be.instanceof(ResultList);
    });
  });
});
