/**
 * karma 测试 文件
 * @author ydr.me
 * @create 2016-05-17 12:13
 */


'use strict';


var MVVM = require('../src/index.js');

describe('blear.classes.mvvm', function () {
    it('样式独立', function () {
        var el1 = document.createElement('div');
        var el2 = document.createElement('div');
        el1.id = 'demo1';
        document.body.appendChild(el1);
        // document.body.appendChild(el2);
        var mv1 = new MVVM({
            el: '#demo1',
            data: {},
            template: '<p>p</p>',
            style: 'p{width:100px;}'
        });
        // var mv2 = new MVVM({
        //     el: el2,
        //     template: '<p></p>',
        //     style: 'p{width:100px;}'
        // });


    });
});