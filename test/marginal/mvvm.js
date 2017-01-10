/**
 * 文件描述
 * @author ydr.me
 * @created 2017-01-10 11:40
 */


'use strict';

var plan = require('blear.utils.plan');

var MVVM = require('../../src/index');
var utils = require('../utils');

it('mvvm 嵌套，父级先销毁', function (done) {
    var el = utils.createDIV();

    el.innerHTML = '<div>{{text}}</div>';
    var firstDivEl = el.firstElementChild;
    var data = {text: 'a'};

    var parentMVVM = new MVVM({
        el: el,
        data: data
    });

    var childEl = document.createElement('div');
    childEl.innerHTML = '{{text}}';
    el.appendChild(childEl);
    var childMVVM = new MVVM({
        el: childEl,
        data: data
    });

    plan
        .taskSync(function () {
            expect(firstDivEl.innerHTML).toBe('a');
            expect(childEl.innerHTML).toBe('a');

            data.text = 'b';
        })
        .wait(10)
        .taskSync(function () {
            expect(firstDivEl.innerHTML).toBe('b');
            expect(childEl.innerHTML).toBe('b');

            parentMVVM.destroy();
            data.text = 'c';
        })
        .wait(10)
        .taskSync(function () {
            expect(firstDivEl.innerHTML).toBe('b');
            expect(childEl.innerHTML).toBe('c');

            childMVVM.destroy();
            data.text = 'd';
        })
        .wait(10)
        .taskSync(function () {
            expect(firstDivEl.innerHTML).toBe('b');
            expect(childEl.innerHTML).toBe('c');

            utils.removeDIV(el);
        })
        .serial(done);
});

it('mvvm 嵌套，子级先销毁', function (done) {
    var el = utils.createDIV();

    el.innerHTML = '<div>{{text}}</div>';
    var firstDivEl = el.firstElementChild;
    var data = {text: 'a'};

    var parentMVVM = new MVVM({
        el: el,
        data: data
    });

    var childEl = document.createElement('div');
    childEl.innerHTML = '{{text}}';
    el.appendChild(childEl);
    var childMVVM = new MVVM({
        el: childEl,
        data: data
    });

    plan
        .taskSync(function () {
            expect(firstDivEl.innerHTML).toBe('a');
            expect(childEl.innerHTML).toBe('a');

            data.text = 'b';
        })
        .wait(10)
        .taskSync(function () {
            expect(firstDivEl.innerHTML).toBe('b');
            expect(childEl.innerHTML).toBe('b');

            childMVVM.destroy();
            data.text = 'c';
        })
        .wait(10)
        .taskSync(function () {
            expect(firstDivEl.innerHTML).toBe('c');
            expect(childEl.innerHTML).toBe('b');

            parentMVVM.destroy();
            data.text = 'd';
        })
        .wait(10)
        .taskSync(function () {
            expect(firstDivEl.innerHTML).toBe('c');
            expect(childEl.innerHTML).toBe('b');

            utils.removeDIV(el);
        })
        .serial(done);
});

it('DOM 游离', function (done) {
    var el = utils.createDIV();

    el.innerHTML =
        '<div>{{text}}</div>' +
        '<div>{{text}}</div>';

    var div0El = el.firstElementChild;
    var div1El = div0El.nextElementSibling;
    var data = {
        text: 'a'
    };
    var mvvm = new MVVM({
        el: el,
        data: data
    });

    plan
        .taskSync(function () {
            expect(div0El.innerHTML).toBe('a');
            expect(div1El.innerHTML).toBe('a');
            document.body.appendChild(div1El);
        })
        .wait(10)
        .taskSync(function () {
            expect(div0El.innerHTML).toBe('a');
            expect(div1El.innerHTML).toBe('a');

            data.text = 'b';
        })
        .wait(10)
        .taskSync(function () {
            expect(div0El.innerHTML).toBe('b');
            expect(div1El.innerHTML).toBe('b');

            mvvm.destroy();
            data.text = 'c';
        })
        .wait(10)
        .taskSync(function () {
            expect(div0El.innerHTML).toBe('b');
            expect(div1El.innerHTML).toBe('b');

            el.appendChild(div1El);
            utils.removeDIV(el);
        })
        .serial(done);
});

