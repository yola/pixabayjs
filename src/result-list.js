'use strict';

var bind = require('lodash.bind');
var ResponseHandler = require('./response-handler');

bind.placeholder = '_';

function ResultList(retriever, options) {
  if (!retriever) {
    throw new Error('Expected Retriever as an argument');
  }

  options || (options = {});

  this._retriever = retriever;
  this._onFailure = options.onFailure;
  this._onSuccess = options.onSuccess;
  this._page = options.page || 1;
}

ResultList.prototype.next = function() {
  this._retriever.query({page: this._page});
  this._page += 1;
  return this._get(this._page - 1);
};

ResultList.prototype._get = function(page) {
  return this._retriever
    .get()
    .then(bind(this._handleSuccess, this, '_', page))
    .fail(bind(this._handleFailure, this, '_', page));
};

ResultList.prototype._handleSuccess = function(res, page) {
  var resHandler = new ResponseHandler(res, page, this._onSuccess);
  return resHandler.success();
};

ResultList.prototype._handleFailure = function(res, page) {
  var resHandler = new ResponseHandler(res, page, this._onFailure);
  return resHandler.failure();
};

module.exports = ResultList;
