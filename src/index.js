/**
 * blear.classes.mvvm
 * @author ydr.me
 * @create 2016年06月04日14:09:36
 */

'use strict';

var Events = require('blear.classes.events');
var Watcher = require('blear.classes.watcher');
var selector = require('blear.core.selector');
var object = require('blear.utils.object');
var array = require('blear.utils.array');
var access = require('blear.utils.access');

var compile = require('./utils/compile');

var defaults = {
    view: 'body',
    model: {},
    methods: {}
};
var directives = {
    html: require('./directives/html')
};
var MVVM = Events.extend({
    className: 'MVVM',
    constructor: function (options) {
        var the = this;

        options = the[_options] = object.assign({}, defaults, options);
        the[_watcher] = new Watcher(options.model);
        the[_compile]();
    },

    _directive: function (name) {
        return directives[name];
    },

    _bind: function (path, binding) {
        binding(this[_watcher].get(path));
    },

    _update: function (path, updater) {
        this[_watcher].watch(path, updater);
    }
});
var _options = MVVM.sole();
var _watcher = MVVM.sole();
var _compile = MVVM.sole();
var pro = MVVM.prototype;

// 编译
pro[_compile] = function () {
    var the = this;
    var options = the[_options];

    var rootEl = the.rootEl = selector.query(options.view)[0];

    compile(rootEl, the);
};

// static

MVVM.directive = function (name, directive) {
    var args = access.args(arguments);

    if (args.length === 1) {
        return directives[name];
    }

    directives[name] = directive;
};

module.exports = MVVM;
