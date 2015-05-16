'use strict';

var _ = require('underscore');

module.exports = {

  /**
   * Main program execution.
   * @param {array} selectors
   * @param {object} config
   */
  main: function(selectors, config) {
    _.each(config.urls, function(url) {
      this.loadPage(url, this.processPage);
    }, this);
  },

  /**
   * Loads the DOM of the given URL, then passes that page's window as the only
   * argument to the provided closure.
   *
   * @param {string} url
   * @param {processWindowClosure} closure
   */
  loadPage: function(url, closure) {
    var jsdom = require('jsdom');

    jsdom.env(url, [], function(errors, window) {
      closure(window);
      window.close();
    });
  },

  /**
   * Perform processing on a window object.
   * @callback processWindowClosure
   * @param {object} window
   */
  processPage: function(window) {
    var Sizzle = require('node-sizzle').sizzleInit(window);
    console.log(Sizzle.matches('h1').length);
  }

};
