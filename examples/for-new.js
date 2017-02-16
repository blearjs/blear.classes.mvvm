/**
 * 文件描述
 * @author ydr.me
 * @created 2016-12-31 15:42
 */


'use strict';

var MVVM = require('../src/index');
var rs = require('./random-string');

var data = window.data = {
    user: {
        list: []
    }
};


new MVVM({
    el: '#app',
    data: data,
    methods: {
        onCover: function () {
            data.user = {
                list: [rs()]
            };
        }
    }
});

