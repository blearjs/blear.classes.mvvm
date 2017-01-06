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

it('@model select single', function (done) {
    var el = utils.createDIV();
    var data = {
        selected: '2'
    };
    el.innerHTML = '' +
        '<select @model="selected">' +
        '<option value="1">1</option>' +
        '<option value="2">2</option>' +
        '<option value="3">3</option>' +
        '<option value="4">4</option>' +
        '</select>' +
        '<p>{{selected}}</p>';
    var selectEl = el.firstElementChild;
    var pEl = selectEl.nextElementSibling;

    new MVVM({
        el: el,
        data: data
    });

    expect(selectEl.value).toBe('2');
    expect(selectEl.selectedOptions.length).toBe(1);
    expect(selectEl.selectedOptions[0].value).toBe('2');
    expect(pEl.innerHTML).toBe('2');

    selectEl.options[2].selected = true;
    event.emit(selectEl, 'change');

    time.nextTick(function () {
        expect(selectEl.value).toBe('3');
        expect(selectEl.selectedOptions.length).toBe(1);
        expect(selectEl.selectedOptions[0].value).toBe('3');
        expect(pEl.innerHTML).toBe('3');
        expect(data.selected).toBe('3');

        data.selected = 1;
        expect(selectEl.value).toBe('1');
        expect(selectEl.selectedOptions.length).toBe(1);
        expect(selectEl.selectedOptions[0].value).toBe('1');
        expect(pEl.innerHTML).toBe('1');

        utils.removeDIV(el);
        done();
    });
});

it('@model select multiple', function (done) {
    var el = utils.createDIV();
    var data = {
        selected: ['2', 4]
    };
    el.innerHTML = '' +
        '<select @model="selected" multiple>' +
        '<option value="1">1</option>' +
        '<option value="2">2</option>' +
        '<option value="3">3</option>' +
        '<option value="4">4</option>' +
        '</select>' +
        '<p>{{selected}}</p>';
    var selectEl = el.firstElementChild;
    var pEl = selectEl.nextElementSibling;

    new MVVM({
        el: el,
        data: data
    });

    expect(selectEl.value).toBe('2');
    expect(selectEl.selectedOptions.length).toBe(2);
    expect(selectEl.selectedOptions[0].value).toBe('2');
    expect(selectEl.selectedOptions[1].value).toBe('4');
    expect(pEl.innerHTML).toBe('2,4');

    selectEl.options[0].selected = true;
    event.emit(selectEl, 'change');

    time.nextTick(function () {
        expect(selectEl.selectedOptions.length).toBe(3);
        expect(selectEl.selectedOptions[0].value).toBe('1');
        expect(selectEl.selectedOptions[1].value).toBe('2');
        expect(selectEl.selectedOptions[2].value).toBe('4');
        expect(pEl.innerHTML).toBe('2,4,1');

        data.selected = [];
        expect(selectEl.value).toBe('');
        expect(selectEl.selectedOptions.length).toBe(0);
        expect(pEl.innerHTML).toBe('');

        utils.removeDIV(el);
        done();
    });
});

