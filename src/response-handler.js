'use strict';

import q from 'q';


const noop = function(res) {
  return res;
};

class ResponseHandler {
  constructor(res, page, perPage, cb) {
    this.res = res;
    this.page = page;
    this.perPage = perPage;
    this.cb = cb || noop;
  }

  success() {
    const data = JSON.parse(this.res.xhr.responseText);
    data.page = this.page;
    data.totalPages = Math.ceil((data.totalHits || data.total) / this.perPage);
    data.error = null;

    return q(this.cb(data));
  }

  failure() {
    let error;

    try {
      error = JSON.parse(this.res.response.xhr.responseText);
    }
    catch(e) {
      error = this.res.response.xhr.responseText;
    }

    const data = {
      error: error,
      page: this.page,
      hits: [],
      totalHits: null,
      totalPages: null
    };

    return q(this.cb(data));
  }
}


export default ResponseHandler;
