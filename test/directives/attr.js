/**
 * 文件描述
 * @author ydr.me
 * @created 2017-01-06 16:47
 */


'use strict';

var MVVM = require('../../src/index');
var utils = require('../utils');

it(':attr', function (done) {
    var el = utils.createDIV();
    var data = {
        abc: '123',
        def: 456,
        xyz: true
    };
    el.innerHTML = '<p :abc="abc"></p>';
    var childEl = el.firstChild;

    new MVVM({
        el: el,
        data: data
    });

    expect(childEl.getAttribute('abc')).toBe('123');
    data.abc = 456;
    expect(childEl.getAttribute('abc')).toBe('456');
    // data.abc = true;
    // expect(childEl.getAttribute('abc')).toBe('true');
    // data.abc = null;
    // expect(childEl.getAttribute('abc')).toBe('');
    //
    // expect(childEl.def).toBe(456);
    // expect(childEl.hidden).toBe(true);

    utils.removeDIV(el);
    done();
});


