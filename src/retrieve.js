'use strict';

const omit = require('lodash.omit');
const request = require('superagent');
const q = require('q');
const url = require('url');

const searchString = function(search) {
  return search.map(term => encodeURIComponent(term)).join('+');
};

const urlPromise = function(query, urlStr, search) {
  query.q = searchString(search);

  const urlObj = url.parse(urlStr);
  urlObj.query = query;

  return q(url.format(urlObj));
};

module.exports = function(search, options) {
  const query = omit(options, 'url');
  return urlPromise(query, options.url, search)
    .then(request.get.bind(request))
    .invoke('accept', 'application/json')
    .ninvoke('end');
};
