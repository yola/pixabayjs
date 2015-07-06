'use strict';

var ResponseHandler = require('./response-handler');
var retrieve = require('./retrieve');


function ResultList(search, options, onSuccess, onFailure) {
  this._search = search;
  this._options = options;
  this._onSuccess = onSuccess;
  this._onFailure = onFailure;
  this._requestPromises = [];

  // first call of next will increment to desired page
  this._options.page -= 1;
}

ResultList.prototype.next = function() {
  var nextPage = this._options.page += 1;

  if (this._requestPromises[nextPage]) {
    return this._requestPromises[nextPage];
  }

  return this._get();
};

ResultList.prototype.previous = function() {
  if (this._options.page <= 1) {
    throw new Error('There is no previous page');
  }

  var previousPage = this._options.page -= 1;

  if (this._requestPromises[previousPage]) {
    return this._requestPromises[previousPage];
  }

  return this._get();
};

ResultList.prototype._get = function() {
  var page = this._options.page;
  var perPage = this._options.per_page;
  var promise =  retrieve(this._search, this._options)
    .then(this._success.bind(this, page, perPage))
    .fail(this._failure.bind(this, page, perPage));

  this._requestPromises[page] = promise;
  return promise;
};

ResultList.prototype._success = function(page, perPage, res) {
  var resHandler = new ResponseHandler(res, page, perPage, this._onSuccess);
  return resHandler.success();
};

ResultList.prototype._failure = function(page, perPage, res) {
  var resHandler = new ResponseHandler(res, page, perPage, this._onFailure);
  return resHandler.failure();
};

module.exports = ResultList;
