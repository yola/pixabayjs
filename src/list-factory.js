'use strict';

var ResponseHandler = require('./response-handler');

function ListFactory(retriever, options) {
  if (!retriever) {
    throw new Error('Expected Retriever as an argument');
  }

  options || (options = {});

  this._retriever = retriever;
  this._onFailure = options.onFailure;
  this._onSuccess = options.onSuccess;
  this._page = options.page || 1;
}

ListFactory.prototype.next = function() {
  this._retriever.query({page: this._page});
  this._page += 1;
  return this._get();
};

ListFactory.prototype._get = function() {
  return this._retriever
    .get()
    .then(this._handleSuccess.bind(this))
    .fail(this._handleFailure.bind(this));
};

ListFactory.prototype._handleSuccess = function(res) {
  var resHandler = new ResponseHandler(res, this._page - 1, this._onSuccess);
  return resHandler.success();
};

ListFactory.prototype._handleFailure = function(res) {
  var resHandler = new ResponseHandler(res, this._page - 1, this._onFailure);
  return resHandler.failure();
};

module.exports = ListFactory;
