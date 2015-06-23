'use strict';

var ListFactory = require('./list-factory');

function RequestFactory(retriever) {
  this._retriever = retriever;
}

RequestFactory.prototype.listFactory = function(options) {
  return new ListFactory(this._retriever, options);
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
