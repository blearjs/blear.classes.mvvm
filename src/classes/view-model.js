/**
 * ViewModel 类
 * @author ydr.me
 * @created 2016-12-27 15:47
 */


'use strict';

var Class = require('blear.classes.class');
var random = require('blear.utils.random');

var compile = require('../runtime/compile');
var monitor = require('../runtime/monitor');
var parser = require('../runtime/parser');

var ViewModel = Class.extend({
    className: 'ViewModel',
    constructor: function (el, scope, parent) {
        var the = this;

        the.guid = random.guid();
        the.el = el;
        the.scope = scope;
        the.parent = parent;
        the.monitor = monitor;
        the.parser = parser;
        the.children = [];
        the.directives = [];
        compile(el, scope, the);
    },
    add: function (directive) {
        this.directives.push(directive);
    }
});

module.exports = ViewModel;

