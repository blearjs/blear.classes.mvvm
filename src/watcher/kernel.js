/**
 * 核心
 * @author ydr.me
 * @created 2016-12-30 12:38
 * @updated 2017年01月07日15:10:08
 */


'use strict';

var object = require('blear.utils.object');
var array = require('blear.utils.array');
var random = require('blear.utils.random');
var typeis = require('blear.utils.typeis');
var access = require('blear.utils.access');
var Events = require('blear.classes.events');

var Wire = require('./wire');
var Bait = Events.extend({
    className: 'Bait',
    constructor: function (data) {
        var the = this;

        Bait.parent(the);
        the.wire = new Wire();
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

            bait.wire.link();

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
    var wire = new Wire();

    // 1、先深度遍历
    object.define(obj, key, {
        enumerable: true,
        get: function () {
            var oldVal = preGet ? preGet.call(obj) : val;
            var deepBait = getBait(oldVal);

            deepLinkArray(oldVal);
            wire.link();

            if (deepBait) {
                deepBait.wire.link();
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

            var signal = {
                type: 'object',
                parent: obj,
                key: key,
                method: 'set',
                oldVal: oldVal,
                newVal: setVal
            };

            linkStart(setVal);
            wire.pipe(signal);
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
            var insertValue = [];

            // 先执行原始方法
            original.apply(arr, args);

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

            var signal = {
                type: 'array',
                parent: arr,
                method: method,
                spliceIndex: spliceIndex,
                spliceCount: spliceCount,
                insertValue: insertValue,
                oldVal: oldVal,
                newVal: arr
            };

            getBait(arr).wire.pipe(signal);
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
