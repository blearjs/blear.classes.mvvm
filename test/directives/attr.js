/**
 * 文件描述
 * @author ydr.me
 * @created 2017-01-06 16:47
 */


'use strict';

var plan = require('blear.utils.plan');

var MVVM = require('../../src/index');
var utils = require('../utils');

it(':attr', function (done) {
    var el = utils.createDIV();
    var data = {
        abc: '123',
        def: 456,
        xyz: true
    };
    el.innerHTML = '<p :abc="abc" :readonly="xyz" :def.prop="def" :hidden="xyz"></p>';
    var childEl = el.firstChild;
    var mvvm = new MVVM({
        el: el,
        data: data
    });

    plan
        .wait(10)
        .taskSync(function () {
            expect(childEl.readOnly).toBe(true);
            expect(childEl.readonly).toBe(undefined);
            expect(childEl.getAttribute('abc')).toBe('123');
            data.abc = 456;
        })
        .wait(10)
        .taskSync(function () {
            expect(childEl.getAttribute('abc')).toBe('456');
            data.abc = true;
        })
        .wait(10)
        .taskSync(function () {
            expect(childEl.getAttribute('abc')).toBe('true');
            data.abc = null;
        })
        .wait(10)
        .taskSync(function () {
            expect(childEl.getAttribute('abc')).toBe('');
            expect(childEl.def).toBe(456);
            expect(childEl.hidden).toBe(true);
            mvvm.destroy();
            utils.removeDIV(el);
        })
        .serial(done);
});


