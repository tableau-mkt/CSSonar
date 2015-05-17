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

CSSonar.main({urls: ['http://example.com']}, ['a.cta'], function(err, results) {
  console.log(results);
});
```

In the above example, `results` would be an object similar to the following:
```json
{
  "count": 5,
  "countByUrl": {
    "http://example.com": 3,
    "http://example.com/bar": 2
  },
  "countBySelector": {
    "a.cta": 5
  },
  "countByUrlBySelector": {
    "http://example.com": {
      "a.cta": 3,
    },
    "http://example.com/bar": {
      "a.cta": 2,
    }
  },
  "countBySelectorByUrl": {
    "a.cta": {
      "http://example.com": 2,
      "http://example.com/bar": 3,
    }
  },
  "metadata": {}
}
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
