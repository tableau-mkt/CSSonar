'use strict';
var assert = require('assert');
var cssonar = require('../');

describe('cssonar node module', function () {
  it('must have at least one test', function () {
    cssonar();
    assert(false, 'I was too lazy to write any tests. Shame on me.');
  });
});
