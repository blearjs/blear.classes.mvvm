/**
 * 文件描述
 * @author ydr.me
 * @created 2017-01-10 11:40
 */


'use strict';

var plan = require('blear.utils.plan');
var random = require('blear.utils.random');

var MVVM = require('../../src/index');
var utils = require('../utils');


it('数据连续 DOM 变动只更新一次', function (done) {
    var el = utils.createDIV();
    var data = {text: ''};
    el.innerHTML = '<div :data-text="text"></div>';
    var divEl = el.firstElementChild;
    var mvvm = new MVVM({
        el: el,
        data: data
    });
    var mutatedTimes = 0;
    var observer = new MutationObserver(function (mutations) {
        console.log('observer change', new Date());
        mutatedTimes += mutations.length;
        mutations.forEach(function (mutation) {
            console.log(mutation);
        });
    });

    observer.observe(divEl, {
        attributes: true
    });

    plan
        .taskSync(function () {
            var count = 10;
            while (count--) {
                data.text = random.guid();
            }
        })
        .wait(10)
        .taskSync(function () {
            expect(mutatedTimes).toBe(1);
            expect(divEl.dataset.text).toBe(data.text + '');
            observer.disconnect();
            mvvm.destroy();
        })
        .serial(done);
});

