/**
 * 文件描述
 * @author ydr.me
 * @created 2017-01-06 16:47
 */


'use strict';

var plan = require('blear.utils.plan');

var MVVM = require('../../src/index');
var utils = require('../utils');


describe('if', function () {

it('@if 懒编译特性', function (done) {
    var el = utils.createDIV();
    var data = {
        bool: false,
        text: 'a'
    };
    el.innerHTML = '<p @if="bool">{{text}}</p><span @if="!bool">{{text}}</span>';
    var pEl = el.firstElementChild;
    var spanEl = pEl.nextElementSibling;
    var mvvm = new MVVM({
        el: el,
        data: data
    });

    plan
        .taskSync(function () {
            expect(el.innerHTML).toBe('<span>a</span>');
            expect(pEl.innerHTML).toBe('{{text}}');
            expect(spanEl.innerHTML).toBe('a');

            data.bool = true;
        })
        .wait(10)
        .taskSync(function () {
            expect(el.innerHTML).toBe('<p>a</p>');
            expect(pEl.innerHTML).toBe('a');
            expect(spanEl.innerHTML).toBe('a');

            mvvm.destroy();
            utils.removeDIV(el);
        })
        .serial(done);
});

it('@if 嵌套 @if', function (done) {
    var el = utils.createDIV();
    var data = {
        bool1: false,
        bool2: false,
        text: 'a'
    };
    el.innerHTML =
        '<div @if="bool1">' +
        /****/'<p>{{text}}</p>' +
        /****/'<p @if="bool2">{{text}}</p>' +
        '</div>';
    var divEl = el.firstElementChild;
    var p1El = divEl.firstElementChild;
    var p2El = p1El.nextElementSibling;
    var mvvm = new MVVM({
        el: el,
        data: data
    });

    plan
        .taskSync(function () {
            expect(el.innerHTML).toBe('');
            expect(p1El.innerHTML).toBe('{{text}}');
            expect(p2El.innerHTML).toBe('{{text}}');
            expect(divEl.hasAttribute('@if')).toBe(false);
            expect(p2El.hasAttribute('@if')).toBe(true);

            data.bool1 = true;
        })
        .wait(10)
        .taskSync(function () {
            expect(el.innerHTML).toBe(
                '<div>' +
                /****/'<p>a</p>' +
                '</div>'
            );
            expect(p1El.innerHTML).toBe('a');
            expect(p2El.innerHTML).toBe('{{text}}');
            expect(divEl.hasAttribute('@if')).toBe(false);
            expect(p2El.hasAttribute('@if')).toBe(false);

            data.bool2 = true;
        })
        .wait(10)
        .taskSync(function () {
            expect(el.innerHTML).toBe(
                '<div>' +
                /****/'<p>a</p>' +
                /****/'<p>a</p>' +
                '</div>'
            );
            expect(p1El.innerHTML).toBe('a');
            expect(p2El.innerHTML).toBe('a');
            expect(divEl.hasAttribute('@if')).toBe(false);
            expect(p2El.hasAttribute('@if')).toBe(false);

            data.bool1 = false;
        })
        .wait(10)
        .taskSync(function () {
            expect(el.innerHTML).toBe('');
            expect(p1El.innerHTML).toBe('a');
            expect(p2El.innerHTML).toBe('a');
            expect(divEl.hasAttribute('@if')).toBe(false);
            expect(p2El.hasAttribute('@if')).toBe(false);

            mvvm.destroy();
            utils.removeDIV(el);
        })
        .serial(done);
});

it('@if', function (done) {
    var el = utils.createDIV();
    var data = {
        bool: true
    };
    el.innerHTML = '<p @if="bool">1</p>';
    var mvvm = new MVVM({
        el: el,
        data: data
    });

    plan
        .taskSync(function () {
            expect(el.innerHTML).toEqual('<p>1</p>');
            data.bool = false;
        })
        .wait(10)
        .taskSync(function () {
            expect(el.innerHTML).toEqual('');

            mvvm.destroy();
            utils.removeDIV(el);
        })
        .serial(done);
});

it('@if + @else', function (done) {
    var el = utils.createDIV();
    var data = {
        bool: true
    };
    el.innerHTML = '<p @if="bool">1</p><p @else>2</p>';

    var mvvm = new MVVM({
        el: el,
        data: data
    });

    plan
        .taskSync(function () {
            expect(el.innerHTML).toEqual('<p>1</p>');
            data.bool = false;
        })
        .wait(10)
        .taskSync(function () {
            expect(el.innerHTML).toEqual('<p>2</p>');

            mvvm.destroy();
            utils.removeDIV(el);
        })
        .serial(done);
});

it('@if + @else-if', function (done) {
    var el = utils.createDIV();
    var data = {
        bool1: false,
        bool2: true
    };
    el.innerHTML = '<p @if="bool1">1</p><p @else-if="bool2">2</p>';

    var mvvm = new MVVM({
        el: el,
        data: data
    });

    plan
        .taskSync(function () {
            expect(el.innerHTML).toEqual('<p>2</p>');
            data.bool1 = true;
        })
        .wait(10)
        .taskSync(function () {
            expect(el.innerHTML).toEqual('<p>1</p>');

            mvvm.destroy();
            utils.removeDIV(el);
        })
        .serial(done);
});

it('@if + @else-if + @else', function (done) {
    var el = utils.createDIV();
    var data = {
        bool1: false,
        bool2: false
    };
    el.innerHTML = '' +
        '<p @if="bool1">1</p>' +
        '<p @else-if="bool2">2</p>' +
        '<p @else>3</p>' +
        '';

    var mvvm = new MVVM({
        el: el,
        data: data
    });

    plan
        .taskSync(function () {
            expect(el.innerHTML).toEqual('<p>3</p>');

            data.bool1 = true;
        })
        .wait(10)
        .taskSync(function () {
            expect(el.innerHTML).toEqual('<p>1</p>');

            data.bool1 = false;
            data.bool2 = true;
        })
        .wait(10)
        .taskSync(function () {
            expect(el.innerHTML).toEqual('<p>2</p>');

            mvvm.destroy();
            utils.removeDIV(el);
        })
        .serial(done);
});

});

