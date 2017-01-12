/**
 * 响应队列
 * @author ydr.me
 * @created 2017-01-05 00:23
 */


'use strict';

var Events = require('blear.classes.events');
var array = require('blear.utils.array');
var object = require('blear.utils.object');
var time = require('blear.utils.time');

var defaults = {
    tick: 10
};
var Queue = Events.extend({
    className: 'Queue',
    constructor: function (options) {
        var the = this;

        the[_options] = object.assign({}, defaults, options);
        the[_list] = [];
        the[_map] = {};
    },

    push: function (responder, newVal, oldVal, signal) {
        var the = this;
        var options = the[_options];
        var guid = responder.guid;
        var foundIndex = the[_map][guid];

        // 同一个响应只运行添加一次
        // 防止同一份数据多次变化影响页面展示
        // 增加这个的原因是 computed 的字段易出现问题，尤其是数组
        if (foundIndex !== undefined) {
            // 直接修改原始的参数，**需要改变的是新值和信号值，旧值不能变化**
            the[_list][foundIndex][1] = newVal;
            the[_list][foundIndex][3] = signal;
            return;
        }

        the[_map][guid] = the[_list].length;
        the[_list].push([responder, newVal, oldVal, signal]);
        time.nextTick(function () {
            var queues = the[_list];
            the[_list] = [];
            the[_map] = {};
            array.each(queues, function (index, combin) {
                var responder = combin[0];
                var newVal = combin[1];
                var oldVal = combin[2];
                var signal = combin[3];

                // responder 已经断开
                if (responder.unlinked) {
                    return;
                }

                responder.speak(newVal, oldVal, signal);
            });
        });
    }
});
var _options = Queue.sole();
var _list = Queue.sole();
var _map = Queue.sole();

module.exports = Queue;
