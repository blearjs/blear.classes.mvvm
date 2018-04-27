/**
 * 文件描述
 * @author ydr.me
 * @created 2017-01-06 16:47
 */


'use strict';

var plan = require('blear.utils.plan');

var MVVM = require('../../src/index');
var utils = require('../utils');


describe('watch', function () {

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

    plan
        .taskSync(function () {
            data.text = 'b';
            data.text = 'c';
            data.text = 'd';
            data.text = 'e';
        })
        .wait(10)
        .taskSync(function () {
            expect(stack).toEqual(['b', 'c', 'd', 'e']);
            mvvm.destroy();
            utils.removeDIV(el);
        })
        .serial(done);
});

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
            text: {
                imme: true,
                handle: function (newVal, oldVal) {
                    stack.push(newVal);
                }
            }
        }
    });

    plan
        .taskSync(function () {
            data.text = 'b';
            data.text = 'c';
            data.text = 'd';
            data.text = 'e';
        })
        .wait(10)
        .taskSync(function () {
            expect(stack).toEqual(['a', 'b', 'c', 'd', 'e']);
            mvvm.destroy();
            utils.removeDIV(el);
        })
        .serial(done);
});

it('#watch', function (done) {
    var el = utils.createDIV();
    var data = {
        text: 'a'
    };
    el.innerHTML = '{{text}}';
    var stack = [];

    var mvvm = new MVVM({
        el: el,
        data: data
    });

    var unwatch = mvvm.watch('text', function (newVal) {
        stack.push(newVal);
    });

    plan
        .taskSync(function () {
            data.text = 'b';
            data.text = 'c';
        })
        .wait(10)
        .taskSync(function () {
            unwatch();
            data.text = 'd';
            data.text = 'e';
        })
        .wait(10)
        .taskSync(function () {
            expect(stack).toEqual(['b', 'c']);
            mvvm.destroy();
            utils.removeDIV(el);
        })
        .serial(done);
});


});

