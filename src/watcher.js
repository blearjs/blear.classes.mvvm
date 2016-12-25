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
var ARRAY_SET = 'set';
var ARRAY_REMOVE = 'remove';
var ARRAY_DELETE = 'delete';
var ARRAY_SIZE = 'size';
var OVERRIDE_ARRAY_METHODS = [
    ARRAY_POP, ARRAY_PUSH, ARRAY_REVERSE, ARRAY_SHIFT,
    ARRAY_SORT, ARRAY_UNSHIFT, ARRAY_SPLICE
];
var arrayPrototype = Array.prototype;

var defaults = {};
var Watcher = Events.extend({
    className: 'Watcher',
    constructor: function (data, options) {
        var the = this;

        Watcher.parent(the);
        the[_options] = object.assign({}, defaults, options);
        the[_linking] = false;
        the[_linked] = false;
        the[_link] = null;
        the[_linkage] = null;
        the[_guid] = random.guid();
        the[_watchStart](data);
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
var WATCHED_FLAG = Watcher.sole();
var LINKAGE_MAP = Watcher.sole();
var MOUNT_ARRAY_KEY = Watcher.sole();
var odf = object.define;
var pro = Watcher.prototype;


/**
 * 判断数据是否被监听
 * @param data
 * @returns {boolean}
 */
var hasWatched = function (data) {
    return data[WATCHED_FLAG];
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
        the[_watchRegist](data);
        the[_watchObj](data);
    }
};


/**
 * 监听注册
 * @param data
 */
pro[_watchRegist] = function (data) {
    var the = this;
    var list = data[WATCHER_LIST];
    var map = data[WATCHER_MAP];
    var guid = the[_guid];

    if (list) {
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

        // 添加 watcher MAP
        map = {};
        map[guid] = the;
        odf(data, WATCHER_MAP, {
            value: map
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
    var the = this;

    if (!hasWatched[arr]) {
        array.each(OVERRIDE_ARRAY_METHODS, function (index, method) {
            var original = arrayPrototype[method];

            odf(arr, method, {
                value: function () {
                    var oldVal = [].concat(arr);
                    var oldLength = oldVal.length;
                    var args = access.args(arguments);
                    original.apply(arr, args);
                    var newVal = arr;
                    var spliceIndex = 0;
                    var spliceCount = 0;
                    var insertValue = [];

                    arr.size = arr.length;

                    switch (method) {
                        // [1, 2, 3].push(4, 5, 6);
                        case ARRAY_PUSH:
                            spliceIndex = oldLength;
                            insertValue = args;
                            break;

                        // [1, 2, 3].pop();
                        case ARRAY_POP:
                            spliceIndex = oldLength - 1;
                            spliceCount = 1;
                            break;

                        // [1, 2, 3].unshift(4, 5, 6);
                        case ARRAY_UNSHIFT:
                            insertValue = args;
                            break;

                        // [1, 2, 3].shift();
                        case ARRAY_SHIFT:
                            spliceCount = 1;
                            break;

                        // [1, 2, 3].sort();
                        case ARRAY_SORT:
                            spliceIndex = -1;
                            break;

                        // [1, 2, 3].splice(1, 1, 6);
                        case ARRAY_SPLICE:
                            spliceIndex = args[0];
                            spliceCount = args[1] || 0;
                            insertValue = args.slice(2);
                            break;
                    }

                    var operation = {
                        type: 'array',
                        parent: arr,
                        method: method,
                        spliceIndex: spliceIndex,
                        spliceCount: spliceCount,
                        insertValue: insertValue,
                        oldVal: oldVal,
                        newVal: newVal
                    };
                    var args1 = [newVal, oldVal, operation];
                    var args2 = [newVal, oldVal, operation];

                    the[_linkageReact](arr, MOUNT_ARRAY_KEY, args1);
                    the[_broadcast](arr, MOUNT_ARRAY_KEY, args2);
                }
            });
        });

        odf(arr, WATCHED_FLAG, {
            value: true
        });

        // set index, val
        odf(arr, ARRAY_SET, {
            value: function (index, val) {
                var oldVal = arr[index];

                if (val === oldVal) {
                    return;
                }

                arr.splice(index, 1, val);
            }
        });

        // remove item
        odf(arr, ARRAY_REMOVE, {
            value: function (item) {
                var index = array.indexOf(arr, item);

                if (index > -1) {
                    arr.splice(index, 1);
                }
            }
        });

        // delete index
        odf(arr, ARRAY_DELETE, {
            value: function (index) {
                arr.splice(index, 1);
            }
        });

        odf(arr, ARRAY_SIZE, {
            enumerable: true,
            get: function () {
                return arr.length;
            },
            set: function () {
                // empty
            }
        });
    }

    array.each(arr, function (index, val) {
        the[_watchStart](val);
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
    var isArray = typeis.Array(val);
    var mountTarget = isArray ? val : obj;
    var mountKey = isArray ? MOUNT_ARRAY_KEY : key;
    var watcherList = mountTarget[WATCHER_LIST];
    var linkageList = mountTarget[LINKAGE_MAP][mountKey] || [];

    mountTarget[LINKAGE_MAP][mountKey] = linkageList;
    array.each(watcherList, function (index, watcher) {
        var link = watcher[_link];

        if (watcher[_linking] && !watcher[_linked]) {
            var linkage = link();

            if (typeis.Function(linkage)) {
                watcher[_linked] = true;
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

    if (typeis.Function(val)) {
        return;
    }

    if (!hasWatched[obj]) {
        odf(obj, WATCHED_FLAG, {
            value: true
        });
        odf(obj, key, {
            enumerable: true,
            get: function () {
                the[_linkWatcher](obj, key, val);
                return oldVal;
            },
            set: function (newVal) {
                if (newVal === oldVal) {
                    return;
                }

                var operation = {
                    type: 'object',
                    parent: obj,
                    method: 'set',
                    oldVal: oldVal,
                    newVal: newVal
                };
                var args1 = [newVal, oldVal, operation];
                var args2 = [newVal, oldVal, operation];

                oldVal = newVal;
                the[_linkageReact](obj, key, args1);
                the[_broadcast](obj, key, args2);
            }
        });
    }

    the[_watchStart](val);
};


Watcher.defaults = defaults;
module.exports = Watcher;
