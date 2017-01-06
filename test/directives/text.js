/**
 * 文件描述
 * @author ydr.me
 * @created 2017-01-06 16:47
 */


'use strict';

var MVVM = require('../../src/index');
var utils = require('../utils');

it('文本指令', function (done) {
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
    data.text = 3;
    data.text = 4;
    expect(el.innerHTML).toEqual('4');
    utils.removeDIV(el);
    done();
});


