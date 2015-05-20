'use strict';

var formatData = function(rawData) {
      var data = {
          count: 0,
          countByUrl: {},
          countBySelector: {},
          countByUrlBySelector: {},
          countBySelectorByUrl: {},
          metadata: {}
        },
        url;

      rawData.map(function(obj) {
        url = Object.keys(obj)[0];

        for (var sel in obj[url]) {
          if (obj[url].hasOwnProperty(sel)) {
            // Initialize.
            data.countByUrl[url] = data.countByUrl[url] || 0;
            data.countBySelector[sel] = data.countBySelector[sel] || 0;
            data.countByUrlBySelector[url] = data.countByUrlBySelector[url] || {};
            data.countByUrlBySelector[url][sel] = data.countByUrlBySelector[url][sel] || 0;
            data.countBySelectorByUrl[sel] = data.countBySelectorByUrl[sel] || {};
            data.countBySelectorByUrl[sel][url] = data.countBySelectorByUrl[sel][url] || 0;

            // Stash total count overall.
            data.count += obj[url][sel];

            // Stash total count for this URL.
            data.countByUrl[url] += obj[url][sel];

            // Stash total count by URL by selector.
            data.countByUrlBySelector[url][sel] += obj[url][sel];

            // Stash total count for this selector.
            data.countBySelector[sel] += obj[url][sel];

            // Stash total count by selector by URL.
            data.countBySelectorByUrl[sel][url] += obj[url][sel];
          }
        }
      });
      return data;
    };

/**
 * Takes an array of count details and transforms them into a beamform response
 * object that can be used to get CSSonar stats.
 *
 * @param {Object[]} rawData
 *   An array of objects representing selector counts for a URL. The object
 *   consists of a single object, keyed by URL, which is itself an object
 *   mapping selectors to counts.
 *
 * @returns {Object}
 */
module.exports = function(rawData) {
  var data = formatData(rawData);

  return {

    /**
     * Returns the total count of selector hits across all pages.
     *
     * @returns {number}
     */
    count: function() {
      return data.count;
    },

    /**
     * Returns a map of counts keyed by either url or selector.
     *
     * @param {String} type
     *   One of: "selector" or "url"
     *
     * @returns {Object|null}
     */
    countBy: function(type) {
      var normalized = 'countBy' + type.charAt(0).toUpperCase() + type.slice(1);
      return data[normalized] ? data[normalized] : null;
    },

    /**
     * Returns a nested map of counts, keyed on the outside by url and keyed on
     * the inside by selector (or vice versa, depending on input).
     *
     * @param {String} outer
     *   One of: "selector" or "url"
     *
     * @param {String} inner
     *   One of "selector" or "url" (probably the opposite of outer).
     *
     * @returns {Object|null}
     */
    deepCountBy: function(outer, inner) {
      var normalized = 'countBy';

      normalized += outer.charAt(0).toUpperCase() + outer.slice(1);
      normalized += 'By' + inner.charAt(0).toUpperCase() + inner.slice(1);
      return data[normalized] ? data[normalized] : null;
    },

    /**
     * Returns metadata associated with this CSSonar scan.
     *
     * @returns {Object}
     */
    metadata: function() {
      return data.metadata;
    }

  };
};
