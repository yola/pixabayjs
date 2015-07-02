'use strict';

var ResponseHandler = require('./response-handler');
var retrieve = require('./retrieve');


function ResultList(search, options, onSuccess, onFailure) {
  this._onFailure = onFailure;
  this._onSuccess = onSuccess;
  this._options = options;
  this._requestPromises = [];
  this._search = search;

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
  var promise =  retrieve(this._search, this._options)
    .then(this._handleSuccess.bind(this, this._page, this._perPage))
    .fail(this._handleFailure.bind(this, this._page, this._perPage));

  this._requestPromises[this._options.page] = promise;
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
