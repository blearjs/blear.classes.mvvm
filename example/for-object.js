/**
 * 文件描述
 * @author ydr.me
 * @created 2017-01-03 18:46
 */


'use strict';

window.data = {
    a: {
        b: 1
    },
    aa: {
        bb: 2
    },
    aaa: {
        bbb: {
            ccc: true
        }
    }
};

var MVVM = require('../src/index');

new MVVM({
    el: '#app',
    data: data
});

