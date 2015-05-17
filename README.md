#  [![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][daviddm-image]][daviddm-url]

> Detect CSS selector prevalence in your web application.


## Install

```sh
$ npm install --save tableau-mkt/cssonar
```


## Configuration

Add a `.cssonar.json` file to your project's root. The JSON file should contain
an object with the following properties:

- __urls__: An array of representative URLs that CSSonar will ping to determine
  selector prevalence.
- __warnThreshold__: A float representing a percentage threshold above which a
  warning should be shown (e.g. warn if `0.5` or 50% of all pages match the
  provided CSS selector list.


## Usage

```js
var CSSonar = require('cssonar');

CSSonar.scan({urls: ['http://example.com']}, ['a.cta'], function(err, results) {
  // Get the total count of all instances of all selectors across all pages.
  results.count();

  // Get a map of selector occurrence count keyed by page URL.
  results.countBy('url');

  // Get a map of selector occurrence count keyed by selector.
  results.countBy('selector');

  // Get a nested map of selector occurrence counts whose outer keys are URLs
  // and whose inner keys are selectors.
  results.deepCountBy('url', 'selector');

  // Get a nested map of selector occurrence counts whose outer keys are
  // selectors and whose inner keys are page URLs.
  results.deepCountBy('selector', 'url');

  // Get metadata associated with this CSSonar scan.
  results.metadata();
});
```


## Commandline Usage
```sh
$ npm install --global tableau-mkt/cssonar
$ cd /path/to/your/webapp/root # contains your .cssonar.json file
$ cssonar ".selector-1" "#another > .selector"
```


## License

MIT © []()


[npm-image]: https://badge.fury.io/js/cssonar.svg
[npm-url]: https://npmjs.org/package/cssonar
[travis-image]: https://travis-ci.org/tableau-mkt/cssonar.svg?branch=master
[travis-url]: https://travis-ci.org/tableau-mkt/cssonar
[daviddm-image]: https://david-dm.org/tableau-mkt/cssonar.svg?theme=shields.io
[daviddm-url]: https://david-dm.org/tableau-mkt/cssonar
