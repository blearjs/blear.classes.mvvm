/**
 * 文件描述
 * @author ydr.me
 * @create 2016-06-27 17:34
 */


'use strict';

var random = require('blear.utils.random');

var MVVM = require('../src/index');

var data = window.data = {
    html: '1',
    text: '2',
    list: ['3']
};

var mvvm = new MVVM({
    el: '#app',
    data: data
});

// watch 所有变化
mvvm.watch('html + text', function () {

});


document.getElementById('set1').onclick = function () {
    data.html = random.string();
};

document.getElementById('set4').onclick = function () {
    data.text = random.string();
};

document.getElementById('set2').onclick = function () {
    data.list.set(0, random.string());
};

document.getElementById('set3').onclick = function () {
    data.list.push(random.string());
};

document.getElementById('set6').onclick = function () {
    data.list.sort(function () {
        return Math.random() > 0.5;
    });
    console.log(data.list);
};
