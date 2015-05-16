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
        '  cssonar <input>',
        '',
        'Example',
        '  cssonar Unicorn'
      ].join('\n')
    });

CSSonar.main(config, cli.input, function(err, results) {
  if (err) console.error(err);
  else console.log(JSON.stringify(results))
});
