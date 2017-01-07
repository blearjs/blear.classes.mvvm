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
var Bait = Class.extend({
    className: 'Bait',
    constructor: function (data) {
        var the = this;

        the.agent = new Agent();
        the.guid = guid();
        defineValue(data, BAIT_FLAG_NAME, the);
        defineValue(data, BAIT_DATA_GUID_NAME, guid());

        if (isObject(data)) {
            observeObject(data);
        } else if (isArray(data)) {
            observeArray(data);
        }
    }
});
var BAIT_FLAG_NAME = Bait.sole();


function linkStart(data) {
    var bait = getBait(data);

    if (bait === null || bait) {
        return bait;
    }

    return new Bait(data);
}


function getBait(data) {
    if (!isData(data)) {
        return null;
    }

    if (hasOwn(data, BAIT_FLAG_NAME)) {
        return data[BAIT_FLAG_NAME];
    }
}


var BAIT_DATA_GUID_NAME = guid();
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
            var bait = getBait(item);

            if (!bait) {
                return;
            }

            bait.agent.link();

            deepLinkArray(item);
        });
    }
}

function linking(obj, key) {
    var descriptor = Object.getOwnPropertyDescriptor(obj, key);
    // 预先设置的 get/set
    var preGet = descriptor && descriptor.get;
    var preSet = descriptor && descriptor.set;
    var val = obj[key];
    var agent = new Agent();

    // 1、先深度遍历
    object.define(obj, key, {
        enumerable: true,
        get: function () {
            var oldVal = preGet ? preGet.call(obj) : val;
            var deepBait = getBait(oldVal);

            deepLinkArray(oldVal);
            agent.link();

            if (deepBait) {
                deepBait.agent.link();
            }

            return oldVal;
        },
        set: function (setVal) {
            var oldVal = preGet ? preGet.call(obj) : val;

            if (setVal === oldVal) {
                return;
            }

            if (preSet) {
                preSet.call(obj, setVal);
            } else {
                val = setVal;
            }

            var operation = {
                type: 'object',
                parent: obj,
                key: key,
                method: 'set',
                oldVal: oldVal,
                newVal: setVal
            };

            linkStart(setVal);
            agent.react(operation);
        }
    });

    // 2、再广度遍历
    linkStart(val);
}

function observeObject(obj) {
    object.each(obj, function (key, val) {
        if (typeis.Function(val)) {
            return;
        }

        linking(obj, key);
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
                    linkStart(insertValue);
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

            getBait(arr).agent.react(operation);
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
        linkStart(val);
    });
}


// ===================================

exports.linkStart = linkStart;
exports.linking = linking;
