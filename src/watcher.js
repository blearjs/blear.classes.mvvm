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
        the.data = data;
        the[_options] = object.assign({}, defaults, options);
        the[_linking] = false;
        the[_linker] = null;
        the[_linkageList] = [];
        the[_guid] = random.guid();
        the[_watchStart](data);
    },
    watch: function (callback) {

    },

    /**
     * 私有方法，仅限制 blear 模块之间调用，
     * 除非你知道如何使用，
     * link 方法将数据获取与源头字段一一关联，
     * 需要使用者自己处理监听的 watcher 是否一致。
     *
     * @param callback
     * @returns {*}
     * @private
     */
    _link: function (callback) {
        var the = this;

        if (the[_linking]) {
            return;
        }

        the[_linking] = true;
        the[_linker] = fun.noop(callback);
    },


    /**
     * 私有方法，仅限制 blear 模块之间调用，
     * 在处理完成精确数据变化监听关系之后断开连接。
     *
     * @private
     */
    _linkEnd: function () {
        this[_linkend] = true;
    },


    /**
     * 销毁观察
     */
    destroy: function () {
        var the = this;

        the[_watchEnd](the.data);
        the[_dropLinkage]();
        the[_linkageList] = the[_linker] = the.data = null;
        Watcher.invoke('destroy', the);
    }
});
var _options = Watcher.sole();
var _guid = Watcher.sole();
var _linking = Watcher.sole();
var _linker = Watcher.sole();
var _linkend = Watcher.sole();
var _linkageList = Watcher.sole();
var _watchStart = Watcher.sole();
var _watchEnd = Watcher.sole();
var _onWatch = Watcher.sole();
var _unWatch = Watcher.sole();
var _onWatchObj = Watcher.sole();
var _unWatchObj = Watcher.sole();
var _onWatchArr = Watcher.sole();
var _unWatchArr = Watcher.sole();
var _onWatchObjWithKeyVal = Watcher.sole();
var _unWatchObjWithKeyVal = Watcher.sole();
var _broadcast = Watcher.sole();
var _linkWatcher = Watcher.sole();
var _linkageReact = Watcher.sole();
var _dropLinkage = Watcher.sole();
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
 * 观察开始
 * @param data
 */
pro[_watchStart] = function (data) {
    var the = this;

    if (typeis.Array(data)) {
        the[_onWatch](data);
        the[_onWatchArr](data);
    } else if (typeis.Object(data)) {
        the[_onWatch](data);
        the[_onWatchObj](data);
    }
};

/**
 * 取消观察
 * @param data
 */
pro[_watchEnd] = function (data) {
    var the = this;

    if (typeis.Array(data)) {
        the[_unWatch](data);
        the[_onWatchArr](data);
    } else if (typeis.Object(data)) {
        the[_unWatch](data);
        the[_unWatchObj](data);
    }
};

/**
 * 删除关联函数
 */
pro[_dropLinkage] = function () {
    var the = this;

    array.each(the[_linkageList], function (index, config) {
        var linkage = config.l;
        var obj = config.o;
        var key = config.k;
        var list = obj[LINKAGE_MAP][key];
        array.delete(list, linkage, true);
    });
};


/**
 * 监听注册
 * @param data
 */
pro[_onWatch] = function (data) {
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
 * 监听取消
 * @param data
 */
pro[_unWatch] = function (data) {
    var the = this;
    var list = data[WATCHER_LIST];
    var map = data[WATCHER_MAP];

    if (!list) {
        return;
    }

    var guid = the[_guid];
    var found = map[guid];

    if (!found) {
        return;
    }

    map[guid] = null;
    array.delete(list, the);
};


/**
 * watch 对象
 * @param obj
 */
pro[_onWatchObj] = function (obj) {
    var the = this;

    object.each(obj, function (key, val) {
        the[_onWatchObjWithKeyVal](obj, key, val);
    });
};

/**
 * unwatch 对象
 * @param obj
 */
pro[_unWatchObj] = function (obj) {
    var the = this;

    object.each(obj, function (key, val) {
        the[_unWatchObjWithKeyVal](obj, key, val);
    });
};


/**
 * 按键值对监听对象
 * @param obj
 * @param key
 * @param val
 */
pro[_onWatchObjWithKeyVal] = function (obj, key, val) {
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


/**
 * 按键值对取消监听
 * @param obj
 * @param key
 * @param val
 */
pro[_unWatchObjWithKeyVal] = function (obj, key, val) {
    var the = this;

    if (typeis.Function(val)) {
        return;
    }

    the[_watchEnd](val);
};


/**
 * watch 数组
 * @param arr
 */
pro[_onWatchArr] = function (arr) {
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

        // delete index
        odf(arr, ARRAY_DELETE, {
            value: function (item) {
                var index = array.indexOf(arr, item);

                if (index > -1) {
                    arr.splice(index, 1);
                }
            }
        });

        // remove index
        odf(arr, ARRAY_REMOVE, {
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
 * unwatch 数组
 * @param arr
 */
pro[_unWatchArr] = function (arr) {
    var the = this;

    array.each(arr, function (index, val) {
        the[_watchEnd](val);
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
        var link = watcher[_linker];

        if (watcher[_linking] && !watcher[_linkend]) {
            var linkage = link();

            if (typeis.Function(linkage)) {
                linkageList.push(linkage);
                // 将 linkage 添加到 watcher 里便于销毁
                watcher[_linkageList].push({
                    l: linkage,
                    o: obj,
                    k: key
                });
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


Watcher.defaults = defaults;
module.exports = Watcher;
