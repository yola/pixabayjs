'use strict';

var q = require('q');

var noop = function(res) {
  return res;
};

function ResponseHandler(res, page, cb) {
  this.res = res;
  this.page = page;
  this.cb = cb || noop;
}

ResponseHandler.prototype.success = function() {
  var data = JSON.parse(this.res.xhr.responseText);
  data.page = this.page;
  data.error = null;

  return q(this.cb(data));
};

ResponseHandler.prototype.failure = function() {
  var error = JSON.parse(this.res.response.xhr.responseText);
  var data = {
    error: error,
    page: null,
    hits: [],
    totalHits: null
  };

  return q(this.cb(data));
};

module.exports = ResponseHandler;
