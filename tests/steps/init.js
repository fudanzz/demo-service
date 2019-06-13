'use strict';

const _ = require('lodash');
const co = require('co');
const Promise = require('bluebird');

let initialized = false;

let init = co.wrap(function* () {
  if (initialized) {
    return;
  }

  initialized = true;
});

module.exports.init = init;