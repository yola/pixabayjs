'use strict';

var assign = require('lodash.assign');

var internal = {
  page: 1,
  url: 'https://pixabay.com/api'
};

module.exports = function(args) {
  var config = {
    username: args.username,
    key: args.key,
    search: args.search
  };

  return assign(config, internal, args.defaults, args.options);
};
