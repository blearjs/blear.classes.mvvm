/**
 * 文件描述
 * @author ydr.me
 * @created 2017-01-06 16:47
 */


'use strict';

var event = require('blear.core.event');
var time = require('blear.utils.time');

var MVVM = require('../../src/index');
var utils = require('../utils');

it('@model checkbox single', function (done) {
    var el = utils.createDIV();
    var data = {
        checked: true
    };
    el.innerHTML = '' +
        '<input type="checkbox" @model="checked">' +
        '<p>{{checked}}</p>';
    var inputEl = el.firstElementChild;
    var pEl = inputEl.nextElementSibling;

    new MVVM({
        el: el,
        data: data
    });

    expect(inputEl.checked).toBe(true);
    expect(pEl.innerHTML).toBe('true');

    inputEl.checked = false;
    event.emit(inputEl, 'change');

    time.nextTick(function () {
        data.checked = false;
        expect(inputEl.checked).toBe(false);
        expect(pEl.innerHTML).toBe('false');

        data.checked = true;
        expect(inputEl.checked).toBe(true);
        expect(pEl.innerHTML).toBe('true');

        utils.removeDIV(el);
        done();
    });
});

it('@model checkbox multiple', function (done) {
    var el = utils.createDIV();
    var data = {
        checked: [1]
    };
    el.innerHTML = '' +
        '<input type="checkbox" @model="checked" value="1">' +
        '<input type="checkbox" @model="checked" value="2">' +
        '<input type="checkbox" @model="checked" value="3">' +
        '<input type="checkbox" @model="checked" value="4">' +
        '<p>{{checked}}</p>';
    var input1El = el.firstElementChild;
    var input2El = input1El.nextElementSibling;
    var input3El = input2El.nextElementSibling;
    var input4El = input3El.nextElementSibling;
    var pEl = input4El.nextElementSibling;

    new MVVM({
        el: el,
        data: data
    });

    expect(input1El.checked).toBe(true);
    expect(input2El.checked).toBe(false);
    expect(input3El.checked).toBe(false);
    expect(input4El.checked).toBe(false);
    expect(pEl.innerHTML).toBe('1');

    input3El.checked = true;
    event.emit(input3El, 'change');

    time.nextTick(function () {
        expect(input1El.checked).toBe(true);
        expect(input2El.checked).toBe(false);
        expect(input3El.checked).toBe(true);
        expect(input4El.checked).toBe(false);
        expect(pEl.innerHTML).toBe('1,3');

        data.checked.shift();
        data.checked.push(4);
        expect(input1El.checked).toBe(false);
        expect(input2El.checked).toBe(false);
        expect(input3El.checked).toBe(true);
        expect(input4El.checked).toBe(true);
        expect(pEl.innerHTML).toBe('3,4');

        input3El.checked = false;
        event.emit(input3El, 'change');

        time.nextTick(function () {
            expect(input1El.checked).toBe(false);
            expect(input2El.checked).toBe(false);
            expect(input3El.checked).toBe(false);
            expect(input4El.checked).toBe(true);
            expect(pEl.innerHTML).toBe('4');

            utils.removeDIV(el);
            done();
        });
    });
});


