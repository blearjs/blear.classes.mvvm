/**
 * 文件描述
 * @author ydr.me
 * @created 2017-01-06 16:47
 */


'use strict';

var plan = require('blear.utils.plan');

var MVVM = require('../../src/index');
var utils = require('../utils');


describe('if for', function () {

it('@if 嵌套 @for，初始为 false', function (done) {
    var el = utils.createDIV();
    var data = {
        bool: false,
        list: [1, 2]
    };
    el.innerHTML =
        '<p @if="bool" @for="item in list">{{item}}</p>';
    var pEl = el.firstElementChild;
    var mvvm = new MVVM({
        el: el,
        data: data
    });

    plan
        .taskSync(function () {
            expect(el.innerHTML).toBe('');
            expect(pEl.hasAttribute('@if')).toBe(false);
            expect(pEl.hasAttribute('@for')).toBe(true);
            expect(pEl.innerHTML).toBe('{{item}}');

            data.bool = 1;
        })
        .wait(10)
        .taskSync(function () {
            expect(el.innerHTML).toBe(
                '<p>1</p>' +
                '<p>2</p>'
            );
            expect(pEl.hasAttribute('@if')).toBe(false);
            expect(pEl.hasAttribute('@for')).toBe(false);
            expect(pEl.innerHTML).toBe('{{item}}');

            mvvm.destroy();
            utils.removeDIV(el);
        })
        .serial(done);
});

it('@if 嵌套 @for，初始为 true', function (done) {
    var el = utils.createDIV();
    var data = {
        list: [1, 2]
    };
    el.innerHTML =
        '<p @if="list.length" @for="item in list">{{item}}</p>';
    var pEl = el.firstElementChild;
    var mvvm = new MVVM({
        el: el,
        data: data
    });

    plan
        .taskSync(function () {
            expect(el.innerHTML).toBe(
                '<p>1</p>' +
                '<p>2</p>'
            );
            expect(pEl.hasAttribute('@if')).toBe(false);
            expect(pEl.hasAttribute('@for')).toBe(false);
            expect(pEl.innerHTML).toBe('{{item}}');

            mvvm.destroy();
            utils.removeDIV(el);
        })
        .serial(done);
});

});

