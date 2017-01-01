/**
 * 观察 object
 * @author ydr.me
 * @created 2016-12-30 12:38
 */


'use strict';

var object = require('blear.utils.object');
var array = require('blear.utils.array');
var random = require('blear.utils.random');
var typeis = require('blear.utils.typeis');
var access = require('blear.utils.access');

var Agent = require('./agent');

var WATCH_FLAG = random.guid();
var AGENT_KEY = random.guid();
var AGENT_GUID = random.guid();
var AGENT_ARRAY = random.guid();
var AGENT_LIST = random.guid();
var AGENT_MAP = random.guid();
var DATA_GUID = random.guid();
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
var OVERRIDE_ARRAY_METHODS = [
    ARRAY_POP, ARRAY_PUSH, ARRAY_REVERSE, ARRAY_SHIFT,
    ARRAY_SORT, ARRAY_UNSHIFT, ARRAY_SPLICE
];

if (typeof DEBUG !== 'undefined' && DEBUG) {
    AGENT_KEY = '__AGENT_KEY__';
    AGENT_ARRAY = '__AGENT_ARRAY__';
    AGENT_LIST = '__AGENT_LIST__';
    AGENT_MAP = '__AGENT_MAP__';
    AGENT_GUID = '__AGENT_GUID__';
    DATA_GUID = '__DATA_GUID__';
}

function hasOwn(obj, key) {
    return object.hasOwn(obj, key);
}

function isObject(any) {
    return typeis.Object(any);
}

function isArray(any) {
    return typeis.Array(any);
}

function isData(any) {
    return isObject(any) || isArray(any);
}

function defineValue(obj, key, val) {
    object.define(obj, key, {
        value: val
    });
}

function observe(watcher, any, agent) {
    if (!isData(any)) {
        return;
    }

    if (hasOwn(any, DATA_GUID)) {
        return;
    }

    defineValue(any, DATA_GUID, random.guid());

    if (isObject(any)) {
        observeObject(watcher, any);
    } else if (isArray(any)) {
        observeArray(watcher, any, agent);
    }
}

function observeObjectWithKeyAndVal(watcher, obj, key) {
    var descriptor = Object.getOwnPropertyDescriptor(object, key);
    var getter = descriptor && descriptor.get;
    var setter = descriptor && descriptor.set;
    var val = obj[key];
    var oldVal = val;
    var agent = new Agent();

    // if (isArray(val)) {
    //     if (hasOwn(val, AGENT_ARRAY)) {
    //         agent = val[AGENT_ARRAY];
    //     } else {
    //         agent = new Agent();
    //         defineValue(val, AGENT_ARRAY, agent);
    //     }
    // } else {
    //     agent = new Agent();
    // }

    // 1、先深度遍历
    object.define(obj, key, {
        enumerable: true,
        get: function () {
            obj;
            key;
            val;
            oldVal = getter ? getter.call(obj) : oldVal;
            agent.link();
            return oldVal;
        },
        set: function (val) {
            var newVal = setter ? setter.call(obj, val) : val;

            if (newVal === oldVal) {
                return;
            }

            oldVal = newVal;
            agent.react();
            observe(watcher, oldVal, agent);
        }
    });

    // 2、再广度遍历
    observe(watcher, val, agent);
}

function observeObject(watcher, obj) {
    object.each(obj, function (key, val) {
        if (typeis.Function(val)) {
            return;
        }

        observeObjectWithKeyAndVal(watcher, obj, key);
    });
}

function observeArray(watcher, arr, agent) {
    // if (!arr[AGENT_ARRAY]) {
    //     defineValue(arr, AGENT_ARRAY, agent);
    // }

    // // 如果值是数组，则从数组上取 agent
    // if (hasOwn(arr, AGENT_ARRAY)) {
    //     var preAgent = arr[AGENT_ARRAY];
    //     agent.concat(preAgent);
    // }
    defineValue(arr, AGENT_ARRAY, agent);

    console.log(new Date(), 'observeArray agent.guid', agent.guid);
    var list;
    var map;

    // if (hasOwn(arr, AGENT_LIST)) {
    //     list = arr[AGENT_LIST];
    //     map = arr[AGENT_MAP];
    //
    //     if (!map[agent.guid]) {
    //         map[agent.guid] = true;
    //         list.push(agent);
    //     }
    // } else {
    //     defineValue(arr, AGENT_LIST, []);
    //     defineValue(arr, AGENT_MAP, {});
    // }

    array.each(OVERRIDE_ARRAY_METHODS, function (index, method) {
        var original = Array.prototype[method];
        defineValue(arr, method, function () {
            var args = access.args(arguments);
            var oldLength = arr.length;
            var spliceIndex = 0;
            var spliceCount = 0;
            var oldVal = [].concat(arr);
            original.apply(arr, args);
            var insertValue = [];

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

            if (insertValue) {
                array.each(insertValue, function (index, insertValue) {
                    observe(watcher, insertValue, agent);
                });
            }

            var operation = {
                type: 'array',
                parent: arr,
                method: method,
                spliceIndex: spliceIndex,
                spliceCount: spliceCount,
                insertValue: insertValue,
                oldVal: oldVal,
                newVal: arr
            };

            agent.react(operation);
        });
    });
    array.each(arr, function (index, val) {
        observe(watcher, val, agent);
    });

    defineValue(arr, 'set', function (index, val) {
        if (val === arr[index]) {
            return;
        }

        arr.splice(index, 1, val);
    });

    defineValue(arr, 'remove', function (index) {
        array.remove(arr, index);
    });

    defineValue(arr, 'delete', function (val) {
        array.delete(arr, val);
    });
}

exports.data = observe;
exports.key = observeObjectWithKeyAndVal;
