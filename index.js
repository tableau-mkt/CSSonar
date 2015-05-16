'use strict';

var _ = require('underscore');

module.exports = {

  configs: {},

  /**
   * Main program execution.
   * @param {array} selectors
   * @param {object} config
   */
  main: function(selectors, config) {
    // Stash the selectors on a scoped config object.
    config.selectors = selectors;
    this.configs = config;

    // Iterate through all URLs, load, and process the page.
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
    var jsdom = require('jsdom'),
        that = this;

    jsdom.env(url, [], function(errors, window) {
      closure.call(that, window);
      window.close();
    });
  },

  /**
   * Perform processing on a window object.
   * @callback processWindowClosure
   * @param {object} window
   */
  processPage: function(window) {
    var Sizzle = require('node-sizzle').sizzleInit(window),
        selectors = this.configs.selectors || [];

    // Iterate through all provided selectors.
    _.each(selectors, function(selector) {
      console.log(selector + ': ' + Sizzle.matches(selector).length);
    }, this);
  }

};
