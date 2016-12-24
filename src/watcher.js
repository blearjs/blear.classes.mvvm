/**
 * classes/Watcher
 * @author ydr.me
 * @create 2016-05-03 17:26
 */



'use strict';

var Events = require('blear.classes.events');
var object = require('blear.utils.object');
var array = require('blear.utils.array');
var typeis = require('blear.utils.typeis');
var access = require('blear.utils.access');

var ARRAY_POP = 'pop';
var ARRAY_PUSH = 'push';
var ARRAY_REVERSE = 'reverse';
var ARRAY_SHIFT = 'shift';
var ARRAY_SORT = 'sort';
var ARRAY_UNSHIFT = 'unshift';
var ARRAY_SPLICE = 'splice';
var OVERRIDE_ARRAY_PROTOS = [
    ARRAY_POP, ARRAY_PUSH, ARRAY_REVERSE, ARRAY_SHIFT,
    ARRAY_SORT, ARRAY_UNSHIFT, ARRAY_SPLICE
];

var defaults = {
    linkage: function () {

    }
};
var Watcher = Events.extend({
    constructor: function (obj, options) {
        var the = this;

        if (!typeis.Object(obj)) {
            throw new TypeError('只能监听对象');
        }

        the[_options] = object.assign({}, defaults, options);
        watchObject(obj, the);
    }
});
var _options = Watcher.sole();

Watcher.defaults = defaults;
module.exports = Watcher;


var WATCHER_LIST = Watcher.sole();
var BROADCAST = Watcher.sole();
var odf = object.define;

function watchObject(obj, watcher) {
    var list = watcher[WATCHER_LIST];
    var options = watcher[_options];

    if (!list) {
        list = [];
        // 添加 watcher 列表
        odf(obj, WATCHER_LIST, {
            value: list
        });

        // 添加广播方法
        odf(obj, BROADCAST, {
            value: function () {
                console.log(list);
                debugger;
            }
        });
    }

    list.push(watcher);

    watchObj(obj);

    // 2. watch 对象
    function watchObj(obj) {
        object.each(obj, function (key, val) {
            watchObjWithKeyVal(obj, key, val);
        });
    }

    // 3. watch 数组
    function watchArr(arr) {
        object.each(arr, function (key, val) {

        });
    }

    function watchObjWithKeyVal(obj, key, val) {
        var oldVal = val;

        odf(obj, key, {
            enumerable: true,
            get: function () {
                return oldVal;
            },
            set: function (newVal) {
                if (newVal === oldVal) {
                    return;
                }

                oldVal = newVal;
            }
        });
    }
}
