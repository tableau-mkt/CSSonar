#!/usr/bin/env node
'use strict';

var CSSonar = require('./'),
    meow = require('meow'),
    config = require('cli-config').getConfig({
      dirname: __dirname,
      merge: 'deep',
      ancestors: true
    }),
    cli = meow({
      help: [
        'Usage',
        '  cssonar <css-selectors>',
        '',
        'Example',
        '  cssonar "a.cta" "input.submit"'
      ].join('\n')
    }),
    colors = require('colors');

console.log(colors.inverse(' CSSonar ') + '\n');
CSSonar.main(config, cli.input, function(err, results) {
  var pagesAffected = 0,
      unusedSelectors = 0,
      percentPagesAffected,
      warnPages;

  // If there are errors, print them and exit.
  if (err) {
    console.error(err);
    process.exit(1);
  }

  // Calculate number of affected pages.
  Object.keys(results.countByUrl).map(function(url) {
    if (results.countByUrl[url]) {
      pagesAffected++;
    }
  });
  percentPagesAffected = Math.round((pagesAffected / config.urls.length) * 100);
  warnPages = percentPagesAffected >= config.warnThreshold * 100;

  // Calculate number of unused selectors.
  Object.keys(results.countBySelector).map(function(selector) {
    if (results.countBySelector[selector] === 0) {
      unusedSelectors++;
    }
  });

  // Elements affected.
  console.log([
    colors.bold('Distinct elements across all pages:'),
    colors['reset'](results.count)
  ].join(' '));

  // Pages affected.
  console.log([
    colors.bold('Pages affected:'),
    colors[warnPages ? 'yellow' : 'reset'](pagesAffected),
    colors[warnPages ? 'yellow' : 'reset']('(' + percentPagesAffected + '%)')
  ].join(' '));

  // Unused selectors.
  console.log([
    colors.bold('Unused selectors:'),
    colors[unusedSelectors ? 'yellow' : 'reset'](unusedSelectors)
  ].join(' ') + '\n');

});
