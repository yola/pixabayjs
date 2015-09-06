/* jshint esnext: true */

'use strict';

let chai = require('chai');
let chaiAsPromised = require('chai-as-promised');
let pixabay = require('../src/index');
let ResultList = require('../src/result-list');

let expect = chai.expect;
chai.use(chaiAsPromised);

let username = 'username';
let key = 'key';

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
    let search = ['dogs', 'puppies'];

    it('returns a ResultList', function() {
      expect(client.resultList(search)).to.be.instanceof(ResultList);
    });
  });
});
