'use strict';

var q = require('q');

var noop = function(res) {
  return res;
};

function ResponseHandler(res, page, perPage, cb) {
  this.res = res;
  this.page = page;
  this.perPage = perPage;
  this.cb = cb || noop;
}

ResponseHandler.prototype.success = function() {
  var data = JSON.parse(this.res.xhr.responseText);
  data.page = this.page;
  data.totalPages = Math.ceil(data.totalHits / this.perPage);
  data.error = null;

  return q(this.cb(data));
};

ResponseHandler.prototype.failure = function() {
  var error = JSON.parse(this.res.response.xhr.responseText);
  var data = {
    error: error,
    page: this.page,
    hits: [],
    totalHits: null,
    totalPages: null
  };

  return q(this.cb(data));
};

module.exports = ResponseHandler;
