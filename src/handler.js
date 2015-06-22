'use strict';

var uniq = require('lodash.uniq');

function Handler(retriever) {
  this._currentRequest = null;
  this._fetched = false;
  this._page = 1;
  this._requested = false;
  this._retriever = retriever;
  this._totalPages = 1;
  this.hits = [];
  this.lastPage = false;
}

Handler.prototype._handleResponse = function(response) {
  this._currentRequest = null;
  this._fetched = true;

  this.response = response;
  var data = response.body;

  this.totalHits = data.totalHits;
  this.hits = uniq(this.hits.concat(data.hits));

  var totalHits = data.totalHits;
  var per_page = this._retriever._query.per_page || 20;
  this._totalPages = Math.ceil(totalHits / per_page);

  if (this._page === this._totalPages) {
    this.lastPage = true;
  }

  return response;
};

Handler.prototype.next = function() {
  if (!this._requested) {
    throw new Error('No initial request has been made');
  }

  if (!this._fetched) {
    return this._currentRequest;
  }

  if (this.lastPage) {
    throw new Error('Last page has been retrieved');
  }

  this._page += 1;
  this.page(this._page);

  var request = this.get();
  return request;
};

Handler.prototype.page = function(page) {
  this._page = page;
  return this.query({page: this._page});
};

Handler.prototype.query = function(obj) {
  this._retriever.query(obj);
  return this;
};

Handler.prototype.search = function(search) {
  if (this._requested) {
    throw new Error('Cannot change search terms after a request has been made');
  }
  this._retriever.search(search);
  return this;
};

Handler.prototype.get = function() {
  if (this._currentRequest) {
    return this._currentRequest;
  }

  this._fetched = false;
  this._requested = true;
  this._currentRequest = this._retriever.get()
    .then(this._handleResponse.bind(this));

  return this._currentRequest;
};

module.exports = Handler;
