'use strict';

import omit from 'lodash.omit';
import request from 'superagent';
import url from 'url';

const searchString = function(search) {
  return search.map(term => encodeURIComponent(term)).join('+');
};

const generateUrl = function(query, urlStr, search) {
  query.q = searchString(search);

  const urlObj = url.parse(urlStr);
  urlObj.query = query;

  return url.format(urlObj);
};

var retrieve = function(search, options) {
  const query = omit(options, 'url');

  return request
    .get(generateUrl(query, options.url, search))
    .accept('application/json');
};

export default retrieve;
