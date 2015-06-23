'use strict';

var Retriever = require('./retriever');
var RequestFactory = require('./request-factory');

var pixabayjs = {
  authenticate: function(username, key) {
    this.username = username;
    this.key = key;
  },

  defaults: function(defaults) {
    this.defaults = defaults;
  },

  requestFactory: function(options) {
    var retriever = new Retriever(options);
    retriever
      .username(this.username)
      .key(this.key)
      .defaults(this.defaults);

    return new RequestFactory(retriever);
  }
};

module.exports = pixabayjs;
