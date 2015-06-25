'use strict';

var assign = require('lodash.assign');
var request = require('superagent');
var q = require('q');
var url = require('url');

function Retriever(options) {
  options = options || {};

  this._path = options.path || 'https://pixabay.com/api';
  this._query = options.query || {};
  this._search = options.search || [];
}

Retriever.prototype.defaults = function(defaults) {
  this._setQuery(defaults);
  return this;
};

Retriever.prototype.get = function() {
  return this._url()
    .then(request.get.bind(request))
    .invoke('accept', 'application/json')
    .ninvoke('end');
};

Retriever.prototype.host = function(host) {
  this._host = host;
  return this;
};

Retriever.prototype.key = function(key) {
  if (key) {
    this._setQuery({key: key});
  }

  return this;
};

Retriever.prototype.path = function(path) {
  this._path = path;
  return this;
};

Retriever.prototype.protocol = function(protocol) {
  this._protocol = protocol;
};

Retriever.prototype.query = function(query) {
  this._setQuery(query);
  return this;
};

Retriever.prototype.search = function(search) {
  this._search = search;
  return this;
};

Retriever.prototype.username = function(username) {
  if (username) {
    this._setQuery({username: username});
  }

  return this;
};

Retriever.prototype._setQuery = function(query) {
  assign(this._query, query);
};

Retriever.prototype._searchString = function() {
  return this._search.map(function(term) {
    return encodeURIComponent(term);
  }).join('+');
};

Retriever.prototype._urlObj = function() {
  this._setQuery({q: this._searchString()});

  var urlObj = url.parse(this._path);
  urlObj.query = this._query;

  return urlObj;
};

Retriever.prototype._url = function() {
  return q(url.format(this._urlObj()));
};

module.exports = Retriever;

