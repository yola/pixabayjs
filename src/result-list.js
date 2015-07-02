'use strict';

var ResponseHandler = require('./response-handler');
var retrieve = require('./retrieve');

function ResultList(config, onSuccess, onFailure) {
  if (!config.page || config.page < 1) {
    config.page = 1;
  }

  config.per_page || (config.per_page = 20);

  this._config = config;
  this._onFailure = onFailure;
  this._onSuccess = onSuccess;
  this._requestPromises = [];

  // first call of next will increment to desired page
  this._config.page -= 1;
}

ResultList.prototype.next = function() {
  this._config.page += 1;

  if (this._requestPromises[this._config.page]) {
    return this._requestPromises[this._config.page];
  }

  return this._get();
};

ResultList.prototype.previous = function() {
  if (this._config.page <= 1) {
    throw new Error('There is no previous page');
  }

  this._config.page -= 1;

  if (this._requestPromises[this._config.page]) {
    return this._requestPromises[this._config.page];
  }

  return this._get();
};

ResultList.prototype._get = function() {
  var promise =  retrieve(this._config)
    .then(this._success.bind(this, this._config.page, this._config.per_page))
    .fail(this._failure.bind(this, this._config.page, this._config.per_page));

  this._requestPromises[this._config.page] = promise;
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
