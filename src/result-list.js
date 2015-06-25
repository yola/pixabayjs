'use strict';

var ResponseHandler = require('./response-handler');

function ResultList(retriever, options) {
  if (!retriever) {
    throw new Error('Expected Retriever as an argument');
  }

  options || (options = {});

  this._retriever = retriever;
  this._onFailure = options.onFailure;
  this._onSuccess = options.onSuccess;
  this._page = options.page || 1;
  this._perPage = options.perPage || 20;
}

ResultList.prototype.next = function() {
  this._retriever.query({page: this._page, per_page: this._perPage});
  this._page += 1;
  return this._get();
};

ResultList.prototype._get = function() {
  var page = this._page - 1;
  return this._retriever
    .get()
    .then(this._handleSuccess.bind(this, page, this._perPage))
    .fail(this._handleFailure.bind(this, page, this._perPage));
};

ResultList.prototype._handleSuccess = function(page, perPage, res) {
  var resHandler = new ResponseHandler(res, page, perPage, this._onSuccess);
  return resHandler.success();
};

ResultList.prototype._handleFailure = function(page, perPage, res) {
  var resHandler = new ResponseHandler(res, page, perPage, this._onFailure);
  return resHandler.failure();
};

module.exports = ResultList;
