# blear.classes.mvvm

[![npm module][npm-img]][npm-url]
[![build status][travis-img]][travis-url]
[![coverage][coveralls-img]][coveralls-url]

[travis-img]: https://img.shields.io/travis/blearjs/blear.classes.mvvm/master.svg?style=flat-square
[travis-url]: https://travis-ci.org/blearjs/blear.classes.mvvm

[npm-img]: https://img.shields.io/npm/v/blear.classes.mvvm.svg?style=flat-square
[npm-url]: https://www.npmjs.com/package/blear.classes.mvvm

[coveralls-img]: https://img.shields.io/coveralls/blearjs/blear.classes.mvvm/master.svg?style=flat-square
[coveralls-url]: https://coveralls.io/github/blearjs/blear.classes.mvvm?branch=master


# usage
```html
<div id="app">{{message}}</div>
```

\+

```js
var mvvm = new MVVM({
    el: '#app',
    data: {
        message: 'Hello blear'
    }
});
```

= 

```html
<div id="app">hello blear</div>
```

