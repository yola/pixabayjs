/* jshint esnext: true */

'use strict';

import {
  omit,
  q,
  request,
  url
} from './exports';

let searchString = function(search) {
  return search.map(function(term) {
    return encodeURIComponent(term);
  }).join('+');
};

let urlPromise = function(query, urlStr, search) {
  query.q = searchString(search);

  let urlObj = url.parse(urlStr);
  urlObj.query = query;

  return q(url.format(urlObj));
};

export default function(search, options) {
  let query = omit(options, 'url');
  return urlPromise(query, options.url, search)
    .then(request.get.bind(request))
    .invoke('accept', 'application/json')
    .ninvoke('end');
}
