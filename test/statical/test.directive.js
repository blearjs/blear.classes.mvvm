/**
 * 文件描述
 * @author ydr.me
 * @created 2017-01-09 17:07
 */


'use strict';

var plan = require('blear.utils.plan');

var MVVM = require('../../src/index');
var utils = require('../utils');

it('静态指令 abc', function (done) {
    var stack = [];
    var callback = function (v) {
        stack.push(v);
    };

    MVVM.directive('abc', {
        bind: function (node) {
            var directive = this;

            node.onclick = function () {
                callback(directive.get());
            };
        },
        destroy: function () {
            node.onclick = null;
        }
    });

    var el = utils.createDIV();
    el.innerHTML = '<button @abc="a"></button>';
    var btnEl = el.firstElementChild;
    var mvvm = new MVVM({
        el: el,
        data: {
            a: 'a'
        }
    });

    plan
        .taskSync(function () {
            btnEl.click();
        })
        .wait(10)
        .taskSync(function () {
            expect(stack).toEqual(['a']);
            mvvm.destroy();
            btnEl.click();
        })
        .wait(10)
        .taskSync(function () {
            expect(stack).toEqual(['a']);
            utils.removeDIV(el);
        })
        .serial(done);
});

it('静态指令 def', function (done) {
    var stack = [];
    var callback = function (v) {
        stack.push(v);
    };

    MVVM.directive('def', function () {
        callback(this.get());
    });

    var el = utils.createDIV();
    el.innerHTML = '<button @def="a"></button>';
    var data = {
        a: 'a'
    };
    var mvvm = new MVVM({
        el: el,
        data: data
    });

    plan
        .taskSync(function () {
            expect(stack).toEqual(['a']);
            data.a = 'b';
        })
        .wait(10)
        .taskSync(function () {
            expect(stack).toEqual(['a', 'b']);
            mvvm.destroy();
            data.a = 'c';
        })
        .wait(10)
        .taskSync(function () {
            expect(stack).toEqual(['a', 'b']);
            utils.removeDIV(el);
        })
        .serial(done);
});



