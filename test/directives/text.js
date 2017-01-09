/**
 * 文件描述
 * @author ydr.me
 * @created 2017-01-06 16:47
 */


'use strict';

var MVVM = require('../../src/index');
var utils = require('../utils');

it('插值', function (done) {
    var el = utils.createDIV();
    var data = {
        text: '1'
    };
    el.innerHTML = '{{text}}';

    var mvvm = new MVVM({
        el: el,
        data: data
    });

    expect(el.innerHTML).toEqual('1');
    data.text = 2;
    expect(el.innerHTML).toEqual('2');

    mvvm.destroy();
    utils.removeDIV(el);
    done();
});

it('* 插值', function (done) {
    var el = utils.createDIV();
    var data = {
        text: '1'
    };
    el.innerHTML = '{{ * text }}-{{text}}';

    var mvvm = new MVVM({
        el: el,
        data: data
    });

    expect(el.innerHTML).toEqual('1-1');
    data.text = 2;
    expect(el.innerHTML).toEqual('1-2');

    mvvm.destroy();
    utils.removeDIV(el);
    done();
});

it('@text', function (done) {
    var el = utils.createDIV();
    var data = {
        text: '1'
    };
    el.innerHTML = '<p @text="text"></p>';

    var mvvm = new MVVM({
        el: el,
        data: data
    });

    expect(el.innerHTML).toEqual('<p>1</p>');
    data.text = 2;
    expect(el.innerHTML).toEqual('<p>2</p>');

    mvvm.destroy();
    utils.removeDIV(el);
    done();
});

it('@text.once', function (done) {
    var el = utils.createDIV();
    var data = {
        text: '1'
    };
    el.innerHTML = '<p @text="text"></p><p @text.once="text"></p>';
    var p1El = el.firstElementChild;
    var p2El = p1El.nextElementSibling;

    var mvvm = new MVVM({
        el: el,
        data: data
    });

    expect(p1El.innerHTML).toBe('1');
    expect(p2El.innerHTML).toBe('1');

    data.text = 2;
    expect(p1El.innerHTML).toBe('2');
    expect(p2El.innerHTML).toBe('1');

    mvvm.destroy();
    utils.removeDIV(el);
    done();
});


