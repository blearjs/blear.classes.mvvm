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
var access = require('blear.utils.access');

var compile = require('./utils/compile');
var address = require('./utils/address');

var defaults = {
    el: 'body',
    data: {},
    methods: {}
};
var directives = {
    html: require('./directives/html'),
    for: require('./directives/for')
};
var MVVM = Events.extend({
    className: 'MVVM',
    constructor: function (options) {
        var the = this;

        the[_options] = object.assign({}, defaults, options);
        the[_compile]();
    },

    _directive: function (name) {
        return directives[name];
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
    var rootEl = the.view = selector.query(options.el)[0];
    var fragment = modification.create('#fragment');
    var addressNode = address(rootEl, 'mvvm');

    fragment.appendChild(rootEl);
    the[_watcher] = compile(fragment, the, options.data);
    modification.insert(rootEl, addressNode, 0);
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
