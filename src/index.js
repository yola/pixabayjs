'use strict';

var assign = require('lodash.assign');
var ResultList = require('./result-list');

var requiredDefaults = {
  page: 1,
  per_page: 20,
  url: 'https://pixabay.com/api'
};

var pixabayjs = {
  _auth: {},

  defaults: {},

  authenticate: function(username, key) {
    this._auth.username = username;
    this._auth.key = key;
  },

  resultList: function(search, opts, onSuccess, onFailure) {
    var config = assign({}, requiredDefaults, this.defaults, this._auth, opts);
    return new ResultList(search, config, onSuccess, onFailure);
  }
};

module.exports = pixabayjs;
