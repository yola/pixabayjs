'use strict';

var Handler = require('./handler');
var Retriever = require('./retriever');

var pixabayjs = {
  authenticate: function(username, key) {
    this.username = username;
    this.key = key;
  },

  defaults: function(defaults) {
    this.defaults = defaults;
  },

  request: function(options) {
    var retriever = new Retriever(options);
    retriever
      .username(this.username)
      .key(this.key)
      .defaults(this.defaults);

    return new Handler(retriever);
  }
};

module.exports = pixabayjs;
