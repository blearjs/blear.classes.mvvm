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

it('@model input:text', function (done) {
    var el = utils.createDIV();
    var data = {
        text: 'x'
    };
    el.innerHTML = '<input @model="text"><p>{{text}}</p>';
    var inputEl = el.firstElementChild;
    var pEl = inputEl.nextElementSibling;

    new MVVM({
        el: el,
        data: data
    });

    expect(inputEl.value).toBe('x');
    expect(pEl.innerHTML).toBe('x');

    inputEl.value = 'y';
    event.emit(inputEl, 'input');

    time.nextTick(function () {
        event.emit(inputEl, 'change');

        time.nextTick(function () {
            expect(data.text).toBe('y');
            expect(inputEl.value).toBe('y');
            expect(pEl.innerHTML).toBe('y');

            data.text = 'z';
            expect(inputEl.value).toBe('z');
            expect(pEl.innerHTML).toBe('z');

            utils.removeDIV(el);
            done();
        });
    });
});

it('@model.trim input:text', function (done) {
    var el = utils.createDIV();
    var data = {
        text: 'x'
    };
    el.innerHTML = '<input @model.trim="text"><p>{{text}}</p>';
    var inputEl = el.firstElementChild;
    var pEl = inputEl.nextElementSibling;

    new MVVM({
        el: el,
        data: data
    });

    expect(inputEl.value).toBe('x');
    expect(pEl.innerHTML).toBe('x');

    inputEl.value = 'y    ';
    event.emit(inputEl, 'input');

    time.nextTick(function () {
        event.emit(inputEl, 'change');

        time.nextTick(function () {
            expect(data.text).toBe('y');
            expect(inputEl.value).toBe('y');
            expect(pEl.innerHTML).toBe('y');

            data.text = 'z';
            expect(inputEl.value).toBe('z');
            expect(pEl.innerHTML).toBe('z');

            utils.removeDIV(el);
            done();
        });
    });
});

it('@model.trim input:text', function (done) {
    var el = utils.createDIV();
    var data = {
        text: 1
    };
    el.innerHTML = '<input @model.trim.number="text"><p>{{text}}</p>';
    var inputEl = el.firstElementChild;
    var pEl = inputEl.nextElementSibling;

    new MVVM({
        el: el,
        data: data
    });

    expect(inputEl.value).toBe('1');
    expect(pEl.innerHTML).toBe('1');

    inputEl.value = '2    ';
    event.emit(inputEl, 'input');

    time.nextTick(function () {
        event.emit(inputEl, 'change');

        time.nextTick(function () {
            expect(data.text).toBe(2);
            expect(inputEl.value).toBe('2');
            expect(pEl.innerHTML).toBe('2');

            data.text = 3;
            expect(inputEl.value).toBe('3');
            expect(pEl.innerHTML).toBe('3');

            utils.removeDIV(el);
            done();
        });
    });
});

it('@model textarea', function (done) {
    var el = utils.createDIV();
    var data = {
        text: 'x'
    };
    el.innerHTML = '<textarea @model="text"></textarea><p>{{text}}</p>';
    var inputEl = el.firstElementChild;
    var pEl = inputEl.nextElementSibling;

    new MVVM({
        el: el,
        data: data
    });

    expect(inputEl.value).toBe('x');
    expect(pEl.innerHTML).toBe('x');

    inputEl.value = 'y';
    event.emit(inputEl, 'input');
    time.nextTick(function () {
        event.emit(inputEl, 'change');

        time.nextTick(function () {
            expect(data.text).toBe('y');
            expect(inputEl.value).toBe('y');
            expect(pEl.innerHTML).toBe('y');

            data.text = 'z';
            expect(inputEl.value).toBe('z');
            expect(pEl.innerHTML).toBe('z');

            utils.removeDIV(el);
            done();
        });
    });
});


