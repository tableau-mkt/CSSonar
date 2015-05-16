'use strict';

var _ = require('underscore'),
    Promise = require('promise');

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
  main: function(config, selectors, callback) {
    var that = this;

    // Stash the selectors on a scoped config object.
    config.selectors = selectors;
    this.configs = config;

    // Iterate through all URLs, load, and process the page.
    this.processPages.call(this, config.urls).done(function(results) {
      callback(null, that.formatResponse(results));
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
        if (errors) reject(errors);
        else fulfill(window);
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
  },

  /**
   * Takes an array of count details and transforms them into a response object
   * of the format expected from this module.
   *
   * @param {Object[]} data
   *   An array of objects representing selector counts for a URL. The object
   *   consists of a single object, keyed by URL, which is itself an object
   *   mapping selectors to counts.
   *
   * @returns {Object}
   *   Returns an object containing the following keys:
   *   - count: An integer representing the total sum of selector hits across
   *     all pages.
   *   - countByUrl: A map of URLs and their selector hit counts.
   *   - countBySelector: A map of selectors and their hit counts.
   *   - countByUrlBySelector: Similar to countByUrl, but broken down one layer
   *     deeper by selector.
   *   - countBySelectorByUrl: Similar to countBySelector, but broken down one
   *     layer deeper by URL.
   */
  formatResponse: function(data) {
    var response = {
          count: 0,
          countByUrl: {},
          countBySelector: {},
          countByUrlBySelector: {},
          countBySelectorByUrl: {},
          metadata: {}
        },
        url;

    data.map(function(obj) {
      url = Object.keys(obj)[0];

      for (var sel in obj[url]) {
        if (obj[url].hasOwnProperty(sel)) {
          // Initialize.
          response.countByUrl[url] = response.countByUrl[url] || 0;
          response.countBySelector[sel] = response.countBySelector[sel] || 0;
          response.countByUrlBySelector[url] = response.countByUrlBySelector[url] || {};
          response.countByUrlBySelector[url][sel] = response.countByUrlBySelector[url][sel] || 0;
          response.countBySelectorByUrl[sel] = response.countBySelectorByUrl[sel] || {};
          response.countBySelectorByUrl[sel][url] = response.countBySelectorByUrl[sel][url] || 0;

          // Stash total count overall.
          response.count += obj[url][sel];

          // Stash total count for this URL.
          response.countByUrl[url] += obj[url][sel];

          // Stash total count by URL by selector.
          response.countByUrlBySelector[url][sel] += obj[url][sel];

          // Stash total count for this selector.
          response.countBySelector[sel] += obj[url][sel];

          // Stash total count by selector by URL.
          response.countBySelectorByUrl[sel][url] += obj[url][sel];
        }
      }
    });

    return response;
  }

};
