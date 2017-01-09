/**
 * 文件描述
 * @author ydr.me
 * @created 2017-01-06 16:47
 */


'use strict';

var event = require('blear.core.event');
var random = require('blear.utils.random');

var MVVM = require('../../src/index');
var utils = require('../utils');

it('@click($el $ev)', function (done) {
    var el = utils.createDIV();
    var data = {
        a: 1
    };
    el.innerHTML = '<p @click="onClick($el, $ev)"></p>';
    var pEl = el.firstElementChild;
    var mvvm = new MVVM({
        el: el,
        data: data,
        methods: {
            onClick: function ($el, $ev) {
                expect(this).toBe(data);
                expect(arguments.length).toBe(2);
                expect($el).toBe(pEl);
                expect($ev.type).toBe('click');
                expect($ev.target).toBe(pEl);

                mvvm.destroy();
                utils.removeDIV(el);
                done();
            }
        }
    });

    pEl.click();
});

it('@click.prevent', function (done) {
    var el = utils.createDIV();
    var data = {
        a: 1,
        hash: random.guid()
    };
    el.innerHTML = '<a :href="\'#\' + hash" @click.prevent="onClick"></a>';
    var pEl = el.firstElementChild;
    var preHash = location.hash;
    var mvvm = new MVVM({
        el: el,
        data: data,
        methods: {
            onClick: function () {
                expect(location.hash).toBe(preHash);

                mvvm.destroy();
                utils.removeDIV(el);
                done();
            }
        }
    });

    pEl.click();
});

it('@click.stop', function (done) {
    var el = utils.createDIV();
    var data = {
        a: 1
    };
    el.innerHTML = '<p @click.stop="onClick"></p>';
    var pEl = el.firstElementChild;
    var bubbled = false;

    event.on(el, 'click', function () {
        bubbled = true;
    });
    var mvvm = new MVVM({
        el: el,
        data: data,
        methods: {
            onClick: function () {
                setTimeout(function () {
                    expect(bubbled).toBe(false);

                    mvvm.destroy();
                    utils.removeDIV(el);
                    done();
                }, 10);
            }
        }
    });

    pEl.click();
});

it('@click.false', function (done) {
    var el = utils.createDIV();
    var data = {
        a: 1,
        hash: random.guid()
    };
    el.innerHTML = '<a :href="\'#\' + hash" @click.false="onClick"></a>';
    var pEl = el.firstElementChild;
    var preHash = location.hash;
    var bubbled = false;

    event.on(el, 'click', function () {
        bubbled = true;
    });

    var mvvm = new MVVM({
        el: el,
        data: data,
        methods: {
            onClick: function () {
                expect(location.hash).toBe(preHash);
                setTimeout(function () {
                    expect(bubbled).toBe(false);

                    mvvm.destroy();
                    utils.removeDIV(el);
                    done();
                }, 10);
            }
        }
    });

    pEl.click();
});

it('@keyup.enter', function (done) {
    var el = utils.createDIV();
    var data = {};
    el.innerHTML = '<input @keyup.enter="onEnter($ev)">';
    var inputEl = el.firstElementChild;
    var triggerTimes = 0;
    var mvvm = new MVVM({
        el: el,
        data: data,
        methods: {
            onEnter: function ($ev) {
                triggerTimes++;
                expect($ev.type).toBe('keyup');
                expect($ev.keyCode).toBe(13);

                setTimeout(function () {
                    expect(triggerTimes).toBe(1);
                    mvvm.destroy();
                    utils.removeDIV(el);
                    done();
                }, 10);
            }
        }
    });

    var ev1 = event.create('keyup');
    ev1.keyCode = 13;
    event.emit(inputEl, ev1);

    var ev2 = event.create('keyup');
    ev2.keyCode = 14;
    event.emit(inputEl, ev2);
});

it('@click destroy', function (done) {
    var el = utils.createDIV();
    var data = {};
    el.innerHTML = '<button @click="onClick"></button>';

    var buttonEl = el.firstElementChild;
    var times = 0;
    var mvvm = new MVVM({
        el: el,
        data: data,
        methods: {
            onClick: function () {
                times++;
            }
        }
    });

    buttonEl.click();
    mvvm.destroy();
    buttonEl.click();

    setTimeout(function () {
        expect(times).toBe(1);
        utils.removeDIV(el);
        done();
    }, 10);
});
