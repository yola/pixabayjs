'use strict';

import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import pixabay from '../src/index';
import ResultList from '../src/result-list';

const {expect} = chai;

chai.use(chaiAsPromised);

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
    it('sets the client\'s key', function() {
      client.authenticate(key);
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
