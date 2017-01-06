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

    new MVVM({
        el: el,
        data: data
    });

    expect(el.innerHTML).toEqual('1');
    data.text = 2;
    expect(el.innerHTML).toEqual('2');
    utils.removeDIV(el);
    done();
});

it('@text', function (done) {
    var el = utils.createDIV();
    var data = {
        text: '1'
    };
    el.innerHTML = '<p @text="text"></p>';

    new MVVM({
        el: el,
        data: data
    });

    expect(el.innerHTML).toEqual('<p>1</p>');
    data.text = 2;
    expect(el.innerHTML).toEqual('<p>2</p>');
    utils.removeDIV(el);
    done();
});


