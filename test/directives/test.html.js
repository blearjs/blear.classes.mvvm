/**
 * 文件描述
 * @author ydr.me
 * @created 2017-01-06 16:47
 */


'use strict';

var plan = require('blear.utils.plan');

var MVVM = require('../../src/index');
var utils = require('../utils');

it('@html', function (done) {
    var el = utils.createDIV();
    var data = {
        html: '<b></b>'
    };
    el.innerHTML = '<p @html="html"></p>';
    var mvvm = new MVVM({
        el: el,
        data: data
    });

    plan
        .taskSync(function () {
            expect(el.innerHTML).toEqual('<p><b></b></p>');

            data.html = '<i></i>';
        })
        .wait(10)
        .taskSync(function () {
            expect(el.innerHTML).toEqual('<p><i></i></p>');
            mvvm.destroy();
            utils.removeDIV(el);
        })
        .serial(done);
});


