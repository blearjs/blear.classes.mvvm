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
var access = require('blear.utils.access');

var anchor = require('./utils/anchor');
var directiveFactory = require('./directives/factory');
var ViewModel = require('./classes/view-model');

var defaults = {
    el: 'body',
    data: {},
    methods: {}
};
var watchDefaults = {
    immediate: false
};
var MVVM = Events.extend({
    className: 'MVVM',
    constructor: function (options) {
        var the = this;

        MVVM.parent(the);
        the[_options] = object.assign({}, defaults, options);
        the[_compile]();
    },
    watch: function (exp, callback, options) {
        options = object.assign({}, watchDefaults, options);
        var virtualDirective = directiveFactory({
            exp: exp,
            update: function (node, newVal, oldVal, operation) {
                if (this.bound || options.immediate && !this.bound) {
                    callback(newVal, oldVal);
                }
            }
        });
        this[_vm].add(virtualDirective);
    }
});
var _options = MVVM.sole();
var _compile = MVVM.sole();
var _vm = MVVM.sole();
var pro = MVVM.prototype;

// 编译
pro[_compile] = function () {
    var the = this;
    var options = the[_options];
    var rootEl = the.view = selector.query(options.el)[0];
    // var fragment = modification.create('#fragment');
    // var anchorNode = anchor(rootEl, 'mvvm');
    var scope = object.assign(options.data, options.methods);

    // fragment.appendChild(rootEl);
    the.model = scope;
    the[_vm] = new ViewModel(rootEl, scope);
    ViewModel.end();

    // modification.insert(rootEl, anchorNode, 3);
};

// static

// MVVM.directive = function (name, directive) {
//     var args = access.args(arguments);
//
//     if (args.length === 1) {
//         return directives[name];
//     }
//
//     directives[name] = directive;
// };


module.exports = MVVM;
