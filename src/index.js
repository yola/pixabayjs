/* jshint esnext: true */

'use strict';

import {assign} from './exports';
import ResultList from './result-list';

let requiredDefaults = {
  page: 1,
  per_page: 20,
  url: 'https://pixabay.com/api'
};

let pixabayjs = {
  _auth: {},

  defaults: {},

  authenticate(username, key) {
    this._auth.username = username;
    this._auth.key = key;
  },

  resultList(search, opts, onSuccess, onFailure) {
    let config = assign({}, requiredDefaults, this.defaults, this._auth, opts);
    return new ResultList(search, config, onSuccess, onFailure);
  }
};

module.exports = pixabayjs;
export default pixabayjs;
