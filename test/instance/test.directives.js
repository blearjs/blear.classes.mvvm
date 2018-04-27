/**
 * 文件描述
 * @author ydr.me
 * @created 2017-01-09 15:40
 */


'use strict';

var plan = require('blear.utils.plan');

var MVVM = require('../../src/index');
var utils = require('../utils');


describe('directives', function () {

it('>directive', function (done) {
    var el = utils.createDIV();
    el.innerHTML = '<button @my-directive1="a" @my-directive2="a"></button>';
    var btnEl = el.firstElementChild;
    var times1 = 0;
    var times2 = 0;
    var times3 = 0;
    var mvvm = new MVVM({
        el: el,
        data: {
            a: 1
        },
        directives: {
            'my-directive1': function () {
                times1++;
            },
            'my-directive2': {
                bind: function () {
                    times2++;
                },
                update: function () {
                    times3++;
                }
            }
        }
    });

    plan
        .taskSync(function () {
            expect(times1).toBe(1);
            expect(times2).toBe(1);
            expect(times3).toBe(0);
        })
        .taskSync(function () {
            data.a++;
            expect(times1).toBe(1);
            expect(times2).toBe(1);
            expect(times3).toBe(1);
        })
        .taskSync(function () {
            mvvm.destroy();
            data.a++;
            expect(times1).toBe(1);
            expect(times2).toBe(1);
            expect(times3).toBe(1);
            utils.removeDIV(el);
        })
        .serial(done);
});

});

