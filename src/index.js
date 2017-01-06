/**
 * blear.classes.mvvm
 * @author ydr.me
 * @create 2016年06月04日14:09:36
 */

'use strict';

var Events = require('blear.classes.events');
var selector = require('blear.core.selector');
var modification = require('blear.core.modification');
var object = require('blear.utils.object');
var array = require('blear.utils.array');
var typeis = require('blear.utils.typeis');
var access = require('blear.utils.access');
var fun = require('blear.utils.function');

var anchor = require('./utils/anchor');
var ViewModel = require('./classes/view-model');
var Directive = require('./classes/directive');
var configs = require('./configs');

var defaults = {
    el: 'body',
    data: {},
    computed: {},
    watch: {},
    methods: {}
};
var definitions = {};
var MVVM = Events.extend({
    className: 'MVVM',
    constructor: function (options) {
        var the = this;

        MVVM.parent(the);
        the[_computedWatchList] = [];
        the[_options] = object.assign({}, defaults, options);
        the[_initScope]();
        the[_initComputed]();
        the[_initDirectives]();
        the[_initVM]();
        the[_initWatch]();
    },
    watch: function (exp, callback, immediate) {
        var the = this;
        var virtualDirective = new Directive({
            exp: exp,
            update: function (node, newVal, oldVal, operation) {
                if (this.bound || immediate && !this.bound) {
                    callback.call(the.scope, newVal, oldVal, operation);
                }
            }
        });
        the[_vm].add(virtualDirective);
        return function unwatch() {
            virtualDirective.destroy();
            virtualDirective = null;
        };
    }
});
var _options = MVVM.sole();
var _vm = MVVM.sole();
var _initScope = MVVM.sole();
var _initComputed = MVVM.sole();
var _initDirectives = MVVM.sole();
var _definitions = MVVM.sole();
var _initVM = MVVM.sole();
var _computedWatchList = MVVM.sole();
var _initWatch = MVVM.sole();
var pro = MVVM.prototype;

pro[_initScope] = function () {
    var the = this;
    var options = the[_options];

    the.scope = object.assign(options.data, options.methods);
};

pro[_initComputed] = function () {
    var the = this;
    var scope = the.scope;
    var options = the[_options];

    object.each(options.computed, function (key, val) {
        var computedSet = function (newVal) {
            return newVal;
        };
        var computedGet;

        if (typeis.Function(val)) {
            computedGet = fun.bind(val, scope);
        } else {
            computedGet = fun.bind(val.get, scope);
            computedSet = fun.bind(val.set, scope);
        }

        var rewritedGet = function () {
            var val = computedGet();

            if (typeof val === 'object') {
                object.define(val, configs.computedFlagName, {
                    value: true
                });
            }

            return val;
        };

        // 加入观察列表
        the[_computedWatchList].push([scope, key, computedGet, computedSet]);
        object.define(scope, key, {
            enumerable: true,
            get: rewritedGet,
            set: computedSet
        });
    });
    options.computed = null;
};

pro[_initDirectives] = function () {
    var the = this;
    var options = the[_options];

    the[_definitions] = options.directives || {};
};

// 编译
pro[_initVM] = function () {
    var the = this;
    var options = the[_options];
    var rootEl = the.view = selector.query(options.el)[0];
    var fragment = modification.create('#fragment');
    var anchorNode = anchor(rootEl, 'mvvm');

    fragment.appendChild(rootEl);
    the[_vm] = new ViewModel(rootEl, the.scope);
    the[_vm].setInstanceDefinitions(the[_definitions]);
    the[_vm].setStaticlDefinitions(definitions);
    the[_vm].run();
    modification.insert(rootEl, anchorNode, 3);
};

pro[_initWatch] = function () {
    var the = this;
    var options = the[_options];

    array.each(the[_computedWatchList], function (index, comb) {
        var scope = comb[0];
        var key = comb[1];
        var computedGet = comb[2];
        var computedSet = comb[3];

        the.watch(computedGet, function (newVal) {
            scope[key] = newVal
        }, true);
    });

    object.each(options.watch, function (key, watcher) {
        var immediate = false;

        if (typeis.Object(watcher)) {
            immediate = watcher.immediate;
            watcher = watcher.handle;
        }

        the.watch(key, watcher, immediate);
    });
};

// ======================================== static ========================================


MVVM.directives = definitions;
MVVM.directive = function (name, definition) {
    var args = access.args(arguments);

    if (args.length === 1) {
        return definitions[name];
    }

    definitions[name] = definition;
};


module.exports = MVVM;
