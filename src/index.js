/**
 * blear.classes.mvvm
 * @author ydr.me
 * @create 2016年06月04日14:09:36
 */

'use strict';

var Events = require('blear.classes.events');
var Watcher = require('blear.classes.watcher');
var selector = require('blear.core.selector');
var modification = require('blear.core.modification');
var object = require('blear.utils.object');
var array = require('blear.utils.array');
var typeis = require('blear.utils.typeis');
// var access = require('blear.utils.access');
var fun = require('blear.utils.function');
var random = require('blear.utils.random');

var anchor = require('./utils/anchor');
var ViewModel = require('./classes/view-model');
var configs = require('./configs');

var defaults = {
    el: 'body',
    data: {},
    computed: {},
    watch: {},
    methods: {},
    directives: {},
    watchDefaults: {
        // immediately
        imme: false,
        deep: false
    }
};
var STATIC_DIRECTIVES = {};
var STATIC_METHODS = {};
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

    /**
     * 监听数据
     * @param exp
     * @param callback
     * @param options
     * @returns {Function}
     */
    watch: function (exp, callback, options) {
        return this[_watcher].watch(exp, callback, options);
    },

    /**
     * 添加实例方法
     * @param name
     * @param method
     */
    method: function (name, method) {
        var the = this;
        the.scope[name] = method;
        return the;
    },

    /**
     * 销毁实例
     */
    destroy: function () {
        var the = this;

        the[_vm].destroy();
        the[_watcher].destroy();
    }
});
var _options = MVVM.sole();
var _vm = MVVM.sole();
var _watcher = MVVM.sole();
var _initScope = MVVM.sole();
var _initComputed = MVVM.sole();
var _initDirectives = MVVM.sole();
var _definitions = MVVM.sole();
var _initVM = MVVM.sole();
var _computedWatchList = MVVM.sole();
var _initWatch = MVVM.sole();
var _mvvmID = MVVM.sole();
var pro = MVVM.prototype;

pro[_initScope] = function () {
    var the = this;
    var options = the[_options];

    the.scope = object.assign(options.data, STATIC_METHODS, options.methods);
    the[_watcher] = new Watcher(the.scope);
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

    the[_definitions] = options.directives;
};

// 编译
pro[_initVM] = function () {
    var the = this;
    var options = the[_options];
    var rootEl = the.view = selector.query(options.el)[0];
    var fragment = modification.create('#fragment');
    var anchorNode = anchor(rootEl);

    fragment.appendChild(rootEl);
    the[_vm] = new ViewModel(rootEl, the.scope);
    the[_vm].setInstanceDefinitions(the[_definitions]);
    the[_vm].setStaticlDefinitions(STATIC_DIRECTIVES);
    the[_vm].run();
    rootEl[_mvvmID] = random.guid();
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
        }, {
            imme: true
        });
    });
    the[_computedWatchList] = null;

    object.each(options.watch, function (key, watcher) {
        var options = null;

        if (typeis.Object(watcher)) {
            options = {
                imme: watcher.imme,
                deep: watcher.deep
            };
            watcher = watcher.handle;
        }

        the.watch(key, watcher, options);
    });
    options.watch = null;
};

// ======================================== static ========================================


MVVM.directives = STATIC_DIRECTIVES;

/**
 * 添加静态指令
 * @param name
 * @param definition
 */
MVVM.directive = function (name, definition) {
    STATIC_DIRECTIVES[name] = definition;
};

/**
 * 添加静态方法
 * @param name
 * @param method
 */
MVVM.method = function (name, method) {
    STATIC_METHODS[name] = method;
};


module.exports = MVVM;
