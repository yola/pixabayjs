'use strict';

const assign = require('lodash.assign');
const ResultList = require('./result-list');

const requiredDefaults = {
  page: 1,
  per_page: 20,
  url: 'https://pixabay.com/api'
};

const pixabayjs = {
  _auth: {},

  defaults: {},

  authenticate: function(username, key) {
    this._auth.username = username;
    this._auth.key = key;
  },

  resultList: function(search, opts, onSuccess, onFailure) {
    const conf = assign({}, requiredDefaults, this.defaults, this._auth, opts);
    return new ResultList(search, conf, onSuccess, onFailure);
  }
};

module.exports = pixabayjs;
