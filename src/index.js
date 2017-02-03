'use strict';

import assign from 'lodash.assign';
import ResultList from './result-list';

const requiredDefaults = {
  page: 1,
  per_page: 20,
};

const pixabayjs = {
  _auth: {},

  _makeConfig: function(url, opts) {
    const urlObj = { url };
    return assign({}, requiredDefaults, urlObj, this.defaults, this._auth,
      opts);
  },

  defaults: {},

  authenticate: function(key) {
    this._auth.key = key;
  },

  imageResultList: function(search, opts, onSuccess, onFailure) {
    const url = 'https://pixabay.com/api';
    const conf = this._makeConfig(url, opts);
    return new ResultList(search, conf, onSuccess, onFailure);
  },

  videoResultList: function(search, opts, onSuccess, onFailure) {
    const url = 'https://pixabay.com/api/videos';
    const conf = this._makeConfig(url, opts);
    return new ResultList(search, conf, onSuccess, onFailure);
  }
};

export default pixabayjs;
