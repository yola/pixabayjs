'use strict';

var uniq = require('lodash.uniq');

function Handler(retriever) {
  this._fetched = false;
  this._page = 1;
  this._initRequest = false;
  this._retriever = retriever;
  this._totalPages = 1;
  this.hits = [];
  this.lastPage = false;
}

Handler.prototype._handleResponse = function(response) {
  this.response = response;
  var data = response.body;

  this.totalHits = data.totalHits;
  this.hits = uniq(this.hits.concat(data.hits));

  var per_page = this._retriever._query.per_page || 20;
  this._totalPages = Math.ceil(this.totalHits / per_page);

  if (this._page === this._totalPages) {
    this.lastPage = true;
  }

  return response;
};

Handler.prototype.next = function() {
  if (!this._initRequest) {
    throw new Error('No initial request has been made');
  }

  if (this.lastPage) {
    throw new Error('Last page has been retrieved');
  }

  this._page += 1;
  this.page(this._page);

  return this.get();
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
  this._initRequest = true;
  return this._retriever.get()
    .then(this._handleResponse.bind(this));
};

module.exports = Handler;
