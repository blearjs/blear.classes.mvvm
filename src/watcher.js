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
var fun = require('blear.utils.function');

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

var defaults = {};
var Watcher = Events.extend({
    constructor: function (obj, options) {
        var the = this;

        if (!typeis.Object(obj)) {
            throw new TypeError('只能监听对象');
        }

        the[_options] = object.assign({}, defaults, options);
        the[_linking] = false;
        the[_linked] = false;
        the[_link] = null;
        the[_linkage] = null;
        watch(obj, the);
    },
    watch: function (callback) {

    },
    link: function (callback) {
        var the = this;

        if (the[_linking]) {
            return the;
        }

        the[_linking] = true;
        the[_link] = fun.noop(callback);
    }
});
var _options = Watcher.sole();
var _linking = Watcher.sole();
var _linked = Watcher.sole();
var _linkage = Watcher.sole();
var _link = Watcher.sole();

Watcher.defaults = defaults;
module.exports = Watcher;


var WATCHER_LIST = Watcher.sole();
var BROADCAST = Watcher.sole();
var LINKAGE_LIST = Watcher.sole();
var odf = object.define;

function watch(obj, watcher) {
    var list = obj[WATCHER_LIST];

    if (list) {
        list.push(watcher);
        return;
    } else {
        list = [watcher];
        // 添加 watcher 列表
        odf(obj, WATCHER_LIST, {
            value: list
        });

        // 添加 关联 列表
        odf(obj, LINKAGE_LIST, {
            value: []
        });

        // 添加广播方法
        odf(obj, BROADCAST, {
            value: function () {
                console.log(list);
                debugger;
            }
        });
    }

    watchObj(obj);
}


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


/**
 * 关联一对一的 get、set，给实例去操作，一个 watcher 只能有一个 linkage
 * @param obj
 */
function linkWatcher(obj) {
    var watcherList = obj[WATCHER_LIST];
    var linkageList = obj[LINKAGE_LIST];

    array.each(watcherList, function (index, watcher) {
        var link = watcher[_link];

        if (watcher[_linking] && !watcher[_linked]) {
            var linkage = link();

            if (typeis.Function(linkage)) {
                debugger;
                linkageList.push(linkage);
            }
        }
    });
}


/**
 * 响应
 * @param obj
 * @param newVal
 * @param oldVal
 */
function linkageReact(obj, newVal, oldVal) {
    var linkaegList = obj[LINKAGE_LIST];

    array.each(linkaegList, function (index, linkage) {
        // 不保证精确
        linkage(newVal, oldVal);
    });
}

/**
 * 按键值对监听对象
 * @param obj
 * @param key
 * @param val
 */
function watchObjWithKeyVal(obj, key, val) {
    var oldVal = val;

    odf(obj, key, {
        enumerable: true,
        get: function () {
            linkWatcher(obj);
            return oldVal;
        },
        set: function (newVal) {
            if (newVal === oldVal) {
                return;
            }

            linkageReact(obj, newVal, oldVal);
            oldVal = newVal;
        }
    });
}