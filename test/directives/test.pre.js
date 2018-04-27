/**
 * 文件描述
 * @author ydr.me
 * @created 2017-01-06 16:47
 */


'use strict';

var MVVM = require('../../src/index');
var utils = require('../utils');


describe('pre', function () {

it('@pre', function (done) {
    var el = utils.createDIV();
    var data = {
        html: '<b></b>'
    };
    el.innerHTML = '<p @pre>{{html}}</p>';
    var mvvm = new MVVM({
        el: el,
        data: data
    });

    expect(el.innerHTML).toEqual('<p>{{html}}</p>');
    data.html = '<i></i>';
    expect(el.innerHTML).toEqual('<p>{{html}}</p>');

    mvvm.destroy();
    utils.removeDIV(el);
    done();
});

});

