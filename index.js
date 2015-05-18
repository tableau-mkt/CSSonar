'use strict';

var Promise = require('promise');

module.exports = {

  configs: {},

  /**
   * Main program execution.
   *
   * @param {Object} config
   *   The CSSonar config object.
   *
   * @param {Array} selectors
   *   An array of selectors to use when querying a list of pages.
   *
   * @param {Function} callback
   *   A callback function to be run with the results of the CSSonar scan. This
   *   callback should take two arguments: error, and response.
   */
  scan: function(config, selectors, callback) {
    // Stash the selectors on a scoped config object.
    config.selectors = selectors;
    this.configs = config;

    // Iterate through all URLs, load, and process the page.
    this.processPages.call(this, config.urls).done(function(results) {
      callback(null, require('./beamform.js')(results));
    }, function(err) {
      callback(err, null);
    });
  },

  /**
   * Processes a list of pages.
   *
   * @param {Array} urls
   *   An array of URLs representing pages to be processed.
   *
   * @returns {Promise[]}
   *   An array of promises for each provided URL.
   */
  processPages: function(urls) {
    return Promise.all(urls.map(this.preparePage, this));
  },

  /**
   * Attempts to compile the window object for a given URL, then if successful,
   * query the window for all configured selectors.
   *
   * @param {String} url
   *   The URL of the page to be prepared.
   *
   * @returns {Promise}
   *   If fulfilled, the promise will pass an object mapping a URL to an object
   *   representing query stats for the page.
   */
  preparePage: function(url) {
    var that = this,
        response = {};

    return new Promise(function(fulfill, reject) {
      that.compileWindow(url).done(function (window) {
        response[url] = that.queryPage.call(that, window, that.configs.selectors);
        fulfill(response);
      }, reject);
    });
  },

  /**
   * Compile a window object for a given URL.
   *
   * @param {String} url
   *   The URL of the page whose window object is desired.
   *
   * @returns {Promise}
   *   If fulfilled, the promise will pass the compiled window object.
   */
  compileWindow: function(url) {
    return new Promise(function(fulfill, reject) {
      require('jsdom').env(url, [], function(errors, window) {
        if (errors) {
          reject(errors);
        }
        else {
          fulfill(window);
        }
      });
    });
  },

  /**
   * Queries the given window object for the given selectors.
   *
   * @param {Object} window
   *   A standard window object.
   *
   * @param {Array} selectors
   *   An array of selectors with which to query the window.
   *
   * @returns {Object}
   *   A map showing counts of selectors on this page, keyed by selector.
   */
  queryPage: function(window, selectors) {
    var Sizzle = require('node-sizzle').sizzleInit(window),
        response = {};

    selectors.map(function(selector) {
      response[selector] = Sizzle.matches(selector).length;
    });

    return response;
  }

};
