'use strict';

var assign = require('lodash.assign');
var ResultList = require('./result-list');

var defaults = {
  page: 1,
  per_page: 20,
  safesearch: true,
  url: 'https://pixabay.com/api'
};

var pixabayjs = {
  _auth: {},

  authenticate: function(username, key) {
    this._auth.username = username;
    this._auth.key = key;
  },

  resultList: function(search, options, onSuccess, onFailure) {
    var config = assign(this.defaults, this._auth, options);
    return new ResultList(search, config, onSuccess, onFailure);
  }
};

Object.defineProperty(pixabayjs, 'defaults', {
  get: function() {
    return defaults;
  },
  set: function(value) {
    defaults = assign(defaults, value);
  }
});

module.exports = pixabayjs;
