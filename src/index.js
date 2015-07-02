'use strict';

var assign = require('lodash.assign');
var clone = require('lodash.clone');
var ResultList = require('./result-list');


var pixabayjs = {
  authenticate: function(username, key) {
    this.username = username;
    this.key = key;
  },

  defaults: {
    safesearch: true
  },

  resultList: function(search, options, onSuccess, onFailure) {
    var mergedOptions;
    var optsClone = clone(options);

    optsClone.key || (optsClone.key = this.key);
    optsClone.page > 0 || (optsClone.page = 1);
    optsClone.url || (optsClone.url = 'https://pixabay.com/api');
    optsClone.username || (optsClone.username = this.username);

    mergedOptions = assign(this.defaults, optsClone);

    return new ResultList(search, mergedOptions, onSuccess, onFailure);
  }
};

module.exports = pixabayjs;
