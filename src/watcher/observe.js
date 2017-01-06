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
var Class = require('blear.classes.class');

var Agent = require('./agent');
var Distributor = Class.extend({
    className: 'Distributor',
    constructor: function (data) {
        var the = this;

        the.agent = new Agent();
        the.guid = guid();
        defineValue(data, DISTRIBUTOR_KEY, the);
        defineValue(data, DATA_GUID, guid());

        if (isObject(data)) {
            observeObject(data);
        } else if (isArray(data)) {
            observeArray(data);
        }
    }
});
var DISTRIBUTOR_KEY = Distributor.sole();


function createDistributor(data) {
    var distributor = getDistributor(data);

    if (distributor === null || distributor) {
        return distributor;
    }

    return new Distributor(data);
}


function getDistributor(data) {
    if (!isData(data)) {
        return null;
    }

    if (hasOwn(data, DISTRIBUTOR_KEY)) {
        return data[DISTRIBUTOR_KEY];
    }
}


var WATCH_FLAG = guid();
var AGENT_KEY = guid();
var AGENT_GUID = guid();
var AGENT_ARRAY = guid();
var AGENT_LIST = guid();
var AGENT_MAP = guid();
var DATA_GUID = guid();
var DATA_PARENT = guid();
var DATA_GET_GUID = guid();
var DATA_SET_GUID = guid();
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
    DATA_PARENT = '__DATA_PARENT__';
}

function guid() {
    return random.guid();
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


function deepLinkArray(data) {
    if (isArray(data)) {
        array.each(data, function (index, item) {
            var distributor = getDistributor(item);

            if (!distributor) {
                return;
            }

            distributor.agent.link();

            deepLinkArray(item);
        });
    }
}

function observeObjectWithKeyAndVal(obj, key) {
    var descriptor = Object.getOwnPropertyDescriptor(obj, key);
    var getter = descriptor && descriptor.get;
    var setter = descriptor && descriptor.set;
    var val = obj[key];
    var oldVal = val;
    var agent = new Agent();
    var childDistributor;

    // 1、先深度遍历
    object.define(obj, key, {
        enumerable: true,
        get: function () {
            console.log('get val', 'obj=', obj, 'key=', key);
            oldVal = getter ? getter.call(obj) : oldVal;
            agent.link();
            childDistributor = getDistributor(oldVal);

            if (childDistributor) {
                childDistributor.agent.link();
            }

            deepLinkArray(oldVal);

            return oldVal;
        },
        set: function (val) {
            var newVal = setter ? setter.call(obj, val) : val;

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

            oldVal = newVal;
            childDistributor = createDistributor(oldVal);
            agent.react(operation);
        }
    });

    // 2、再广度遍历
    createDistributor(val);
}

function observeObject(obj) {
    object.each(obj, function (key, val) {
        if (typeis.Function(val)) {
            return;
        }

        observeObjectWithKeyAndVal(obj, key);
    });
}

function observeArray(arr) {
    array.each(OVERRIDE_ARRAY_METHODS, function (index, method) {
        var original = Array.prototype[method];
        defineValue(arr, method, function () {
            var args = access.args(arguments);
            var oldLength = arr.length;
            var spliceIndex = 0;
            var spliceCount = 0;
            var oldVal = arr;
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
                    createDistributor(insertValue);
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

            getDistributor(arr).agent.react(operation);
        });
    });

    defineValue(arr, ARRAY_SET, function (index, val) {
        if (val === arr[index]) {
            return;
        }

        arr.splice(index, 1, val);
    });

    defineValue(arr, ARRAY_REMOVE, function (index) {
        array.remove(arr, index);
    });

    defineValue(arr, ARRAY_DELETE, function (val) {
        array.delete(arr, val);
    });

    array.each(arr, function (index, val) {
        createDistributor(val);
    });
}


// ===================================

exports.data = createDistributor;
exports.key = observeObjectWithKeyAndVal;
