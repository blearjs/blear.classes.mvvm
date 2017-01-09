/**
 * 文件描述
 * @author ydr.me
 * @created 2017-01-09 15:40
 */


'use strict';

var plan = require('blear.utils.plan');

var MVVM = require('../../src/index');
var utils = require('../utils');

it('>methods', function (done) {
    var el = utils.createDIV();
    el.innerHTML = '<button @click="onClick"></button>';
    var btnEl = el.firstElementChild;
    var getA;
    var mvvm = new MVVM({
        el: el,
        data: {
            a: 1
        },
        methods: {
            onClick: function () {
                getA = this.a++;
            }
        }
    });

    plan
        .taskSync(function () {
            btnEl.click();
        })
        .wait(10)
        .taskSync(function () {
            expect(getA).toBe(1);
            mvvm.destroy();
            btnEl.click();
        })
        .wait(10)
        .taskSync(function () {
            expect(getA).toBe(1);
            utils.removeDIV(el);
        })
        .serial(done);
});


