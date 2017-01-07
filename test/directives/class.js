/**
 * 文件描述
 * @author ydr.me
 * @created 2017-01-06 16:47
 */


'use strict';

var MVVM = require('../../src/index');
var utils = require('../utils');
var arrCompare = require('../../src/utils/array-compare');


var matchClass = function (a, b) {
    a = a.trim();
    b = b.trim();

    var aa = a.split(/\s+/);
    var bb = b.split(/\s+/);

    if (aa.length !== bb.length) {
        return false;
    }

    var ac = arrCompare(aa, bb);
    return ac.insert.length === 0 && ac.remove.length === 0;
};


it(':class 对象表示', function (done) {
    var el = utils.createDIV();
    var data = {
        abc: '123',
        def: null
    };
    el.innerHTML = '<p class="o" :class="{abc: abc, def: def}"></p>';
    var childEl = el.firstChild;

    new MVVM({
        el: el,
        data: data
    });

    expect(childEl.classList.contains('abc')).toBe(true);
    expect(childEl.classList.contains('def')).toBe(false);
    expect(
        matchClass(
            childEl.className.trim(),
            'o abc'
        )
    ).toBe(true);

    data.abc = 0;
    data.def = 123;
    expect(childEl.classList.contains('abc')).toBe(false);
    expect(childEl.classList.contains('def')).toBe(true);
    expect(
        matchClass(
            childEl.className.trim(),
            'o def'
        )
    ).toBe(true);

    utils.removeDIV(el);
    done();
});

it(':class 数组表示', function (done) {
    var el = utils.createDIV();
    var data = {
        abc: '123',
        def: null
    };
    el.innerHTML = '<p :class="[abc, def]"></p>';
    var childEl = el.firstChild;

    new MVVM({
        el: el,
        data: data
    });

    expect(childEl.classList.contains('123')).toBe(true);
    expect(childEl.className.trim()).toBe('123');

    data.abc = 0;
    data.def = 123;
    expect(
        matchClass(
            childEl.className.trim(),
            '123'
        )
    ).toBe(true);

    data.abc = 'hao';
    data.def = 'ren';
    expect(
        matchClass(
            childEl.className.trim(),
            'hao ren'
        )
    ).toBe(true);

    utils.removeDIV(el);
    done();
});

it(':class 组合表示', function (done) {
    var el = utils.createDIV();
    var data = {
        abc: '123',
        def: null,
        opq: true,
        xyz: false
    };
    el.innerHTML = '<p :class="[abc, def, {opq: opq, xyz: xyz}]"></p>';
    var childEl = el.firstChild;

    new MVVM({
        el: el,
        data: data
    });

    expect(childEl.classList.contains('123')).toBe(true);
    expect(childEl.classList.contains('opq')).toBe(true);
    expect(
        matchClass(
            childEl.className.trim(),
            '123 opq'
        )
    ).toBe(true);

    data.abc = 0;
    data.def = 123;
    expect(matchClass(
        childEl.className.trim(),
        '123 opq'
        )
    ).toBe(true);

    data.abc = 'hao';
    data.def = 'ren';
    expect(matchClass(
        childEl.className.trim(),
        'hao ren opq'
        )
    ).toBe(true);

    data.xyz = true;
    expect(matchClass(
        childEl.className.trim(),
        'hao ren opq xyz'
        )
    ).toBe(true);

    utils.removeDIV(el);
    done();
});

