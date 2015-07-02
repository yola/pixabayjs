'use strict';

var configFactory = require('./config-factory');
var ResultList = require('./result-list');

var pixabayjs = {
  authenticate: function(username, key) {
    this.username = username;
    this.key = key;
  },

  defaults: {},

  makeConfig: function(search, options) {
    var config = {
      username: this.username,
      key: this.key,
      defaults: this.defaults,
      search: search,
      options: options
    };

    return configFactory(config);
  },

  resultList: function(config, onSuccess, onFailure) {
    return new ResultList(config, onSuccess, onFailure);
  }
};

module.exports = pixabayjs;
