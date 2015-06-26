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
  this._page = options.page ? options.page - 1 : 0;
  this._perPage = options.perPage || 20;
  this._requestPromises = [];

  this._retriever.query({per_page: this._perPage});
}

ResultList.prototype.next = function() {
  this._page += 1;

  this._retriever.query({page: this._page});

  if (this._requestPromises[this._page]) {
    return this._requestPromises[this._page];
  }

  return this._get();
};

ResultList.prototype.previous = function() {
  if (this._page <= 1) {
    throw new Error('There is no previous page');
  }

  this._page -= 1;

  if (this._requestPromises[this._page]) {
    return this._requestPromises[this._page];
  }

  this._retriever.query({page: this._page});

  return this._get();
};

ResultList.prototype._get = function() {
  var promise =  this._retriever
    .get()
    .then(this._handleSuccess.bind(this, this._page, this._perPage))
    .fail(this._handleFailure.bind(this, this._page, this._perPage));

  this._requestPromises[this._page] = promise;
  return promise;
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
