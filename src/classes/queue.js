/**
 * 响应队列
 * @author ydr.me
 * @created 2017-01-05 00:23
 */


'use strict';

var Events = require('blear.classes.events');
var array = require('blear.utils.array');
var object = require('blear.utils.object');

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
        the[_timer] = null;
    },

    push: function (response, args) {
        var the = this;
        var options = the[_options];
        var guid = response.guid;
        var map = the[_map];
        var queues = the[_list];
        var foundIndex = map[guid];

        console.log(new Date(), 'push queue', guid, args);

        // 同一个响应只运行添加一次
        // 防止同一份数据多次变化影响页面展示
        // 增加这个的原因是 computed 的字段易出现问题，尤其是数组
        if (foundIndex !== undefined) {
            // 直接修改原始的参数
            queues[foundIndex][1] = args;
            return;
        }

        map[guid] = queues.length;
        queues.push([response, args]);
        clearTimeout(the[_timer]);
        the[_timer] = setTimeout(function () {
            array.each(queues, function (index, combin) {
                var res = combin[0];
                var args = combin[1];

                res.respond.apply(res, args);
            });
            the[_list] = [];
            the[_map] = {};
        }, options.tick);
    }
});
var _options = Queue.sole();
var _timer = Queue.sole();
var _list = Queue.sole();
var _map = Queue.sole();

module.exports = Queue;
