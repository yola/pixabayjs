'use strict';

var ResponseHandler = require('./request-handler');

function ListFactory(retriever, spec) {
  if (!retriever) {
    throw new Error('Expected Retriever as an argument');
  }

  spec || (spec = {});

  this._retriever = retriever;
  this._page = spec.page || 1;
  this._cb = spec.cb;
}

ListFactory.prototype.next = function() {
  this._retriever.query({page: this._page});
  this._page += 1;
  return this._get();
};

ListFactory.prototype._get = function() {
  return this._retriever
    .get()
    .then(this._handleResponse.bind(this));
};

ListFactory.prototype._handleResponse = function(res) {
  var resHandler = new ResponseHandler(res, this._cb);
  return resHandler.handle();
};

module.exports = ListFactory;
