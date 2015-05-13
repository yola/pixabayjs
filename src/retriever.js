'use strict';

var _ = require('lodash');
var request = require('superagent');
var q = require('q');
var url = require('url');

function Retriever(options) {
  options = options || {};
  this._host = options.host || 'pixabay.com';
  this._path = options.path || 'api';
  this._protocol = options.protocol || 'http';
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
  _.assign(this._query, query);
};

Retriever.prototype._searchString = function() {
  return _.map(this._search, function(term) {
    return _.escape(term);
  }).join('+');
};

Retriever.prototype._urlObj = function() {
  this._setQuery({q: this._searchString()});

  return {
    hostname: this._host,
    pathname: this._path,
    protocol: this._protocol,
    query: this._query
  };
};

Retriever.prototype._url = function() {
  return q(url.format(this._urlObj()));
};

module.exports = Retriever;

