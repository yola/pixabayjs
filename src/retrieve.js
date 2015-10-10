'use strict';

import omit from 'lodash.omit';
import request from 'superagent';
import q from 'q';
import url from 'url';

const searchString = function(search) {
  return search.map(term => encodeURIComponent(term)).join('+');
};

const urlPromise = function(query, urlStr, search) {
  query.q = searchString(search);

  const urlObj = url.parse(urlStr);
  urlObj.query = query;

  return q(url.format(urlObj));
};

var retrieve = function(search, options) {
  const query = omit(options, 'url');
  return urlPromise(query, options.url, search)
    .then(request.get.bind(request))
    .invoke('accept', 'application/json')
    .ninvoke('end');
};

export default retrieve;
