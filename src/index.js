'use strict';

var Retriever = require('./retriever');

var pixabayjs = {
  authorize: function(username, key) {
    this.username = username;
    this.key = key;
  },

  defaults: function(defaults) {
    this.defaults = defaults;
  },

  request: function(options) {
    var request = new Retriever(options);
    return request
      .username(this.username)
      .key(this.key)
      .defaults(this.defaults);
  }
};

module.exports = pixabayjs;
