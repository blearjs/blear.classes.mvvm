/**
 * 文件描述
 * @author ydr.me
 * @create 2016-06-27 17:34
 */


'use strict';

var MVVM = require('../src/index');

var model = window.model = {
    html: '<b>Hello World!</b>'
};
new MVVM({
    view: '#app',
    model: model
});


