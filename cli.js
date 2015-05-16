#!/usr/bin/env node
'use strict';

var meow = require('meow'),
    cssonar = require('./'),
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

cssonar.main(cli.input, config);
