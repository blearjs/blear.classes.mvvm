/**
 * 文件描述
 * @author ydr.me
 * @create 2016-06-27 17:34
 */


'use strict';


var MVVM = require('../src/index');

var data = window.data = {
    html: '<b>你好</b>',
    list: ['<b>再见</b>', '<b>滚</b>']
};

new MVVM({
    el: '#app',
    data: data
});
