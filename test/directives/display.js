/**
 * 文件描述
 * @author ydr.me
 * @created 2017-01-06 16:47
 */


'use strict';

var plan = require('blear.utils.plan');

var MVVM = require('../../src/index');
var utils = require('../utils');

it('@show @hide', function (done) {
    var el = utils.createDIV();
    var data = {
        bool: true,
        text: 'a'
    };
    el.innerHTML = '' +
        '<a @show="bool">{{text}}</a>' +
        '<b @hide="bool">{{text}}</b>';
    var aEl = el.firstElementChild;
    var bEl = aEl.nextElementSibling;
    var mvvm = new MVVM({
        el: el,
        data: data
    });

    plan
        .taskSync(function () {
            expect(aEl.innerHTML).toBe('a');
            expect(bEl.innerHTML).toBe('a');
            expect(aEl.style.display).toBe('block');
            expect(bEl.style.display).toBe('none');
            data.bool = false;
        })
        .wait()
        .taskSync(function () {
            expect(aEl.innerHTML).toBe('a');
            expect(bEl.innerHTML).toBe('a');
            expect(aEl.style.display).toBe('none');
            expect(bEl.style.display).toBe('block');
            mvvm.destroy();
            utils.removeDIV(el);
        })
        .serial(done);
});


