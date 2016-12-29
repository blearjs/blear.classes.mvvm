/**
 * 文件描述
 * @author ydr.me
 * @create 2016-06-27 17:34
 */


'use strict';

var random = require('blear.utils.random');

var MVVM = require('../src/index');

var data = window.data = {
    a: '1',
    b: {
        c: {
            d: {
                e: '2'
            }
        }
    },
    x: {
        y: {
            z: 3
        }
    }
};

new MVVM({
    el: '#app',
    data: data
});

document.getElementById('change1').onclick = function () {
    data.a = random.string();
};

document.getElementById('change2').onclick = function () {
    data.b.c.d.e = random.string();
};

document.getElementById('change3').onclick = function () {
    data.x = {
        y: {
            z: random.string()
        }
    };
};