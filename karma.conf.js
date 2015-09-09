'use strict';

module.exports = function(config) {
  config.set({
    frameworks: ['mocha', 'browserify'],
    browsers: ['PhantomJS'],
    browserify: {
      debug: true,
      watch: true,
    },
    preprocessors: {
      'test/**/*.js': ['browserify']
    },
    files: [
      'test/test-setup.js',
      'test/*-spec.js'
    ],
    reporters: ['spec'],
    singleRun: true
  });
};
