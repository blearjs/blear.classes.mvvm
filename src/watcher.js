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
var random = require('blear.utils.random');

var ARRAY_POP = 'pop';
var ARRAY_PUSH = 'push';
var ARRAY_REVERSE = 'reverse';
var ARRAY_SHIFT = 'shift';
var ARRAY_SORT = 'sort';
var ARRAY_UNSHIFT = 'unshift';
var ARRAY_SPLICE = 'splice';
var OVERRIDE_ARRAY_METHODS = [
    ARRAY_POP, ARRAY_PUSH, ARRAY_REVERSE, ARRAY_SHIFT,
    ARRAY_SORT, ARRAY_UNSHIFT, ARRAY_SPLICE
];

var defaults = {};
var Watcher = Events.extend({
    constructor: function (data, options) {
        var the = this;

        the[_options] = object.assign({}, defaults, options);
        the[_linking] = false;
        the[_linked] = false;
        the[_link] = null;
        the[_linkage] = null;
        the[_watchStart](data);
        the[_guid] = random.guid();
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
var _guid = Watcher.sole();
var _linking = Watcher.sole();
var _linked = Watcher.sole();
var _linkage = Watcher.sole();
var _link = Watcher.sole();
var _watchStart = Watcher.sole();
var _watchRegist = Watcher.sole();
var _watchObj = Watcher.sole();
var _watchArr = Watcher.sole();
var _watchObjWithKeyVal = Watcher.sole();
var _broadcast = Watcher.sole();
var _linkWatcher = Watcher.sole();
var _linkageReact = Watcher.sole();
var WATCHER_LIST = Watcher.sole();
var WATCHER_MAP = Watcher.sole();
var LINKAGE_MAP = Watcher.sole();
var odf = object.define;
var pro = Watcher.prototype;


/**
 * 判断数据是否被监听
 * @param data
 * @returns {boolean}
 */
var hasWatch = function (data) {
    var list = data[WATCHER_LIST] || [];
    return list && list.length > 0;
};

/**
 * 监听开始
 * @param data
 */
pro[_watchStart] = function (data) {
    var the = this;

    if (typeis.Array(data)) {
        the[_watchRegist](data);
        the[_watchArr](data);
    } else if (typeis.Object(data)) {
        the[_watchObj](data);
        the[_watchRegist](data);
    }
};


/**
 * 监听注册
 */
pro[_watchRegist] = function (data) {
    var the = this;
    var list = data[WATCHER_LIST];
    var map = data[WATCHER_MAP];

    if (list) {
        var guid = the[_guid];

        if (map[guid]) {
            return;
        }

        map[guid] = the;
        list.push(the);
    } else {
        list = [the];
        // 添加 watcher 列表
        odf(data, WATCHER_LIST, {
            value: list
        });

        // 添加 关联 列表
        odf(data, LINKAGE_MAP, {
            value: {}
        });
    }
};


/**
 * watch 对象
 * @param obj
 */
pro[_watchObj] = function (obj) {
    var the = this;

    object.each(obj, function (key, val) {
        the[_watchObjWithKeyVal](obj, key, val);
    });
};

/**
 * watch 数组
 * @param arr
 */
pro[_watchArr] = function (arr) {
    array.each(OVERRIDE_ARRAY_METHODS, function (index, method) {

    });

    array.each(arr, function (index, val) {

    });
};

/**
 * 精确关联一对一的 get、set，给实例去操作
 * @param obj
 * @param key
 * @param val
 */
pro[_linkWatcher] = function (obj, key, val) {
    // 如果是数组，则挂载在数组上
    var target = typeis.Array(val) ? val : obj;
    var watcherList = target[WATCHER_LIST];
    var linkageList = target[LINKAGE_MAP][key] || [];

    target[LINKAGE_MAP][key] = linkageList;
    array.each(watcherList, function (index, watcher) {
        var link = watcher[_link];

        if (watcher[_linking] && !watcher[_linked]) {
            var linkage = link();

            if (typeis.Function(linkage)) {
                linkageList.push(linkage);
            }
        }
    });
};

/**
 * 关联响应
 * @param any
 * @param key
 * @param args
 */
pro[_linkageReact] = function (any, key, args) {
    var linkaegList = any[LINKAGE_MAP][key] || [];

    array.each(linkaegList, function (index, linkage) {
        linkage.apply(any, args);
    });
};

/**
 * 对应变化广播
 * @param any
 * @param key
 * @param args
 */
pro[_broadcast] = function (any, key, args) {
    var list = any[WATCHER_LIST] || [];

    array.each(list, function (index, watcher) {
        args.unshift('change');
        args.unshift(key);
        watcher.emit.apply(watcher, args);
    });
};

/**
 * 按键值对监听对象
 * @param obj
 * @param key
 * @param val
 */
pro[_watchObjWithKeyVal] = function (obj, key, val) {
    var the = this;
    var oldVal = val;

    if (!hasWatch[obj]) {
        odf(obj, key, {
            enumerable: true,
            get: function () {
                linkWatcher(obj, key, val);
                return oldVal;
            },
            set: function (newVal) {
                if (newVal === oldVal) {
                    return;
                }

                var args1 = [newVal, oldVal, {}];
                var args2 = [newVal, oldVal, {}];
                oldVal = newVal;
                linkageReact(obj, key, args1);
                broadcast(obj, key, args2);
            }
        });
    }

    the[_watchStart](val);
};


Watcher.defaults = defaults;
module.exports = Watcher;
