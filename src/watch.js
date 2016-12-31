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

var Pivot = require('./pivot');

var WATCH_FLAG = random.guid();
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

function isObject(any) {
    return typeis.Object(any);
}

function isArray(any) {
    return typeis.Array(any);
}

function defineValue(obj, key, val) {
    object.define(obj, key, {
        value: val
    });
}

function watch(any, pivot) {
    if (isObject(any)) {
        watchObject(any);
    } else if (isArray(any)) {
        watchArray(any, pivot);
    }
}

function watchObject(obj) {
    object.each(obj, function (key, val) {
        var descriptor = Object.getOwnPropertyDescriptor(object, key);
        var getter = descriptor && descriptor.get;
        var setter = descriptor && descriptor.set;
        var oldVal = val;
        var pivot = new Pivot();

        object.define(obj, key, {
            enumerable: true,
            get: function () {
                oldVal = getter ? getter.call(obj) : oldVal;
                pivot.link();
                return oldVal;
            },
            set: function (val) {
                var newVal = setter ? setter.call(obj, val) : val;

                if (newVal === oldVal) {
                    return;
                }

                oldVal = newVal;
                pivot.react();
                watch(oldVal, pivot);
            }
        });

        watch(val, pivot);
    });
}

function watchArray(arr, pivot) {
    array.each(OVERRIDE_ARRAY_METHODS, function (index, method) {
        var original = Array.prototype[method];
        defineValue(arr, method, function () {
            var args = access.args(arguments);
            var oldLength = arr.length;
            var spliceIndex = 0;
            var spliceCount = 0;
            var oldVal = [].concat(arr);
            var newVal = original.apply(arr, args);
            var insertValue = null;


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
                    watch(insertValue, pivot);
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
                newVal: newVal
            };

            pivot.react(operation);
        });
    });

    array.each(arr, function (index, val) {
        watch(val, pivot);
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

module.exports = watch;
