/**
 * 文件描述
 * @author ydr.me
 * @created 2017-01-06 16:47
 */


'use strict';

var event = require('blear.core.event');
var time = require('blear.utils.time');
var howdo = require('blear.utils.howdo');

var MVVM = require('../../src/index');
var utils = require('../utils');

it('@model radio single', function (done) {
    var el = utils.createDIV();
    var data = {
        checked: 1
    };
    el.innerHTML = '' +
        '<input type="radio" name="radio" @model="checked" value="1">' +
        '<input type="radio" name="radio" @model="checked" value="2">' +
        '<input type="radio" name="radio" @model="checked" value="3">' +
        '<input type="radio" name="radio" @model="checked" value="4">' +
        '<p>{{checked}}</p>';
    var input1El = el.firstElementChild;
    var input2El = input1El.nextElementSibling;
    var input3El = input2El.nextElementSibling;
    var input4El = input3El.nextElementSibling;
    var pEl = input4El.nextElementSibling;
    var mvvm = new MVVM({
        el: el,
        data: data
    });

    howdo
        .task(function (next) {
            expect(input1El.checked).toBe(true);
            expect(input2El.checked).toBe(false);
            expect(input3El.checked).toBe(false);
            expect(input4El.checked).toBe(false);
            expect(pEl.innerHTML).toBe('1');

            next();
        })
        .task(function (next) {
            input3El.checked = true;
            event.emit(input3El, 'change');
            utils.wait(next);
        })
        .task(function (next) {
            expect(input1El.checked).toBe(false);
            expect(input2El.checked).toBe(false);
            expect(input3El.checked).toBe(true);
            expect(input4El.checked).toBe(false);
            expect(pEl.innerHTML).toBe('3');

            data.checked = 2;
            expect(input1El.checked).toBe(false);
            expect(input2El.checked).toBe(true);
            expect(input3El.checked).toBe(false);
            expect(input4El.checked).toBe(false);
            expect(pEl.innerHTML).toBe('2');

            mvvm.destroy();
            data.checked = 3;
            expect(input1El.checked).toBe(false);
            expect(input2El.checked).toBe(true);
            expect(input3El.checked).toBe(false);
            expect(input4El.checked).toBe(false);
            expect(pEl.innerHTML).toBe('2');

            next();
        })
        .task(function (next) {
            input4El.checked = true;
            event.emit(input4El, 'change');
            utils.wait(next);
        })
        .task(function (next) {
            expect(data.checked).toBe(3);
            expect(input1El.checked).toBe(false);
            expect(input2El.checked).toBe(false);
            expect(input3El.checked).toBe(false);
            expect(input4El.checked).toBe(true);
            expect(pEl.innerHTML).toBe('2');

            utils.removeDIV(el);
            next();
        })
        .follow(done);
});



