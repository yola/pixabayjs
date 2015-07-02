'use strict';

var omit = require('lodash.omit');
var request = require('superagent');
var q = require('q');
var url = require('url');

var searchString = function(search) {
  return search.map(function(term) {
    return encodeURIComponent(term);
  }).join('+');
};

var urlPromise = function(query, urlStr, search) {
  query.q = searchString(search);

  var urlObj = url.parse(urlStr);
  urlObj.query = query;

  return q(url.format(urlObj));
};

module.exports = function(search, options) {
  var query = omit(options, 'url');
  return urlPromise(query, options.url, search)
    .then(request.get.bind(request))
    .invoke('accept', 'application/json')
    .ninvoke('end');
};
