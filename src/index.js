'use strict';

var assign = require('lodash.assign');
var ResultList = require('./result-list');

var _internal = {
  page: 1,
  per_page: 20,
  safesearch: true,
  url: 'https://pixabay.com/api'
};

var pixabayjs = {
  _auth: {},

  defaults: {},

  authenticate: function(username, key) {
    this._auth.username = username;
    this._auth.key = key;
  },

  resultList: function(search, options, onSuccess, onFailure) {
    var config = assign({}, _internal, this.defaults, this._auth, options);
    return new ResultList(search, config, onSuccess, onFailure);
  }
};

module.exports = pixabayjs;
