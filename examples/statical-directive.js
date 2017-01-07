/**
 * 文件描述
 * @author ydr.me
 * @created 2017-01-05 13:11
 */


'use strict';

var MVVM = require('../src/index');

MVVM.directive('reverse', function (node, newVal, oldVal, operation) {
    node.innerHTML = newVal.split('').reverse().join('-');
});

new MVVM({
    el: '#app',
    data: {
        abc: 'abc'
    }
});

