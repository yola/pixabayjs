'use strict';

var q = require('q');

var noop = function(res) {
  return res;
};

function RequestHandler(res, cb) {
  this.res = res;
  this.cb = cb || noop;
}

RequestHandler.prototype.handle = function() {
  var data = this.res.body;
  data.page = this.res.request.qs.page;

  return q(this.cb(this.res));
};

module.exports = RequestHandler;
