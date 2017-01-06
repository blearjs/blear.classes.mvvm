/**
 * 文件描述
 * @author ydr.me
 * @created 2017-01-06 16:47
 */


'use strict';

var MVVM = require('../../src/index');
var utils = require('../utils');

it(':style', function (done) {
    var el = utils.createDIV();
    var data = {
        borderWidth: 3,
        paddingLeft: 4
    };
    el.innerHTML = '<p style="width:1px;" ' +
        ':style="{height: \'2px\', border-left-width: borderWidth,paddingLeft:paddingLeft}"></p>';
    var firstEl = el.firstElementChild;

    new MVVM({
        el: el,
        data: data
    });

    expect(firstEl.style.width).toEqual('1px');
    expect(firstEl.style.height).toEqual('2px');
    expect(firstEl.style.borderLeftWidth).toEqual('3px');
    expect(firstEl.style.paddingLeft).toEqual('4px');
    expect(firstEl.style.length).toEqual(4);

    data.paddingLeft += 1;
    expect(firstEl.style.width).toEqual('1px');
    expect(firstEl.style.height).toEqual('2px');
    expect(firstEl.style.borderLeftWidth).toEqual('3px');
    expect(firstEl.style.paddingLeft).toEqual('5px');

    done();
});


