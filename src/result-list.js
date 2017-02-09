'use strict';

import ResponseHandler from './response-handler';
import retrieve from './retrieve';


class ResultList {
  constructor(search, options, onSuccess, onFailure) {
    this._search = search;
    this._options = options;
    this._onSuccess = onSuccess;
    this._onFailure = onFailure;
    this._requestPromises = [];

    // first call of next will increment to desired page
    this._options.page -= 1;
  }

  next() {
    const nextPage = this._options.page += 1;

    if (this._requestPromises[nextPage]) {
      return this._requestPromises[nextPage];
    }

    return this._get();
  }

  previous() {
    if (this._options.page <= 1) {
      throw new Error('There is no previous page');
    }

    const previousPage = this._options.page -= 1;

    if (this._requestPromises[previousPage]) {
      return this._requestPromises[previousPage];
    }

    return this._get();
  }

  _get() {
    const page = this._options.page;
    const perPage = this._options.per_page;
    const promise =  retrieve(this._search, this._options)
      .then(this._success(page, perPage))
      .catch(this._failure(page, perPage));

    this._requestPromises[page] = promise;
    return promise;
  }

  _success(page, perPage) {
    return res => {
      const resHndlr = new ResponseHandler(res, page, perPage, this._onSuccess);
      return resHndlr.success();
    };
  }

  _failure(page, perPage) {
    return res => {
      const resHndlr = new ResponseHandler(res, page, perPage, this._onFailure);
      return resHndlr.failure();
    };
  }
}


export default ResultList;
