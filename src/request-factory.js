'use strict';

var ResultList = require('./result-list');

function RequestFactory(retriever) {
  this._retriever = retriever;
}

RequestFactory.prototype.resultList = function(options) {
  return new ResultList(this._retriever, options);
};

RequestFactory.prototype.query = function(obj) {
  this._retriever.query(obj);
  return this;
};

RequestFactory.prototype.search = function(arr) {
  this._retriever.search(arr);
  return this;
};

module.exports = RequestFactory;
