/**
 * 文件描述
 * @author ydr.me
 * @created 2017-01-06 16:47
 */


'use strict';

var MVVM = require('../../src/index');
var utils = require('../utils');

it('>watch', function (done) {
    var el = utils.createDIV();
    var data = {
        text: 'a'
    };
    el.innerHTML = '{{text}}';
    var stack = [];

    var mvvm = new MVVM({
        el: el,
        data: data,
        watch: {
            text: function (newVal, oldVal) {
                stack.push(newVal);
            }
        }
    });

    data.text = 'b';
    data.text = 'c';
    data.text = 'd';
    data.text = 'e';

    setTimeout(function () {
        expect(stack).toEqual(['b', 'c', 'd', 'e']);

        mvvm.destroy();
        utils.removeDIV(el);
        done();
    }, 10);
});



